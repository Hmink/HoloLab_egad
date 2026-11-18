"""Optional native CPU inference, reusing v2.1's detector without its selector.
Camera stays in the browser. Only one local JPEG request is processed at a time.
"""

import importlib.util
from pathlib import Path
import threading
import time


class NativeTracking:
    def __init__(self, model_path: Path, enabled=True):
        self.model_path = model_path
        self.available = enabled and all(
            importlib.util.find_spec(name) for name in ("cv2", "numpy", "mediapipe")
        )
        self.lock = threading.Lock()
        self.tracker = None

    def initialize(self):
        if not self.available:
            raise RuntimeError("Native MediaPipe dependencies not installed")
        with self.lock:
            if self.tracker is None:
                from chemlab.tracking import HandTracker

                self.tracker = HandTracker(self.model_path, num_hands=2)
        return {"ok": True, "delegate": "Python CPU"}

    def detect(self, encoded):
        if self.tracker is None:
            raise RuntimeError("Native detector not initialized")
        if not self.lock.acquire(blocking=False):
            raise BlockingIOError("Detector busy; skip frame")
        try:
            import cv2
            import numpy as np

            start = time.perf_counter()
            frame = cv2.imdecode(
                np.frombuffer(encoded, dtype=np.uint8), cv2.IMREAD_COLOR
            )
            if frame is None or max(frame.shape[:2]) > 2048:
                raise ValueError("Invalid camera image")
            # JPEG is already mirrored by Worker. Never mirror twice.
            candidates, inference_ms = self.tracker.detect_all(frame)
            return {
                "hands": [
                    {
                        "landmarks": [{"x": p[0], "y": p[1], "z": 0} for p in c.points],
                        "label": c.label,
                        "score": c.score,
                    }
                    for c in candidates
                ],
                "inferenceMs": inference_ms,
                "serverMs": (time.perf_counter() - start) * 1000,
            }
        finally:
            self.lock.release()

    def close(self):
        with self.lock:
            if self.tracker:
                self.tracker.close()
                self.tracker = None
