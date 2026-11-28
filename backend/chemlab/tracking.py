"""MediaPipe Tasks API, VIDEO mode with monotonic millisecond timestamps."""

import time
from pathlib import Path

import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from .selection import Candidate


class HandTracker:
    def __init__(self, model_path: Path, num_hands=1):
        if not model_path.is_file():
            raise FileNotFoundError("Thiếu model. Chạy: python download_model.py")
        options = vision.HandLandmarkerOptions(
            base_options=python.BaseOptions(model_asset_path=str(model_path)),
            running_mode=vision.RunningMode.VIDEO,
            num_hands=num_hands,
            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.landmarker = vision.HandLandmarker.create_from_options(options)
        self.last_timestamp = -1

    def detect(self, frame_bgr):
        candidates, elapsed_ms = self.detect_all(frame_bgr)
        return (candidates[0].points if candidates else None), elapsed_ms

    def detect_all(self, frame_bgr):
        rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        timestamp = max(self.last_timestamp + 1, time.monotonic_ns() // 1_000_000)
        self.last_timestamp = timestamp
        start = time.perf_counter()
        result = self.landmarker.detect_for_video(image, timestamp)
        elapsed_ms = (time.perf_counter() - start) * 1000
        candidates = []
        for i, landmarks in enumerate(result.hand_landmarks):
            category = result.handedness[i][0]
            candidates.append(
                Candidate(
                    [(p.x, p.y) for p in landmarks],
                    [(p.x, p.y, p.z) for p in result.hand_world_landmarks[i]],
                    category.category_name,
                    category.score,
                )
            )
        return candidates, elapsed_ms

    def close(self):
        self.landmarker.close()
