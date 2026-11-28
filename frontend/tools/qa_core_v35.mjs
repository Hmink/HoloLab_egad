import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  out = path.join(root, "validation_v35");
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
  const point = await page.evaluate(() => {
    const o=__lab.createObject("beaker",{x:0,y:0,z:0});
    for(let i=0;i<480;i++)__lab.view.physics.step(1/120);
    __lab.view.scene.updateMatrixWorld(true);
    return __lab.view.toScreen(o.group.position);
  });
  const work = await page.locator("#workspace").boundingBox();
  await page.mouse.move(point.x,point.y);
  await page.mouse.down();
  await page.mouse.move(work.x + work.width * 0.4, work.y + work.height * 0.3, {
    steps: 15,
  });
  await page.waitForFunction(() => {
    const o=__lab.view.objects[0];return o.group.position.distanceTo(o.target)<0.01;
  });
  await page.waitForTimeout(250);
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
  await page.waitForFunction(y => __lab.view.objects[0].group.position.y < y - 0.05, before, {timeout:4000});
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
  const physicsAcceptance = await page.evaluate(() => {
    __lab.clearDesk();
    const p = __lab.view.physics,
      dt = 1 / 120;
    const step = (n = 1) => {
      for (let i = 0; i < n; i++) p.step(dt);
    };
    const gap = (e) =>
      p.bounds(e, e.body.rotation(), p.position(e)).min.y - p.table.top;
    const a = __lab.createObject("beaker", { x: -1.5, y: -1.0, z: 0 });
    const b = __lab.createObject("flask", { x: 0, y: -1.0, z: 0 });
    step(600);
    __lab.beginMouse(a, __lab.view.toScreen(a.target));
    let peak = 0,
      penetration = 0;
    for (let i = 0; i < 240; i++) {
      p.setTarget(a, { x: 2.2, y: -1.0, z: 0 });
      step();
      const e = p.entries.get(b.id),
        v = e.body.linvel();
      peak = Math.max(peak, Math.hypot(v.x, v.z));
      penetration = Math.max(penetration, -gap(e));
    }
    __lab.endMouse();
    if (peak > 0.66 || penetration > 0.005)
      throw Error(
        "real-model collision unsafe " + JSON.stringify({ peak, penetration }),
      );
    step(600);
    __lab.clearDesk();
    const o = __lab.createObject("beaker", { x: 0, y: 1, z: 0 }),
      e = p.entries.get(o.id);
    let outside = 0,
      maxThrow = 0,
      maxGapBelow = 0,
      screenOutside = 0;
    const l = p.limits;
    for (const target of [
      { x: -30, y: 1, z: 0 },
      { x: 30, y: 1, z: 0 },
      { x: 0, y: 1, z: -30 },
      { x: 0, y: 1, z: 30 },
    ]) {
      __lab.beginMouse(o, __lab.view.toScreen(o.target));
      p.setTarget(o, target, 0.8, 0.3, 0.2);
      step(160);
      __lab.endMouse();
      const v = e.body.linvel();
      maxThrow = Math.max(maxThrow, Math.hypot(v.x, v.y, v.z));
      for (let i = 0; i < 360; i++) {
        step();
        const bound = p.bounds(e, e.body.rotation(), p.position(e));
        outside = Math.max(
          outside,
          l.xMin - bound.min.x,
          bound.max.x - l.xMax,
          l.zMin - bound.min.z,
          bound.max.z - l.zMax,
          bound.max.y - l.top,
        );
        maxGapBelow = Math.max(maxGapBelow, -gap(e));
        if (i % 60 === 0)
          for (const x of [bound.min.x, bound.max.x])
            for (const y of [bound.min.y, bound.max.y])
              for (const z of [bound.min.z, bound.max.z]) {
                const s = __lab.view.toScreen({ x, y, z }),
                  r = __lab.view.rect;
                screenOutside = Math.max(
                  screenOutside,
                  r.left - s.x,
                  s.x - r.right,
                  r.top - s.y,
                  s.y - r.bottom,
                );
              }
      }
    }
    if (
      outside > 0.005 ||
      maxGapBelow > 0.005 ||
      maxThrow > 0.401 ||
      screenOutside > 1
    )
      throw Error(
        "boundary failure " +
          JSON.stringify({ outside, maxGapBelow, maxThrow, screenOutside }),
      );
    const ordinaryRecoveries = p.recoveryCount;
    // Fault injection is deliberately separated from normal interaction evidence.
    e.body.setTranslation({ x: 5, y: 0, z: 0 }, true);
    p.recover(e);
    const recovery = p.position(e),
      faultRecovered =
        p.recoveryCount === ordinaryRecoveries + 1 && recovery.x < l.xMax;
    if (!faultRecovered) throw Error("fault recovery failed");
    __lab.beginMouse(o, __lab.view.toScreen(o.target));
    const before = p.position(e);
    p.setWorkspace({ ...l, xMin: l.xMin + 0.3, xMax: l.xMax - 0.3 });
    const after = p.position(e);
    const resizeJump = Math.hypot(
      before.x - after.x,
      before.y - after.y,
      before.z - after.z,
    );
    if (resizeJump > 1e-6) throw Error("resize teleported held tool");
    __lab.endMouse();
    step(1);
    return {
      peak_contact_horizontal_m_s: peak,
      max_penetration_scene: Math.max(penetration, maxGapBelow),
      max_throw_m_s: maxThrow,
      max_outside_scene: outside,
      max_projected_outside_px: screenOutside,
      ordinary_recoveries: ordinaryRecoveries,
      fault_recovered: faultRecovered,
      held_resize_jump: resizeJump,
    };
  });
  check(
    "V3.3 production mesh: fast contact, four physical boundaries, projection, safe fault recovery, no held resize teleport",
    physicsAcceptance,
  );
  const design = await page.evaluate(async () => {
    await document.fonts.ready;
    const bad = [];
    __lab.clearDesk();
    const snapshots = [];
    for (const [i, id] of [
      "beaker",
      "flask",
      "tube",
      "hcl",
      "dropper",
      "balance",
    ].entries()) {
      const o = __lab.createObject(id, { x: (i - 2.5) * 0.95, y: -0.8, z: 0 }),
        e = __lab.view.physics.entries.get(o.id);
      snapshots.push({
        id: stockId(o),
        scale: o.group.scale.x,
        colliders: e.colliders.length,
        physical: !!e.body,
        mouth_y: o.mouthY ?? null,
        liquid: !!o.liquid,
      });
      const grad = o.group.children.find(
        (n) => n.name === "vessel-visual-details",
      )?.userData.graduations;
      if (grad)
        for (const mark of grad) {
          const g = __lab.view.liquidGeometry(
            o.stock.kind,
            mark.ml / o.stock.capacity_ml,
          );
          g.computeBoundingBox();
          if (Math.abs(g.boundingBox.max.y - mark.level) > 0.001)
            bad.push(id + ":graduation");
          g.dispose();
        }
      function stockId(o) {
        return o.stock.id;
      }
      if (o.group.scale.x !== 0.67 || !e.colliders.length) bad.push(id);
    }
    for (let i = 0; i < 600; i++) __lab.view.physics.step(1 / 120);
    const selected = __lab.view.objects.at(-1);
    const glass = __lab.view.glass.type;
    return {
      font: getComputedStyle(document.body).fontFamily,
      fontLoaded: document.fonts.check('400 14px "Be Vietnam Pro"'),
      glass,
      cameraFit: getComputedStyle(document.querySelector("#camera")).objectFit,
      technicalClosed: !document.querySelector("#settings").open,
      snapshots,
      bad,
      renderCalls: __lab.view.renderer.info.render.calls,
      triangles: __lab.view.renderer.info.render.triangles,
    };
  });
  assert.ok(design.fontLoaded);
  assert.equal(design.glass, "MeshPhysicalMaterial");
  assert.deepEqual(design.bad, []);
  assert.ok(design.technicalClosed);
  check(
    "Bundled Vietnamese fonts, collapsed diagnostics, PBR glass, tool IDs/pivots/colliders retained",
    design,
  );
  await page.screenshot({ path: path.join(out, "internal_design_v33.png") });

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
  await page.evaluate(() => document.querySelector("#extra-tools").open=true);
  await page.locator("#titration-mode").click();
  await page.locator("#t-drop").click();
  assert.equal(await page.locator("#t-used").textContent(), "0.05 mL");
  await page.locator("#titration-mode").click();
  check("Preserved titration scene and microdose");
  await page.evaluate(() => document.querySelector("#practice-options").open=true);
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
  await page.evaluate(() => {
    const receive = __lab.capture.onResult;
    __lab.capture.onResult = (data) => {
      __lab.testInputShape = { width: data.width, height: data.height };
      receive(data);
    };
  });
  await page.waitForFunction(
    () =>
      __lab.testInputShape?.width === 640 &&
      __lab.testInputShape?.height === 360,
    null,
    { timeout: 30000 },
  );
  if (process.env.CAMERA_FIXTURE) await page.waitForFunction(
    () => __lab.metrics.tracking.some((t) => t.hands > 0),
    null,
    { timeout: 30000 },
  );
  const preview = await page.evaluate(() => ({
    cv_input: __lab.testInputShape,
    fit: getComputedStyle(document.querySelector("#camera")).objectFit,
    mirror: getComputedStyle(document.querySelector("#camera")).transform,
    tracking: __lab.metrics.tracking.at(-1),
  }));
  assert.equal(preview.fit, "contain");
  assert.ok(preview.mirror.includes("-1"));
  assert.ok(preview.tracking);
  if (process.env.CAMERA_FIXTURE) assert.ok(preview.tracking.hands > 0);
  check(
    "Mirror/aspect and real MediaPipe input pipeline; synthetic test pattern has no hands",
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
  if (process.env.BENCHMARK === "1") {
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
        version: "3.5.0",
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
