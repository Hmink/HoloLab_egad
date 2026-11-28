"""Stable owner selection; independent of MediaPipe result ordering and size."""

from dataclasses import dataclass
from math import hypot


@dataclass(frozen=True)
class Candidate:
    points: list
    world: list | None = None
    label: str = "Unknown"
    score: float = 0.0

    @property
    def center(self):
        return tuple(
            sum(self.points[i][axis] for i in (0, 5, 9, 17)) / 4 for axis in (0, 1)
        )


class HandSelector:
    """Prefer the requested hand, never silently give a held object to another.

    Handedness is probabilistic, not biometric identity. Ambiguous candidates
    pause control; continuous nearby points tolerate an uncertain label.
    """

    def __init__(self, preference="right"):
        self.preference = preference
        self.reset()

    def reset(self):
        self.label = None
        self.center = None
        self.last_seen = None
        self.generation = 0

    def choose(self, candidates, now, holding=False):
        desired = self.label if holding and self.label else self.preference.title()
        if desired == "Auto":
            desired = self.label
        matching = [c for c in candidates if c.label == desired]
        if not matching and self.center and self.last_seen is not None:
            # Only a LOW confidence label flip near the old position is tolerated.
            matching = [
                c
                for c in candidates
                if c.score < 0.65
                and now - self.last_seen < 0.20
                and hypot(c.center[0] - self.center[0], c.center[1] - self.center[1])
                < 0.10
            ]
        if not matching and self.preference == "auto" and not holding:
            if self.last_seen is None or now - self.last_seen > 0.8:
                matching = candidates
        if not matching:
            return None
        if self.center:
            chosen = min(
                matching,
                key=lambda c: hypot(
                    c.center[0] - self.center[0], c.center[1] - self.center[1]
                ),
            )
        else:
            chosen = max(matching, key=lambda c: c.score)
        if (
            self.label is not None
            and chosen.label != self.label
            and chosen.score >= 0.65
        ):
            if holding:
                return None
            self.generation += 1
        if chosen.score >= 0.65 or self.label is None:
            self.label = chosen.label
        self.center, self.last_seen = chosen.center, now
        return chosen
