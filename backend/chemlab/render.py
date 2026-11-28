"""Pillow draws UTF-8 text; OpenCV only handles video and the desktop window."""

from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

from .config import Config
from .scene import Scene, inventory_cards, tab_rectangles

INK = "#e6edf5"
MUTED = "#97a9be"
TEAL = "#5eead4"
BG = "#0b1320"
PANEL = "#111e2e"
CARD = "#19293c"
EDGES = [
    (0, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (0, 5),
    (5, 6),
    (6, 7),
    (7, 8),
    (5, 9),
    (9, 10),
    (10, 11),
    (11, 12),
    (9, 13),
    (13, 14),
    (14, 15),
    (15, 16),
    (13, 17),
    (0, 17),
    (17, 18),
    (18, 19),
    (19, 20),
]


@lru_cache(maxsize=32)
def font(size, bold=False):
    names = (
        [
            "C:/Windows/Fonts/segoeuib.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ]
        if bold
        else [
            "C:/Windows/Fonts/segoeui.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    )
    names += ["/System/Library/Fonts/Supplemental/Arial.ttf"]
    for name in names:
        if Path(name).is_file():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default(size=size)


def text(draw, xy, value, size=16, color=INK, bold=False):
    mask, offset = _text_mask(str(value), size, bold)
    draw.bitmap((xy[0] + offset[0], xy[1] + offset[1]), mask, fill=color)


@lru_cache(maxsize=1024)
def _text_mask(value, size, bold):
    mask, offset = font(size, bold).getmask2(value, mode="L")
    return Image.frombytes("L", mask.size, bytes(mask)), offset


def fit_text(draw, value, width, size=16, bold=False):
    return _fit_text_cached(value, width, size, bold)


@lru_cache(maxsize=2048)
def _fit_text_cached(value, width, size, bold):
    chosen_font = font(size, bold)
    if chosen_font.getlength(value) <= width:
        return value
    low, high = 0, len(value)
    while low < high:
        middle = (low + high + 1) // 2
        if chosen_font.getlength(value[:middle] + "…") <= width:
            low = middle
        else:
            high = middle - 1
    return value[:low] + "…" if low else ""


def wrapped(draw, xy, value, width, size=16, color=INK, spacing=7):
    x, y = xy
    line = ""
    for word in value.split():
        candidate = (line + " " + word).strip()
        if line and draw.textlength(candidate, font=font(size)) > width:
            text(draw, (x, y), line, size, color)
            y += size + spacing
            line = word
        else:
            line = candidate
    if line:
        text(draw, (x, y), line, size, color)
    return y + size + spacing


def icon(draw, cx, cy, kind, color, scale=1.0):
    def box(x0, y0, x1, y1):
        return (
            round(cx + x0 * scale),
            round(cy + y0 * scale),
            round(cx + x1 * scale),
            round(cy + y1 * scale),
        )

    line = max(1, round(2 * scale))
    if kind == "beaker":
        draw.rounded_rectangle(
            box(-22, -30, 22, 28), radius=5 * scale, outline=color, width=line
        )
        draw.rectangle(box(-18, 2, 18, 23), fill="#245f65")
        draw.line(
            [box(-27, -31, 27, -31)[:2], box(-27, -31, 27, -31)[2:]],
            fill=color,
            width=line,
        )
        for y in (-18, -8, 2, 12):
            draw.line(box(10, y, 19, y), fill=color, width=line)
    elif kind == "tube":
        draw.rounded_rectangle(
            box(-12, -33, 12, 32), radius=11 * scale, outline=color, width=line
        )
        draw.rounded_rectangle(box(-8, 4, 8, 28), radius=7 * scale, fill="#65548b")
        draw.rectangle(box(-15, -34, 15, -27), fill=color)
    elif kind == "dropper":
        draw.rounded_rectangle(box(-11, -33, 11, -11), radius=8 * scale, fill=color)
        draw.rectangle(box(-5, -11, 5, 22), outline=color, width=line)
        draw.polygon(
            [
                (cx - 5 * scale, cy + 22 * scale),
                (cx + 5 * scale, cy + 22 * scale),
                (cx, cy + 33 * scale),
            ],
            fill=color,
        )
    elif kind == "lamp":
        draw.ellipse(box(-24, -4, 24, 28), outline=color, width=line)
        draw.rectangle(box(-11, -10, 11, 2), fill=color)
        draw.line(box(0, -21, 0, -10), fill=color, width=line)
        # Unlit: the prototype does not simulate flames or heating.
    elif kind == "balance":
        draw.line(box(-25, -20, 25, -20), fill=color, width=line)
        draw.line(box(0, -20, 0, -7), fill=color, width=line)
        draw.rounded_rectangle(
            box(-29, -7, 29, 27), radius=4 * scale, outline=color, width=line
        )
        draw.rectangle(box(-19, 3, 8, 16), fill="#204c52")
        draw.ellipse(box(15, 6, 21, 12), fill=color)
    elif kind == "metal":
        draw.polygon(
            [
                (cx - 26 * scale, cy - 6 * scale),
                (cx + 8 * scale, cy - 24 * scale),
                (cx + 26 * scale, cy - 10 * scale),
                (cx - 8 * scale, cy + 12 * scale),
            ],
            fill=color,
        )
        draw.polygon(
            [
                (cx - 26 * scale, cy - 6 * scale),
                (cx - 8 * scale, cy + 12 * scale),
                (cx - 8 * scale, cy + 28 * scale),
                (cx - 26 * scale, cy + 10 * scale),
            ],
            fill="#64748b",
        )
        draw.polygon(
            [
                (cx - 8 * scale, cy + 12 * scale),
                (cx + 26 * scale, cy - 10 * scale),
                (cx + 26 * scale, cy + 7 * scale),
                (cx - 8 * scale, cy + 28 * scale),
            ],
            fill="#475569",
        )
    else:
        draw.rounded_rectangle(
            box(-22, -18, 22, 31), radius=6 * scale, outline=color, width=line
        )
        draw.rectangle(box(-11, -32, 11, -18), outline=color, width=line)
        draw.rectangle(box(-14, -38, 14, -31), fill=color)
        draw.rectangle(box(-16, 3, 16, 22), fill=color)


class Renderer:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.backgrounds = {}

    def static(self, group):
        if group in self.backgrounds:
            return self.backgrounds[group].copy()
        cfg = self.cfg
        im = Image.new("RGB", (cfg.width, cfg.height), BG)
        d = ImageDraw.Draw(im)
        d.rectangle((0, 0, cfg.menu_width, cfg.height), fill=PANEL)
        text(d, (24, 22), "ChemLab", 30, bold=True)
        text(d, (182, 32), "/ CV", 18, TEAL)
        text(d, (25, 67), "PHÒNG THÍ NGHIỆM TƯƠNG TÁC", 12, MUTED)
        for value, rect in tab_rectangles(cfg).items():
            active = value == group
            d.rounded_rectangle(rect, radius=8, fill="#24535a" if active else CARD)
            text(
                d,
                (rect[0] + 12, rect[1] + 7),
                "Dụng cụ" if value == "tool" else "Hóa chất",
                14,
                TEAL if active else MUTED,
                True,
            )
        for item, rect in inventory_cards(cfg):
            if item.group != group:
                continue
            x0, y0, x1, y1 = rect
            d.rounded_rectangle(rect, radius=12, fill=CARD, outline="#2b3b50")
            icon(d, x0 + 36, (y0 + y1) / 2, item.kind, item.color, 0.65)
            size = 14 if cfg.split >= 0.43 else 16
            text(
                d,
                (x0 + 70, y0 + 10),
                fit_text(d, item.name, x1 - x0 - 80, size, True),
                size,
                INK,
                True,
            )
            text(d, (x0 + 70, y0 + 34), item.formula, 13, MUTED)
            text(d, (x0 + 70, y0 + 56), item.label, 10, item.color, True)
        text(d, (cfg.menu_width + 24, 23), "BÀN THÍ NGHIỆM", 22, bold=True)
        text(
            d,
            (cfg.menu_width + 24, 59),
            fit_text(
                d,
                "Mở tay để trỏ · Chụm để gắp · Giữ để kéo · Mở để thả",
                cfg.width - cfg.menu_width - 44,
                14,
            ),
            14,
            MUTED,
        )
        d.rounded_rectangle(
            (cfg.width - 139, 25, cfg.width - 22, 54), radius=13, fill="#163a3e"
        )
        text(d, (cfg.width - 125, 31), "BẢN MẪU 01", 11, TEAL, True)
        d.line((cfg.menu_width, 0, cfg.menu_width, cfg.height), fill="#304056")
        d.line(
            (18, cfg.height - cfg.footer, cfg.width - 18, cfg.height - cfg.footer),
            fill="#304056",
        )
        text(
            d,
            (24, cfg.height - 79),
            "T / C  đổi kho     R  dọn bàn     Q / Esc  thoát",
            13,
            MUTED,
        )
        text(
            d,
            (24, cfg.height - 49),
            "Chỉ dùng vật thể ảo · Chưa mô phỏng phản ứng, rót hay gia nhiệt",
            12,
            "#e6c78b",
        )
        self.backgrounds[group] = im.copy()
        return im

    def render(
        self,
        scene: Scene,
        frame=None,
        points=None,
        pointer=None,
        pinched=False,
        armed=False,
        fps=None,
        inference_ms=None,
        mouse_only=False,
        snapshot=False,
    ):
        cfg = self.cfg
        im = self.static(scene.group)
        x0, y0, x1, y1 = cfg.workspace
        w, h = x1 - x0, y1 - y0
        image_rect = None
        if frame is not None:
            camera = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            camera = ImageOps.contain(camera, (w, h))
            px, py = x0 + (w - camera.width) // 2, y0 + (h - camera.height) // 2
            im.paste(camera, (px, py))
            image_rect = (px, py, camera.width, camera.height)
        d = ImageDraw.Draw(im)
        if frame is None:
            d.rounded_rectangle((x0, y0, x1, y1), radius=16, fill="#122335")
            for x in range(x0 + 25, x1, 40):
                for y in range(y0 + 25, y1, 40):
                    d.ellipse((x, y, x + 1, y + 1), fill="#345169")
        d.rounded_rectangle((x0, y0, x1, y1), radius=14, outline="#446072", width=2)
        if image_rect:
            px, py, iw, ih = image_rect
            ax, ay, bx, by = cfg.active_region
            d.rectangle(
                (px + ax * iw, py + ay * ih, px + bx * iw, py + by * ih),
                outline="#5b8b86",
                width=1,
            )
            if points is not None:
                projected = [(px + x * iw, py + y * ih) for x, y in points]
                for a, b in EDGES:
                    d.line((*projected[a], *projected[b]), fill=TEAL, width=2)
                for j, (x, y) in enumerate(projected):
                    r = 5 if j in (4, 8) else 3
                    d.ellipse(
                        (x - r, y - r, x + r, y + r),
                        fill="#fbbf24" if j in (4, 8) else TEAL,
                    )
        if snapshot or mouse_only:
            label = (
                "ẢNH MINH HỌA GIAO DIỆN · KHÔNG PHẢI WEBCAM"
                if snapshot
                else "CHẾ ĐỘ CHUỘT · KHÔNG SỬ DỤNG WEBCAM"
            )
            text(d, (x0 + 22, y0 + 22), label, 12, MUTED, True)
        for obj in scene.objects:
            held = scene.drag is not None and scene.drag.obj.id == obj.id
            rect = (obj.x - 48, obj.y - 63, obj.x + 48, obj.y + 63)
            d.rounded_rectangle(
                rect,
                radius=12,
                fill="#102b3b",
                outline=TEAL if held else "#526a81",
                width=2 if held else 1,
            )
            icon(d, obj.x, obj.y - 8, obj.item.kind, obj.item.color, 0.95)
            caption = fit_text(d, obj.item.name, 88, 11)
            tw = d.textlength(caption, font=font(11))
            text(d, (obj.x - tw / 2, obj.y + 36), caption, 11)
            text(d, (obj.x - 35, obj.y - 58), f"#{obj.id:02d}", 9, MUTED)
        if pointer:
            x, y = pointer
            color = TEAL if pinched else "#fbbf24"
            d.ellipse((x - 12, y - 12, x + 12, y + 12), outline=color, width=3)
            d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=color)
        # HUD and instructions occupy reserved bottom strip inside the workspace.
        hud_y = y1 - 76
        d.rounded_rectangle(
            (x0 + 12, hud_y, x1 - 12, y1 - 12), radius=10, fill="#0c1928"
        )
        state = (
            "ĐANG GẮP"
            if scene.drag
            else ("SẴN SÀNG" if armed or mouse_only else "HÃY MỞ TAY")
        )
        text(d, (x0 + 25, hud_y + 9), state, 12, TEAL, True)
        stats = []
        if fps is not None:
            stats.append(f"{fps:.0f} FPS")
        if inference_ms is not None:
            stats.append(f"Nhận diện {inference_ms:.0f} ms")
        if stats:
            text(d, (x0 + 150, hud_y + 9), "  ·  ".join(stats), 12, MUTED)
        text(d, (x0 + 25, hud_y + 34), fit_text(d, scene.message, w - 55, 12), 12, INK)
        if len(scene.objects) == 0:
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            d.rounded_rectangle(
                (cx - 140, cy - 59, cx + 140, cy + 40),
                radius=16,
                fill="#153546",
                outline="#376772",
            )
            text(d, (cx - 116, cy - 41), "Đặt dụng cụ đầu tiên", 19, INK, True)
            text(d, (cx - 116, cy - 7), "Gắp từ kho rồi kéo sang đây", 14, MUTED)
        return cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
