"""Procedural triangle meshes. No images stand in for the 3D vessels."""

from functools import lru_cache
import math
import numpy as np

# (height, radius), in local coordinates. Outside, rim, inside and base form
# one open, thick-walled vessel; unlike a capped cylinder, the mouth is hollow.
PROFILES = {
    "beaker": (
        (-0.82, 0.67),
        (-0.78, 0.72),
        (0.76, 0.72),
        (0.80, 0.76),
        (0.84, 0.76),
        (0.84, 0.67),
        (0.75, 0.66),
        (-0.70, 0.66),
        (-0.72, 0),
    ),
    "flask": (
        (-0.88, 0.64),
        (-0.81, 0.78),
        (-0.59, 0.78),
        (0.38, 0.25),
        (0.92, 0.25),
        (0.95, 0.29),
        (1.00, 0.29),
        (1.00, 0.20),
        (0.40, 0.20),
        (-0.59, 0.69),
        (-0.75, 0.69),
        (-0.77, 0),
    ),
    "tube": (
        (-1.00, 0),
        (-0.96, 0.20),
        (-0.80, 0.30),
        (0.97, 0.30),
        (1.00, 0.34),
        (1.04, 0.34),
        (1.04, 0.25),
        (-0.78, 0.25),
        (-0.90, 0.16),
        (-0.94, 0),
    ),
    "bottle": (
        (-0.88, 0.53),
        (-0.81, 0.60),
        (0.48, 0.60),
        (0.68, 0.26),
        (0.98, 0.26),
        (1.01, 0.30),
        (1.05, 0.30),
        (1.05, 0.20),
        (0.70, 0.20),
        (0.43, 0.53),
        (-0.73, 0.53),
        (-0.75, 0),
    ),
    "dropper": (
        (-1.05, 0),
        (-0.94, 0.035),
        (-0.50, 0.10),
        (0.65, 0.10),
        (0.65, 0.075),
        (-0.50, 0.075),
        (-0.94, 0.022),
    ),
}
INTERIORS = {
    "beaker": ((-0.69, 0.65), (0.74, 0.65)),
    "flask": ((-0.74, 0.68), (-0.59, 0.68), (0.4, 0.19), (0.91, 0.19)),
    "tube": ((-0.90, 0.10), (-0.78, 0.24), (0.94, 0.24)),
    "bottle": ((-0.72, 0.52), (0.43, 0.52), (0.70, 0.19), (0.96, 0.19)),
    "dropper": ((-0.90, 0.022), (-0.50, 0.065), (0.60, 0.065)),
}


def lathe(profile, segments=64, flat=False):
    return _lathe(tuple(profile), segments)


@lru_cache(maxsize=384)
def _lathe(profile, segments=64):
    vertices = []
    for (y0, r0), (y1, r1) in zip(profile, profile[1:]):
        dy, dr = y1 - y0, r1 - r0
        length = math.hypot(dy, dr)
        if length < 1e-10:
            continue
        for j in range(segments):
            a, b = 2 * math.pi * j / segments, 2 * math.pi * (j + 1) / segments

            def v(y, r, angle):
                return (
                    r * math.cos(angle),
                    y,
                    r * math.sin(angle),
                    dy / length * math.cos(angle),
                    -dr / length,
                    dy / length * math.sin(angle),
                )

            p = (v(y0, r0, a), v(y0, r0, b), v(y1, r1, b), v(y1, r1, a))
            for index in (0, 1, 2, 0, 2, 3):
                vertices.append(p[index])
    return np.asarray(vertices, dtype="f4")


def box(sx=1, sy=1, sz=1):
    p = np.asarray(
        [
            (x * sx, y * sy, z * sz)
            for x in (-0.5, 0.5)
            for y in (-0.5, 0.5)
            for z in (-0.5, 0.5)
        ],
        dtype="f4",
    )
    faces = (
        (0, 1, 3, 2),
        (4, 6, 7, 5),
        (0, 4, 5, 1),
        (2, 3, 7, 6),
        (0, 2, 6, 4),
        (1, 5, 7, 3),
    )
    out = []
    for a, b, c, d in faces:
        normal = np.cross(p[b] - p[a], p[c] - p[a])
        normal /= np.linalg.norm(normal)
        for j in (a, b, c, a, c, d):
            out.append((*p[j], *normal))
    return np.asarray(out, dtype="f4")


@lru_cache(maxsize=24)
def sphere(radius=1, segments=24):
    profile = [
        (radius * math.sin(a), radius * math.cos(a))
        for a in np.linspace(-math.pi / 2, math.pi / 2, 16)
    ]
    return lathe(profile, segments)


def transform_vertices(vertices, scale=(1, 1, 1), offset=(0, 0, 0)):
    result = vertices.copy()
    result[:, :3] = result[:, :3] * np.asarray(scale) + np.asarray(offset)
    result[:, 3:] /= np.asarray(scale)
    result[:, 3:] /= np.maximum(
        np.linalg.norm(result[:, 3:], axis=1, keepdims=True), 1e-9
    )
    return result


def volume_to_height(kind, fill):
    """Integrate radius^2: a conical flask does not fill linearly in height."""
    profile = INTERIORS[kind]
    y = np.linspace(profile[0][0], profile[-1][0], 600)
    radius = np.interp(y, [p[0] for p in profile], [p[1] for p in profile])
    cumulative = np.cumsum(radius * radius)
    return float(np.interp(fill * cumulative[-1], cumulative, y))


@lru_cache(maxsize=256)
def liquid_mesh(kind, fill_step):
    fill = max(0.001, min(0.97, fill_step / 100))
    height = volume_to_height(kind, fill)
    profile = INTERIORS[kind]
    radius = float(np.interp(height, [p[0] for p in profile], [p[1] for p in profile]))
    shape = [(profile[0][0], 0)] + [p for p in profile if p[0] < height]
    shape += [(height, radius), (height, 0)]
    return lathe(shape)


def rotation(roll=0.0, yaw=0.0):
    a, b, c = map(math.radians, (roll, yaw, 19))
    rz = np.array(
        ((math.cos(a), -math.sin(a), 0), (math.sin(a), math.cos(a), 0), (0, 0, 1))
    )
    ry = np.array(
        ((math.cos(b), 0, math.sin(b)), (0, 1, 0), (-math.sin(b), 0, math.cos(b)))
    )
    rx = np.array(
        ((1, 0, 0), (0, math.cos(c), -math.sin(c)), (0, math.sin(c), math.cos(c)))
    )
    return (rz @ rx @ ry).astype("f4")


def mouth_position(obj):
    if obj.item.kind not in INTERIORS:
        return obj.x, obj.y
    rim = PROFILES[obj.item.kind]
    top = max(p[0] for p in rim)
    radius = next(p[1] for p in rim if p[0] == top)
    # The lower rim on the side towards which the vessel tilts is the outlet.
    side = -1 if obj.roll > 0 else 1
    local = np.array((side * radius, top, 0), dtype="f4")
    pos = rotation(obj.roll, obj.yaw) @ local * obj.scale
    return obj.x + float(pos[0]), obj.y - float(pos[1])
