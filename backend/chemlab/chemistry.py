"""Exact balance + bounded ideal stoichiometry; NOT a reaction predictor.

The caller selects a known reaction and verifies preconditions. No UI state is
mutated here: returned results are proposals until the action is committed.
"""

import json
from functools import reduce
from math import gcd, isfinite, lcm
from pathlib import Path

from sympy import Matrix


def load_database(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema_version") != "1.0.0":
        raise ValueError("Unsupported chemistry schema")
    for reaction in data["reactions"]:
        left, right = reaction["reactants"], reaction["products"]
        expected = list(left.values()) + list(right.values())
        actual = balance_species(list(left), list(right), data["species"])
        if actual != expected:
            raise ValueError(f"Invalid coefficients in {reaction['id']}")
    return data


def balance_species(reactants, products, species):
    """Find the positive integer nullspace of an atom AND charge matrix.

    Input products must already be known. Multiple independent balances are
    rejected instead of silently selecting an arbitrary nullspace vector.
    """
    ids = list(reactants) + list(products)
    if not reactants or not products or len(ids) != len(set(ids)):
        raise ValueError("Use a net equation with distinct species on both sides")
    entries = [species[key] for key in ids]
    elements = sorted({element for entry in entries for element in entry["atoms"]})
    signs = [1] * len(reactants) + [-1] * len(products)
    rows = [
        [sign * entry["atoms"].get(element, 0) for sign, entry in zip(signs, entries)]
        for element in elements
    ]
    rows.append([sign * entry["charge"] for sign, entry in zip(signs, entries)])
    basis = Matrix(rows).nullspace()
    if len(basis) != 1:
        raise ValueError("No unique balance; review species and oxidation/charge data")
    vector = basis[0]
    denominator = reduce(lcm, (int(value.q) for value in vector), 1)
    integers = [int(value * denominator) for value in vector]
    if integers[0] < 0:
        integers = [-n for n in integers]
    if any(n <= 0 for n in integers):
        raise ValueError("No strictly positive balance for the supplied equation")
    divisor = reduce(gcd, integers)
    return [n // divisor for n in integers]


def finite_number(value, name, lower=0, strict=False):
    if not isinstance(value, (int, float)) or not isfinite(value):
        raise ValueError(f"{name} must be a finite number")
    if value < lower or (strict and value == lower):
        raise ValueError(f"Invalid {name}")


def solve_stoichiometry(
    db,
    reaction,
    amounts_mol,
    *,
    temperature_K=298.15,
    pressure_Pa=101325.0,
    solution_mass_g=100.0,
    solution_volume_L=0.1,
    cp_J_g_K=4.18,
    vessel_heat_capacity_J_K=0.0,
):
    """One complete known reaction, homogeneous dilute mixture, ideal endpoint.

    Missing enthalpy -> no temperature estimate. Gas volume is ideal-gas
    equivalent at input T/P, not measured bubbles or gas captured from water.
    Solvent mass, spectator ions and vessel capacity are caller inputs.
    """
    for name, value in {
        "temperature_K": temperature_K,
        "pressure_Pa": pressure_Pa,
        "solution_mass_g": solution_mass_g,
        "solution_volume_L": solution_volume_L,
        "cp_J_g_K": cp_J_g_K,
    }.items():
        finite_number(value, name, strict=True)
    finite_number(vessel_heat_capacity_J_K, "vessel_heat_capacity_J_K")
    for key, value in amounts_mol.items():
        if key not in db["species"]:
            raise ValueError(f"Unknown species: {key}")
        finite_number(value, key)
    t_min, t_max = reaction["model"]["temperature_K"]
    if not t_min <= temperature_K <= t_max:
        raise ValueError("Temperature is outside this model's scope")
    for key in reaction["reactants"]:
        if (
            amounts_mol.get(key, 0) / solution_volume_L
            > reaction["model"]["max_initial_reactant_M"] + 1e-12
        ):
            raise ValueError("Concentration is outside the dilute model's scope")
    left, right = reaction["reactants"], reaction["products"]
    if balance_species(list(left), list(right), db["species"]) != list(
        left.values()
    ) + list(right.values()):
        raise ValueError("Reaction is not balanced")
    extent = min(
        amounts_mol.get(key, 0.0) / coefficient for key, coefficient in left.items()
    )
    final = dict(amounts_mol)
    for key, coefficient in left.items():
        final[key] = max(0.0, final.get(key, 0.0) - coefficient * extent)
    generated = {key: coefficient * extent for key, coefficient in right.items()}
    for key, quantity in generated.items():
        final[key] = final.get(key, 0.0) + quantity
    product_masses = {
        key: quantity
        * sum(
            db["atomic_masses_g_mol"][atom] * count
            for atom, count in db["species"][key]["atoms"].items()
        )
        for key, quantity in generated.items()
    }
    gas = {
        key: quantity * 8.314462618 * temperature_K / pressure_Pa * 1000
        for key, quantity in generated.items()
        if db["species"][key]["phase"] == "g"
    }
    enthalpy = reaction["thermodynamics"]["delta_h_J_per_mol_extent"]
    heat = None if enthalpy is None else -extent * enthalpy
    temperature = (
        None
        if heat is None
        else temperature_K
        + heat / (solution_mass_g * cp_J_g_K + vessel_heat_capacity_J_K)
    )
    return {
        "extent_mol": extent,
        "final_mol": final,
        "generated_mol": generated,
        "generated_mass_g": product_masses,
        "ideal_gas_equivalent_L_at_input_T_P": gas,
        "heat_to_solution_J": heat,
        "estimated_final_temperature_K": temperature,
        "assumptions": [
            "complete reaction",
            "homogeneous dilute mixture",
            "no heat loss/evaporation",
            "no gas dissolution or Ksp solver",
            "no kinetics: this is an endpoint, not a temperature-time curve",
        ],
    }
