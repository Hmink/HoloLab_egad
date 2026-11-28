"""Transactional drag/drop. Inventory entries spawn independent instances."""

from dataclasses import dataclass

from .config import Config


@dataclass(frozen=True)
class Item:
    id: str
    name: str
    formula: str
    kind: str
    group: str
    label: str
    color: str


INVENTORY = (
    Item("beaker", "Cốc thủy tinh", "250 mL", "beaker", "tool", "DỤNG CỤ", "#5eead4"),
    Item("tube", "Ống nghiệm", "20 mL", "tube", "tool", "DỤNG CỤ", "#a5b4fc"),
    Item("dropper", "Ống nhỏ giọt", "1 mL", "dropper", "tool", "DỤNG CỤ", "#93c5fd"),
    Item("lamp", "Đèn cồn", "Mô hình", "lamp", "tool", "NGUỒN NHIỆT", "#fbbf24"),
    Item("balance", "Cân điện tử", "Mô hình", "balance", "tool", "DỤNG CỤ", "#cbd5e1"),
    Item(
        "hcl",
        "Axit clohiđric",
        "HCl · 0,1 M",
        "bottle",
        "chemical",
        "AXIT · SDS?",
        "#fda4af",
    ),
    Item(
        "naoh",
        "Natri hiđroxit",
        "NaOH · 0,1 M",
        "bottle",
        "chemical",
        "BAZƠ · SDS?",
        "#c4b5fd",
    ),
    Item(
        "cuso4",
        "Đồng(II) sunfat",
        "CuSO₄ · 0,1 M",
        "bottle",
        "chemical",
        "MUỐI · SDS?",
        "#38bdf8",
    ),
    Item(
        "indicator",
        "Chỉ thị màu",
        "Mẫu chỉ thị",
        "bottle",
        "chemical",
        "SDS CHƯA GẮN",
        "#f472b6",
    ),
    Item(
        "metal",
        "Mẫu kim loại",
        "Zn · mô hình",
        "metal",
        "chemical",
        "SDS CHƯA GẮN",
        "#94a3b8",
    ),
)


@dataclass
class LabObject:
    id: int
    item: Item
    x: float
    y: float
    half_width: int = 48
    half_height: int = 64

    def contains(self, p):
        return (
            abs(p[0] - self.x) <= self.half_width
            and abs(p[1] - self.y) <= self.half_height
        )


@dataclass
class Drag:
    obj: LabObject
    is_new: bool
    origin: tuple[float, float]
    offset: tuple[float, float]


def inside(point, rect):
    return rect[0] <= point[0] <= rect[2] and rect[1] <= point[1] <= rect[3]


def inventory_cards(cfg: Config):
    # The same rectangles drive hit-testing and drawing.
    top, gap, rows = 172, 10, 5
    usable = cfg.height - cfg.footer - top - 12
    row_height = (usable - gap * (rows - 1)) / rows
    columns = 2 if cfg.split >= 0.43 else 1
    margin = 22
    card_width = (cfg.menu_width - 2 * margin - gap * (columns - 1)) / columns
    for group in ("tool", "chemical"):
        for n, item in enumerate(i for i in INVENTORY if i.group == group):
            col, row = n % columns, n // columns
            x, y = margin + col * (card_width + gap), top + row * (row_height + gap)
            yield item, (int(x), int(y), int(x + card_width), int(y + row_height))


def tab_rectangles(cfg):
    return {
        "tool": (22, 124, cfg.menu_width // 2 - 4, 158),
        "chemical": (cfg.menu_width // 2 + 4, 124, cfg.menu_width - 22, 158),
    }


class Scene:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.objects: list[LabObject] = []
        self.drag: Drag | None = None
        self.group = "tool"
        self.next_id = 1
        self.message = "Mở tay → trỏ vào thẻ → chụm → kéo sang bàn → mở tay."

    def reset(self):
        self.objects.clear()
        self.drag = None
        self.message = "Đã dọn bàn thí nghiệm."

    def handle(self, event: str | None, pointer):
        if event == "cancel":
            self.cancel()
            return
        if pointer is None:
            return
        if event == "grab" and self.drag is None:
            for group, rect in tab_rectangles(self.cfg).items():
                if inside(pointer, rect):
                    self.group = group
                    return
            for obj in reversed(self.objects):
                if obj.contains(pointer):
                    self.objects.remove(obj)
                    self.objects.append(obj)  # Bring held object to front.
                    self.drag = Drag(
                        obj,
                        False,
                        (obj.x, obj.y),
                        (obj.x - pointer[0], obj.y - pointer[1]),
                    )
                    break
            if self.drag is None:
                for item, rect in inventory_cards(self.cfg):
                    if item.group == self.group and inside(pointer, rect):
                        if len(self.objects) >= 16:
                            self.message = "Bàn đã có 16 vật thể. Nhấn R để dọn bàn."
                            return
                        obj = LabObject(self.next_id, item, *pointer)
                        self.next_id += 1
                        self.objects.append(obj)
                        self.drag = Drag(obj, True, pointer, (0, 0))
                        break
            if self.drag:
                self.message = (
                    f"Đang cầm: {self.drag.obj.item.name}. Mở tay trên bàn để đặt."
                )
        if self.drag:
            obj, offset = self.drag.obj, self.drag.offset
            obj.x = max(
                obj.half_width,
                min(self.cfg.width - obj.half_width, pointer[0] + offset[0]),
            )
            obj.y = max(
                self.cfg.header + obj.half_height,
                min(
                    self.cfg.height - self.cfg.footer - obj.half_height,
                    pointer[1] + offset[1],
                ),
            )
        if event == "release" and self.drag:
            if inside(pointer, self.cfg.workspace):
                obj = self.drag.obj
                x0, y0, x1, y1 = self.cfg.drop_zone
                obj.x = max(x0 + obj.half_width, min(x1 - obj.half_width, obj.x))
                obj.y = max(y0 + obj.half_height, min(y1 - obj.half_height, obj.y))
                self.message = f"Đã đặt {obj.item.name}. Có thể gắp lại để di chuyển."
                self.drag = None
            else:
                self.cancel("Thả ngoài bàn: đã hủy di chuyển.")

    def cancel(self, reason="Mất dấu tay: đã hủy di chuyển; mở tay để bắt đầu lại."):
        if self.drag:
            if self.drag.is_new:
                self.objects.remove(self.drag.obj)
            else:
                self.drag.obj.x, self.drag.obj.y = self.drag.origin
            self.drag = None
            self.message = reason
