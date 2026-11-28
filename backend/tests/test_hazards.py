import json
from pathlib import Path
import unittest
from copy import deepcopy

from chemlab.chemistry import load_database
from lab3d.catalog import STOCK
from lab3d.mixture import Mixture, risk_kind, transfer

ROOT = Path(__file__).resolve().parents[1]
DB = load_database(ROOT / "data/chemistry.json")


def stock(key):
    return Mixture.stock(STOCK[key])


class HazardTests(unittest.TestCase):
    def test_water_acid_order_changes_effect_but_neither_is_fire(self):
        self.assertEqual(risk_kind(stock("water"), stock("acid_risk"))[0], "splash")
        self.assertEqual(risk_kind(stock("acid_risk"), stock("water"))[0], "heat")

    def test_same_acid_or_empty_receiver_does_not_invent_incident(self):
        for key in ("acid_risk", "nitric_risk", "hcl_risk"):
            self.assertIsNone(risk_kind(stock(key), stock(key))[0])
            self.assertIsNone(risk_kind(stock(key), Mixture())[0])

    def test_nitric_oxidizer_scenario_is_distinct_from_water(self):
        self.assertEqual(risk_kind(stock("nitric_risk"), stock("fuel_risk"))[0], "fire")
        self.assertEqual(risk_kind(stock("water"), stock("nitric_risk"))[0], "heat")

    def test_hydrochloric_not_automatically_fire(self):
        self.assertEqual(risk_kind(stock("hcl_risk"), stock("water"))[0], "fumes")
        self.assertIsNone(risk_kind(stock("hcl_risk"), stock("fuel_risk"))[0])

    def test_qualitative_cases_remain_nonquantitative_and_training_atomic(self):
        for source, target in (
            ("water", "acid_risk"),
            ("nitric_risk", "water"),
            ("nitric_risk", "fuel_risk"),
            ("hcl_risk", "water"),
        ):
            a, b = stock(source), stock(target)
            before = deepcopy((a, b))
            result, _ = transfer(a, b, DB, 10, 250, allow_risk=False)
            self.assertIsNone(result)
            self.assertEqual((a, b), before)
            result, _ = transfer(a, b, DB, 10, 250, allow_risk=True)
            self.assertTrue(result["target"].unknown)
            self.assertIsNone(result["target"].temperature_K)
            self.assertIsNone(result["reaction_id"])
            self.assertEqual(result["generated_mol"], {})
            self.assertEqual(
                result["source"].volume_ml + result["target"].volume_ml, 200
            )

    def test_rule_source_references_resolve(self):
        data = json.loads((ROOT / "data/hazards.json").read_text(encoding="utf-8"))
        for rule in data["rules"]:
            self.assertTrue(rule["source_refs"])
            for ref in rule["source_refs"]:
                self.assertIn(ref, data["sources"])


if __name__ == "__main__":
    unittest.main()
