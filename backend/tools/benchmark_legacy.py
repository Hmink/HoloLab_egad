"""60-second v2.1 native pipeline comparison with real model / explicit image feed.
Requires the optional desktop dependencies. Native window and camera are mocked.
Different rendering backends mean these are system-level, not isolated speedups.
"""

import argparse, json, math, statistics, sys, time
from pathlib import Path
from unittest.mock import patch
import cv2

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import app
from chemlab.tracking import HandTracker
from lab3d.ui import Renderer3D

parser = argparse.ArgumentParser()
parser.add_argument("image")
args = parser.parse_args()
image = cv2.imread(args.image)
if image is None:
    raise ValueError("Image not readable")
output = ROOT / "validation"
output.mkdir(exist_ok=True)
start = None
tracking = []
renders = []
model_ms = []
gpu = None


class FakeCamera:
    def read(self):
        time.sleep(1 / 30)
        return True, image.copy()

    def set(self, *args):
        return True

    def release(self):
        pass


def demo(scene):
    x0, y0, x1, y1 = scene.cfg.workspace
    for i, stock in enumerate(("beaker", "flask", "cuso4", "naoh", "water")):
        scene.spawn(stock, x0 + (i + 1) * (x1 - x0) / 6, y0 + (y1 - y0) / 2)


original_detect = HandTracker.detect_all


def detect(self, frame):
    result = original_detect(self, frame)
    tracking.append((time.perf_counter(), result[1], len(result[0])))
    return result


original_render = Renderer3D.render


def render(self, scene, *args, **kwargs):
    global gpu
    gpu = self.meshes.gpu
    if scene.objects:
        scene.objects[-1].x = (
            scene.cfg.workspace[2] - 130 + math.sin(time.perf_counter() / 1.2) * 20
        )
    return original_render(self, scene, *args, **kwargs)


def show(*args):
    global start
    now = time.perf_counter()
    if start is None:
        start = now + 5
    if now >= start:
        renders.append(now)


def key(*args):
    return ord("q") if start is not None and time.perf_counter() - start >= 60 else -1


with patch.object(app, "open_camera", return_value=FakeCamera()), patch.object(
    app, "demo", demo
), patch.object(HandTracker, "detect_all", detect), patch.object(
    Renderer3D, "render", render
), patch.object(
    cv2, "namedWindow"
), patch.object(
    cv2, "setMouseCallback"
), patch.object(
    cv2, "imshow", side_effect=show
), patch.object(
    cv2, "waitKeyEx", side_effect=key
), patch.object(
    cv2, "getWindowProperty", return_value=1
), patch.object(
    cv2, "destroyAllWindows"
), patch.object(
    sys,
    "argv",
    [
        "app.py",
        "--demo",
        "--width",
        "1280",
        "--height",
        "800",
        "--model",
        str(ROOT / "web/models/hand_landmarker.task"),
        "--log",
        str(output / "legacy_frames.jsonl"),
    ],
):
    app.main()
end = renders[-1]
duration = end - start
samples = [r for r in tracking if start <= r[0] <= end]
rows = [
    json.loads(line)
    for line in (output / "legacy_frames.jsonl").read_text().splitlines()
    if '"type": "frame"' in line
]
# App log timestamps are relative to the main loop start. Tail matches measured renders.
rows = rows[-len(renders) :]
p95 = lambda a: sorted(a)[math.ceil(len(a) * 0.95) - 1] if a else None
result = dict(
    version="2.1-preserved-native",
    duration_s=duration,
    complete=duration >= 60,
    render_frames=len(renders),
    render_fps=len(renders) / duration,
    tracking_samples=len(samples),
    tracking_hz=len(samples) / duration,
    inference_mean_ms=statistics.mean(r[1] for r in samples),
    render_interval_p95_ms=p95([(b - a) * 1000 for a, b in zip(renders, renders[1:])]),
    sample_age_p95_ms=p95(
        [r["sample_age_ms"] for r in rows if r.get("sample_age_ms") is not None]
    ),
    objects=5,
    width=1280,
    height=800,
    gpu=gpu,
    physical_camera_test=False,
    input_source="repeated-static-reference-photo, simulated 30 Hz capture",
    note="Native MediaPipe + ModernGL/Pillow pipeline. Window output mocked; real inference/render calls retained. Not an isolated algorithm speed comparison.",
)
(output / "benchmark_v21.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2)
)
print(json.dumps(result, ensure_ascii=False, indent=2))
