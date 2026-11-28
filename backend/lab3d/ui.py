"""Vietnamese desktop UI. Actual mesh rendering is delegated to OpenGL."""

import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageOps

from chemlab.render import EDGES, font, text, fit_text, wrapped
from .catalog import buttons, cards, pages
from .geometry import mouth_position
from .gl_renderer import MeshRenderer
from .mixture import Mixture
from .scene import Object3D

BG, PANEL, INK, MUTED, TEAL = "#08121b", "#102331", "#e7f3f7", "#95aebd", "#60e5cb"


class Renderer3D:
    def __init__(self, cfg):
        self.cfg = cfg
        self.meshes = MeshRenderer(cfg.width, cfg.height)
        self.backgrounds = {}

    def static(self, scene):
        key = scene.group, scene.page
        if key in self.backgrounds:
            return self.backgrounds[key].copy()
        c = self.cfg
        im = Image.new("RGBA", (c.width, c.height), BG)
        d = ImageDraw.Draw(im)
        d.rectangle((0, 0, c.menu_width, c.height), fill=PANEL)
        text(d, (24, 22), "CHEMLAB", 29, INK, True)
        text(d, (25, 60), "3D v2.1  /  KHÔNG GIAN THỰC NGHIỆM", 11, TEAL, True)
        text(d, (24, 98), "KHO DỤNG CỤ & HÓA CHẤT", 12, MUTED, True)
        labels = {"tool": "Dụng cụ", "chemical": "Hóa chất", "risk": "Nguy hiểm"}
        for action, rect in buttons(c).items():
            if action in labels:
                active = action == scene.group
                d.rounded_rectangle(rect, 8, fill="#23524f" if active else "#1a3443")
                text(
                    d,
                    (rect[0] + 10, rect[1] + 8),
                    labels[action],
                    12,
                    TEAL if active else MUTED,
                    True,
                )
        previews = []
        for i, (item, rect) in enumerate(cards(c, scene.group, scene.page)):
            x0, y0, x1, y1 = rect
            d.rounded_rectangle(rect, 12, fill="#17303f", outline="#284b5b")
            text(
                d,
                (x0 + 83, y0 + 16),
                fit_text(d, item.name, x1 - x0 - 93, 15, True),
                15,
                INK,
                True,
            )
            text(
                d,
                (x0 + 83, y0 + 42),
                fit_text(d, item.formula, x1 - x0 - 93, 12),
                12,
                MUTED,
            )
            if item.group == "risk":
                text(d, (x0 + 83, y1 - 22), "CHỈ TRONG MÔ PHỎNG", 10, "#f6b36d", True)
            obj = Object3D(
                i + 1, item, x0 + 43, (y0 + y1) / 2, Mixture.stock(item), scale=30
            )
            previews.append(obj)
        im = Image.alpha_composite(im, self.meshes.render(previews))
        d = ImageDraw.Draw(im)
        for action in ("prev", "next"):
            rect = buttons(c)[action]
            d.rounded_rectangle(rect, 8, fill="#1c3c4c")
            text(
                d,
                (rect[0] + 19, rect[1] + 5),
                "<" if action == "prev" else ">",
                17,
                INK,
            )
        y = buttons(c)["prev"][1]
        text(
            d,
            (92, y + 8),
            f"Trang {scene.page + 1}/{pages(scene.group)}  ·  [ / ]",
            12,
            MUTED,
        )
        text(
            d,
            (24, c.height - 32),
            "Dữ liệu tham khảo · chưa thẩm định giảng dạy",
            10,
            MUTED,
        )
        self.backgrounds[key] = im.copy()
        return im

    def render(
        self,
        scene,
        frame=None,
        points=None,
        pointer=None,
        pinched=False,
        fps=None,
        mouse_only=False,
        now=0.0,
        snapshot=False,
        hand_info=None,
    ):
        c = self.cfg
        im = self.static(scene)
        d = ImageDraw.Draw(im)
        x0, y0, x1, y1 = c.workspace
        w, h = x1 - x0, y1 - y0
        d.rounded_rectangle((x0, y0, x1, y1), 18, fill="#122c3b")
        image_rect = None
        if frame is not None:
            camera = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).convert(
                "RGBA"
            )
            camera = ImageOps.contain(camera, (w, h))
            camera = Image.blend(
                camera, Image.new("RGBA", camera.size, "#071a28"), 0.25
            )
            px, py = x0 + (w - camera.width) // 2, y0 + (h - camera.height) // 2
            im.paste(camera, (px, py))
            image_rect = px, py, camera.width, camera.height
        d = ImageDraw.Draw(im)
        if frame is None:
            # Desk perspective is a visual reference, not a calibrated AR plane.
            desk = Image.new("RGBA", im.size, (0, 0, 0, 0))
            grid = ImageDraw.Draw(desk)
            horizon = y0 + 115
            for x in range(x0 - 240, x1 + 250, 85):
                grid.line(
                    (x0 + w / 2 + (x - (x0 + w / 2)) * 0.35, horizon, x, y1),
                    fill="#234350",
                    width=1,
                )
            for factor in (0.02, 0.08, 0.18, 0.34, 0.57, 0.88):
                y = horizon + factor * (y1 - horizon)
                grid.line((x0, y, x1, y), fill="#234350")
            crop = desk.crop((x0, y0, x1, y1))
            im.paste(crop, (x0, y0), crop)
            d = ImageDraw.Draw(im)
        text(d, (x0, 29), "Bàn thí nghiệm 3D", 27, INK, True)
        subtitle = "Kính trong · chất lỏng · chất rắn · phối trộn tự do"
        text(d, (x0 + 1, 68), subtitle, 13, MUTED)
        if fps is not None:
            text(d, (x1 - 94, 33), f"{fps:.0f} FPS", 14, TEAL, True)
        mode = (
            "TỰ DO · CÓ TÌNH HUỐNG NGUY HIỂM"
            if scene.allow_risk
            else "HƯỚNG DẪN · CHẶN THAO TÁC NGUY HIỂM"
        )
        mode_rect = buttons(c)["mode"]
        d.rounded_rectangle(
            mode_rect, 9, fill="#514132" if scene.allow_risk else "#214b49"
        )
        text(
            d,
            (mode_rect[0] + 10, mode_rect[1] + 11),
            fit_text(d, mode + "  [S]", c.menu_width - 62, 10),
            10,
            "#f7cb8d" if scene.allow_risk else TEAL,
            True,
        )
        tag = (
            "ẢNH DỰNG TỪ MÃ 3D"
            if snapshot
            else ("CHUỘT / KHÔNG CAMERA" if mouse_only else "WEBCAM + ĐIỂM BÀN TAY")
        )
        text(d, (x0 + 18, y0 + 16), tag, 10, MUTED, True)
        if image_rect and hand_info:
            hand, preference = hand_info
            px, py, iw, ih = image_rect
            ax, ay, bx, by = hand.cfg.active_region
            control_rect = (px + ax * iw, py + ay * ih, px + bx * iw, py + by * ih)
            d.rounded_rectangle(control_rect, 8, outline="#56bba5", width=2)
            text(
                d,
                (control_rect[0] + 7, control_rect[1] + 5),
                "VÙNG TAY → TOÀN MÀN HÌNH",
                10,
                TEAL,
                True,
            )
        if image_rect and points is not None:
            px, py, iw, ih = image_rect
            ps = [(px + x * iw, py + y * ih) for x, y in points]
            for a, b in EDGES:
                d.line((*ps[a], *ps[b]), fill=TEAL, width=2)
            for x, y in ps:
                d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=TEAL)
        for obj in scene.objects:
            selected = obj.id == scene.selected_id
            d.ellipse(
                (obj.x - 70, obj.y + 60, obj.x + 70, obj.y + 84),
                fill="#0b202b",
                outline=TEAL if selected else "#284957",
                width=2 if selected else 1,
            )
        im = Image.alpha_composite(im, self.meshes.render(scene.objects, now))
        d = ImageDraw.Draw(im)
        by_id = {o.id: o for o in scene.objects}
        for obj in scene.objects:
            liquid = obj.mixture
            name = f"#{obj.id} " + obj.item.name
            caption = fit_text(d, name, 178, 11)
            tw = d.textlength(caption, font=font(11))
            d.rounded_rectangle(
                (obj.x - tw / 2 - 7, obj.y + 87, obj.x + tw / 2 + 7, obj.y + 109),
                6,
                fill="#102734",
            )
            text(d, (obj.x - tw / 2, obj.y + 90), caption, 11, INK)
            volume = (
                "định tính"
                if "qualitative" in liquid.tags
                else f"{liquid.volume_ml:.1f} mL"
            )
            if obj.item.kind == "solid":
                volume = f"{liquid.solid_copper_g:.2f} g · Cu"
            elif obj.item.kind in ("lamp", "balance"):
                volume = "Mô hình 3D"
            text(d, (obj.x - 32, obj.y + 113), volume, 11, MUTED)
        if scene.stream and now < scene.stream[0]:
            a, b = by_id.get(scene.stream[1]), by_id.get(scene.stream[2])
            if a and b:
                sx, sy = mouth_position(a)
                end = (b.x, b.y - 22)
                d.line((sx, sy, *end), fill="#9de8f6", width=4)
                for i in range(5):
                    ratio = (now * 2 + i / 5) % 1
                    x, y = sx + (end[0] - sx) * ratio, sy + (end[1] - sy) * ratio
                    d.ellipse((x - 3, y - 3, x + 3, y + 5), fill="#b0edff")
        if scene.pour_target_id in by_id:
            target = by_id[scene.pour_target_id]
            d.ellipse(
                (target.x - 32, target.y - 80, target.x + 32, target.y - 61),
                outline=TEAL,
                width=3,
            )
        im = self.effects(im, scene, now, by_id)
        d = ImageDraw.Draw(im)
        if hand_info:
            hand, preference = hand_info
            label = {"right": "PHẢI", "left": "TRÁI", "auto": "TỰ ĐỘNG"}[preference]
            reach = {
                "easy": "DỄ VỚI",
                "standard": "CHUẨN",
                "full": "TOÀN ẢNH",
                "custom": "TÙY CHỈNH",
            }[hand.reach]
            status = f"Tay {label} · {reach} · {hand.status}"
            d.rounded_rectangle((x0 + 10, y0 + 38, x1 - 10, y0 + 68), 7, fill="#0c2634")
            text(
                d,
                (x0 + 20, y0 + 45),
                fit_text(d, status, w - 40, 11),
                11,
                TEAL if hand.valid else "#ffd39a",
                True,
            )
        if pointer:
            x, y = pointer
            col = TEAL if pinched else "#f8d58c"
            d.ellipse((x - 11, y - 11, x + 11, y + 11), outline=col, width=2)
            d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=col)
        if not scene.objects:
            cx, cy = x0 + w / 2, y0 + h / 2
            text(d, (cx - 160, cy - 28), "Bắt đầu bằng một chiếc bình", 22, INK, True)
            text(
                d,
                (cx - 174, cy + 12),
                "Chụm tay để kéo từ kho sang bàn thí nghiệm",
                14,
                MUTED,
            )
        hud = c.drop_zone[3] + 12
        d.rounded_rectangle(
            (x0 + 10, hud, x1 - 10, y1 - 8), 12, fill="#0a1c28", outline="#294859"
        )
        obj = scene.selected
        if obj:
            mix = obj.mixture
            state = (
                "CHỈ MINH HỌA ĐỊNH TÍNH"
                if "qualitative" in mix.tags
                else ("CHƯA XÁC ĐỊNH" if mix.unknown else "MÔ HÌNH CÓ GIỚI HẠN")
            )
            text(
                d,
                (x0 + 25, hud + 9),
                f"#{obj.id}  {obj.item.name}  |  {state}",
                12,
                "#f2bf79" if mix.unknown else TEAL,
                True,
            )
            temp = (
                "T: chưa có mô hình"
                if mix.temperature_K is None
                else f"T ≈ {mix.temperature_K - 273.15:.2f} °C"
            )
            volume = (
                "Thể tích: minh họa"
                if "qualitative" in mix.tags
                else f"V: {mix.volume_ml:.1f}/{obj.item.capacity_ml:g} mL"
            )
            text(
                d,
                (x0 + 25, hud + 31),
                f"{volume}   ·   {temp}   ·   Góc: {abs(obj.roll):.0f}°   ·   Nắp {'đóng' if obj.sealed else 'mở'}",
                12,
                INK,
            )
            species = []
            for key, value in mix.mol.items():
                if value > 1e-9 and key != "H2O":
                    species.append(
                        f"{self.db_formula(scene,key)} {value * 1000:.2f} mmol"
                    )
            for key, value in mix.escaped_mol.items():
                if value > 1e-9:
                    species.append(
                        f"{self.db_formula(scene,key)} đã thoát: {value * 1000:.2f} mmol"
                    )
            text(
                d,
                (x0 + 25, hud + 51),
                fit_text(d, " | ".join(species) or mix.note, w - 60, 11),
                11,
                MUTED,
            )
        else:
            text(
                d,
                (x0 + 25, hud + 20),
                "Chọn một bình để xem thể tích, lượng chất và trạng thái mô hình.",
                13,
                MUTED,
            )
        wrapped(d, (x0, c.height - 124), scene.message, w, 13, INK, spacing=3)
        text(
            d,
            (x0, c.height - 65),
            fit_text(
                d,
                "Giữ + nghiêng ≥45°: rót | A/D: nghiêng · W: dựng · P: rót · J/L: xoay · K: nắp",
                w,
                11,
            ),
            11,
            MUTED,
        )
        text(
            d,
            (x0, c.height - 43),
            fit_text(
                d,
                "T/C/H: kho · [ ]: trang · S: chế độ · E/O: lưu/mở · R: dọn bàn · Q: thoát",
                w,
                11,
            ),
            11,
            MUTED,
        )
        text(
            d,
            (x0, c.height - 22),
            fit_text(
                d,
                (
                    "B: đổi tay · 1/2/3: vùng tay · F: hiệu chỉnh · Space: đặt bình"
                    if hand_info
                    else "3D minh họa; không thay thế kết quả đo hoặc đánh giá an toàn thật."
                ),
                w,
                10,
            ),
            10,
            "#648493",
        )
        if scene.alert and now < scene.alert[0]:
            rect = (x0 + 10, y0 + 75, x1 - 10, y0 + 187)
            d.rounded_rectangle(rect, 12, fill="#601e2b", outline="#e38579", width=2)
            text(
                d,
                (x0 + 25, y0 + 84),
                "TÌNH HUỐNG NGUY HIỂM · HIỆU ỨNG MINH HỌA",
                12,
                "#ffccae",
                True,
            )
            wrapped(d, (x0 + 25, y0 + 109), scene.alert[1], w - 60, 12, INK, spacing=3)
        return cv2.cvtColor(np.asarray(im.convert("RGB")), cv2.COLOR_RGB2BGR)

    @staticmethod
    def db_formula(scene, key):
        return scene.db["species"][key]["formula"]

    @staticmethod
    def effects(im, scene, now, by_id):
        # Transparent particles are visual teaching cues, not a fluid/fire solver.
        overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        for start, oid, effect in scene.effects:
            obj = by_id.get(oid)
            if not obj:
                continue
            age = now - start
            if not 0 <= age < 4:
                continue
            fade = min(1.0, (4 - age) / 1.2)
            if effect in ("fire", "heat", "splash"):
                d.ellipse(
                    (obj.x - 65, obj.y - 60, obj.x + 65, obj.y + 62),
                    fill=(255, 105, 35, int(38 * fade)),
                )
            for i in range(28):
                phase = (age * 0.7 + i * 0.073) % 1
                side = math.sin(i * 17.3)
                if effect == "bubbles":
                    x, y = obj.x + side * 29, obj.y + 32 - phase * 86
                    r = 2 + i % 3
                    d.ellipse(
                        (x - r, y - r, x + r, y + r),
                        outline=(188, 239, 255, int(220 * fade)),
                        width=2,
                    )
                elif effect == "fire":
                    x = obj.x + side * (1 - phase) * 43
                    y = obj.y - 25 - phase * 125
                    r = 4 + (1 - phase) * 10
                    alpha = int(205 * (1 - phase) * fade)
                    d.polygon(
                        [
                            (x - r, y + r),
                            (x - r * 0.6, y - r * 0.6),
                            (x + math.sin(age * 6 + i) * 7, y - r * 3),
                            (x + r * 0.7, y - r * 0.3),
                            (x + r, y + r),
                        ],
                        fill=(255, 110 + i % 3 * 45, 45, alpha),
                    )
                    d.ellipse(
                        (x - r * 0.4, y - r, x + r * 0.4, y + r),
                        fill=(255, 236, 154, alpha),
                    )
                    sx, sy = (
                        obj.x + side * 33 + math.sin(age + i) * 14,
                        obj.y - 80 - phase * 170,
                    )
                    sr = 7 + phase * 15
                    d.ellipse(
                        (sx - sr, sy - sr, sx + sr, sy + sr),
                        fill=(118, 132, 140, int(60 * (1 - phase) * fade)),
                    )
                elif effect == "splash":
                    x = obj.x + side * phase * 130
                    y = obj.y - 55 - 130 * phase + 180 * phase * phase
                    d.line(
                        (x - side * 6, y - 7, x, y),
                        fill=(215, 237, 249, int(150 * fade)),
                        width=2,
                    )
                    d.ellipse(
                        (x - 3, y - 4, x + 3, y + 4),
                        fill=(233, 246, 255, int(230 * fade)),
                    )
                elif effect in ("heat", "fumes"):
                    x = obj.x + side * 25 + math.sin(phase * 5 + i) * 8
                    y = obj.y - 40 - phase * 115
                    if effect == "heat":
                        d.line(
                            [
                                (x + math.sin(j * 0.9 + age * 4) * 4, y - j * 4)
                                for j in range(6)
                            ],
                            fill=(255, 170, 84, int(170 * (1 - phase) * fade)),
                            width=2,
                        )
                    else:
                        r = 5 + phase * 14
                        d.ellipse(
                            (x - r, y - r, x + r, y + r),
                            fill=(216, 233, 240, int(90 * (1 - phase) * fade)),
                        )
                elif effect == "pressure":
                    r = 20 + phase * 105
                    d.ellipse(
                        (obj.x - r, obj.y - r, obj.x + r, obj.y + r),
                        outline=(251, 167, 110, int(150 * (1 - phase) * fade)),
                        width=2,
                    )
                    theta = i * 2.399
                    x, y = (
                        obj.x + math.cos(theta) * phase * 125,
                        obj.y + math.sin(theta) * phase * 95,
                    )
                    d.polygon(
                        [(x - 4, y - 2), (x + 6, y - 4), (x + 1, y + 6)],
                        fill=(160, 216, 236, int(140 * (1 - phase) * fade)),
                    )
        x0, y0, x1, y1 = scene.cfg.workspace
        im.alpha_composite(overlay.crop((x0, y0, x1, y1)), (x0, y0))
        return im

    def close(self):
        self.meshes.close()
