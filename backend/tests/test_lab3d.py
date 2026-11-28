"""Behavior tests: conservation, uncertain chemistry, risk modes and gestures."""

from copy import deepcopy
import json
from pathlib import Path
import tempfile
import unittest

from chemlab.chemistry import load_database
from chemlab.config import Config
from chemlab.scene import Drag
from lab3d.catalog import STOCK, cards
from lab3d.geometry import mouth_position, volume_to_height
from lab3d.mixture import Mixture, transfer
from lab3d.scene import LabScene

ROOT = Path(__file__).resolve().parents[1]
DB = load_database(ROOT / "data/chemistry.json")


def stock(name):
    return Mixture.stock(STOCK[name])


def pour(source, target, amount=10, capacity=250, **kwargs):
    result, message = transfer(source, target, DB, amount, capacity, **kwargs)
    return result, message


def elements(*mixtures):
    total = {}
    for mix in mixtures:
        for mapping in (mix.mol, mix.escaped_mol):
            for key, mol in mapping.items():
                for element, count in DB["species"][key]["atoms"].items():
                    total[element] = total.get(element, 0) + count * mol
    return total


class MixtureTests(unittest.TestCase):
    def test_transfer_is_atomic_and_preserves_material(self):
        src, dst = stock("hcl"), Mixture()
        before = deepcopy(src)
        result, _ = pour(src, dst)
        self.assertEqual(src, before)
        self.assertEqual(dst.volume_ml, 0)
        self.assertEqual(result["source"].volume_ml, 90)
        self.assertEqual(result["target"].volume_ml, 10)
        self.assertAlmostEqual(
            result["source"].mol["H_plus"] + result["target"].mol["H_plus"], 0.01
        )

    def test_capacity_clamps_without_discarding_material(self):
        result, _ = pour(stock("water"), Mixture(volume_ml=19), capacity=20)
        self.assertEqual(result["amount_ml"], 1)
        self.assertEqual(result["source"].volume_ml, 99)
        self.assertEqual(result["target"].volume_ml, 20)

    def test_full_vessel_and_empty_source_do_not_mutate(self):
        for a, b in ((stock("water"), Mixture(volume_ml=250)), (Mixture(), Mixture())):
            saved = deepcopy((a, b))
            self.assertIsNone(pour(a, b)[0])
            self.assertEqual((a, b), saved)

    def test_neutralization_quantities_and_temperature(self):
        acid = pour(stock("hcl"), Mixture())[0]["target"]
        result, _ = pour(stock("naoh"), acid)
        target = result["target"]
        self.assertAlmostEqual(target.mol["H2O"], 0.001)
        self.assertAlmostEqual(target.mol["Na_plus"], 0.001)
        self.assertAlmostEqual(target.mol["Cl_minus"], 0.001)
        self.assertAlmostEqual(target.temperature_K, 298.15 + 57.3 / (20 * 4.18))

    def test_repeated_pour_respects_limiting_reagent(self):
        mixture = pour(stock("hcl"), Mixture())[0]["target"]
        base = stock("naoh")
        for _ in range(3):
            result, _ = pour(base, mixture)
            base, mixture = result["source"], result["target"]
        self.assertAlmostEqual(mixture.mol["H2O"], 0.001)
        self.assertAlmostEqual(mixture.mol["OH_minus"], 0.002)
        self.assertEqual(mixture.mol["H_plus"], 0)

    def test_precipitate_conserves_copper_and_charge(self):
        src = stock("cuso4")
        base = stock("naoh")
        first = pour(src, Mixture())[0]
        result, _ = pour(base, first["target"])
        mix = result["target"]
        self.assertAlmostEqual(mix.mol["CuOH2"], 0.0005)
        self.assertAlmostEqual(mix.mol["Cu_2plus"], 0.0005)
        self.assertIsNone(mix.temperature_K)
        self.assertAlmostEqual(
            sum(DB["species"][k]["charge"] * n for k, n in mix.mol.items()), 0
        )

    def test_precipitate_moves_as_well_mixed_suspension(self):
        mix = pour(stock("cuso4"), Mixture())[0]["target"]
        mix = pour(stock("naoh"), mix)[0]["target"]
        result, _ = pour(mix, Mixture(), amount=5)
        self.assertAlmostEqual(result["target"].mol["CuOH2"], mix.mol["CuOH2"] / 4)

    def test_open_gas_escapes_and_element_ledger_is_conserved(self):
        acid = pour(stock("hcl"), Mixture())[0]["target"]
        source = stock("nahco3")
        before = elements(acid, source)
        result, _ = pour(source, acid)
        after = elements(result["source"], result["target"])
        for element in before:
            self.assertAlmostEqual(before[element], after[element], places=12)
        self.assertNotIn("CO2", result["target"].mol)
        self.assertAlmostEqual(result["target"].escaped_mol["CO2"], 0.001)
        self.assertEqual(result["effect"], "bubbles")

    def test_unsupported_mix_stays_unknown_after_dilution(self):
        mix = pour(stock("cuso4"), Mixture())[0]["target"]
        mix = pour(stock("hcl"), mix)[0]["target"]
        self.assertTrue(mix.unknown)
        self.assertIsNone(mix.temperature_K)
        diluted = pour(stock("water"), mix)[0]["target"]
        self.assertTrue(diluted.unknown)

    def test_risk_training_block_is_atomic_but_sandbox_has_visual_effect(self):
        acid = stock("acid_risk")
        water = stock("water")
        before = deepcopy((water, acid))
        self.assertIsNone(pour(water, acid, allow_risk=False)[0])
        self.assertEqual((water, acid), before)
        result, _ = pour(water, acid, allow_risk=True)
        self.assertEqual(result["effect"], "splash")
        self.assertTrue(result["target"].unknown)
        self.assertIsNone(result["temperature_K"])

    def test_abstract_combustion_has_no_invented_chemical_products(self):
        result, _ = pour(stock("oxidizer_risk"), stock("fuel_risk"))
        self.assertEqual(result["effect"], "fire")
        self.assertEqual(result["generated_mol"], {})
        self.assertIsNone(result["gas_equivalent_ml"])

    def test_closed_gas_scenario_is_qualitative(self):
        acid = pour(stock("hcl"), Mixture())[0]["target"]
        self.assertIsNone(pour(stock("nahco3"), acid, sealed=True, allow_risk=False)[0])
        result, _ = pour(stock("nahco3"), acid, sealed=True)
        self.assertEqual(result["effect"], "pressure")
        self.assertIsNone(result["reaction_id"])

    def test_solid_transfer_is_conserved_and_unmodeled(self):
        result, _ = pour(stock("copper"), Mixture())
        self.assertEqual(result["source"].solid_copper_g, 0)
        self.assertEqual(result["target"].solid_copper_g, 0.5)
        self.assertTrue(result["target"].unknown)

    def test_nonfinite_or_nonpositive_transfer_rejected(self):
        for amount in (0, -1, float("nan"), float("inf")):
            with self.assertRaises(ValueError):
                pour(stock("water"), Mixture(), amount=amount)


class Scene3DTests(unittest.TestCase):
    def setUp(self):
        self.scene = LabScene(Config(width=1440, height=900, footer=130), DB)

    def prepared_pour(self):
        scene = self.scene
        target = scene.spawn("beaker", 900, 500)
        source = scene.spawn("hcl", 900, 260)
        source.roll = -65
        mx, my = mouth_position(source)
        source.x += target.x - mx
        source.y += 365 - my
        scene.drag = Drag(source, False, (source.x, source.y), (0, 0))
        return source, target

    def test_inventory_grab_moves_actual_vessel(self):
        _, rect = next(cards(self.scene.cfg, "tool", 0))
        pos = (rect[0] + 25, rect[1] + 25)
        self.scene.handle("grab", pos)
        self.scene.handle(None, (850, 400))
        self.scene.handle("release", (850, 400))
        self.assertEqual(len(self.scene.objects), 1)
        self.assertEqual(self.scene.objects[0].item.kind, "beaker")
        self.assertIsNone(self.scene.drag)

    def test_automatic_pour_needs_target_tilt_and_dwell(self):
        source, target = self.prepared_pour()
        self.assertIs(self.scene.target_for(source), target)
        for i in range(9):
            self.scene.tick(0.05, i * 0.05)
        self.assertEqual(target.mixture.volume_ml, 10)

    def test_missing_tracking_stops_pouring_immediately(self):
        source, target = self.prepared_pour()
        for i in range(15):
            self.scene.tick(0.05, i * 0.05, tracked=False)
        self.assertEqual(target.mixture.volume_ml, 0)

    def test_no_target_no_transfer(self):
        source, target = self.prepared_pour()
        source.x -= 250
        for i in range(25):
            self.scene.tick(0.05, i * 0.05)
        self.assertEqual(target.mixture.volume_ml, 0)

    def test_cancel_after_material_transfer_keeps_source_and_conserves(self):
        source, target = self.prepared_pour()
        self.scene.drag.is_new = True
        self.scene.pour(source, target, 0.1)
        self.scene.cancel()
        self.assertIn(source, self.scene.objects)
        self.assertEqual(source.mixture.volume_ml + target.mixture.volume_ml, 100)

    def test_closed_source_cannot_pour(self):
        source, target = self.prepared_pour()
        source.sealed = True
        self.assertFalse(self.scene.pour(source, target, 0))
        self.assertEqual(target.mixture.volume_ml, 0)

    def test_session_round_trip_and_duplicate_id_rejection_are_atomic(self):
        source, target = self.prepared_pour()
        self.scene.pour(source, target, 0)
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / "saved.json"
            self.scene.save(file)
            restored = LabScene(self.scene.cfg, DB)
            restored.load(file)
            self.assertEqual(restored.objects[0].mixture, target.mixture)
            self.assertEqual(restored.objects[1].mixture, source.mixture)
            bad = json.loads(file.read_text(encoding="utf-8"))
            bad["objects"][1]["id"] = bad["objects"][0]["id"]
            file.write_text(json.dumps(bad), encoding="utf-8")
            before = deepcopy(restored.objects)
            with self.assertRaises(ValueError):
                restored.load(file)
            self.assertEqual(restored.objects, before)

    def test_experiments_are_plain_data(self):
        for file in (ROOT / "experiments").glob("*.json"):
            if file.name != "my_session.json":
                self.scene.load(file)
                self.assertGreater(len(self.scene.objects), 0)

    def test_flask_level_is_not_linear_in_volume(self):
        half = volume_to_height("flask", 0.5)
        self.assertLess(half, 0)
        self.assertLess(volume_to_height("flask", 0.2), half)


if __name__ == "__main__":
    unittest.main()
