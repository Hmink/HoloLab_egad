import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  out = path.join(root, "validation_v31");
const { chromium } = await import(
  process.env.PLAYWRIGHT_PACKAGE || "playwright"
);
const server = spawn(
  "python3",
  ["-S", "server.py", "--no-browser", "--browser-tracking", "--port", "8767"],
  { cwd: root },
);
server.stderr.on("data", () => {});
await new Promise((resolve, reject) => {
  server.stdout.on(
    "data",
    (b) => b.toString().includes("http://") && resolve(),
  );
  server.on("exit", (c) => reject(Error("server " + c)));
});
let browser;
const errors = [],
  checks = [];
const check = (name, data = {}) => {
  checks.push({ name, passed: true, ...data });
  console.log("PASS", name);
};
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
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
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8767/?test");
  await page.waitForFunction(() => window.__lab);
  check("WebGL startup and local chemistry API");
  await page.locator("#sidebar-toggle").click();
  assert.equal(await page.locator("#inventory").isVisible(), false);
  await page.locator("#sidebar-toggle").click();
  check("Sidebar collapse/expand");
  const card = await page.locator('[data-stock="beaker"]').boundingBox(),
    work = await page.locator("#workspace").boundingBox();
  await page.mouse.move(card.x + 30, card.y + 30);
  await page.mouse.down();
  await page.mouse.move(work.x + work.width * 0.3, work.y + work.height * 0.5, {
    steps: 8,
  });
  await page.mouse.up();
  assert.equal(await page.evaluate(() => __lab.view.objects.length), 1);
  check("Existing inventory mouse drag/drop");
  await page.locator("#titration-mode").click();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => __lab.bench.active), true);
  assert.equal(await page.locator("#t-ph").textContent(), "1.00");
  await page.locator("#t-drop").click();
  assert.equal(await page.locator("#t-used").textContent(), "0.05 mL");
  check("Titration mode and measured microdose");
  const synthetic = await page.evaluate(() => {
    const b = __lab.bench;
    const p = b.valvePoint,
      m = __lab.interaction.margin;
    const tr = {
      id: 991,
      slot: 0,
      observed: true,
      ambiguous: false,
      pose: {
        x: m + (p.x / innerWidth) * (1 - 2 * m),
        y: m + (p.y / innerHeight) * (1 - 2 * m),
        ratio: 0.9,
        angle: 0,
      },
    };
    b.process([tr], 0, performance.now(), m);
    tr.pose.ratio = 0.2;
    for (let t = 20; t < 160; t += 20) b.process([tr], t, performance.now(), m);
    tr.pose.angle = -Math.PI / 4;
    b.process([tr], 180, performance.now(), m);
    const opened = b.model.open;
    tr.observed = false;
    b.process([tr], 200, performance.now(), m);
    return { opened, afterLoss: b.model.open };
  });
  assert.ok(synthetic.opened > 0.4);
  assert.equal(synthetic.afterLoss, 0);
  check(
    "Synthetic pinch/wrist opens valve; missing observation closes it",
    synthetic,
  );
  await page.evaluate(() => {
    __lab.bench.model.add(24.95);
    __lab.bench.refresh();
  });
  assert.equal(await page.locator("#t-ph").textContent(), "7.00");
  await page.evaluate(() => {
    __lab.bench.model.add(0.3);
    __lab.bench.refresh();
  });
  assert.ok(Number(await page.locator("#t-ph").textContent()) > 10);
  check("Equivalence pH 7 and base excess / indicator");
  await page.locator("#titration-panel summary").click();
  await page.locator("#t-acid").selectOption("CH3COOH");
  await page.locator("#t-reset").click();
  assert.ok(Number(await page.locator("#t-ph").textContent()) > 2.8);
  await page.locator("#titration-panel summary").click();
  check("Weak-acid sample reset");
  await page.locator("#reaction-library").click();
  assert.equal(await page.locator("#reaction-select option").count(), 100);
  await page.locator("#reaction-calculate").click();
  assert.match(
    await page.locator("#reaction-result").textContent(),
    /Chưa xác nhận/,
  );
  await page.locator("#reaction-condition").check();
  await page.locator("#reaction-calculate").click();
  assert.match(
    await page.locator("#reaction-result").textContent(),
    /Chất giới hạn/,
  );
  await page.locator("#reactions-close").click();
  check("100-reaction UI, conditions and product quantities");
  await page.screenshot({ path: path.join(out, "internal_titration.png") });
  await page.locator("#titration-mode").click();
  assert.equal(
    await page.evaluate(() => __lab.view.objects[0].group.visible),
    true,
  );
  check("Return to preserved free-desk objects");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(200);
  const layout = await page.evaluate(() => ({
    camera: document.querySelector("#camera").getBoundingClientRect().toJSON(),
    workspace: document
      .querySelector("#workspace")
      .getBoundingClientRect()
      .toJSON(),
  }));
  assert.ok(layout.camera.bottom < layout.workspace.top);
  check("Small mirrored camera above workspace at 1280x720", layout);
  await page.locator("#start-camera").click();
  await page.waitForFunction(() => __lab.metrics.tracking.length > 10, null, {
    timeout: 60000,
  });
  const capture = await page.evaluate(() => ({
    delegate: __lab.capture.delegate,
    frames: __lab.metrics.tracking.length,
    hands: __lab.metrics.tracking.at(-1).hands,
    maxHz: __lab.capture.maxHz,
    width: __lab.capture.inferenceWidth,
  }));
  check("Real MediaPipe worker on synthetic camera pixels", capture);
  await page.locator("#titration-mode").click();
  await page.evaluate(() =>
    __lab.metrics.begin(performance.now(), {
      version: "3.1.0",
      input_source: "looped still reference photo; not real gestures",
      backend: __lab.capture.delegate,
      environment: "headless Chromium / SwiftShader",
      titration: true,
      width: innerWidth,
      height: innerHeight,
    }),
  );
  await page.waitForFunction(() => __lab.metrics.lastReport?.complete, null, {
    timeout: 70000,
  });
  const report = await page.evaluate(() => __lab.metrics.lastReport);
  await writeFile(
    path.join(out, "benchmark_v31.json"),
    JSON.stringify(report, null, 2),
  );
  check("60-second full pipeline benchmark", report);
  await page.locator("#stop-camera").click();
  await page.waitForTimeout(300);
  check("Camera stop");
  assert.deepEqual(errors, []);
  check("No browser JS errors");
} finally {
  await mkdir(out, { recursive: true });
  await writeFile(
    path.join(out, "browser_checks.json"),
    JSON.stringify({ checks, errors, physical_camera_tested: false }, null, 2),
  );
  await browser?.close();
  server.kill();
}
