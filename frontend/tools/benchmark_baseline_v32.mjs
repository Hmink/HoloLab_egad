/** Compare V3.1 on the same host/fixture, manually requesting HD to match V3.2. */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const root = process.env.BASELINE_PROJECT;
if (!root) throw Error("BASELINE_PROJECT must point to an extracted V3.1");
const server = spawn(
  process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"),
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8771"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((r, j) => {
  server.stdout.on("data", (b) => b.toString().includes("http://") && r());
  server.on("exit", (c) => j(Error("server " + c)));
});
let browser;
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
  await page.goto("http://127.0.0.1:8771/?test");
  await page.waitForFunction(() => window.__lab);
  await page.evaluate(() => {
    const q = document.querySelector("#quality");
    q.value = "1";
    q.dispatchEvent(new Event("change"));
  });
  await page.locator("#start-camera").click();
  await page.waitForFunction(() => __lab.metrics.tracking.length > 5, null, {
    timeout: 60000,
  });
  await page.evaluate(async () => {
    const t = document.querySelector("#camera").srcObject.getVideoTracks()[0];
    await t.applyConstraints({
      width: { exact: 1280 },
      height: { exact: 720 },
      frameRate: { ideal: 60, max: 60 },
    });
    __lab.clearDesk();
    for (const [i, id] of [
      "beaker",
      "flask",
      "cuso4",
      "naoh",
      "tube",
    ].entries())
      __lab.createObject(id, {
        x: (i - 2) * 1.1,
        y: id === "beaker" ? -1.08 : id === "tube" ? -0.95 : -1.04,
        z: 0,
      });
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const start = performance.now(),
      o = __lab.view.objects.at(-1);
    function animate(t) {
      if (!__lab.metrics.current) return;
      o.target = { x: 2.2 + Math.sin((t - start) / 1200) * 0.18, y: 0.3, z: 0 };
      requestAnimationFrame(animate);
    }
    __lab.metrics.begin(start, {
      version: "3.1.0",
      input_source: "Y4M loop of static reference hands; not physical gestures",
      environment: "Chromium headless / SwiftShader",
      physical_camera_tested: false,
      backend: __lab.capture.delegate,
      camera_settings: Object.fromEntries(
        Object.entries(
          document
            .querySelector("#camera")
            .srcObject.getVideoTracks()[0]
            .getSettings(),
        ).filter(([k]) => !["deviceId", "groupId"].includes(k)),
      ),
      inference_width: __lab.capture.inferenceWidth,
      viewport: { width: innerWidth, height: innerHeight },
      objects: 5,
      moving_body: "programmatic hand target",
      dpr: __lab.view.pixelRatio,
    });
    requestAnimationFrame(animate);
  });
  await page.waitForFunction(() => __lab.metrics.lastReport?.complete, null, {
    timeout: 70000,
  });
  const b = await page.evaluate(() => __lab.metrics.lastReport);
  assert.equal(b.complete, true);
  await writeFile(process.env.BASELINE_OUTPUT, JSON.stringify(b, null, 2));
  console.log(JSON.stringify(b));
} finally {
  await browser?.close();
  server.kill();
}
