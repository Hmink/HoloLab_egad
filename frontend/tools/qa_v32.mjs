import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  out = path.join(root, "validation_v32");
await mkdir(out, { recursive: true });
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const server = spawn(
  process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"),
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8768"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((r, j) => {
  server.stdout.on("data", (b) => b.toString().includes("http://") && r());
  server.on("exit", (c) => j(Error("server " + c)));
});
let browser;
const errors = [],
  checks = [],
  requests = new Set();
const check = (name, data = {}) => {
  checks.push({ name, passed: true, ...data });
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
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      ...(process.env.CAMERA_FIXTURE
        ? ["--use-file-for-fake-video-capture=" + process.env.CAMERA_FIXTURE]
        : []),
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.add(r.url()));
  await page.goto("http://127.0.0.1:8768/?test");
  await page.waitForFunction(() => window.__lab, null, { timeout: 30000 });
  check("Startup: local Rapier WASM, Three.js, chemistry API");
  // Mouse grab/release exercises the production event handlers, not a mocked physics body.
  const card = await page.locator('[data-stock="beaker"]').boundingBox(),
    work = await page.locator("#workspace").boundingBox();
  await page.mouse.move(card.x + 35, card.y + 25);
  await page.mouse.down();
  await page.mouse.move(work.x + work.width * 0.4, work.y + work.height * 0.3, {
    steps: 15,
  });
  await page.waitForTimeout(150);
  assert.equal(
    await page.evaluate(() =>
      __lab.view.physics.entries.get(1).body.isKinematic(),
    ),
    true,
  );
  const before = await page.evaluate(
    () => __lab.view.objects[0].group.position.y,
  );
  await page.mouse.up();
  assert.equal(
    await page.evaluate(() =>
      __lab.view.physics.entries.get(1).body.isDynamic(),
    ),
    true,
  );
  await page.waitForTimeout(100);
  assert.ok(
    await page.evaluate(
      (y) => __lab.view.objects[0].group.position.y < y - 0.05,
      before,
    ),
  );
  await page.waitForTimeout(1000);
  check("Mouse grab → kinematic; release → dynamic and visible falling");
  const drops = await page.evaluate(() => {
    const p = __lab.view.physics,
      o = __lab.view.objects[0];
    let maxPen = 0,
      minFloorGap = Infinity;
    for (let n = 0; n < 20; n++) {
      __lab.beginMouse(o, __lab.view.toScreen(o.target));
      __lab.move(
        o,
        { x: 0, y: n % 2 ? -0.9 : 1.2, z: 0 },
        (n % 3) * 0.25,
        0,
        0,
      );
      for (let i = 0; i < 100; i++) p.step(1 / 120);
      if (!p.entries.get(o.id).body.isKinematic()) throw Error("not held");
      __lab.endMouse();
      if (!p.entries.get(o.id).body.isDynamic()) throw Error("not released");
      const e = p.entries.get(o.id);
      for (let i = 0; i < 320; i++) {
        p.step(1 / 120);
        const gap =
          p.bounds(e, e.body.rotation(), p.position(e)).min.y - p.table.top;
        maxPen = Math.max(maxPen, -gap);
        minFloorGap = Math.min(minFloorGap, gap);
        if (gap < -0.005) throw Error("table penetrated " + gap);
      }
    }
    __lab.beginMouse(o, __lab.view.toScreen(o.target));
    __lab.move(o, { x: 0, y: -10, z: 0 }, 1.2, 0.4, 0.3);
    for (let i = 0; i < 120; i++) p.step(1 / 120);
    const e = p.entries.get(o.id),
      heldGap =
        p.bounds(e, e.body.rotation(), p.position(e)).min.y - p.table.top;
    if (heldGap < -0.001) throw Error("held below table");
    __lab.endMouse();
    // Regrab/release during a short deliberate horizontal movement.
    __lab.beginMouse(o, __lab.view.toScreen(o.target));
    for (let i = 0; i < 30; i++) {
      __lab.move(o, { x: i * 0.02, y: 0.8, z: 0 }, 0, 0, 0);
      p.step(1 / 120);
    }
    __lab.endMouse();
    const velocity = e.body.linvel();
    if (velocity.x <= 0.05) throw Error("no throw inertia");
    return {
      cycles: 20,
      max_penetration_scene_units: maxPen,
      min_gap: minFloorGap,
      held_gap: heldGap,
      throw_velocity_m_per_s: { x: velocity.x, y: velocity.y, z: velocity.z },
    };
  });
  check(
    "20 real-mesh drop/regrab cycles, tabletop block, rotated collider support, inertia",
    drops,
  );
  // Actual Interaction FSM with two pose streams; this is synthetic gesture evidence.
  const gestures = await page.evaluate(async () => {
    __lab.clearDesk();
    const p = __lab.view.physics;
    const a = __lab.createObject("beaker", { x: -1.2, y: 1, z: 0 }),
      b = __lab.createObject("flask", { x: 1.2, y: 1, z: 0 });
    const pose = (o, label, palm) => {
      const at = __lab.view.toScreen(o.target);
      const x = 0.035 + (at.x / innerWidth) * 0.93,
        y = 0.035 + (at.y / innerHeight) * 0.93;
      return {
        x,
        y,
        center: { x, y },
        ratio: 0.9,
        palm,
        angle: 0,
        label,
        score: 0.99,
        fist: false,
        points: Array.from({ length: 21 }, () => ({ x, y, z: 0 })),
      };
    };
    // Freeze as though just touched while preparing the open-hand acquisition samples.
    p.beginGrab(a);
    p.beginGrab(b);
    const pa = pose(a, "Left", 0.15),
      pb = pose(b, "Right", 0.06);
    let clock = performance.now();
    const send = (rows, n = 1) => {
      for (let i = 0; i < n; i++) {
        clock += 34;
        __lab.replay(structuredClone(rows), clock);
      }
    };
    send([pa, pb], 6);
    pa.ratio = pb.ratio = 0.2;
    send([pa, pb], 6);
    if (
      __lab.interaction.owners(a).length !== 1 ||
      __lab.interaction.owners(b).length !== 1
    )
      throw Error("two-hand grab failed");
    const held = __lab.state().hands.map((h) => h.object);
    const t = __lab.tracks.lastFrame + 34;
    __lab.replay([], t);
    __lab.view.physics.ownership(a, true, false);
    __lab.view.physics.ownership(b, true, false);
    const frozen = p.position(p.entries.get(a.id));
    for (let i = 0; i < 20; i++) p.step(1 / 120);
    if (
      !p.entries.get(a.id).body.isKinematic() ||
      __lab.interaction.owners(a).length !== 1
    )
      throw Error("tracking gap dropped object");
    const after = p.position(p.entries.get(a.id));
    if (
      Math.hypot(after.x - frozen.x, after.y - frozen.y, after.z - frozen.z) >
      1e-5
    )
      throw Error("gap moved object");
    let time = t + 34;
    pa.ratio = pb.ratio = 0.9;
    for (let i = 0; i < 8; i++) {
      __lab.replay([pa, pb], time);
      time += 34;
    }
    if (
      __lab.interaction.owners(a).length ||
      !p.entries.get(a.id).body.isDynamic()
    )
      throw Error("release FSM did not detach");
    __lab.interaction.reset();
    __lab.tracks.reset();
    return { held, tracking_gap_froze: true, release_dynamic: true };
  });
  check(
    "Synthetic two-hand FSM, temporary tracking loss, valid release handoff",
    gestures,
  );
  await page.evaluate(async () => {
    __lab.clearDesk();
    const a = __lab.createObject("hcl", { x: -1, y: 0, z: 0 }),
      b = __lab.createObject("naoh", { x: 1, y: 0, z: 0 });
    await __lab.pour(a, b, true);
    if (a.mixture.volume_ml !== 90 || b.mixture.volume_ml !== 110)
      throw Error("chem regression");
  });
  check("Preserved chemical transfer quantities");
  await page.locator("#titration-mode").click();
  await page.locator("#t-drop").click();
  assert.equal(await page.locator("#t-used").textContent(), "0.05 mL");
  await page.locator("#titration-mode").click();
  check("Preserved titration scene and microdose");
  await page.locator("#camera-auto").uncheck();
  await page.locator("#start-camera").click();
  await page.waitForFunction(
    () => __lab.capture.running && __lab.metrics.tracking.length > 5,
    null,
    { timeout: 60000 },
  );
  const modes = [];
  for (const mode of ["HD", "FHD", "LOW", "HD"]) {
    await page.locator("#camera-quality").selectOption(mode);
    await page.waitForFunction(() => !__lab.capture.qualityBusy);
    await page.waitForTimeout(200);
    const report = await page.evaluate(() => __lab.capture.cameraReport());
    modes.push(report);
    assert.ok(report.settings.width > 0 && report.video_width > 0);
    assert.equal(report.requested, mode);
  }
  check(
    "HD default and Low/HD/Full-HD camera modes report actual track and video sizes",
    { modes },
  );
  await page.waitForFunction(
    () => __lab.metrics.tracking.some((t) => t.hands > 0),
    null,
    { timeout: 30000 },
  );
  const preview = await page.evaluate(() => ({
    fit: getComputedStyle(document.querySelector("#camera")).objectFit,
    mirror: getComputedStyle(document.querySelector("#camera")).transform,
    tracking: __lab.metrics.tracking.find((t) => t.hands > 0),
  }));
  assert.equal(preview.fit, "contain");
  assert.ok(preview.mirror.includes("-1"));
  assert.ok(preview.tracking.hands > 0);
  check(
    "Mirror/aspect preserved and real MediaPipe inference detects hands from fixture",
    preview,
  );
  await page.evaluate(() => {
    const q = document.querySelector("#quality");
    q.value = "1";
    q.dispatchEvent(new Event("change"));
  });
  await page.evaluate(() => {
    __lab.clearDesk();
    for (const [i, id] of [
      "beaker",
      "flask",
      "cuso4",
      "naoh",
      "tube",
    ].entries())
      __lab.createObject(id, { x: (i - 2) * 1.1, y: 0.5, z: 0 });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(out, "internal_interface.png") });
  if (process.env.BENCHMARK !== "0") {
    await page.evaluate(() => {
      const o = __lab.view.objects.at(-1);
      __lab.beginMouse(o, __lab.view.toScreen(o.target));
      let start = performance.now();
      function animate(t) {
        if (!__lab.metrics.current) return;
        __lab.move(
          o,
          { x: 2.2 + Math.sin((t - start) / 1200) * 0.18, y: 0.3, z: 0 },
          0,
          0,
          0,
        );
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      __lab.metrics.begin(performance.now(), {
        version: "3.2.0",
        input_source:
          "Y4M loop of static reference hands; not physical gestures",
        physical_camera_tested: false,
        backend: __lab.capture.delegate,
        camera: __lab.capture.cameraReport(),
        physics: "Rapier 0.17.3 / 120 Hz / 5 bodies",
        viewport: { width: innerWidth, height: innerHeight },
        environment: "Chromium headless / SwiftShader",
        moving_body: "programmatic hand target; other four bodies dynamic",
      });
    });
    await page.waitForFunction(() => __lab.metrics.lastReport?.complete, null, {
      timeout: 70000,
    });
    const result = await page.evaluate(() => ({
      ...__lab.metrics.lastReport,
      physics_last_frame_ms: __lab.view.physics.lastStepCost,
      physics_steps: __lab.view.physics.totalSteps,
    }));
    await writeFile(
      path.join(out, "benchmark.json"),
      JSON.stringify(result, null, 2),
    );
    check(
      "60-second webcam-fixture + MediaPipe + Three.js + Rapier measurement",
      result,
    );
  }
  await page.locator("#stop-camera").click();
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => __lab.capture.running), false);
  check("Camera stop");
  assert.deepEqual(errors, []);
  const remote = [...requests].filter(
    (u) => !u.startsWith("http://127.0.0.1:8768/") && !u.startsWith("blob:"),
  );
  assert.deepEqual(remote, []);
  check("No page errors and no remote runtime dependencies");
} catch (e) {
  await writeFile(
    path.join(out, "browser_failure.json"),
    JSON.stringify({ error: String(e), errors, checks }, null, 2),
  );
  throw e;
} finally {
  await writeFile(
    path.join(out, "browser_checks.json"),
    JSON.stringify(
      { checks, page_errors: errors, physical_camera_tested: false },
      null,
      2,
    ),
  );
  await browser?.close();
  server.kill();
}
