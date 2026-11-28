"""Virtual teaching rules. These do not certify the safety of real chemicals."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Decision:
    allowed: bool
    code: str
    message: str


def check_action(
    rules, source_tags, target_tags, reaction, ppe=(), sealed=False, action="pour"
) -> Decision:
    source, target = set(source_tags), set(target_tags)
    hazards = reaction.get("hazards", {}) if reaction else {}
    for rule in rules:
        when = rule["when"]
        match = False
        if "source_has_tag" in when:
            match = (
                action == when.get("action", action)
                and when["source_has_tag"] in source
                and when["target_has_tag"] in target
            )
        elif "unordered_pair_tags" in when:
            a, b = when["unordered_pair_tags"]
            match = (a in source and b in target) or (b in source and a in target)
        elif "either_has_tag" in when:
            match = when["either_has_tag"] in source | target
        elif when.get("reaction_has_toxic_gas"):
            match = bool(hazards.get("toxic_gas_species"))
        elif when.get("gas_product_and_sealed"):
            match = bool(
                sealed and reaction and reaction.get("phenomena", {}).get("gas")
            )
        else:
            return Decision(
                False, "INVALID_RULE", "Quy tắc chưa được hỗ trợ; dừng mô hình."
            )
        if match:
            return Decision(False, rule["id"], rule["message_vi"])
    if reaction is None or not hazards.get("student_simulation_enabled", False):
        return Decision(
            False,
            "UNKNOWN_OR_DISABLED",
            "Không có mô hình được bật cho tình huống này.",
        )
    missing = set(hazards.get("required_virtual_ppe", ())) - set(ppe)
    if missing:
        return Decision(
            False, "MISSING_PPE", "Bổ sung bảo hộ ảo: " + ", ".join(sorted(missing))
        )
    return Decision(
        True, "ALLOW_VIRTUAL_MODEL", "Cho phép mô hình ảo trong phạm vi đã khai báo."
    )
