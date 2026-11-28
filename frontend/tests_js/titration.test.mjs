import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { equilibrium, Titration } from "../web/src/titration.js";
import { atoms, balanced, react } from "../web/src/reaction-engine.js";
const rows = JSON.parse(
  fs.readFileSync(new URL("../web/data/reactions100.json", import.meta.url)),
).reactions;
const close = (a, b, e = 0.005) =>
  assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);
test("OpenStax strong-acid titration example and check-your-learning", () => {
  for (const [addedMl, p] of [
    [0, 1],
    [12.5, 1.4771],
    [25, 7],
    [37.5, 12.301],
  ])
    close(equilibrium({ addedMl }).ph, p);
  for (const [addedMl, p] of [
    [0, 1],
    [15, 1.5111],
    [25, 7],
    [40, 12.523],
  ])
    close(
      equilibrium({ acid: "HNO3", initialMl: 50, baseM: 0.2, addedMl }).ph,
      p,
    );
});
test("Weak acid: start, half equivalence, equivalence, excess", () => {
  for (const [addedMl, p] of [
    [0, 2.875],
    [12.5, 4.745],
    [25, 8.722],
    [37.5, 12.301],
  ])
    close(equilibrium({ acid: "CH3COOH", addedMl }).ph, p, 0.01);
});
test("pH monotonic across equivalence, water autoionization at dilute limit", () => {
  let last = -Infinity;
  for (let v = 0; v <= 50; v += 0.025) {
    const p = equilibrium({ addedMl: v }).ph;
    assert.ok(p >= last);
    last = p;
  }
  close(equilibrium({ acidM: 1e-10, addedMl: 0 }).ph, 7, 0.001);
});
test("Reject unsupported reagents and nonfinite/negative parameters", () => {
  for (const opts of [
    { acid: "H2SO4" },
    { base: "NH3" },
    { acidM: NaN },
    { addedMl: -1 },
    { baseM: 0 },
    { initialMl: Infinity },
  ])
    assert.throws(() => equilibrium(opts));
});
test("Buret conserves volume, stops empty, no catchup over suspended tab", () => {
  const m = new Titration();
  m.open = 1;
  m.step(10);
  close(m.addedMl, 0.15);
  m.add(100);
  assert.equal(m.addedMl, 50);
  assert.equal(m.open, 0);
  close(m.value.volume, 75);
  assert.throws(() => m.add(-1));
});
test("100 unique molecular equations balanced; nested formula parser", () => {
  assert.equal(rows.length, 100);
  assert.equal(new Set(rows.map((r) => r.equation)).size, 100);
  assert.deepEqual(atoms("Al2(SO4)3"), { Al: 2, S: 3, O: 12 });
  for (const r of rows) assert.ok(balanced(r), r.id);
});
test("Every reaction conserves atoms with asymmetric limiting quantities", () => {
  for (const r of rows) {
    const amounts = Object.fromEntries(
      Object.entries(r.reactants).map(([f, c], i) => [f, c * (i + 1) * 0.013]),
    );
    const result = react(r, amounts, true);
    assert.equal(result.status, "calculated");
    const totals = (s) => {
      const a = {};
      for (const [f, n] of Object.entries(s))
        for (const [e, c] of Object.entries(atoms(f)))
          a[e] = (a[e] || 0) + n * c;
      return a;
    };
    const before = totals(amounts);
    const after = totals(result.remaining_mol),
      prod = totals(result.products_mol);
    for (const a in before)
      close(before[a], (after[a] || 0) + (prod[a] || 0), 1e-10);
  }
});
test("Condition gating, missing reagent, extras and limiting reactant", () => {
  const r = rows[0];
  assert.equal(
    react(r, { HCl: 0.01, NaOH: 0.02 }).status,
    "condition_required",
  );
  const a = react(r, { HCl: 0.01, NaOH: 0.02 }, true);
  close(a.remaining_mol.NaOH, 0.01);
  close(a.products_mol.NaCl, 0.01);
  assert.equal(react(r, { HCl: 0.01 }, true).status, "missing_reactant");
  assert.equal(
    react(r, { HCl: 0.01, CuSO4: 0.01 }, true).status,
    "unsupported_mixture",
  );
  assert.throws(() => react(r, { HCl: NaN }, true));
});

test("Invalid reset leaves previous valid experiment intact", () => {
  const m = new Titration();
  m.add(5);
  assert.throws(() => m.reset({ acidM: NaN }));
  assert.equal(m.addedMl, 5);
  assert.equal(m.config.acidM, 0.1);
  assert.ok(Number.isFinite(m.sample().ph));
});
