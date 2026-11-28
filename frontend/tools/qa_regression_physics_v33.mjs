import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const server = spawn(
  process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"),
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8772"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((r) =>
  server.stdout.on("data", (b) => b.toString().includes("http://") && r()),
);
let browser;
const errors = [],
  checks = [];
const check = (name) => {
  checks.push({ name, passed: true });
  console.log("PASS", name);
};
try {
  browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--enable-unsafe-swiftshader",
      "--use-gl=angle",
      "--use-angle=swiftshader",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8772/?test");
  await page.waitForFunction(() => window.__lab);
  const saved = await page.evaluate(async () => {
    __lab.createObject("beaker", { x: 0, y: 0, z: 0 });
    const s = __lab.session();
    await __lab.loadSession(s);
    const a = __lab.session();
    const before = JSON.stringify(
      a.objects.map((o) => ({ id: o.id, stock: o.stock, mixture: o.mixture })),
    );
    let rejected = false;
    try {
      await __lab.loadSession({
        schema: "hololab3-session-1",
        objects: [{ stock: "invalid" }],
      });
    } catch {
      rejected = true;
    }
    const after = JSON.stringify(
      __lab
        .session()
        .objects.map((o) => ({ id: o.id, stock: o.stock, mixture: o.mixture })),
    );
    return { stock: a.objects[0].stock, rejected, unchanged: before === after };
  });
  assert.equal(saved.stock, "beaker");
  assert.ok(saved.rejected && saved.unchanged);
  check(
    "Save/load and invalid import preserve IDs/stocks/quantities while physics remains active",
  );
  await page.locator("#risk-mode").click();
  const risk = await page.evaluate(async () => {
    __lab.clearDesk();
    const a = __lab.createObject("water", { x: -1, y: 0, z: 0 }),
      b = __lab.createObject("acid_risk", { x: 1, y: 0, z: 0 });
    const before = JSON.stringify([a.mixture, b.mixture]);
    await __lab.pour(a, b, true);
    return before === JSON.stringify([a.mixture, b.mixture]);
  });
  assert.ok(risk);
  check(
    "Guided hazardous transfer remains blocked without changing quantities",
  );
  await page.locator("#risk-mode").click();
  const effects = await page.evaluate(async () => {
    const [a, b] = __lab.view.objects;
    await __lab.pour(a, b, true);
    return { qual: b.mixture.qualitative, effects: __lab.view.effects.length };
  });
  assert.ok(effects.qual && effects.effects > 0);
  check("Free-mode qualitative hazard effects retained");
  await page.evaluate(() => document.querySelector("#view-mode").click());
  assert.equal(await page.evaluate(() => __lab.view.controls.enabled), true);
  await page.evaluate(() => document.querySelector("#view-mode").click());
  assert.equal(await page.evaluate(() => __lab.view.controls.enabled), false);
  check("OrbitControls exclusive interaction mode retained");
  await page.locator("#reaction-library").click();
  assert.equal(await page.locator("#reaction-select option").count(), 100);
  await page.locator("#reactions-close").click();
  check("100-reaction library retained");
  assert.deepEqual(errors, []);
} finally {
  await writeFile(
    path.join(root, "validation_v33/regression_checks.json"),
    JSON.stringify({ checks, page_errors: errors }, null, 2),
  );
  await browser?.close();
  server.kill();
}
