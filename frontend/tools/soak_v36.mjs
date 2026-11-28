/** Real wall-clock endurance run. Fake camera + real MediaPipe/Rapier/WebGL.
 * Programmatic object movement is NOT a human hand or physical webcam test.
 * Default: 30 minutes. SOAK_MINUTES allows a shorter harness smoke check.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.resolve(process.env.QA_OUTPUT || path.join(root, "validation_v36"));
await mkdir(out, { recursive: true });
const minutes = Number(process.env.SOAK_MINUTES || 30);
assert.ok(Number.isFinite(minutes) && minutes >= 1);
const { chromium } = await import(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const server = spawn(process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"),
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8796"], { cwd: root });
server.stderr.on("data", () => {});
await new Promise((resolve, reject) => {
  server.stdout.on("data", b => b.toString().includes("http://") && resolve());
  server.on("exit", code => reject(Error("server " + code)));
});
let browser;
const errors = [], samples = [];
let start = null;
try {
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--enable-unsafe-swiftshader",
    "--use-gl=angle", "--use-angle=swiftshader", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("http://127.0.0.1:8796/?test");
  await page.waitForFunction(() => window.__lab);
  await page.evaluate(() => {
    __lab.capture.autoCameraQuality = false;
    const quality = document.getElementById("quality");
    quality.value = "0.75";
    quality.dispatchEvent(new Event("change"));
  });
  await page.locator("#start-camera").click();
  await page.waitForFunction(() => __lab.metrics.tracking.length > 1, null, { timeout: 60000 });
  await page.evaluate(() => {
    window.soak = { frames: 0, track: 0, frameCost: 0, physicsCost: 0, cycles: 0 };
    const originalRender = __lab.metrics.render.bind(__lab.metrics);
    __lab.metrics.render = (t, cost, physicsCost) => {
      soak.frames++; soak.frameCost += cost; soak.physicsCost += physicsCost;
      return originalRender(t, cost, physicsCost);
    };
    const originalTrack = __lab.metrics.track.bind(__lab.metrics);
    __lab.metrics.track = (t, data) => { soak.track++; return originalTrack(t, data); };
    window.prepareCycle = async () => {
      __lab.endMouse(); __lab.clearDesk();
      const oxidizer = __lab.createObject("oxidizer_risk", { x: -2, y: 0, z: 0 });
      const fuel = __lab.createObject("fuel_risk", { x: 2, y: 0, z: 0 });
      await __lab.pour(oxidizer, fuel, true, 2);
    };
    window.moveCycle = () => {
      __lab.clearDesk();
      ["beaker", "flask", "water", "tube", "dropper"].forEach((stock, i) =>
        __lab.createObject(stock, { x: (i - 2) * 1.1, y: 0.5, z: 0 }));
      const item = __lab.view.objects[0];
      __lab.beginMouse(item, __lab.view.toScreen(item.target));
      __lab.move(item, { x: -1.8, y: 0.8, z: 0.3 }, 0.8, 0, 0);
      soak.cycles++;
    };
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  start = Date.now();
  for (let minute = 0; minute < minutes; minute++) {
    const intervalStart = Date.now();
    await page.evaluate(() => prepareCycle());
    await page.waitForTimeout(1500);
    await page.evaluate(() => moveCycle());
    await page.waitForTimeout(1500);
    await page.evaluate(() => __lab.endMouse());
    // Each wait is < 60 s; the tool session can be polled during the full run.
    const remaining = Math.max(0, 60000 - (Date.now() - intervalStart));
    if (remaining) await page.waitForTimeout(remaining);
    const state = await page.evaluate(() => {
      const physics = __lab.view.physics;
      const bodies = [...physics.entries.values()].map(entry => {
        const position = physics.position(entry), bounds = physics.bounds(entry, entry.body.rotation(), position);
        return { id: entry.item.id, finite: [position.x, position.y, position.z].every(Number.isFinite),
          penetration: Math.max(0, physics.table.top - bounds.min.y), sleeping: entry.body.isSleeping() };
      });
      return { ...soak, running: __lab.capture.running, fault: __lab.capture.fault,
        camera: __lab.capture.cameraReport(), gpuResources: { ...__lab.view.renderer.info.memory },
        programs: __lab.view.renderer.info.programs.length, effects: __lab.view.effects.length,
        objects: __lab.view.objects.length, recoveryCount: physics.recoveryCount,
        liquidError: __lab.liquids.lastError || null, bodies };
    });
    const perf = await cdp.send("Performance.getMetrics");
    const raw = Object.fromEntries(perf.metrics.map(m => [m.name, m.value]));
    const previous = samples.at(-1);
    const elapsed = (Date.now() - start) / 1000;
    const duration = elapsed - (previous?.elapsedSeconds || 0);
    const row = { minute: minute + 1, elapsedSeconds: elapsed, ...state,
      renderFPS: (state.frames - (previous?.frames || 0)) / duration,
      trackingHz: (state.track - (previous?.track || 0)) / duration,
      jsHeapUsedBytes: raw.JSHeapUsedSize ?? null, jsHeapTotalBytes: raw.JSHeapTotalSize ?? null,
      rendererTaskSeconds: raw.TaskDuration ?? null };
    samples.push(row);
    await writeFile(path.join(out, "soak-progress.json"), JSON.stringify({ samples, errors }, null, 2));
    assert.ok(state.running && !state.fault, "camera pipeline stopped");
    assert.ok(row.trackingHz > 0 && row.renderFPS > 0, "render or inference stopped making progress");
    assert.equal(state.objects, 5);
    assert.ok(state.bodies.every(b => b.finite && b.penetration < 0.01), "invalid body or penetration");
    assert.equal(state.liquidError, null);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ minute: row.minute, fps: row.renderFPS, hz: row.trackingHz,
      gpuResources: row.gpuResources, heapMB: row.jsHeapUsedBytes / 1e6 }));
  }
  const workerClosed = Promise.all(page.workers().map(worker => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Worker did not close")), 10000);
    worker.on("close", () => {clearTimeout(timer); resolve();});
  })));
  const shutdown = await page.evaluate(() => {
    const tracks = __lab.capture.video.srcObject.getTracks();
    __lab.capture.close();
    return {running: __lab.capture.running, workerCleared: __lab.capture.worker === null,
      allVideoTracksEnded: tracks.every(track => track.readyState === "ended")};
  });
  await workerClosed;
  assert.deepEqual(shutdown, {running: false, workerCleared: true, allVideoTracksEnded: true});
  await writeFile(path.join(out, "soak.json"), JSON.stringify({
    complete: true, requiredMinutes: 30, durationSeconds: (Date.now() - start) / 1000,
    meets30Minutes: (Date.now() - start) >= 1800000,
    physicalCameraTested: false, humanHandsTested: false,
    environment: "Chromium 133 headless SwiftShader; real MediaPipe with synthetic camera; one programmatic movement per minute, engine fire/reset every minute",
    samples, errors, shutdown,
  }, null, 2));
} catch (error) {
  await writeFile(path.join(out, "soak-failure.json"), JSON.stringify({ complete: false,
    error: String(error), durationSeconds: start ? (Date.now() - start) / 1000 : 0, samples, errors }, null, 2));
  throw error;
} finally {
  await browser?.close(); server.kill();
}
