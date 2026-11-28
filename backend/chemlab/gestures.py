"""Pure geometry and input state; independent of camera, OpenCV and MediaPipe."""

from dataclasses import dataclass
from math import hypot, isfinite, pi

from .config import Config


class OneEuro:
    """Speed-adaptive low-pass filter, implemented from Casiez et al. (2012).

    Input positions are normalized (0..1), time is in seconds. beta therefore
    has different units from an implementation filtering pixel coordinates.
    """

    def __init__(self, min_cutoff=1.6, beta=0.35, d_cutoff=1.0):
        self.min_cutoff, self.beta, self.d_cutoff = min_cutoff, beta, d_cutoff
        self.reset()

    def reset(self):
        self.t = self.raw = self.filtered = None
        self.derivative = 0.0

    @staticmethod
    def alpha(cutoff, dt):
        tau = 1.0 / (2.0 * pi * cutoff)
        return dt / (dt + tau)

    def update(self, x: float, t: float) -> float:
        if self.t is None:
            self.t, self.raw, self.filtered = t, x, x
            return x
        if t <= self.t:
            return self.filtered
        dt = t - self.t
        velocity = (x - self.raw) / dt
        a_d = self.alpha(self.d_cutoff, dt)
        self.derivative += a_d * (velocity - self.derivative)
        cutoff = self.min_cutoff + self.beta * abs(self.derivative)
        a = self.alpha(cutoff, dt)
        self.filtered += a * (x - self.filtered)
        self.t, self.raw = t, x
        return self.filtered


class PinchGate:
    """Hysteresis + time debounce + mandatory open hand after tracking loss."""

    def __init__(self, close: float, opening: float, dwell: float):
        if not 0 < close < opening or dwell < 0:
            raise ValueError("Invalid pinch thresholds")
        self.close, self.opening, self.dwell = close, opening, dwell
        self.reset()

    def reset(self):
        self.armed = False
        self.closed = False
        self.candidate = None
        self.since = None

    def update(self, distance: float, t: float) -> str | None:
        if not isfinite(distance):
            return None
        if not self.armed:
            if distance > self.opening:
                if self.since is None:
                    self.since = t
                if t - self.since >= self.dwell:
                    self.armed, self.since = True, None
            else:
                self.since = None
            return None

        desired = self.closed
        if not self.closed and distance < self.close:
            desired = True
        elif self.closed and distance > self.opening:
            desired = False
        if desired == self.closed:
            self.candidate = self.since = None
            return None
        if desired != self.candidate:
            self.candidate, self.since = desired, t
        if t - self.since >= self.dwell:
            self.closed = desired
            self.candidate = self.since = None
            return "grab" if desired else "release"
        return None


@dataclass(frozen=True)
class HandMetrics:
    midpoint: tuple[float, float]
    distance_px: float
    palm_px: float
    ratio: float


def measure_hand(points, frame_width: int, frame_height: int) -> HandMetrics:
    """points: 21 normalized (x,y) pairs. Use actual image aspect ratio."""
    if len(points) != 21 or not all(isfinite(v) for p in points for v in p[:2]):
        raise ValueError("Expected 21 finite landmarks")

    def distance(i, j):
        return hypot(
            (points[i][0] - points[j][0]) * frame_width,
            (points[i][1] - points[j][1]) * frame_height,
        )

    pinch, palm = distance(4, 8), distance(5, 17)
    return HandMetrics(
        ((points[4][0] + points[8][0]) / 2, (points[4][1] + points[8][1]) / 2),
        pinch,
        palm,
        pinch / max(palm, 1e-9),
    )


def map_pointer(midpoint: tuple[float, float], cfg: Config) -> tuple[float, float]:
    x0, y0, x1, y1 = cfg.active_region
    u = min(1.0, max(0.0, (midpoint[0] - x0) / (x1 - x0)))
    v = min(1.0, max(0.0, (midpoint[1] - y0) / (y1 - y0)))
    # The pointer covers BOTH inventory and camera. Skeleton mapping is separate.
    return u * (cfg.width - 1), v * (cfg.height - 1)


class HandInput:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.gate = PinchGate(*cfg.pinch_thresholds, cfg.debounce_s)
        self.fx, self.fy = OneEuro(), OneEuro()
        self.last_seen = None
        self.last_midpoint = None
        self.expired = True
        self.needs_filter_reset = True
        self.metrics = None

    def reset(self):
        self.gate.reset()
        self.fx.reset()
        self.fy.reset()
        self.last_seen = self.last_midpoint = self.metrics = None
        self.expired = True
        self.needs_filter_reset = True

    def missing(self, t: float):
        # Freeze briefly. A lost tracking frame is NEVER interpreted as release.
        self.needs_filter_reset = True
        self.gate.candidate = self.gate.since = None
        if self.last_seen is not None and t - self.last_seen > self.cfg.lost_timeout_s:
            if not self.expired:
                self.gate.reset()
                self.expired = True
                self.last_midpoint = None
                return None, "cancel"
        return None, None

    def update(self, points, width, height, t):
        if points is None:
            return self.missing(t)
        metrics = measure_hand(points, width, height)
        self.metrics = metrics
        if metrics.palm_px < self.cfg.min_palm_px:
            return self.missing(t)
        # Detect a long gap even if the event loop itself was paused.
        if self.last_seen is not None and t - self.last_seen > self.cfg.lost_timeout_s:
            if not self.expired:
                self.reset()
                return None, "cancel"
        # Large discontinuities may be a different hand. Cancel instead of jumping.
        if (
            self.last_midpoint is not None
            and hypot(
                metrics.midpoint[0] - self.last_midpoint[0],
                metrics.midpoint[1] - self.last_midpoint[1],
            )
            > 0.35
        ):
            self.reset()
            return None, "cancel"
        self.last_seen, self.last_midpoint = t, metrics.midpoint
        self.expired = False
        if self.needs_filter_reset:
            self.fx.reset()
            self.fy.reset()
            self.needs_filter_reset = False
        x, y = metrics.midpoint
        if self.cfg.smoothing:
            x, y = self.fx.update(x, t), self.fy.update(y, t)
        pointer = map_pointer((x, y), self.cfg)
        value = (
            metrics.distance_px if self.cfg.pinch_mode == "pixels" else metrics.ratio
        )
        return pointer, self.gate.update(value, t)
