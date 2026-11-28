"""Latest-frame capture and inference, without a growing render/inference queue."""

from dataclasses import dataclass
import threading
import time

import cv2
from chemlab.selection import HandSelector


@dataclass(frozen=True)
class Sample:
    sequence: int
    captured_at: float
    frame: object
    candidate: object
    label: str | None
    generation: int
    inference_ms: float


class HandCamera:
    def __init__(self, cap, model_path, preference="right", inference_width=1280):
        self.cap, self.model_path = cap, model_path
        self.inference_width = inference_width
        self.condition = threading.Condition()
        self.stop = threading.Event()
        self.frame = self.sample = self.error = None
        self.sequence = 0
        self.preference, self.holding = preference, False
        self.threads = [
            threading.Thread(target=self._capture, daemon=True),
            threading.Thread(target=self._detect, daemon=True),
        ]
        for thread in self.threads:
            thread.start()

    def control(self, preference, holding):
        with self.condition:
            self.preference, self.holding = preference, holding

    def poll(self):
        with self.condition:
            if self.error:
                raise RuntimeError(self.error)
            return self.sample

    def _fail(self, error):
        with self.condition:
            self.error = str(error)
            self.stop.set()
            self.condition.notify_all()

    def _capture(self):
        failures = 0
        try:
            while not self.stop.is_set():
                ok, frame = self.cap.read()
                if not ok:
                    failures += 1
                    if failures >= 20:
                        raise RuntimeError(
                            "Webcam ngừng trả ảnh; kiểm tra kết nối camera."
                        )
                    self.stop.wait(0.03)
                    continue
                failures = 0
                # Full frame, mirrored once; never crop to the control rectangle.
                frame = cv2.flip(frame, 1)
                with self.condition:
                    self.sequence += 1
                    self.frame = (self.sequence, time.perf_counter(), frame)
                    self.condition.notify_all()
        except Exception as error:
            self._fail(error)

    def _detect(self):
        tracker = None
        try:
            from chemlab.tracking import HandTracker

            tracker = HandTracker(self.model_path, num_hands=2)
            selector = HandSelector(self.preference)
            sequence = -1
            generation_base = 0
            while not self.stop.is_set():
                with self.condition:
                    self.condition.wait_for(
                        lambda: self.stop.is_set()
                        or (self.frame is not None and self.frame[0] != sequence),
                        timeout=0.2,
                    )
                    if self.stop.is_set():
                        break
                    if self.frame is None or self.frame[0] == sequence:
                        continue
                    sequence, captured_at, frame = self.frame
                    preference, holding = self.preference, self.holding
                if preference != selector.preference:
                    generation_base += selector.generation + 1
                    selector = HandSelector(preference)
                detection_frame = frame
                if frame.shape[1] > self.inference_width:
                    scale = self.inference_width / frame.shape[1]
                    detection_frame = cv2.resize(
                        frame, (self.inference_width, round(frame.shape[0] * scale))
                    )
                candidates, elapsed = tracker.detect_all(detection_frame)
                chosen = selector.choose(candidates, captured_at, holding)
                sample = Sample(
                    sequence,
                    captured_at,
                    frame,
                    chosen,
                    selector.label,
                    generation_base + selector.generation,
                    elapsed,
                )
                with self.condition:
                    self.sample = sample  # Replace the previous sample, never enqueue.
        except Exception as error:
            self._fail(error)
        finally:
            if tracker is not None:
                tracker.close()

    def close(self):
        self.stop.set()
        with self.condition:
            self.condition.notify_all()
        for thread in self.threads:
            thread.join(timeout=2)
        self.cap.release()
