"""Run: python app.py | python app.py --mouse-only | python app.py --help"""

import argparse
from collections import deque
from dataclasses import asdict
import json
import platform
from pathlib import Path
import time

import cv2

from chemlab.config import Config
from chemlab.gestures import HandInput
from chemlab.render import Renderer
from chemlab.scene import INVENTORY, LabObject, Scene

ROOT = Path(__file__).resolve().parent
WINDOW = "ChemLab CV - Python"


def parse_args():
    parser = argparse.ArgumentParser(
        description="ChemLab CV — pinch, grab, drag & drop"
    )
    parser.add_argument("--camera", type=int, default=0)
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=800)
    parser.add_argument("--split", type=float, default=0.3, help="0.3 = 3:7, 0.5 = 1:1")
    parser.add_argument(
        "--pinch", choices=("normalized", "pixels"), default="normalized"
    )
    parser.add_argument("--no-smoothing", action="store_true")
    parser.add_argument(
        "--mouse-only", action="store_true", help="Test UI without camera or model"
    )
    parser.add_argument(
        "--model", type=Path, default=ROOT / "models/hand_landmarker.task"
    )
    parser.add_argument(
        "--log", type=Path, help="Optional local JSONL; no images/video are saved"
    )
    parser.add_argument(
        "--snapshot",
        type=Path,
        help="Render a labeled example without opening a window",
    )
    return parser.parse_args()


def open_camera(index):
    backend = cv2.CAP_DSHOW if platform.system() == "Windows" else cv2.CAP_ANY
    cap = cv2.VideoCapture(index, backend)
    if not cap.isOpened() and backend != cv2.CAP_ANY:
        cap.release()
        cap = cv2.VideoCapture(index)
    if not cap.isOpened():
        cap.release()
        raise RuntimeError(
            "Không mở được webcam. Thử --camera 1, đóng ứng dụng đang dùng camera, hoặc --mouse-only."
        )
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 960)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 540)
    cap.set(
        cv2.CAP_PROP_BUFFERSIZE, 1
    )  # Backend may ignore; never assume zero latency.
    return cap


def main():
    args = parse_args()
    cfg = Config(
        width=args.width,
        height=args.height,
        split=args.split,
        pinch_mode=args.pinch,
        smoothing=not args.no_smoothing,
    )
    scene, input_state, renderer = Scene(cfg), HandInput(cfg), Renderer(cfg)
    if args.snapshot:
        x0, y0, x1, y1 = cfg.workspace
        for k, item in enumerate(INVENTORY[:3]):
            scene.objects.append(
                LabObject(k + 1, item, x0 + (k + 1) * (x1 - x0) / 4, y0 + 220)
            )
        scene.message = "Ảnh minh họa được dựng bằng chính mã giao diện."
        args.snapshot.parent.mkdir(parents=True, exist_ok=True)
        if not cv2.imwrite(str(args.snapshot), renderer.render(scene, snapshot=True)):
            raise RuntimeError("Không ghi được ảnh giao diện")
        print(args.snapshot)
        return

    cap = tracker = log_file = None
    window_created = False
    mouse_pos = [0, 0]
    mouse_events = deque()
    mouse_down = False

    def mouse_callback(event, x, y, flags, param):
        mouse_pos[:] = [x, y]
        if event == cv2.EVENT_LBUTTONDOWN:
            mouse_events.append(("grab", (x, y)))
        elif event == cv2.EVENT_LBUTTONUP:
            mouse_events.append(("release", (x, y)))

    try:
        if not args.mouse_only:
            # Lazy import lets --mouse-only and --snapshot run without MediaPipe.
            from chemlab.tracking import HandTracker

            tracker = HandTracker(args.model)
            cap = open_camera(args.camera)
        if args.log:
            args.log.parent.mkdir(parents=True, exist_ok=True)
            log_file = args.log.open("w", encoding="utf-8")
            log_file.write(
                json.dumps(
                    {
                        "type": "session",
                        "config": asdict(cfg),
                        "input": "mouse" if args.mouse_only else "hand",
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )
        # Fixed size keeps mouse pixel hit boxes consistent with rendered coordinates.
        cv2.namedWindow(WINDOW, cv2.WINDOW_AUTOSIZE)
        window_created = True
        if args.mouse_only:
            cv2.setMouseCallback(WINDOW, mouse_callback)
        started = time.perf_counter()
        previous = started
        fps = None
        read_failures = 0
        while True:
            frame_start = time.perf_counter()
            dt = frame_start - previous
            previous = frame_start
            if dt > 0 and frame_start - started > 0.05:
                instantaneous_fps = 1.0 / dt
                fps = (
                    instantaneous_fps
                    if fps is None
                    else 0.9 * fps + 0.1 * instantaneous_fps
                )
            points = frame = pointer = inference_ms = None
            event = None
            if cap:
                ok, frame = cap.read()
                if not ok:
                    read_failures += 1
                    frame = None
                    if read_failures >= 20:
                        raise RuntimeError(
                            "Webcam ngừng trả khung hình. Kiểm tra kết nối rồi chạy lại."
                        )
                else:
                    read_failures = 0
                    frame = cv2.flip(frame, 1)  # Mirror ONCE, before detection.
                    points, inference_ms = tracker.detect(frame)
                width, height = (
                    (frame.shape[1], frame.shape[0])
                    if frame is not None
                    else (960, 540)
                )
                pointer, event = input_state.update(
                    points, width, height, time.perf_counter()
                )
                scene.handle(event, pointer)
            else:
                pointer = tuple(mouse_pos)
                while mouse_events:
                    event, event_pointer = mouse_events.popleft()
                    mouse_down = event == "grab"
                    scene.handle(event, event_pointer)
                scene.handle(None, pointer)
            view = renderer.render(
                scene,
                frame,
                points,
                pointer,
                mouse_down if args.mouse_only else input_state.gate.closed,
                input_state.gate.armed,
                fps,
                inference_ms,
                args.mouse_only,
            )
            cv2.imshow(WINDOW, view)
            key = cv2.waitKey(1) & 0xFF
            if log_file:
                metrics = input_state.metrics if points is not None else None
                row = {
                    "type": "frame",
                    "t_s": time.perf_counter() - started,
                    "tracked": points is not None,
                    "event": event,
                    "pointer": pointer,
                    "raw_midpoint": metrics.midpoint if metrics else None,
                    "pinch_ratio": metrics.ratio if metrics else None,
                    "pinch_distance_px": metrics.distance_px if metrics else None,
                    "inference_ms": inference_ms,
                    "loop_ms": (time.perf_counter() - frame_start) * 1000,
                    "dragging_id": scene.drag.obj.id if scene.drag else None,
                    "object_count": len(scene.objects),
                }
                log_file.write(json.dumps(row, ensure_ascii=False) + "\n")
            if (
                key in (ord("q"), 27)
                or cv2.getWindowProperty(WINDOW, cv2.WND_PROP_VISIBLE) < 1
            ):
                break
            if key == ord("r"):
                scene.reset()
                input_state.reset()
                mouse_down = False
            if key in (ord("t"), ord("c")):
                scene.cancel("Đã đổi kho.")
                scene.group = "tool" if key == ord("t") else "chemical"
    finally:
        if cap:
            cap.release()
        if tracker:
            tracker.close()
        if log_file:
            log_file.close()
        if window_created:
            cv2.destroyAllWindows()


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, FileNotFoundError, ValueError) as error:
        raise SystemExit(str(error)) from error
