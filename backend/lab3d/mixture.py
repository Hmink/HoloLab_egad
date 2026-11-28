"""Finite material transfers and explicitly bounded chemistry.

Unmodeled mixtures stay unmodeled through subsequent additions. Qualitative
risk effects never invent yields, temperatures, explosive energies or recipes.
"""

from copy import deepcopy
from dataclasses import dataclass, field
from math import isfinite
from functools import lru_cache
from pathlib import Path
import json

from chemlab.chemistry import solve_stoichiometry
from .catalog import FAMILIES, STOCK


@dataclass
class Mixture:
    volume_ml: float = 0.0
    mol: dict = field(default_factory=dict)
    origins: dict = field(default_factory=dict)
    temperature_K: float | None = 298.15
    unknown: bool = False
    solid_copper_g: float = 0.0
    escaped_mol: dict = field(default_factory=dict)
    note: str = "Bình rỗng."

    @classmethod
    def stock(cls, item):
        if item.kind == "solid":
            return cls(
                solid_copper_g=0.5,
                note="Mẫu đồng rắn; chưa có mô hình phản ứng của Cu.",
            )
        if item.group not in ("chemical", "risk"):
            return cls()
        volume = 100.0
        return cls(
            volume_ml=volume,
            mol={
                key: item.concentration_M * volume / 1000 * count
                for key, count in item.ions
            },
            origins={item.id: volume},
            temperature_K=None if item.group == "risk" else 298.15,
            note=(
                "Chỉ mô phỏng định tính." if item.group == "risk" else "Dung dịch gốc."
            ),
        )

    @property
    def tags(self):
        tags = {
            tag
            for key, quantity in self.origins.items()
            if quantity > 1e-9
            for tag in STOCK[key].tags
        }
        if any(
            v > 1e-9 and STOCK[k].group == "chemical" and STOCK[k].kind == "bottle"
            for k, v in self.origins.items()
        ):
            tags.add("aqueous")
        return tags

    @property
    def color(self):
        if self.unknown:
            return (0.43, 0.48, 0.54)  # Neutral placeholder, never a predicted color.
        if "oxidizer" in self.tags and "nitric" not in self.tags:
            return STOCK["oxidizer_risk"].color
        if "fuel" in self.tags:
            return STOCK["fuel_risk"].color
        copper_M = self.mol.get("Cu_2plus", 0) / max(self.volume_ml / 1000, 1e-9)
        blend = min(1.0, copper_M / 0.08)
        return tuple(
            a * (1 - blend) + b * blend
            for a, b in zip((0.62, 0.84, 0.94), STOCK["cuso4"].color)
        )


@lru_cache(maxsize=1)
def hazard_rules():
    return json.loads(
        (Path(__file__).resolve().parents[1] / "data/hazards.json").read_text(
            encoding="utf-8"
        )
    )["rules"]


def risk_kind(source, target, sealed=False):
    a, b = source.tags, target.tags
    for rule in hazard_rules():
        left, right = set(rule["source_tags"]), set(rule["target_tags"])
        match = left <= a and right <= b
        if rule.get("either_direction"):
            match = match or (left <= b and right <= a)
        if match:
            return rule["effect"], rule["message"]
    keys = {k for k, v in {**source.origins, **target.origins}.items() if v > 1e-9}
    if sealed and {"hcl", "nahco3"} <= keys:
        return "pressure", "Bình kín có thể tích tụ khí: minh họa nguy cơ tăng áp suất."
    return None, ""


def transfer(
    source, target, db, requested_ml, capacity_ml, *, sealed=False, allow_risk=True
):
    """Return a proposal; callers commit both vessels together or neither.

    Solid transfer is a single discrete sample; ordinary liquid aliquots carry
    the same fractions of solution, dissolved ions and suspended precipitate.
    """
    if not isfinite(requested_ml) or requested_ml <= 0:
        raise ValueError("Aliquot must be finite and positive")
    if not isfinite(capacity_ml) or capacity_ml <= 0:
        raise ValueError("Target must be a vessel with positive capacity")
    if source.volume_ml <= 1e-9 and source.solid_copper_g <= 1e-9:
        return None, "Nguồn đã hết chất."
    if target.volume_ml >= capacity_ml - 1e-9:
        return None, "Bình nhận đã đầy; không tự làm mất chất khi tràn."
    effect, risk_message = risk_kind(source, target, sealed)
    if effect and not allow_risk:
        return None, "Chế độ hướng dẫn đã chặn: " + risk_message
    if sealed and not effect:
        return None, "Bình đang đóng nắp. Nhấn K để mở trước khi rót."
    left, right = deepcopy(source), deepcopy(target)
    amount = min(requested_ml, source.volume_ml, capacity_ml - target.volume_ml)
    fraction = amount / source.volume_ml if source.volume_ml > 1e-9 else 1.0
    old_volume = right.volume_ml
    left.volume_ml = max(0.0, left.volume_ml - amount)
    right.volume_ml += amount
    for attr in ("mol", "origins"):
        a, b = getattr(left, attr), getattr(right, attr)
        for key in list(a):
            moved = a[key] * fraction
            a[key] = max(0.0, a[key] - moved)
            b[key] = b.get(key, 0.0) + moved
            if a[key] < 1e-12:
                del a[key]
    solid = left.solid_copper_g * fraction
    left.solid_copper_g -= solid
    right.solid_copper_g += solid
    if source.temperature_K is None or (old_volume and target.temperature_K is None):
        right.temperature_K = None
    elif right.volume_ml:
        right.temperature_K = (
            (target.temperature_K or source.temperature_K) * old_volume
            + source.temperature_K * amount
        ) / right.volume_ml
    # This transfer model is a well-mixed suspension, not sediment separation.
    result = {
        "source": left,
        "target": right,
        "amount_ml": amount,
        "effect": effect,
        "reaction_id": None,
        "generated_mol": {},
        "temperature_K": None,
        "gas_equivalent_ml": None,
    }
    right.unknown = right.unknown or source.unknown
    if effect:
        right.unknown = True
        right.temperature_K = None
        right.note = risk_message + " Không có kết quả định lượng."
        return result, right.note
    active = frozenset(k for k, v in right.origins.items() if v > 1e-9 and k != "water")
    if right.unknown or right.solid_copper_g > 1e-9 or "qualitative" in right.tags:
        right.unknown = True
        right.temperature_K = None
        right.note = (
            "CHƯA XÁC ĐỊNH: chưa có mô hình cho hỗn hợp này; màu xám chỉ là ký hiệu."
        )
        return result, right.note
    if len(active) <= 1:
        right.note = (
            "Đã chuyển chất; dung dịch đơn hoặc pha loãng trong phạm vi mô hình."
        )
        return result, right.note
    reaction_id = FAMILIES.get(active)
    if reaction_id is None:
        right.unknown, right.temperature_K = True, None
        right.note = (
            "CHƯA XÁC ĐỊNH: tổ hợp ngoài mô hình, không đồng nghĩa không phản ứng."
        )
        return result, right.note
    reaction = next(r for r in db["reactions"] if r["id"] == reaction_id)
    try:
        solution = solve_stoichiometry(
            db,
            reaction,
            right.mol,
            temperature_K=right.temperature_K or 298.15,
            solution_mass_g=right.volume_ml,
            solution_volume_L=right.volume_ml / 1000,
        )
    except ValueError:
        right.unknown, right.temperature_K = True, None
        right.note = "CHƯA XÁC ĐỊNH: hỗn hợp vượt phạm vi nhiệt độ/nồng độ của mô hình."
        return result, right.note
    right.mol = solution["final_mol"]
    for key in list(right.mol):
        if db["species"][key]["phase"] == "g":
            right.escaped_mol[key] = right.escaped_mol.get(key, 0.0) + right.mol.pop(
                key
            )
    right.temperature_K = solution["estimated_final_temperature_K"]
    if solution["extent_mol"] > 1e-12:
        right.note = reaction["equation_display"]
        result["reaction_id"] = reaction_id
        result["generated_mol"] = solution["generated_mol"]
        result["effect"] = "bubbles" if reaction["phenomena"]["gas"] else None
        result["gas_equivalent_ml"] = (
            sum(solution["ideal_gas_equivalent_L_at_input_T_P"].values()) * 1000
        )
        result["temperature_K"] = right.temperature_K
    else:
        right.note = (
            "Chất giới hạn đã hết; không có lượng sản phẩm tăng thêm trong mô hình."
        )
    return result, right.note
