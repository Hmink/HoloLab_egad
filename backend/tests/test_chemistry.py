import copy
from pathlib import Path
import unittest

from chemlab.chemistry import balance_species, load_database, solve_stoichiometry
from chemlab.safety import check_action

ROOT = Path(__file__).resolve().parents[1]


class ChemistryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = load_database(ROOT / "data/chemistry.json")
        cls.reactions = {r["id"]: r for r in cls.db["reactions"]}
        cls.r = cls.reactions["strong_acid_base"]

    def test_balances_atoms_and_charge(self):
        for r in self.db["reactions"]:
            self.assertEqual(
                balance_species(
                    list(r["reactants"]), list(r["products"]), self.db["species"]
                ),
                list(r["reactants"].values()) + list(r["products"].values()),
            )

    def test_charge_invalid_equation_rejected(self):
        with self.assertRaises(ValueError):
            balance_species(["H_plus"], ["H2O"], self.db["species"])

    def test_neutralization_known_endpoint(self):
        amounts = {
            "H_plus": 0.005,
            "OH_minus": 0.005,
            "Na_plus": 0.005,
            "Cl_minus": 0.005,
        }
        saved = copy.deepcopy(amounts)
        result = solve_stoichiometry(self.db, self.r, amounts)
        self.assertEqual(amounts, saved)
        self.assertAlmostEqual(result["heat_to_solution_J"], 286.5)
        self.assertAlmostEqual(
            result["estimated_final_temperature_K"], 298.15 + 286.5 / 418
        )
        self.assertEqual(result["final_mol"]["Na_plus"], 0.005)
        self.assertAlmostEqual(result["generated_mass_g"]["H2O"], 0.005 * 18.015)

    def test_limiting_reagent_and_no_negative_amounts(self):
        result = solve_stoichiometry(
            self.db, self.r, {"H_plus": 0.005, "OH_minus": 0.002}
        )
        self.assertAlmostEqual(result["extent_mol"], 0.002)
        self.assertAlmostEqual(result["final_mol"]["H_plus"], 0.003)
        self.assertEqual(result["final_mol"]["OH_minus"], 0)

    def test_missing_reactant_makes_no_product(self):
        result = solve_stoichiometry(self.db, self.r, {"H_plus": 0.005})
        self.assertEqual(result["extent_mol"], 0)
        self.assertEqual(result["generated_mol"]["H2O"], 0)

    def test_invalid_and_nonfinite_inputs_rejected(self):
        for amount in (-1, float("nan"), float("inf")):
            with self.assertRaises(ValueError):
                solve_stoichiometry(self.db, self.r, {"H_plus": amount})
        with self.assertRaises(ValueError):
            solve_stoichiometry(self.db, self.r, {}, pressure_Pa=0)
        with self.assertRaises(ValueError):
            solve_stoichiometry(self.db, self.r, {}, temperature_K=350)
        with self.assertRaises(ValueError):
            solve_stoichiometry(self.db, self.r, {"H_plus": 1}, solution_volume_L=0.1)

    def test_precipitation_and_unknown_heat_remains_unknown(self):
        result = solve_stoichiometry(
            self.db,
            self.reactions["copper_hydroxide"],
            {"Cu_2plus": 0.003, "OH_minus": 0.004},
        )
        self.assertAlmostEqual(result["generated_mol"]["CuOH2"], 0.002)
        self.assertAlmostEqual(result["final_mol"]["Cu_2plus"], 0.001)
        self.assertIsNone(result["estimated_final_temperature_K"])

    def test_gas_equivalent_uses_explicit_T_P(self):
        result = solve_stoichiometry(
            self.db,
            self.reactions["bicarbonate_acid"],
            {"HCO3_minus": 0.005, "H_plus": 0.005},
        )
        expected = 0.005 * 8.314462618 * 298.15 / 101325 * 1000
        self.assertAlmostEqual(
            result["ideal_gas_equivalent_L_at_input_T_P"]["CO2"], expected
        )

    def test_water_into_concentrated_acid_blocked_despite_ppe(self):
        result = check_action(
            self.db["safety_rules"],
            ["water"],
            ["concentrated_acid"],
            self.r,
            ppe=["goggles", "gloves"],
        )
        self.assertFalse(result.allowed)
        self.assertEqual(result.code, "water_into_concentrated_acid")

    def test_oxidizer_combustible_unordered(self):
        for a, b in [
            ("strong_oxidizer", "combustible"),
            ("combustible", "strong_oxidizer"),
        ]:
            result = check_action(
                self.db["safety_rules"], [a], [b], self.r, ["goggles", "gloves"]
            )
            self.assertFalse(result.allowed)
            self.assertEqual(result.code, "oxidizer_with_combustible")

    def test_sealed_gas_is_blocked(self):
        result = check_action(
            self.db["safety_rules"],
            [],
            [],
            self.reactions["bicarbonate_acid"],
            ["goggles", "gloves"],
            sealed=True,
        )
        self.assertFalse(result.allowed)
        self.assertEqual(result.code, "gas_in_sealed_vessel")

    def test_toxic_gas_and_restricted_reagents_blocked(self):
        r = copy.deepcopy(self.r)
        r["hazards"]["toxic_gas_species"] = ["Cl2"]
        self.assertFalse(
            check_action(
                self.db["safety_rules"], [], [], r, ["goggles", "gloves"]
            ).allowed
        )
        self.assertFalse(
            check_action(
                self.db["safety_rules"],
                ["restricted_student"],
                [],
                self.r,
                ["goggles", "gloves"],
            ).allowed
        )

    def test_unknown_model_is_not_assumed_safe(self):
        result = check_action(
            self.db["safety_rules"], [], [], None, ["goggles", "gloves"]
        )
        self.assertFalse(result.allowed)

    def test_known_virtual_reaction_needs_ppe(self):
        self.assertFalse(check_action(self.db["safety_rules"], [], [], self.r).allowed)
        self.assertTrue(
            check_action(
                self.db["safety_rules"], [], [], self.r, ["goggles", "gloves"]
            ).allowed
        )


if __name__ == "__main__":
    unittest.main()
