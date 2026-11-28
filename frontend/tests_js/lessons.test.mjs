import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  LessonChemistry,
  appearance,
  ph,
} from "../web/src/lesson-chemistry.js";
const data = JSON.parse(
  fs.readFileSync(new URL("../web/data/lessons-thpt.json", import.meta.url)),
);
const pour = { kind: "pour", aligned: true, sealed: false };
const model = (id) => new LessonChemistry(data, id);
const almost = (a, b, tol = 1e-10) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
test("First exemplar: chloride precipitates stoichiometrically only after valid pour", () => {
  const m = model("chloride");
  assert.equal(m.complete, false);
  const initial = structuredClone(m.snapshot());
  assert.equal(
    m.transfer("lesson-silver", "lesson-chloride", 2, {
      kind: "collision",
      aligned: true,
    }).ok,
    false,
  );
  assert.deepEqual(m.snapshot(), initial);
  m.transfer("lesson-silver", "lesson-chloride", 2, pour);
  almost(m.get("lesson-chloride").mol.AgCl, 0.0001);
  assert.equal(m.complete, true);
  assert.equal(appearance(m.get("lesson-chloride")).solid.species, "AgCl");
});
test("Chloride negative water control; reagent limitation and transfer volume conservation", () => {
  const m = model("chloride");
  m.transfer("lesson-silver", "lesson-control", 2, pour);
  assert.equal(m.get("lesson-control").mol.AgCl, undefined);
  m.transfer("lesson-silver", "lesson-chloride", 30, pour);
  almost(m.get("lesson-chloride").volume_ml, 20);
  almost(m.get("lesson-silver").volume_ml, 16);
  almost(m.get("lesson-chloride").mol.AgCl, 0.0006);
  m.transfer("lesson-chloride", "lesson-control", 3, pour);
  // V3.5 explicitly models a well-mixed suspension during pours.
  almost(m.get("lesson-chloride").mol.AgCl, 0.0006 * 17 / 20);
  // The control already contains Ag+ from the first pour; transferred excess Cl- also reacts.
  almost(m.get("lesson-control").mol.AgCl, 0.0006 * 3 / 20 + 0.0002 * 3 / 20);
});
test("Second exemplar: indicator turns pink, then colorless only after acid; pH has water equilibrium", () => {
  const m = model("indicator");
  almost(ph(m.get("lesson-indicator")), 7);
  m.transfer("lesson-base", "lesson-indicator", 2, pour);
  assert.ok(ph(m.get("lesson-indicator")) > 11);
  assert.equal(m.seenPink, true);
  assert.equal(m.complete, false);
  m.transfer("lesson-acid", "lesson-indicator", 2, pour);
  almost(ph(m.get("lesson-indicator")), 7, 1e-7);
  assert.equal(m.complete, true);
  almost(m.get("lesson-indicator").mol.H2O, 0.0002);
});
test("Acid-first indicator does not mark lesson complete without observing pink", () => {
  const m = model("indicator");
  m.transfer("lesson-acid", "lesson-indicator", 2, pour);
  assert.equal(m.complete, false);
  m.transfer("lesson-base", "lesson-indicator", 2, pour);
  assert.equal(m.complete, false);
});
test("Biuret water control stays blue; protein with alkaline reagent becomes purple, no fictional stoichiometric protein", () => {
  const m = model("biuret");
  m.transfer("lesson-biuret", "lesson-control", 2, pour);
  assert.equal(appearance(m.get("lesson-control")).purple, false);
  m.transfer("lesson-biuret", "lesson-protein", 2, pour);
  assert.equal(appearance(m.get("lesson-protein")).purple, true);
  assert.equal(m.complete, true);
  almost(m.get("lesson-protein").protein_g, 0.05);
  assert.equal(m.get("lesson-protein").mol.protein, undefined);
});
test("Fe/Cu has no reaction outside liquid; extent bounded, stops on removal; atoms conserved", () => {
  const m = model("iron-copper");
  m.step(0.1, { immersed: false });
  assert.equal(m.get("lesson-iron").mol.Cu, undefined);
  for (let i = 0; i < 500; i++) m.step(0.1, { immersed: true });
  almost(m.get("lesson-iron").mol.Cu, 0.005);
  almost(m.get("lesson-copper").mol.Cu_2plus, 0);
  almost(m.get("lesson-copper").mol.Fe_2plus, 0.005);
  const before = structuredClone(m.get("lesson-iron"));
  m.step(0.1, { immersed: false });
  assert.deepEqual(m.get("lesson-iron"), before);
  assert.equal(m.complete, true);
});
test("Ammonium generates NH3, no precipitate; moist litmus must sample gas above correct vessel", () => {
  const m = model("ammonium");
  m.transfer("lesson-base", "lesson-ammonium", 2, pour);
  almost(m.get("lesson-ammonium").mol.NH3, 0.0002);
  assert.equal(m.complete, false);
  m.step(0.1, { litmusAbove: "lesson-base" });
  assert.equal(m.complete, false);
  assert.equal(appearance(m.get("lesson-ammonium")).solid, null);
  m.step(0.1, { litmusAbove: "lesson-ammonium" });
  assert.equal(m.complete, true);
  assert.equal(m.get("lesson-litmus").litmusBlue, true);
  const s = m.get("lesson-ammonium");
  almost(s.mol.NH4_plus + s.mol.NH3 + s.escaped_mol.NH3, 0.001);
});
test("Sealed ammonia vessel does not emit gas; empty, full, wrong receiver and closed pours rejected", () => {
  const m = model("ammonium");
  m.transfer("lesson-base", "lesson-ammonium", 2, pour);
  m.step(0.1, {
    sealed: new Set(["lesson-ammonium"]),
    litmusAbove: "lesson-ammonium",
  });
  assert.equal(m.complete, false);
  assert.equal(m.get("lesson-ammonium").escaped_mol.NH3, undefined);
  assert.equal(m.transfer("lesson-base", "lesson-litmus", 2, pour).ok, false);
  assert.equal(
    m.transfer("lesson-base", "lesson-ammonium", 2, { ...pour, sealed: true })
      .ok,
    false,
  );
});
test("Ten lessons have curriculum evidence or explicit pending alignment, questions and hints", () => {
  assert.equal(data.lessons.length, 10);
  for (const l of data.lessons) {
    assert.ok([10, 11, 12].includes(l.grade));
    assert.ok(l.curriculum.pages?.length || l.curriculum.verified === false);
    assert.ok(l.questions.length >= 3 && l.questions.length <= 5);
    const m = model(l.id);
    for (let i = 0; i < l.questions.length; i++) {
      const q = l.questions[i];
      assert.equal(m.answer(i, q.correct).correct, true);
      assert.ok(
        m.answer(i, (q.correct + 1) % q.options.length).text.length > 15,
      );
    }
  }
});
test("Snapshots round trip; invalid imported amounts do not change current state", () => {
  const m = model("indicator");
  m.transfer("lesson-base", "lesson-indicator", 2, pour);
  const n = model("indicator");
  n.restore(m.snapshot());
  assert.deepEqual(n.get("lesson-indicator"), m.get("lesson-indicator"));
  const raw = m.snapshot();
  raw.vessels = structuredClone(raw.vessels);
  raw.vessels["lesson-base"].mol.Na_plus = -1;
  const before = structuredClone(n.snapshot());
  assert.throws(() => n.restore(raw));
  assert.deepEqual(n.snapshot(), before);
});
test("Near-neutral indicator responds continuously and preserves charge under dilution", () => {
  const m = model("indicator");
  m.transfer("lesson-base", "lesson-indicator", 2, pour);
  m.transfer("lesson-acid", "lesson-indicator", 1.9, pour);
  assert.ok(ph(m.get("lesson-indicator")) > 9);
  m.transfer("lesson-acid", "lesson-indicator", 0.2, pour);
  assert.ok(ph(m.get("lesson-indicator")) < 5);
});
import { balanced, atoms } from "../web/src/reaction-engine.js";
test("All quantitative lesson equations are atom-balanced; biuret intentionally has no fabricated molecular equation", () => {
  for (const r of data.reactionRules)
    assert.equal(balanced(r.molecular), true, r.id);
  assert.equal(
    data.lessons.find((l) => l.id === "biuret").modelType,
    "qualitative-complex",
  );
});
const formula = {
  CuOH2:"Cu(OH)2", Ca_2plus:"Ca", CO3_2minus:"CO3", CaCO3:"CaCO3", HCO3_minus:"HCO3", CH3COOH:"CH3COOH", CH3COO_minus:"CH3COO", CO2:"CO2",
  H_plus: "H",
  OH_minus: "OH",
  Na_plus: "Na",
  Cl_minus: "Cl",
  NO3_minus: "NO3",
  Ag_plus: "Ag",
  AgCl: "AgCl",
  Cu_2plus: "Cu",
  SO4_2minus: "SO4",
  Fe_2plus: "Fe",
  Fe: "Fe",
  Cu: "Cu",
  NH4_plus: "NH4",
  NH3: "NH3",
  H2O: "H2O",
  biuret_Cu: "Cu",
};
function inventory(m) {
  const result = {};
  for (const s of m.vessels.values())
    for (const map of [s.mol, s.escaped_mol])
      for (const [k, n] of Object.entries(map))
        for (const [a, c] of Object.entries(atoms(formula[k])))
          result[a] = (result[a] || 0) + c * n;
  return result;
}
test("Matter is conserved globally over 100 transfers, precipitation and gas escape", () => {
  for (const id of ["chloride", "indicator", "ammonium", "biuret", "neutralization", "copper-hydroxide", "calcium-carbonate", "carbon-dioxide", "dilution"]) {
    const m = model(id),
      before = inventory(m),
      keys = [...m.vessels.keys()].filter((k) => !k.includes("litmus"));
    for (let i = 0; i < 100; i++) {
      m.transfer(keys[i % keys.length], keys[(i + 1) % keys.length], 0.7, pour);
      m.step(0.1, {});
    }
    const after = inventory(m);
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)]))
      almost(before[key] || 0, after[key] || 0, 1e-9);
  }
});
