import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  out = path.join(root, "validation_v34");
await fs.mkdir(out, { recursive: true });
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const server = spawn(
  "python3",
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8784"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((r, j) => {
  server.stdout.on("data", (b) => b.toString().includes("http://") && r());
  server.on("exit", (c) => j(Error("server " + c)));
});
let browser;
const checks = [],
  errors = [];
const check = (name, detail = {}) => {
  checks.push({ name, passed: true, ...detail });
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
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:8784/?test");
  await page.waitForFunction(() => window.__lab, null, { timeout: 30000 });
  await page.selectOption("#lesson-grade", "10");
  await page.click("#lesson-start");
  await page.waitForTimeout(800);
  assert.equal(
    await page.evaluate(() => __lab.lessons.model?.lesson.id),
    "chloride",
    await page.locator("#message").innerText(),
  );
  check("Grade → topic → experiment → start uses UI");
  await page.screenshot({
    path: path.join(out, "internal_chloride_before.png"),
  });
  await page.evaluate(() => {
    window.advanceLab = (n = 120) => {
      for (let i = 0; i < n; i++) {
        __lab.view.physics.step(1 / 120);
        __lab.lessons.tick(1 / 120, performance.now() + (i * 1000) / 120);
      }
      __lab.view.scene.updateMatrixWorld(true);
    };
    window.lessonPour = (key, to) => {
      const a = __lab.lessons.objects.get(key),
        b = __lab.lessons.objects.get(to),
        home = { ...a.target };
      __lab.beginMouse(a, __lab.view.toScreen(a.target));
      __lab.move(a, { x: a.target.x, y: 1.25, z: a.target.z }, 0, 0, 0);
      advanceLab(180);
      __lab.view.scene.updateMatrixWorld(true);
      const mouth = __lab.view.mouth(b),
        roll = 1.05,
        offset = 0.67 * a.mouthY;
      __lab.move(
        a,
        {
          x: mouth.x + Math.sin(roll) * offset,
          y: mouth.y + 1.25 - Math.cos(roll) * offset,
          z: mouth.z,
        },
        roll,
        0,
        0,
      );
      advanceLab(360);
      const r = __lab.lessons.pour(a, b);
      __lab.move(a, { x: a.target.x, y: 1.25, z: a.target.z }, 0, 0, 0);
      advanceLab(180);
      __lab.move(a, { ...home, y: 1.25 }, 0, 0, 0);
      advanceLab(240);
      __lab.move(a, home, 0, 0, 0);
      advanceLab(180);
      __lab.endMouse();
      return {
        ...r,
        pose: { ...a.target },
        mouth: __lab.view.mouth(a),
        targetMouth: __lab.view.mouth(b),
      };
    };
  });
  const neg = await page.evaluate(() =>
    lessonPour("lesson-silver", "lesson-control"),
  );
  assert.equal(neg.ok, true, JSON.stringify(neg));
  assert.equal(
    await page.evaluate(
      () => __lab.lessons.model.get("lesson-control").mol.AgCl || 0,
    ),
    0,
  );
  const chloride = await page.evaluate(() =>
    lessonPour("lesson-silver", "lesson-chloride"),
  );
  assert.equal(chloride.ok, true, JSON.stringify(chloride));
  assert.equal(await page.evaluate(() => __lab.lessons.model.complete), true);
  const solids = await page.evaluate(() => ({
    mol: __lab.lessons.model.get("lesson-chloride").mol.AgCl,
    particles: __lab.lessons.objects
      .get("lesson-chloride")
      .group.getObjectByName("lesson-precipitate")?.children.length,
    foreign: __lab.createObject("acid_risk", { x: 0, y: 1, z: 0 }) === null,
  }));
  assert.ok(solids.particles > 0);
  assert.ok(solids.foreign);
  check(
    "AgCl: geometric pour, negative control, precipitate, foreign reagent blocked",
    solids,
  );
  await page.click("#lesson-quiz");
  await page.locator("#lesson-answers button").nth(1).click();
  assert.ok(
    (await page.locator("#lesson-answer-feedback").innerText()).includes(
      "Gợi ý",
    ),
  );
  await page.locator("#lesson-answers button").nth(0).click();
  assert.ok(
    (await page.locator("#lesson-answer-feedback").innerText()).startsWith(
      "Đúng",
    ),
  );
  await page.click("#lesson-quiz-close");
  check("Quiz unlocks after reaction; wrong answer gives hint");
  await page.evaluate(() => __lab.lessons.start("indicator"));
  await page.waitForTimeout(800);
  assert.equal(
    (await page.evaluate(() => lessonPour("lesson-base", "lesson-indicator")))
      .ok,
    true,
  );
  assert.equal(await page.evaluate(() => __lab.lessons.model.seenPink), true);
  const acid = await page.evaluate(() =>
    lessonPour("lesson-acid", "lesson-indicator"),
  );
  assert.equal(acid.ok, true, JSON.stringify(acid));
  assert.equal(await page.evaluate(() => __lab.lessons.model.complete), true);
  check(
    "Indicator: physical pours produce pink then colorless with quantitative pH",
  );
  const roundtrip = await page.evaluate(async () => {
    const s = __lab.session();
    const before = JSON.stringify(s.model.vessels);
    await __lab.loadSession(s);
    return before === JSON.stringify(__lab.session().model.vessels);
  });
  assert.ok(roundtrip);
  check("Guided session save/load retains matter");
  const invalidImport = await page.evaluate(async () => {
    const before = JSON.stringify(__lab.session().model);
    const bad = structuredClone(__lab.session());
    bad.poses.foreign = { x: 0, y: 0, z: 0, roll: 0, pitch: 0, yaw: 0 };
    let rejected = false;
    try {
      await __lab.loadSession(bad);
    } catch {
      rejected = true;
    }
    return rejected && before === JSON.stringify(__lab.session().model);
  });
  assert.ok(invalidImport);
  check("Invalid lesson import is rejected before clearing current work");
  await page.evaluate(() => __lab.lessons.start("biuret"));
  await page.waitForTimeout(800);
  const bio = await page.evaluate(() =>
    lessonPour("lesson-biuret", "lesson-protein"),
  );
  assert.equal(bio.ok, true, JSON.stringify(bio));
  assert.equal(await page.evaluate(() => __lab.lessons.model.complete), true);
  check("Protein: alkaline biuret reagent gives purple");
  await page.evaluate(() => __lab.lessons.start("ammonium"));
  await page.waitForTimeout(800);
  assert.equal(
    (await page.evaluate(() => lessonPour("lesson-base", "lesson-ammonium")))
      .ok,
    true,
  );
  const ammonia = await page.evaluate(() => {
    const a = __lab.lessons.objects.get("lesson-litmus"),
      b = __lab.lessons.objects.get("lesson-ammonium");
    __lab.view.scene.updateMatrixWorld(true);
    __lab.beginMouse(a, __lab.view.toScreen(a.target));
    __lab.move(a, { x: a.target.x, y: 1.2, z: a.target.z }, 0, 0, 0);
    advanceLab(200);
    __lab.view.scene.updateMatrixWorld(true);
    const m = __lab.view.mouth(b);
    __lab.move(a, { x: m.x, y: m.y + 0.45 - 0.28 * 0.67, z: m.z }, 0, 0, 0);
    advanceLab(360);
    const contacts = __lab.lessons.visuals.contacts(
      __lab.lessons.objects,
      __lab.lessons.model,
    );
    return {
      paperPose: { ...a.target },
      paperRoll: a.roll,
      mouth: __lab.view.mouth(b),
      complete: __lab.lessons.model.complete,
      contacts,
      litmus: __lab.lessons.model.get("lesson-litmus").litmusBlue,
      gas: __lab.lessons.model.get("lesson-ammonium").escaped_mol.NH3,
    };
  });
  assert.ok(ammonia.complete, JSON.stringify(ammonia));
  check(
    "Ammonium: physical litmus above mouth confirms colorless gas",
    ammonia,
  );
  await page.evaluate(() => __lab.lessons.start("iron-copper"));
  await page.waitForTimeout(800);
  const iron = await page.evaluate(() => {
    const a = __lab.lessons.objects.get("lesson-iron"),
      b = __lab.lessons.objects.get("lesson-copper"),
      p = __lab.view.physics;
    const before = __lab.lessons.model.get("lesson-iron").mol.Cu || 0;
    __lab.beginMouse(a, __lab.view.toScreen(a.target));
    __lab.move(a, { x: b.target.x, y: 1, z: b.target.z }, 0, 0, 0);
    advanceLab(180);
    __lab.move(
      a,
      { x: b.target.x, y: b.target.y + 0.28, z: b.target.z },
      0,
      0,
      0,
    );
    advanceLab(500);
    const contacts = __lab.lessons.visuals.contacts(
      __lab.lessons.objects,
      __lab.lessons.model,
    );
    __lab.select(b);
    document.activeElement?.blur();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    const capBlocked = !b.sealed;
    const reacted = __lab.lessons.model.get("lesson-iron").mol.Cu || 0;
    __lab.move(a, { x: b.target.x, y: 1.2, z: b.target.z }, 0, 0, 0);
    advanceLab(200);
    const removed = __lab.lessons.model.get("lesson-iron").mol.Cu || 0;
    advanceLab(120);
    return {
      before,
      reacted,
      removed,
      after: __lab.lessons.model.get("lesson-iron").mol.Cu || 0,
      contacts,
      complete: __lab.lessons.model.complete,
      colliders: p.entries.get(b.id).colliders.length,
      capBlocked,
    };
  });
  assert.equal(iron.before, 0);
  assert.ok(iron.reacted > 0, JSON.stringify(iron));
  assert.equal(iron.removed, iron.after);
  assert.ok(iron.complete);
  assert.ok(iron.capBlocked);
  check(
    "Fe: hollow vessel collider, immersion reacts, lifting out stops reaction",
    iron,
  );
  const immersedRestore = await page.evaluate(async () => {
    const a = __lab.lessons.objects.get("lesson-iron"),
      b = __lab.lessons.objects.get("lesson-copper");
    __lab.move(
      a,
      { x: b.target.x, y: b.target.y + 0.28, z: b.target.z },
      0,
      0,
      0,
    );
    advanceLab(300);
    const saved = __lab.session(),
      oldPose = saved.poses["lesson-iron"];
    await __lab.loadSession(saved);
    const loaded = __lab.lessons.objects.get("lesson-iron");
    return {
      displacement: Math.hypot(
        loaded.target.x - oldPose.x,
        loaded.target.y - oldPose.y,
        loaded.target.z - oldPose.z,
      ),
      immersed: __lab.lessons.visuals.contacts(
        __lab.lessons.objects,
        __lab.lessons.model,
      ).immersed,
      matter:
        JSON.stringify(saved.model.vessels) ===
        JSON.stringify(__lab.session().model.vessels),
    };
  });
  assert.ok(
    immersedRestore.displacement < 0.001,
    JSON.stringify(immersedRestore),
  );
  assert.ok(
    immersedRestore.immersed && immersedRestore.matter,
    JSON.stringify(immersedRestore),
  );
  check(
    "Restoring iron inside hollow beaker preserves its position and matter",
    immersedRestore,
  );
  await page.evaluate(() => __lab.endMouse());
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(out, "internal_iron.png") });
  await page.click("#lesson-knowledge summary");
  await page.screenshot({ path: path.join(out, "internal_knowledge.png") });
  await page.evaluate(() => __lab.lessons.start("chloride"));
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const a = __lab.lessons.objects.get("lesson-silver"),
      b = __lab.lessons.objects.get("lesson-chloride");
    __lab.beginMouse(a, __lab.view.toScreen(a.target));
    __lab.move(a, { x: a.target.x, y: 1.25, z: a.target.z }, 0, 0, 0);
    advanceLab(200);
    const mouth = __lab.view.mouth(b),
      roll = 1.05,
      offset = 0.67 * a.mouthY;
    __lab.move(
      a,
      {
        x: mouth.x + Math.sin(roll) * offset,
        y: mouth.y + 1.25 - Math.cos(roll) * offset,
        z: mouth.z,
      },
      roll,
      0,
      0,
    );
    advanceLab(300);
  });
  await page.waitForFunction(() => __lab.lessons.model.complete, null, {
    timeout: 4000,
  });
  await page.evaluate(() => __lab.endMouse());
  check(
    "Production animation loop automatically pours after hold/tilt dwell (no direct chemistry call)",
  );
  await page.selectOption("#projection-page", "1");
  assert.equal(await page.evaluate(() => __lab.lessons.visuals.page), 1);
  await page.selectOption("#projection-page", "3");
  assert.equal(await page.evaluate(() => __lab.lessons.visuals.page), 3);
  check(
    "Projection pages expose preparation, conditions, explanation, application and safety",
  );
  await page.click("#lesson-exit");
  assert.equal(await page.evaluate(() => __lab.lessons.active), false);
  assert.equal(await page.evaluate(() => __lab.view.objects.length), 0);
  check("Leaving lesson clears its bodies and restores free lab");
  await page.click("#settings > summary");
  await page.click("#view-mode");
  assert.ok(await page.evaluate(() => __lab.view.controls.enabled));
  await page.click("#lesson-start");
  assert.equal(await page.evaluate(() => __lab.view.controls.enabled), false);
  assert.ok(await page.evaluate(() => __lab.lessons.active));
  check("Starting a lesson from Orbit view restores interaction mode");
  assert.deepEqual(errors, []);
  check("No JavaScript exceptions");
} catch (e) {
  checks.push({
    name: "failure",
    passed: false,
    error: String(e),
    stack: e.stack,
  });
  console.error(e);
  process.exitCode = 1;
} finally {
  await fs.writeFile(
    path.join(out, "lessons_browser.json"),
    JSON.stringify({ physicalWebcam: false, checks, errors }, null, 2),
  );
  await browser?.close();
  server.kill();
}
