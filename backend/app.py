"""ChemLab CV 3D: python app.py --mouse-only, then python app.py for hands."""

import argparse
from collections import deque
import json
from pathlib import Path
import time
import cv2

from app_2d import open_camera
from chemlab.chemistry import load_database
from chemlab.config import Config
from lab3d.hand_input import REGIONS, StableHandInput
from lab3d.scene import LabScene
from lab3d.ui import Renderer3D

from paths import ROOT, WEB_DIR
WINDOW = "ChemLab CV 3D - Virtual Experiment Studio"


def arguments():
    parser = argparse.ArgumentParser(description="ChemLab 3D: free virtual experiments")
    parser.add_argument("--mouse-only", action="store_true")
    parser.add_argument("--camera", type=int, default=0)
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--split", type=float, default=0.30)
    parser.add_argument(
        "--model", type=Path, default=WEB_DIR / "models/hand_landmarker.task"
    )
    parser.add_argument(
        "--pinch", choices=("normalized", "pixels"), default="normalized"
    )
    parser.add_argument("--no-smoothing", action="store_true")
    parser.add_argument("--hand", choices=("right", "left", "auto"), default="right")
    parser.add_argument("--reach", choices=tuple(REGIONS), default="easy")
    parser.add_argument("--camera-width", type=int, default=1280)
    parser.add_argument("--camera-height", type=int, default=720)
    parser.add_argument("--inference-width", type=int, default=1280)
    parser.add_argument("--snapshot", type=Path)
    parser.add_argument(
        "--log", type=Path, help="Optional frame metrics JSONL; no images/video"
    )
    parser.add_argument(
        "--experiment", type=Path, help="Open an editable JSON experiment/session"
    )
    parser.add_argument(
        "--session", type=Path, default=ROOT / "experiments/my_session.json"
    )
    parser.add_argument(
        "--demo", action="store_true", help="Start with a prepared 3D desk"
    )
    return parser.parse_args()


def demo(scene):
    x0, y0, x1, y1 = scene.cfg.drop_zone
    w, h = x1 - x0, y1 - y0
    first = scene.spawn("beaker", x0 + w * 0.26, y0 + h * 0.65)
    second = scene.spawn("flask", x0 + w * 0.69, y0 + h * 0.65)
    copper = scene.spawn("cuso4", x0 + w * 0.18, y0 + h * 0.24)
    base = scene.spawn("naoh", x0 + w * 0.48, y0 + h * 0.24)
    water = scene.spawn("water", x0 + w * 0.81, y0 + h * 0.24)
    for _ in range(4):
        scene.pour(copper, first, -10)
    for _ in range(4):
        scene.pour(base, first, -10)
    for _ in range(4):
        scene.pour(water, second, -10)
    first.yaw = 20
    scene.selected_id = first.id
    scene.message = "Bàn mẫu: Cu(OH)₂ đã tạo kết tủa trong cốc. Nhấn R để tự thiết kế thí nghiệm khác."


def main():
    args = arguments()
    if args.width < 1200 or args.height < 800:
        raise ValueError(
            "Bản 3D cần cửa sổ từ 1200 x 800. Có thể dùng --width 1280 --height 800."
        )
    cfg = Config(
        width=args.width,
        height=args.height,
        split=args.split,
        footer=130,
        pinch_mode=args.pinch,
        smoothing=not args.no_smoothing,
    )
    db = load_database(ROOT / "data/chemistry.json")
    scene = LabScene(cfg, db)
    if args.experiment:
        scene.load(args.experiment)
    elif args.demo or args.snapshot:
        demo(scene)
    renderer = Renderer3D(cfg)
    print("3D renderer:", renderer.meshes.gpu)
    cap = camera = log_file = None
    created = False
    mouse_position = [0, 0]
    mouse_events = deque()
    mouse_down = False
    hand = StableHandInput(cfg, args.reach)
    preference = args.hand
    last_sequence = last_generation = None

    def mouse(event, x, y, flags, param):
        mouse_position[:] = [x, y]
        if event == cv2.EVENT_LBUTTONDOWN:
            mouse_events.append(("grab", (x, y)))
        elif event == cv2.EVENT_LBUTTONUP:
            mouse_events.append(("release", (x, y)))

    try:
        if args.snapshot:
            args.snapshot.parent.mkdir(parents=True, exist_ok=True)
            view = renderer.render(scene, mouse_only=True, snapshot=True)
            if not cv2.imwrite(str(args.snapshot), view):
                raise RuntimeError("Không ghi được ảnh 3D")
            print(args.snapshot)
            return
        if not args.mouse_only:
            from lab3d.camera import HandCamera

            if not args.model.is_file():
                raise FileNotFoundError("Thiếu model. Chạy python download_model.py")
            if min(args.camera_width, args.camera_height, args.inference_width) < 320:
                raise ValueError("Độ phân giải camera/nhận diện phải từ 320 trở lên.")
            cap = open_camera(args.camera)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.camera_width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.camera_height)
            cap.set(cv2.CAP_PROP_FPS, 30)
            camera = HandCamera(cap, args.model, preference, args.inference_width)
        if args.log:
            args.log.parent.mkdir(parents=True, exist_ok=True)
            log_file = args.log.open("w", encoding="utf-8")
            log_file.write(
                json.dumps(
                    {
                        "type": "session",
                        "version": "3d-2.1",
                        "input": "mouse" if args.mouse_only else "hand",
                        "hand": preference,
                        "region": hand.cfg.active_region,
                    }
                )
                + "\n"
            )
        cv2.namedWindow(WINDOW, cv2.WINDOW_AUTOSIZE)
        created = True
        if args.mouse_only:
            cv2.setMouseCallback(WINDOW, mouse)
        started = previous = time.perf_counter()
        fps = None
        while True:
            begin = time.perf_counter()
            dt, now = begin - previous, begin - started
            previous = begin
            if dt > 0 and now > 0.1:
                fps = 1 / dt if fps is None else 0.9 * fps + 0.1 / dt
            points = frame = pointer = None
            event = inference_ms = None
            sample = None
            if camera:
                camera.control(preference, bool(scene.drag) or hand.gate.closed)
                sample = camera.poll()
                if sample is not None:
                    frame = sample.frame
                    inference_ms = sample.inference_ms
                if sample is None or begin - sample.captured_at > 0.35:
                    pointer, event = hand.missing(begin)
                elif sample.sequence != last_sequence:
                    last_sequence = sample.sequence
                    if (
                        last_generation is not None
                        and sample.generation != last_generation
                    ):
                        scene.cancel("Đã đổi tay: dụng cụ được đặt lên bàn.")
                        hand.reset()
                    last_generation = sample.generation
                    candidate = sample.candidate
                    points = candidate.points if candidate else None
                    pointer, event = hand.update(
                        points,
                        frame.shape[1],
                        frame.shape[0],
                        sample.captured_at,
                        candidate.world if candidate else None,
                    )
                else:
                    points = sample.candidate.points if sample.candidate else None
                    pointer = hand.pointer if hand.valid else None
                scene.handle(event, pointer)
            else:
                pointer = tuple(mouse_position)
                while mouse_events:
                    event, pos = mouse_events.popleft()
                    mouse_down = event == "grab"
                    scene.handle(event, pos)
                scene.handle(None, pointer)
            scene.tick(
                dt,
                now,
                points,
                frame.shape if frame is not None else None,
                tracked=args.mouse_only or (hand.valid and hand.calibration is None),
            )
            view = renderer.render(
                scene,
                frame,
                points,
                pointer,
                mouse_down if args.mouse_only else hand.gate.closed,
                fps,
                args.mouse_only,
                now,
                hand_info=None if args.mouse_only else (hand, preference),
            )
            cv2.imshow(WINDOW, view)
            key = cv2.waitKeyEx(1)
            if log_file:
                metrics = hand.metrics if points is not None else None
                log_file.write(
                    json.dumps(
                        {
                            "type": "frame",
                            "t_s": now,
                            "tracked": points is not None,
                            "control_valid": hand.valid if camera else True,
                            "hand": sample.label if sample else None,
                            "sample_age_ms": (
                                (begin - sample.captured_at) * 1000 if sample else None
                            ),
                            "region": hand.cfg.active_region,
                            "event": event,
                            "pointer": pointer,
                            "pinch_ratio": metrics.ratio if metrics else None,
                            "inference_ms": inference_ms,
                            "loop_ms": (time.perf_counter() - begin) * 1000,
                            "dragging_id": scene.drag.obj.id if scene.drag else None,
                            "object_count": len(scene.objects),
                            "pour_target_id": scene.pour_target_id,
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                )
            if (
                key in (27, ord("q"))
                or cv2.getWindowProperty(WINDOW, cv2.WND_PROP_VISIBLE) < 1
            ):
                break
            try:
                if camera and key in (
                    ord("1"),
                    ord("2"),
                    ord("3"),
                    ord("b"),
                    ord("f"),
                    32,
                ):
                    scene.cancel()
                    if key == ord("b"):
                        choices = ("right", "left", "auto")
                        preference = choices[(choices.index(preference) + 1) % 3]
                        hand.reset()
                        hand.calibration = hand.corner = None
                        scene.message = (
                            "Đã đổi tay điều khiển: "
                            + {"right": "PHẢI", "left": "TRÁI", "auto": "TỰ ĐỘNG"}[
                                preference
                            ]
                        )
                    elif key == ord("f"):
                        scene.message = hand.calibrate()
                    elif key != 32:
                        name = {
                            ord("1"): "easy",
                            ord("2"): "standard",
                            ord("3"): "full",
                        }[key]
                        hand.set_region(REGIONS[name], name)
                        hand.calibration = hand.corner = None
                        scene.message = "Đã đổi vùng tay. Khung xanh nhỏ điều khiển toàn bộ màn hình."
                    else:
                        hand.reset()
                elif key in (0x740000, 65474, ord("e")):
                    scene.save(args.session)
                elif key in (0x780000, 65478, ord("o")):
                    scene.load(args.session)
                    hand.reset()
                    mouse_down = False
                    mouse_events.clear()
                else:
                    scene.key(key, now)
                    if key == ord("r"):
                        hand.reset()
                        mouse_down = False
                        mouse_events.clear()
            except (OSError, ValueError, KeyError, TypeError) as error:
                scene.message = f"Không thực hiện được: {error}"
    finally:
        if camera:
            camera.close()
        elif cap:
            cap.release()
        if log_file:
            log_file.close()
        renderer.close()
        if created:
            cv2.destroyAllWindows()


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, ValueError, FileNotFoundError, cv2.error) as error:
        raise SystemExit(str(error)) from error
