"""OpenGL 3.3 lit meshes with transparent glass, composited onto webcam frames."""

from collections import OrderedDict
import os
import sys
import numpy as np
from PIL import Image
import moderngl

from .geometry import (
    PROFILES,
    box,
    lathe,
    liquid_mesh,
    rotation,
    sphere,
    transform_vertices,
)

VERTEX = """
#version 330
in vec3 in_pos;
in vec3 in_normal;
uniform mat3 rotation;
uniform vec2 viewport;
uniform vec3 center;
uniform float scale;
out vec3 normal;
out vec3 local_position;
void main() {
    vec3 p = rotation * in_pos * scale;
    normal = normalize(rotation * in_normal);
    local_position = in_pos;
    gl_Position = vec4(2.0 * (p.x + center.x) / viewport.x - 1.0,
                      1.0 - 2.0 * (center.y - p.y) / viewport.y,
                      -(p.z + center.z) / 2000.0, 1.0);
}
"""
FRAGMENT = """
#version 330
in vec3 normal;
in vec3 local_position;
uniform vec4 color;
uniform int glass;
uniform int markings;
out vec4 frag;
void main() {
    vec3 n = normalize(normal);
    if (!gl_FrontFacing) n = -n;
    vec3 light = normalize(vec3(-0.65, 0.85, 1.3));
    float diff = max(dot(n, light), 0.0);
    float spec = pow(max(dot(n, normalize(light + vec3(0,0,1))), 0.0), 72.0);
    float edge = pow(1.0 - abs(n.z), 2.6);
    vec3 rgb = color.rgb * (0.48 + 0.52 * diff) + vec3(spec * 0.8);
    float alpha = color.a;
    if (glass == 1) {
        rgb = mix(vec3(0.56,0.79,0.89), vec3(0.96,1.0,1.0), min(1.0,spec + edge * 0.6));
        alpha = 0.055 + edge * 0.48 + spec * 0.55;
        if (markings == 1 && local_position.z > 0.48 && abs(local_position.x) < 0.26
            && local_position.y > -0.5 && local_position.y < 0.56
            && mod(local_position.y + 0.6, 0.2) < 0.017) {
            rgb = vec3(0.93,0.98,1.0); alpha = 0.85;
        }
    }
    frag = vec4(clamp(rgb,0.0,1.0), clamp(alpha,0.0,1.0));
}
"""


class MeshRenderer:
    def __init__(self, width, height):
        kwargs = {"standalone": True, "require": 330}
        if sys.platform.startswith("linux") and not os.environ.get("DISPLAY"):
            kwargs["backend"] = "egl"
        try:
            self.ctx = moderngl.create_context(**kwargs)
        except Exception as error:
            raise RuntimeError(
                "Không tạo được OpenGL 3.3. Cập nhật driver GPU Intel/NVIDIA/AMD; "
                "tránh Remote Desktop. Có thể dùng app_2d.py để kiểm tra cử chỉ. "
                f"Chi tiết: {error}"
            ) from error
        self.width, self.height = width, height
        self.gpu = self.ctx.info.get("GL_RENDERER", "OpenGL")
        self.program = self.ctx.program(vertex_shader=VERTEX, fragment_shader=FRAGMENT)
        self.program["viewport"].value = (width, height)
        self.color = self.ctx.texture((width, height), 4)
        self.depth = self.ctx.depth_renderbuffer((width, height))
        self.fbo = self.ctx.framebuffer([self.color], self.depth)
        self.meshes = OrderedDict()
        self.ctx.enable(moderngl.DEPTH_TEST | moderngl.BLEND)
        self.ctx.blend_func = (
            moderngl.SRC_ALPHA,
            moderngl.ONE_MINUS_SRC_ALPHA,
            moderngl.ONE,
            moderngl.ONE_MINUS_SRC_ALPHA,
        )

    def mesh(self, key, vertices):
        if key in self.meshes:
            self.meshes.move_to_end(key)
            return self.meshes[key][1]
        if len(self.meshes) >= 180:
            _, (buf, vao) = self.meshes.popitem(last=False)
            vao.release()
            buf.release()
        buf = self.ctx.buffer(vertices.tobytes())
        vao = self.ctx.vertex_array(
            self.program, [(buf, "3f 3f", "in_pos", "in_normal")]
        )
        self.meshes[key] = buf, vao
        return vao

    def draw(self, key, vertices, color, glass=False, markings=False):
        self.program["color"].value = color
        self.program["glass"].value = int(glass)
        self.program["markings"].value = int(markings)
        self.mesh(key, vertices).render()

    def object(self, obj, z, t):
        p = self.program
        p["center"].value = (obj.x, obj.y, z)
        p["scale"].value = obj.scale
        p["rotation"].write(rotation(obj.roll, obj.yaw).T.tobytes())
        kind = obj.item.kind
        self.fbo.depth_mask = True
        self.ctx.disable(moderngl.CULL_FACE)
        if kind == "balance":
            self.draw("balance_base", box(1.8, 0.38, 1.1), (0.15, 0.25, 0.31, 1.0))
            platform = transform_vertices(box(1.3, 0.08, 0.8), offset=(0, 0.25, -0.05))
            self.draw("balance_plate", platform, (0.73, 0.82, 0.87, 1.0))
            display = transform_vertices(
                box(0.63, 0.18, 0.015), offset=(0, -0.02, 0.56)
            )
            self.draw("balance_display", display, (0.10, 0.52, 0.47, 1.0))
            return
        if kind == "lamp":
            base = lathe(
                (
                    (-0.55, 0),
                    (-0.55, 0.53),
                    (-0.48, 0.66),
                    (0, 0.64),
                    (0.25, 0.33),
                    (0.30, 0),
                )
            )
            self.draw("lamp_body", base, (0.26, 0.52, 0.61, 0.72))
            cap = lathe(((0.26, 0), (0.26, 0.29), (0.36, 0.29), (0.36, 0)))
            self.draw("lamp_cap", cap, (0.54, 0.61, 0.67, 1.0))
            wick = transform_vertices(box(0.06, 0.28, 0.06), offset=(0, 0.49, 0))
            self.draw("lamp_wick", wick, (0.85, 0.81, 0.68, 1.0))
            return
        if kind == "solid":
            mesh = transform_vertices(box(1.2, 0.34, 0.72), offset=(0, 0, 0))
            if obj.mixture.solid_copper_g > 1e-9:
                self.draw("copper", mesh, (*obj.item.color, 1.0))
            return
        if kind == "dropper":
            bulb = transform_vertices(
                sphere(0.22), scale=(1, 1.6, 1), offset=(0, 0.88, 0)
            )
            self.draw("bulb", bulb, (0.12, 0.22, 0.27, 1.0))
        if obj.sealed:
            y = max(p[0] for p in PROFILES[kind])
            r = next(p[1] for p in PROFILES[kind] if p[0] == y)
            lid = lathe(((y, 0), (y, r * 1.04), (y + 0.13, r * 1.04), (y + 0.13, 0)))
            self.draw((kind, "lid"), lid, (0.13, 0.21, 0.28, 1.0))
        mix = obj.mixture
        for key, color in (
            ("CuOH2", (0.25, 0.65, 0.98)),
            ("CaCO3", (0.93, 0.94, 0.88)),
        ):
            if mix.mol.get(key, 0) > 1e-10:
                # Separate 3D sediment particles; size is illustrative, not grain metrology.
                rng = np.random.default_rng(obj.id * 17)
                for j in range(12):
                    x, z0 = rng.uniform(-0.30, 0.30, 2)
                    bottom = -0.65 if kind not in ("tube", "dropper") else -0.80
                    crystal = transform_vertices(
                        sphere(0.065, 10), offset=(x, bottom, z0)
                    )
                    self.draw((obj.id, kind, key, j), crystal, (*color, 1.0))
        if mix.solid_copper_g > 1e-9:
            crystal = transform_vertices(box(0.37, 0.18, 0.26), offset=(0, -0.59, 0.1))
            self.draw("solid_in_vessel", crystal, (0.78, 0.36, 0.16, 1.0))
        if mix.volume_ml > 0.001:
            step = max(1, min(97, round(mix.volume_ml / obj.item.capacity_ml * 97)))
            self.fbo.depth_mask = False
            self.ctx.enable(moderngl.CULL_FACE)
            self.ctx.cull_face = "back"
            self.draw(
                (kind, "liquid", step), liquid_mesh(kind, step), (*mix.color, 0.58)
            )
        # Back and front glass passes preserve a visible hollow rim. No depth write
        # for transparency. Overlapping transparent objects remain approximate.
        self.fbo.depth_mask = False
        self.ctx.enable(moderngl.CULL_FACE)
        for face in ("front", "back"):
            self.ctx.cull_face = face
            self.draw(
                (kind, "glass"),
                lathe(PROFILES[kind]),
                (0.75, 0.9, 1, 0.2),
                glass=True,
                markings=kind in ("beaker", "bottle"),
            )
        self.ctx.disable(moderngl.CULL_FACE)

    def render(self, objects, t=0.0):
        self.fbo.use()
        self.fbo.depth_mask = True
        self.fbo.clear(0, 0, 0, 0, depth=1)
        for i, obj in enumerate(objects):
            self.object(obj, i * 190.0 - 1500.0, t)
        # RGBa is Pillow's premultiplied mode. Its native conversion avoids
        # multiple full-frame float arrays and preserves straight alpha output.
        return Image.frombytes(
            "RGBa",
            (self.width, self.height),
            self.fbo.read(components=4, alignment=1),
            "raw",
            "RGBa",
            0,
            -1,
        ).convert("RGBA")

    def close(self):
        for buf, vao in self.meshes.values():
            vao.release()
            buf.release()
        self.meshes.clear()
        for resource in (self.fbo, self.depth, self.color, self.program):
            resource.release()
        self.ctx.release()
