import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { runScenarios } from "../tools/physics_scenarios_v33.mjs";
const results = await runScenarios(
  fileURLToPath(new URL("..", import.meta.url)),
);
for (const r of results.scenarios)
  test("V3.3 " + r.name, () => assert.equal(r.passed, true, JSON.stringify(r)));
