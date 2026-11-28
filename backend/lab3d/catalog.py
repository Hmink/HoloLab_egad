"""Declarative stock. Colors are illustrative; labels are not SDS certificates."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Stock:
    id: str
    name: str
    formula: str
    kind: str
    group: str
    capacity_ml: float = 250.0
    color: tuple = (0.63, 0.85, 0.94)
    concentration_M: float = 0.0
    ions: tuple = ()
    tags: tuple = ()


CATALOG = (
    Stock("beaker", "Cốc thủy tinh", "250 mL", "beaker", "tool"),
    Stock("flask", "Bình tam giác", "250 mL", "flask", "tool"),
    Stock("tube", "Ống nghiệm", "20 mL", "tube", "tool", 20),
    Stock("dropper", "Ống nhỏ giọt", "1 mL", "dropper", "tool", 1),
    Stock("lamp", "Đèn cồn", "Hình học 3D · chưa gia nhiệt", "lamp", "tool", 0),
    Stock("balance", "Cân điện tử", "Hình học 3D · chưa cân", "balance", "tool", 0),
    Stock("water", "Nước", "H₂O", "bottle", "chemical", tags=("water",)),
    Stock(
        "hcl",
        "Axit clohiđric",
        "HCl · 0,1 M",
        "bottle",
        "chemical",
        concentration_M=0.1,
        ions=(("H_plus", 1), ("Cl_minus", 1)),
    ),
    Stock(
        "naoh",
        "Natri hiđroxit",
        "NaOH · 0,1 M",
        "bottle",
        "chemical",
        concentration_M=0.1,
        ions=(("Na_plus", 1), ("OH_minus", 1)),
    ),
    Stock(
        "cuso4",
        "Đồng(II) sunfat",
        "CuSO₄ · 0,1 M",
        "bottle",
        "chemical",
        color=(0.06, 0.48, 0.95),
        concentration_M=0.1,
        ions=(("Cu_2plus", 1), ("SO4_2minus", 1)),
    ),
    Stock(
        "nahco3",
        "Natri hiđrocacbonat",
        "NaHCO₃ · 0,1 M",
        "bottle",
        "chemical",
        concentration_M=0.1,
        ions=(("Na_plus", 1), ("HCO3_minus", 1)),
    ),
    Stock(
        "cacl2",
        "Canxi clorua",
        "CaCl₂ · 0,1 M",
        "bottle",
        "chemical",
        concentration_M=0.1,
        ions=(("Ca_2plus", 1), ("Cl_minus", 2)),
    ),
    Stock(
        "na2co3",
        "Natri cacbonat",
        "Na₂CO₃ · 0,1 M",
        "bottle",
        "chemical",
        concentration_M=0.1,
        ions=(("Na_plus", 2), ("CO3_2minus", 1)),
    ),
    Stock(
        "copper",
        "Mảnh đồng rắn",
        "Cu · mẫu 3D",
        "solid",
        "chemical",
        0,
        color=(0.78, 0.36, 0.16),
        tags=("unmodeled_solid",),
    ),
    Stock(
        "acid_risk",
        "Axit sunfuric đặc",
        "H₂SO₄ · định tính",
        "bottle",
        "risk",
        tags=("concentrated_acid", "sulfuric", "qualitative"),
    ),
    Stock(
        "nitric_risk",
        "Axit nitric đặc",
        "HNO₃ · định tính",
        "bottle",
        "risk",
        tags=("concentrated_acid", "nitric", "oxidizer", "qualitative"),
    ),
    Stock(
        "hcl_risk",
        "Axit clohiđric đặc",
        "HCl · định tính",
        "bottle",
        "risk",
        tags=("concentrated_acid", "hydrochloric", "qualitative"),
    ),
    Stock(
        "oxidizer_risk",
        "Chất oxi hóa ảo",
        "OX · không phải công thức",
        "bottle",
        "risk",
        color=(0.64, 0.26, 0.84),
        tags=("oxidizer", "qualitative"),
    ),
    Stock(
        "fuel_risk",
        "Chất dễ cháy ảo",
        "FUEL · không định danh",
        "bottle",
        "risk",
        color=(0.95, 0.64, 0.23),
        tags=("fuel", "qualitative"),
    ),
)
STOCK = {entry.id: entry for entry in CATALOG}
FAMILIES = {
    frozenset(("hcl", "naoh")): "strong_acid_base",
    frozenset(("cuso4", "naoh")): "copper_hydroxide",
    frozenset(("hcl", "nahco3")): "bicarbonate_acid",
    frozenset(("cacl2", "na2co3")): "calcium_carbonate",
}


def cards(cfg, group, page):
    entries = [entry for entry in CATALOG if entry.group == group]
    top, gap = 182, 10
    height = min(91, (cfg.height - 330) / 5 - gap)
    for i, entry in enumerate(entries[page * 5 : page * 5 + 5]):
        y = top + i * (height + gap)
        yield entry, (20, int(y), cfg.menu_width - 20, int(y + height))


def pages(group):
    return (sum(entry.group == group for entry in CATALOG) + 4) // 5


def buttons(cfg):
    gap = 6
    width = (cfg.menu_width - 40 - gap * 2) / 3
    result = {
        group: (
            int(20 + i * (width + gap)),
            133,
            int(20 + i * (width + gap) + width),
            167,
        )
        for i, group in enumerate(("tool", "chemical", "risk"))
    }
    bottom = min(707, cfg.height - 136)
    result.update(
        {
            "prev": (20, bottom, 76, bottom + 32),
            "next": (cfg.menu_width - 76, bottom, cfg.menu_width - 20, bottom + 32),
            "mode": (20, bottom + 45, cfg.menu_width - 20, bottom + 82),
        }
    )
    return result
