/** Real browser + real MediaPipe. Camera pixels come from an explicit Y4M fixture.
 * Gesture replay below is SYNTHETIC; it cannot validate physical-hand accuracy.
 * env: PLAYWRIGHT_PACKAGE, CAMERA_FIXTURE, VIDEO_FIXTURE(optional), PYTHON(optional).
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "validation");
await mkdir(output, { recursive: true });
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const cameraFile = process.env.CAMERA_FIXTURE;
if (!cameraFile)
  throw Error(
    "Set CAMERA_FIXTURE to an absolute Y4M path. No physical-camera assumption.",
  );
const server = spawn(
  process.env.PYTHON || "python",
  [
    ...(process.env.NATIVE_TRACKING === "1" ? [] : ["-S"]),
    "server.py",
    "--no-browser",
    "--port",
    "8765",
  ],
  { cwd: root },
);
server.stderr.on("data", (b) => process.stderr.write(b));
await new Promise((resolve, reject) => {
  server.stdout.on("data", (b) => {
    if (b.toString().includes("http://")) resolve();
  });
  server.on("error", reject);
  server.on("exit", (c) => reject(Error("server exited " + c)));
});
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    "--use-file-for-fake-video-capture=" + cameraFile,
  ],
});
const checks = [],
  errors = [],
  requests = new Set();
const check = (name, details = {}) => {
  checks.push({ name, passed: true, ...details });
  console.log("PASS", name);
};
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  context.on("request", (r) => requests.add(r.url()));
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/?test");
  await page.waitForFunction(() => window.__lab, { timeout: 45000 });
  const card = await page.locator('[data-stock="beaker"]').boundingBox();
  await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2);
  await page.mouse.down();
  await page.mouse.move(760, 400, { steps: 15 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  let state = await page.evaluate(() => __lab.state());
  assert.equal(state.objects.length, 1);
  const position = await page.evaluate(() =>
    __lab.view.toScreen(__lab.view.objects[0].target),
  );
  assert.ok(Math.abs(position.x - 760) < 2 && Math.abs(position.y - 400) < 2);
  check("mouse inventory -> 3D drag and release");
  await page.keyboard.press("a");
  await page.keyboard.press("j");
  await page.keyboard.press("k");
  const orientation = await page.evaluate(() => {
    const o = __lab.view.objects[0];
    return { roll: o.roll, yaw: o.yaw, sealed: o.sealed, cap: o.cap.visible };
  });
  assert.ok(
    orientation.roll > 0 &&
      orientation.yaw > 0 &&
      orientation.sealed &&
      orientation.cap,
  );
  check("tilt, yaw and cap controls");
  await page.evaluate(async () => {
    const saved = __lab.session();
    await __lab.loadSession(saved);
    if (
      JSON.stringify(__lab.session().objects) !== JSON.stringify(saved.objects)
    )
      throw Error("roundtrip mismatch");
    const before = JSON.stringify(__lab.session());
    try {
      await __lab.loadSession({
        schema: "hololab3-session-1",
        objects: [{ stock: "invalid" }],
      });
      throw Error("bad session accepted");
    } catch (e) {
      if (e.message === "bad session accepted") throw e;
    }
    if (before !== JSON.stringify(__lab.session()))
      throw Error("invalid load mutated scene");
  });
  check("save/load round-trip and rejected import leaves scene unchanged");
  const chemistry = await page.evaluate(async () => {
    __lab.clearDesk();
    const a = __lab.createObject("hcl", { x: -1, y: 0, z: 0 }),
      b = __lab.createObject("naoh", { x: 1, y: 0, z: 0 });
    await __lab.pour(a, b, true);
    return { a: a.mixture, b: b.mixture };
  });
  assert.equal(chemistry.a.volume_ml, 90);
  assert.equal(chemistry.b.volume_ml, 110);
  assert.ok(chemistry.b.temperature_K > 298.15);
  assert.ok(chemistry.b.mol.OH_minus < 0.01);
  check("neutralization through HTTP adapter: volume, amount and heat");
  await page.click("#risk-mode");
  const risk = await page.evaluate(async () => {
    __lab.clearDesk();
    const a = __lab.createObject("water", { x: -1, y: 0, z: 0 }),
      b = __lab.createObject("acid_risk", { x: 1, y: 0, z: 0 });
    const before = JSON.stringify(__lab.session().objects);
    await __lab.pour(a, b, true);
    return before === JSON.stringify(__lab.session().objects);
  });
  assert.ok(risk);
  check("guided-mode hazardous transfer is atomic and blocked");
  await page.click("#risk-mode");
  const qualitative = await page.evaluate(async () => {
    const [a, b] = __lab.view.objects;
    await __lab.pour(a, b, true);
    return {
      temp: b.mixture.temperature_K,
      qualitative: b.mixture.qualitative,
      effects: __lab.view.effects.length,
    };
  });
  assert.equal(qualitative.temp, null);
  assert.ok(qualitative.qualitative && qualitative.effects > 0);
  check("free-mode qualitative hazard animation retained");
  // Production raycaster + ownership + pose controller; observations are synthetic.
  const gestures = await page.evaluate(async () => {
    __lab.clearDesk();
    const a = __lab.createObject("beaker", { x: -1.3, y: 0, z: 0 }),
      b = __lab.createObject("flask", { x: 1.3, y: 0, z: 0 });
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
    const asPose = (o, label, palm) => {
      const p = __lab.view.toScreen(o.target),
        x = 0.035 + (p.x / innerWidth) * 0.93,
        y = 0.035 + (p.y / innerHeight) * 0.93;
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
    const pa = asPose(a, "Left", 0.15),
      pb = asPose(b, "Right", 0.06);
    async function send(rows, n = 1) {
      for (let i = 0; i < n; i++) {
        await new Promise((r) => setTimeout(r, 36));
        __lab.replay(structuredClone(rows), performance.now());
      }
    }
    await send([pa, pb], 6);
    pa.ratio = pb.ratio = 0.2;
    await send([pa, pb], 5);
    const owners = __lab.state().hands.map((h) => h.object);
    if (owners[0] !== a.id || owners[1] !== b.id)
      throw Error("two-hand raycast grab failed " + JSON.stringify(owners));
    for (let i = 0; i < 12; i++) {
      pa.x += 0.003;
      pa.center.x = pa.x;
      pb.x -= 0.002;
      pb.center.x = pb.x;
      await send(i % 2 ? [pb, pa] : [pa, pb]);
    }
    const before = [{ ...a.target }, { ...b.target }];
    await send([], 6);
    if (
      __lab.interaction.owners(a).length !== 1 ||
      __lab.interaction.owners(b).length !== 1
    )
      throw Error("lost ownership during gap");
    pa.x += 0.03;
    pa.center.x = pa.x;
    pb.x -= 0.02;
    pb.center.x = pb.x;
    await send([pa, pb]);
    const jump = Math.max(
      ...[a, b].map((o, i) =>
        Math.hypot(
          o.target.x - before[i].x,
          o.target.y - before[i].y,
          o.target.z - before[i].z,
        ),
      ),
    );
    if (jump > 1e-7) throw Error("recovery target jump " + jump);
    pa.ratio = pb.ratio = 0.9;
    await send([pa, pb], 6);
    if (
      __lab.interaction.owners(a).length ||
      __lab.interaction.owners(b).length
    )
      throw Error("release failed");
    return {
      grab_ids: owners,
      recovery_jump_world_units: jump,
      events: __lab.interaction.events.slice(-12),
    };
  });
  check(
    "synthetic two-hand raycast, independent ownership, movement, dropout, release",
    gestures,
  );
  await page.locator("#settings summary").click();
  await page.click("#view-mode");
  assert.equal(await page.evaluate(() => __lab.view.controls.enabled), true);
  await page.click("#view-mode");
  assert.equal(await page.evaluate(() => __lab.view.controls.enabled), false);
  check("OrbitControls exclusive mode");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(200);
  assert.ok(
    await page.evaluate(
      () =>
        Math.abs(
          __lab.view.camera.aspect -
            __lab.view.rect.width / __lab.view.rect.height,
        ) < 1e-8,
    ),
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(200);
  check("viewport resize updates camera projection");
  await page.locator("#settings summary").click();
  await page.evaluate(() => {
    __lab.clearDesk();
    for (const [i, id] of [
      "beaker",
      "flask",
      "cuso4",
      "naoh",
      "water",
    ].entries())
      __lab.createObject(id, { x: (i - 2) * 1.2, y: 0, z: 0 });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(output, "interface_1280x800.png") });
  await page.click("#start-camera");
  await page.waitForFunction(
    () => __lab.capture.running || __lab.capture.fault,
    { timeout: 60000 },
  );
  assert.equal(await page.evaluate(() => __lab.capture.fault), false);
  await page.waitForFunction(
    () => __lab.metrics.tracking.some((t) => t.hands === 2),
    { timeout: 30000 },
  );
  check(
    "real MediaPipe identifies two hands from explicit fake-camera pixel fixture",
  );
  await page.click("#stop-camera");
  await page.waitForTimeout(300);
  await page.click("#start-camera");
  await page.waitForFunction(() => __lab.capture.running, { timeout: 30000 });
  await page.waitForTimeout(1000);
  assert.equal(await page.evaluate(() => __lab.capture.fault), false);
  check("stop/restart camera without stale result ownership");
  if (process.env.VIDEO_FIXTURE) {
    await page.locator("#video-file").setInputFiles(process.env.VIDEO_FIXTURE);
    await page.waitForTimeout(4000);
    const videoState = await page.evaluate(() => ({
      running: __lab.capture.running,
      fault: __lab.capture.fault,
      tracked: __lab.metrics.tracking.some((t) => t.hands > 0),
      status: document.querySelector("#message").textContent,
      error: document.querySelector("#camera").error?.message,
    }));
    assert.ok(
      videoState.running && !videoState.fault && videoState.tracked,
      JSON.stringify(videoState),
    );
    check("local video input and monotonic timestamps across looping video");
  }
  await page.waitForTimeout(8000);
  await page.evaluate(() => {
    __lab.interaction.reset();
    __lab.tracks.reset();
    const gl = __lab.view.renderer.getContext(),
      ext = gl.getExtension("WEBGL_debug_renderer_info");
    __lab.metrics.begin(performance.now(), {
      version: "3.0.0",
      input_source: "fake-camera-or-looped-video-from-static-reference-photo",
      physical_camera_test: false,
      synthetic_gesture_benchmark: false,
      real_mediapipe: true,
      delegate: __lab.capture.delegate,
      frame_transport: __lab.capture.frameTransport,
      webgl_renderer: ext
        ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
      width: innerWidth,
      height: innerHeight,
      objects: __lab.view.objects.length,
      initial_dpr: __lab.view.pixelRatio,
      user_agent: navigator.userAgent,
      note_fixture:
        "Two visible hands in a repeated static reference image, not live motion. One vessel moved programmatically.",
    });
    const moving = __lab.view.objects.at(-1),
      initial = moving.target.x,
      start = performance.now();
    function animate(t) {
      if (!__lab.metrics.current) return;
      moving.target.x = initial + Math.sin((t - start) / 1200) * 0.18;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
  for (let i = 0; i < 7; i++) {
    await page.waitForTimeout(10000);
    const progress = await page.evaluate(() => ({
      running: !!__lab.metrics.current,
      fps: __lab.metrics.fps(performance.now()),
      tracking: __lab.metrics.hz(performance.now()),
    }));
    console.log("BENCHMARK", progress);
    if (!progress.running) break;
  }
  const report = await page.evaluate(() => ({
    ...__lab.metrics.lastReport,
    final_dpr: __lab.view.pixelRatio,
    final_objects: __lab.view.objects.length,
    accepted_hand_states: __lab.state().hands,
    worker_fault: __lab.capture.fault,
  }));
  assert.equal(report.complete, true);
  assert.equal(report.worker_fault, false);
  assert.ok(report.detected_samples > 0);
  assert.equal(report.final_objects, 5);
  check("60-second render + real tracking benchmark completed");
  assert.equal(errors.length, 0, JSON.stringify(errors));
  const remote = [...requests].filter(
    (url) =>
      !url.startsWith("http://127.0.0.1:8765/") && !url.startsWith("blob:"),
  );
  assert.deepEqual(remote, []);
  check("runtime requests only localhost; no CDN required");
  const suffix = process.env.NATIVE_TRACKING === "1" ? "native" : "wasm";
  report.input_source=process.env.VIDEO_FIXTURE?'looped-local-WebM-from-static-reference-photo':'fake-camera-Y4M-from-static-reference-photo';
  report.source_sha256=JSON.parse(await readFile(path.join(output,'SOURCE_SHA256.json'),'utf8'));
  await writeFile(
    path.join(output, `benchmark_v3_${suffix}.json`),
    JSON.stringify(report, null, 2),
  );
  await writeFile(
    path.join(output, `browser_checks_${suffix}.json`),
    JSON.stringify(
      {
        checks,
        page_errors: errors,
        remote_requests: remote,
        physical_camera_test: false,
        browser: await browser.version(),
      },
      null,
      2,
    ),
  );
  console.log("RESULT", JSON.stringify(report));
} catch (error) {
  await writeFile(
    path.join(output, "browser_failure.json"),
    JSON.stringify({ checks, errors, error: String(error) }, null, 2),
  );
  throw error;
} finally {
  await browser.close();
  server.kill();
}
