"""Hand/mouse interaction, pouring transactions and editable experiment files."""

from collections import deque
from dataclasses import asdict, dataclass, field
from pathlib import Path
from math import atan2, degrees, isfinite
import json
import time

from chemlab.scene import Drag, inside
from .catalog import STOCK, buttons, cards, pages
from .geometry import INTERIORS, mouth_position
from .mixture import Mixture, transfer


@dataclass
class Object3D:
    id: int
    item: object
    x: float
    y: float
    mixture: Mixture = field(default_factory=Mixture)
    roll: float = 0.0
    yaw: float = 0.0
    scale: float = 78.0
    sealed: bool = False

    def contains(self, pointer):
        narrow = self.item.kind in ("tube", "dropper")
        return (
            abs(pointer[0] - self.x) < (39 if narrow else 65)
            and abs(pointer[1] - self.y) < 90
        )


class LabScene:
    def __init__(self, cfg, db):
        self.cfg, self.db = cfg, db
        self.objects = []
        self.drag = None
        self.selected_id = None
        self.next_id = 1
        self.group, self.page = "tool", 0
        self.allow_risk = True
        self.message = (
            "Gắp bình từ kho. Giữ nguồn trên miệng bình nhận, nghiêng tay để rót."
        )
        self.events = deque(maxlen=3000)
        self.effects = []
        self.stream = None
        self.pour_target_id = None
        self.dwell = 0.0
        self.last_pour = -1e9
        self.wrist_baseline = None
        self.roll_baseline = 0
        self.alert = None

    @property
    def selected(self):
        return next((o for o in self.objects if o.id == self.selected_id), None)

    def spawn(self, stock_id, x, y):
        if len(self.objects) >= 16:
            raise ValueError("Bàn đã có 16 vật thể. Nhấn R hoặc Delete để dọn.")
        item = STOCK[stock_id]
        obj = Object3D(self.next_id, item, x, y, Mixture.stock(item))
        self.next_id += 1
        self.objects.append(obj)
        self.selected_id = obj.id
        return obj

    def cancel(self, reason="Đã đặt dụng cụ lên bàn; mở tay rồi gắp lại."):
        """Park instead of discarding. Only an explicit delete may remove a vessel."""
        if self.drag:
            obj = self.drag.obj
            x0, y0, x1, y1 = self.cfg.drop_zone
            obj.x = max(x0 + 65, min(x1 - 65, obj.x))
            obj.y = max(y0 + 100, min(y1 - 124, obj.y))
            obj.roll = 0
        self.drag = None
        self.stream = None
        self.wrist_baseline = None
        self.dwell = 0
        self.pour_target_id = None
        self.message = reason

    def handle(self, event, pointer):
        if event in ("cancel", "park"):
            self.cancel()
            return
        if pointer is None:
            return
        if event == "grab" and not self.drag:
            for action, rect in buttons(self.cfg).items():
                if inside(pointer, rect):
                    if action in ("tool", "chemical", "risk"):
                        self.group, self.page = action, 0
                    elif action in ("prev", "next"):
                        self.page = (
                            self.page + (1 if action == "next" else -1)
                        ) % pages(self.group)
                    else:
                        self.allow_risk = not self.allow_risk
                    return
            if pointer[0] < self.cfg.menu_width:
                for entry, rect in cards(self.cfg, self.group, self.page):
                    if inside(pointer, rect):
                        try:
                            obj = self.spawn(entry.id, *pointer)
                        except ValueError as error:
                            self.message = str(error)
                            return
                        self.drag = Drag(obj, True, pointer, (0, 0))
                        break
            else:
                for obj in reversed(self.objects):
                    if obj.contains(pointer):
                        self.objects.remove(obj)
                        self.objects.append(obj)
                        self.selected_id = obj.id
                        self.drag = Drag(
                            obj,
                            False,
                            (obj.x, obj.y),
                            (obj.x - pointer[0], obj.y - pointer[1]),
                        )
                        break
            if self.drag:
                self.wrist_baseline = None
                self.message = f"Đang cầm {self.drag.obj.item.name}. Nghiêng để rót; mở tay để đặt."
        if self.drag:
            obj = self.drag.obj
            obj.x = max(70, min(self.cfg.width - 80, pointer[0] + self.drag.offset[0]))
            obj.y = max(
                145, min(self.cfg.drop_zone[3] - 124, pointer[1] + self.drag.offset[1])
            )
        if event == "release" and self.drag:
            if inside(pointer, self.cfg.workspace):
                obj = self.drag.obj
                x0, y0, x1, y1 = self.cfg.drop_zone
                obj.x = max(x0 + 65, min(x1 - 65, obj.x))
                obj.y = max(y0 + 100, min(y1 - 124, obj.y))
                obj.roll = 0
                self.drag = None
                self.wrist_baseline = None
                self.dwell = 0
            else:
                self.cancel("Thả ngoài bàn: dụng cụ đã được đặt vào vùng bàn gần nhất.")

    def target_for(self, source):
        if source.item.kind == "solid":
            mouth = source.x, source.y
        else:
            mouth = mouth_position(source)
        candidates = []
        for obj in self.objects:
            if obj is source or obj.item.kind not in INTERIORS:
                continue
            # Target mouth, unlike the moving outlet, is the center of its rim.
            y = obj.y - obj.scale * (1.0 if obj.item.kind != "beaker" else 0.80) * 0.945
            tolerance = 52 if obj.item.kind == "beaker" else 29
            dy = y - mouth[1]
            if abs(obj.x - mouth[0]) < tolerance and -12 < dy < 200:
                candidates.append((max(0, dy), obj))
        return min(candidates, key=lambda p: p[0])[1] if candidates else None

    def pour(self, source, target, now):
        if source.sealed:
            self.message = "Nguồn đang đóng nắp. Chọn nguồn rồi nhấn K để mở."
            return False
        requested = 0.2 if source.item.kind == "dropper" else 10.0
        result, message = transfer(
            source.mixture,
            target.mixture,
            self.db,
            requested,
            target.item.capacity_ml,
            sealed=target.sealed,
            allow_risk=self.allow_risk,
        )
        self.message = message
        if result is None:
            self.alert = (now + 4, message) if "chặn" in message else self.alert
            return False
        source.mixture, target.mixture = result["source"], result["target"]
        if self.drag and self.drag.obj is source:
            # A poured inventory object is committed even if tracking later fails.
            self.drag.is_new = False
            self.drag.origin = (max(self.cfg.workspace[0] + 80, source.x), source.y)
        self.stream = (now + 0.4, source.id, target.id)
        if result["effect"]:
            # Bound particle work even while repeatedly pouring into one target.
            if not any(
                oid == target.id and kind == result["effect"] and now - start < 1
                for start, oid, kind in self.effects
            ):
                self.effects = [
                    e for e in self.effects if e[1:] != (target.id, result["effect"])
                ]
                self.effects.append((now, target.id, result["effect"]))
        if result["effect"] in ("fire", "splash", "pressure", "heat", "fumes"):
            self.alert = (now + 7, message)
        self.events.append(
            {
                "t": now,
                "source": source.id,
                "target": target.id,
                "amount_ml": (
                    None
                    if "qualitative" in target.mixture.tags
                    else result["amount_ml"]
                ),
                "effect": result["effect"],
                "reaction": result["reaction_id"],
                "generated_mol": result["generated_mol"],
                "message": message,
                "model_status": (
                    "unmodeled" if target.mixture.unknown else "bounded_model"
                ),
            }
        )
        return True

    def tick(self, dt, now, points=None, frame_shape=None, tracked=True):
        self.effects = [e for e in self.effects if now - e[0] < 4]
        if not self.drag or not tracked:
            self.dwell = 0
            self.pour_target_id = None
            if not tracked:
                self.stream = None
            self.wrist_baseline = None
            return
        source = self.drag.obj
        if points is not None and frame_shape:
            height, width = frame_shape[:2]
            dx = (points[9][0] - points[0][0]) * width
            dy = (points[9][1] - points[0][1]) * height
            angle = -degrees(atan2(dx, -dy))
            if self.wrist_baseline is None:
                self.wrist_baseline = angle
                self.roll_baseline = source.roll
            delta = (angle - self.wrist_baseline + 180) % 360 - 180
            source.roll += (
                max(-85, min(85, self.roll_baseline + delta)) - source.roll
            ) * min(1, dt * 12)
        target = self.target_for(source)
        ready = target is not None and (
            abs(source.roll) >= 45 or source.item.kind == "solid"
        )
        target_id = target.id if ready else None
        self.dwell = (
            self.dwell + min(dt, 0.08)
            if target_id and target_id == self.pour_target_id
            else 0
        )
        self.pour_target_id = target_id
        if ready and self.dwell >= 0.30 and now - self.last_pour >= 0.55:
            self.pour(source, target, now)
            self.last_pour = now

    def key(self, key, now):
        obj = self.selected
        if key in (ord("t"), ord("c"), ord("h")):
            self.cancel("Đã đổi kho.")
            self.group = {ord("t"): "tool", ord("c"): "chemical", ord("h"): "risk"}[key]
            self.page = 0
        elif key in (ord("["), ord("]")):
            self.page = (self.page + (1 if key == ord("]") else -1)) % pages(self.group)
        elif key == ord("s"):
            self.allow_risk = not self.allow_risk
        elif key == ord("r"):
            self.objects.clear()
            self.drag = None
            self.selected_id = None
            self.effects.clear()
            self.alert = self.stream = None
            self.message = "Bàn trống. Có thể tự bố trí thí nghiệm mới."
        elif obj:
            if key in (ord("a"), ord("d")):
                obj.roll = max(
                    -85, min(85, obj.roll + (10 if key == ord("a") else -10))
                )
            elif key in (ord("j"), ord("l")):
                obj.yaw = (obj.yaw + (15 if key == ord("l") else -15)) % 360
            elif key == ord("w"):
                obj.roll = 0
            elif key == ord("k"):
                obj.sealed = not obj.sealed
                self.message = "Đã " + ("đóng" if obj.sealed else "mở") + " nắp ảo."
            elif key in (8, 127):
                self.objects.remove(obj)
                self.drag, self.selected_id = None, None
                self.message = "Đã bỏ vật thể khỏi bàn; sự kiện bỏ mẫu được lưu."
                self.events.append(
                    {
                        "t": now,
                        "action": "discard",
                        "id": obj.id,
                        "mixture": asdict(obj.mixture),
                    }
                )
            elif key == ord("p"):
                target = self.target_for(obj)
                if target:
                    self.pour(obj, target, now)
                else:
                    self.message = (
                        "Đưa miệng nguồn lên phía trên miệng bình nhận rồi nhấn P."
                    )

    def save(self, path):
        payload = {
            "schema": "chemlab3d-session-1",
            "allow_risk": self.allow_risk,
            "objects": [
                {
                    "id": o.id,
                    "stock": o.item.id,
                    "x_norm": (o.x - self.cfg.workspace[0])
                    / (self.cfg.workspace[2] - self.cfg.workspace[0]),
                    "y_norm": (o.y - self.cfg.workspace[1])
                    / (self.cfg.drop_zone[3] - self.cfg.workspace[1]),
                    "roll": o.roll,
                    "yaw": o.yaw,
                    "sealed": o.sealed,
                    "mixture": asdict(o.mixture),
                }
                for o in self.objects
            ],
            "events": list(self.events),
        }
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(".tmp")
        temporary.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        temporary.replace(path)
        self.message = f"Đã lưu {path.name}; có thể sửa bố trí hoặc mở lại."

    def load(self, path):
        """Validate into a temporary scene, then commit. Never execute file content."""
        raw = Path(path).read_text(encoding="utf-8")
        if len(raw) > 2_000_000:
            raise ValueError("Tệp quá lớn")
        data = json.loads(raw)
        if not isinstance(data, dict) or data.get("schema") not in (
            "chemlab3d-session-1",
            "chemlab3d-experiment-1",
        ):
            raise ValueError("Schema thí nghiệm không hợp lệ")
        rows = data.get("objects", [])
        if not isinstance(rows, list) or len(rows) > 16:
            raise ValueError("Thí nghiệm cần danh sách tối đa 16 vật thể")
        fresh = LabScene(self.cfg, self.db)
        fresh.allow_risk = data.get("allow_risk", True) is True
        ids = set()
        for row in rows:
            if not isinstance(row, dict) or row.get("stock") not in STOCK:
                raise ValueError("Mỗi vật thể cần stock có trong danh mục")
            for key in ("x_norm", "y_norm"):
                value = row.get(key, 0.5)
                if (
                    not isinstance(value, (int, float))
                    or not isfinite(value)
                    or not 0 <= value <= 1
                ):
                    raise ValueError("Tọa độ phải hữu hạn trong [0,1]")
            item = STOCK[row["stock"]]
            x0, y0, x1, y1 = self.cfg.drop_zone
            x = max(x0 + 65, min(x1 - 65, x0 + row.get("x_norm", 0.5) * (x1 - x0)))
            y = max(y0 + 100, min(y1 - 124, y0 + row.get("y_norm", 0.5) * (y1 - y0)))
            obj = fresh.spawn(item.id, x, y)
            object_id = row.get("id", obj.id)
            if type(object_id) is not int or object_id <= 0 or object_id in ids:
                raise ValueError("ID vật thể trùng hoặc không hợp lệ")
            obj.id = object_id
            ids.add(object_id)
            if "mixture" in row:
                definition = row["mixture"]
                if not isinstance(definition, dict):
                    raise ValueError("mixture phải là một JSON object")
                for field_name in ("mol", "origins", "escaped_mol"):
                    if not isinstance(definition.get(field_name, {}), dict):
                        raise ValueError("Danh sách lượng chất phải là một JSON object")
                mix = Mixture(**row["mixture"])
                numeric = [
                    mix.volume_ml,
                    mix.solid_copper_g,
                    *mix.mol.values(),
                    *mix.origins.values(),
                    *mix.escaped_mol.values(),
                ]
                if any(
                    not isinstance(v, (int, float)) or not isfinite(v) or v < 0
                    for v in numeric
                ):
                    raise ValueError("Lượng chất phải hữu hạn và không âm")
                if mix.volume_ml > item.capacity_ml:
                    raise ValueError("Lượng chất lớn hơn dung tích")
                if (
                    set(mix.mol) - set(self.db["species"])
                    or set(mix.origins) - set(STOCK)
                    or set(mix.escaped_mol) - set(self.db["species"])
                ):
                    raise ValueError("Tệp chứa chất chưa định nghĩa")
                if mix.temperature_K is not None and (
                    not isinstance(mix.temperature_K, (int, float))
                    or not isfinite(mix.temperature_K)
                    or not 1 < mix.temperature_K < 10000
                ):
                    raise ValueError("Nhiệt độ không hợp lệ")
                if not isinstance(mix.note, str) or type(mix.unknown) is not bool:
                    raise ValueError("Trạng thái mô hình không hợp lệ")
                obj.mixture = mix
            for key, limit in (("roll", 85), ("yaw", 360)):
                value = row.get(key, 0)
                if (
                    not isinstance(value, (int, float))
                    or not isfinite(value)
                    or abs(value) > limit
                ):
                    raise ValueError("Góc xoay không hợp lệ")
                setattr(obj, key, value)
            obj.sealed = row.get("sealed", False) is True
        fresh.next_id = max(ids, default=0) + 1
        events = data.get("events", [])
        if not isinstance(events, list):
            raise ValueError("Nhật ký không hợp lệ")
        fresh.events.extend(events[-3000:])
        self.objects, self.next_id = fresh.objects, fresh.next_id
        self.events, self.allow_risk = fresh.events, fresh.allow_risk
        self.selected_id = self.objects[-1].id if self.objects else None
        self.drag, self.stream, self.alert = None, None, None
        self.effects.clear()
        self.message = f"Đã mở {Path(path).name}. Tự chọn thứ tự và lượng rót."
