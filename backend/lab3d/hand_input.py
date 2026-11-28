"""Reach mapping, adaptive filtering and non-destructive tracking recovery."""

from dataclasses import replace
from math import hypot, isfinite, sqrt

from chemlab.gestures import HandMetrics, OneEuro, PinchGate, map_pointer

REGIONS = {
    "easy": (0.22, 0.18, 0.78, 0.82),
    "standard": (0.12, 0.12, 0.88, 0.88),
    "full": (0.03, 0.03, 0.97, 0.97),
}


def measure(points, width, height, world=None):
    if len(points) != 21 or not all(isfinite(v) for p in points for v in p[:2]):
        raise ValueError("Expected 21 finite landmarks")

    def pixels(a, b):
        return hypot(
            (points[a][0] - points[b][0]) * width,
            (points[a][1] - points[b][1]) * height,
        )

    # Palm length guards against width foreshortening when rotating the wrist.
    palm = max(pixels(5, 17), 0.8 * pixels(0, 9), 0.8 * pixels(0, 13))
    pinch = pixels(4, 8)
    ratio = pinch / max(palm, 1e-9)
    if world and len(world) == 21 and all(isfinite(v) for p in world for v in p):

        def distance(a, b):
            return sqrt(sum((x - y) ** 2 for x, y in zip(world[a], world[b])))

        scale = max(distance(5, 17), 0.8 * distance(0, 9), 0.8 * distance(0, 13))
        if scale > 1e-6:
            ratio = distance(4, 8) / scale
    return HandMetrics(
        tuple((points[4][i] + points[8][i]) / 2 for i in (0, 1)), pinch, palm, ratio
    )


class StableHandInput:
    """2 s grace, guarded reacquisition, relative clutch while dragging.

    No extrapolation of invisible hands and no chemical actions during loss.
    Frame timestamps must be strictly increasing. All time values are seconds.
    """

    def __init__(self, cfg, reach="easy", grace_s=2.0):
        self.cfg = replace(cfg, active_region=REGIONS[reach])
        self.reach = reach
        self.grace_s = grace_s
        self.calibration = None
        self.corner = None
        self.reset()

    def reset(self):
        # Larger beta reduces motion lag; low cutoff still suppresses rest jitter.
        self.fx, self.fy = OneEuro(1.8, 8.0), OneEuro(1.8, 8.0)
        self.gate = PinchGate(*self.cfg.pinch_thresholds, self.cfg.debounce_s)
        self.last_seen = self.last_sample = None
        self.last_midpoint = self.filtered = self.pointer = None
        self.metrics = None
        self.valid = False
        self.lost = False
        self.recovery_since = None
        self.recovery_mid = None
        self.status = "Mở ngón cái và trỏ để sẵn sàng."

    def set_region(self, region, name="custom"):
        x0, y0, x1, y1 = region
        if not all(isfinite(x) for x in region) or not (
            0 <= x0 < x1 <= 1
            and 0 <= y0 < y1 <= 1
            and x1 - x0 >= 0.18
            and y1 - y0 >= 0.18
        ):
            raise ValueError("Vùng tay quá nhỏ hoặc ngoài ảnh; hãy chọn lại hai góc.")
        self.cfg = replace(self.cfg, active_region=tuple(region))
        self.reach = name
        self.reset()

    def calibrate(self):
        if self.calibration is None:
            self.reset()
            self.calibration = "first"
            return "Đưa tay tới góc TRÁI TRÊN thoải mái, nhấn F để ghi."
        if not self.valid or self.metrics is None:
            return "Chưa thấy tay rõ; đưa cả bàn tay vào ảnh rồi nhấn F."
        if self.calibration == "first":
            self.corner = self.metrics.midpoint
            self.calibration = "second"
            return "Đưa tay tới góc PHẢI DƯỚI thoải mái, nhấn F lần nữa."
        self.set_region((*self.corner, *self.metrics.midpoint))
        self.calibration = self.corner = None
        return "Đã hiệu chỉnh vùng tay. Mở tay rồi chụm để gắp."

    def missing(self, t):
        self.valid = False
        self.gate.candidate = self.gate.since = None
        self.recovery_since = self.recovery_mid = None
        self.lost = True
        self.status = "Mất dấu: giữ nguyên dụng cụ, dừng rót. Đưa tay trở lại."
        if self.last_seen is not None and t - self.last_seen >= self.grace_s:
            held = self.gate.closed
            self.reset()
            self.status = "Đã đặt dụng cụ lên bàn. Mở tay rồi gắp lại."
            return None, "park" if held else None
        return None, None

    def update(self, points, width, height, t, world=None):
        if points is None:
            return self.missing(t)
        if self.last_sample is not None and t <= self.last_sample:
            return self.pointer if self.valid else None, None
        self.last_sample = t
        metrics = measure(points, width, height, world)
        self.metrics = metrics
        if metrics.palm_px < 16:
            result = self.missing(t)
            self.status = (
                "Tay quá nhỏ trong ảnh; dụng cụ vẫn được giữ. Đưa tay gần hơn."
            )
            return result
        if self.last_seen is not None and t - self.last_seen >= self.grace_s:
            return self.missing(t)
        gap = self.last_seen is not None and t - self.last_seen > 0.20
        jump = (
            self.last_midpoint is not None
            and hypot(
                metrics.midpoint[0] - self.last_midpoint[0],
                metrics.midpoint[1] - self.last_midpoint[1],
            )
            > 0.22
        )
        if gap or jump:
            self.lost = True
        if self.lost:
            # Require a stable 120 ms return; don't count unobserved time as pinch.
            if (
                self.recovery_mid is None
                or hypot(
                    metrics.midpoint[0] - self.recovery_mid[0],
                    metrics.midpoint[1] - self.recovery_mid[1],
                )
                > 0.10
            ):
                self.recovery_since = t
            self.recovery_mid = metrics.midpoint
            if t - self.recovery_since < 0.12:
                self.valid = False
                self.status = "Đã thấy tay; đang bắt lại, chưa rót."
                return None, None
            self.fx.reset()
            self.fy.reset()
            self.filtered = None  # Clutch: first recovered frame does not move item.
            self.gate.candidate = self.gate.since = None
            self.lost = False
            self.recovery_since = self.recovery_mid = None
        self.last_seen, self.last_midpoint = t, metrics.midpoint
        self.valid = True
        x, y = metrics.midpoint
        if self.cfg.smoothing:
            x, y = self.fx.update(x, t), self.fy.update(y, t)
        if self.gate.closed and self.pointer is not None:
            if self.filtered is not None:
                x0, y0, x1, y1 = self.cfg.active_region
                dx = (x - self.filtered[0]) / (x1 - x0) * (self.cfg.width - 1)
                dy = (y - self.filtered[1]) / (y1 - y0) * (self.cfg.height - 1)
                self.pointer = (
                    max(0, min(self.cfg.width - 1, self.pointer[0] + dx)),
                    max(0, min(self.cfg.height - 1, self.pointer[1] + dy)),
                )
        else:
            self.pointer = map_pointer((x, y), self.cfg)
        self.filtered = x, y
        value = (
            metrics.distance_px if self.cfg.pinch_mode == "pixels" else metrics.ratio
        )
        event = None if self.calibration else self.gate.update(value, t)
        self.status = (
            "Đang cầm"
            if self.gate.closed
            else (
                "Sẵn sàng gắp" if self.gate.armed else "Mở ngón cái và trỏ để sẵn sàng"
            )
        )
        return self.pointer, event
