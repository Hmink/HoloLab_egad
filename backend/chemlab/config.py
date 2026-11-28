from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    width: int = 1280
    height: int = 800
    split: float = 0.30
    header: int = 112
    footer: int = 100
    # Hand coordinates in this normalized camera rectangle cover the whole UI.
    active_region: tuple[float, float, float, float] = (0.12, 0.12, 0.88, 0.88)
    pinch_mode: str = "normalized"
    pinch_close: float = 0.30
    pinch_open: float = 0.46
    close_px: float = 40.0
    open_px: float = 60.0
    debounce_s: float = 0.075
    lost_timeout_s: float = 0.35
    min_palm_px: float = 22.0
    smoothing: bool = True

    def __post_init__(self):
        if self.width < 1100 or self.height < 680:
            raise ValueError("Use a window at least 1100 x 680 pixels")
        if not 0.25 <= self.split <= 0.50:
            raise ValueError("split must be between 0.25 and 0.50")
        if self.pinch_mode not in ("normalized", "pixels"):
            raise ValueError("Unknown pinch mode")

    @property
    def menu_width(self) -> int:
        return round(self.width * self.split)

    @property
    def workspace(self) -> tuple[int, int, int, int]:
        return (
            self.menu_width + 14,
            self.header,
            self.width - 18,
            self.height - self.footer - 12,
        )

    @property
    def pinch_thresholds(self) -> tuple[float, float]:
        if self.pinch_mode == "pixels":
            return self.close_px, self.open_px
        return self.pinch_close, self.pinch_open

    @property
    def drop_zone(self) -> tuple[int, int, int, int]:
        x0, y0, x1, y1 = self.workspace
        return x0, y0, x1, y1 - 90  # Reserve the HUD; placed objects remain visible.
