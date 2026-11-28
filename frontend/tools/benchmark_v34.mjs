/** Same-host before/after benchmark. Software GL + prerecorded still-frame loop, NOT physical webcam. */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const root = path.resolve(process.env.BENCH_PROJECT || "."),
  out = process.env.BENCH_OUTPUT;
if (!out || !process.env.CAMERA_FIXTURE)
  throw Error("Set BENCH_OUTPUT and CAMERA_FIXTURE");
const server = spawn(
  process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"),
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8774"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((r, j) => {
  server.stdout.on("data", (b) => b.toString().includes("http://") && r());
  server.on("exit", (c) => j(Error("server " + c)));
});
let browser;
const errors = [];
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
      "--use-file-for-fake-video-capture=" + process.env.CAMERA_FIXTURE,
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8774/?test");
  await page.waitForFunction(() => window.__lab);
  await page.addStyleTag({
    content:
      "#workspace{width:1024px!important;height:420px!important;min-height:420px!important;flex:0 0 420px!important}",
  });
  await page.evaluate(() => {
    const el = document.querySelector("#quality");
    el.value = "1";
    el.dispatchEvent(new Event("change"));
    document.querySelector("#camera-auto").checked = false;
    __lab.capture.autoCameraQuality = false;
  });
  await page.locator("#start-camera").click();
  await page.waitForFunction(() => __lab.metrics.tracking.length > 5, null, {
    timeout: 60000,
  });
  await page.evaluate(async (lessonId) => {
    await __lab.capture.applyCameraQuality("HD");
    __lab.clearDesk();
    if (lessonId) {
      __lab.lessons.start(lessonId);
      return;
    }
    for (const [i, id] of [
      "beaker",
      "flask",
      "cuso4",
      "naoh",
      "tube",
    ].entries())
      __lab.createObject(id, { x: (i - 2) * 1.1, y: -1.0, z: 0 });
  }, process.env.BENCH_LESSON || null);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const p = __lab.view.physics;
    __lab.benchStable = __lab.view.objects
      .slice(0, -1)
      .map((o) => ({ id: o.id, pos: { ...o.target } }));
    const o = __lab.view.objects.at(-1);
    __lab.beginMouse(o, __lab.view.toScreen(o.target));
    const start = performance.now();
    __lab.metrics.begin(start, {
      version: document.title,
      input_source: "Y4M 1280x720@30 still-photo loop; not physical gestures",
      physical_camera_tested: false,
      environment: "Chromium 134 headless / SwiftShader / WebCPU",
      backend: __lab.capture.delegate,
      camera: __lab.capture.cameraReport(),
      viewport: { width: innerWidth, height: innerHeight },
      render_surface: {
        width: __lab.view.rect.width,
        height: __lab.view.rect.height,
      },
      dpr: __lab.view.pixelRatio,
      objects: __lab.view.objects.length,
      lesson: __lab.lessons?.model?.lesson.id || null,
      moving_body: "one programmatic target; other bodies untouched",
    });
    const animate = (t) => {
      if (!__lab.metrics.current) return;
      __lab.move(
        o,
        {
          x:
            (__lab.lessons?.active ? -2.2 : 2.2) +
            Math.sin((t - start) / 1200) * 0.18,
          y: 0.3,
          z: 0,
        },
        0,
        0,
        0,
      );
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
  await page.waitForFunction(() => __lab.metrics.lastReport?.complete, null, {
    timeout: 70000,
  });
  const report = await page.evaluate(() => {
    const stable = __lab.benchStable.map(({ id, pos }) => {
      const o = __lab.view.objects.find((o) => o.id === id),
        e = __lab.view.physics.entries.get(id);
      return {
        id,
        drift_scene: Math.hypot(
          o.target.x - pos.x,
          o.target.y - pos.y,
          o.target.z - pos.z,
        ),
        sleeping: e.body.isSleeping(),
      };
    });
    return {
      ...__lab.metrics.lastReport,
      untouched_bodies_60s: stable,
      recovery_count: __lab.view.physics.recoveryCount ?? null,
      camera_final: __lab.capture.cameraReport(),
      physical_camera_tested: false,
    };
  });
  report.page_errors = errors;
  assert.deepEqual(errors, []);
  await writeFile(out, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify({
      output: out,
      render_fps: report.render_fps,
      tracking_hz: report.tracking_hz,
      physics_cpu_ms: report.physics_cpu_mean_ms,
      rest: report.untouched_bodies_60s,
    }),
  );
} finally {
  await browser?.close();
  server.kill();
}
