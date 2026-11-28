import test from "node:test";
import assert from "node:assert/strict";
import { HandCapture } from "../web/src/capture.js";
import { Metrics } from "../web/src/metrics.js";

function fixture() {
  const messages = [],
    results = [];
  const video = {
    readyState: 2,
    videoWidth: 1280,
    videoHeight: 720,
    pause() {},
    removeAttribute() {},
  };
  const capture = new HandCapture(
    video,
    (x) => results.push(x),
    () => {},
  );
  capture.running = true;
  capture.worker = { postMessage: (x) => messages.push(x) };
  return { capture, messages, results };
}
test("camera sends at most one inference per unique frame and one in flight", async () => {
  const saved = globalThis.createImageBitmap;
  globalThis.createImageBitmap = async () => ({ close() {} });
  try {
    const { capture: c, messages } = fixture();
    await c.frame(0, 1);
    await c.frame(40, 2);
    assert.equal(messages.length, 1);
    c.busy = false;
    await c.frame(80, 1);
    assert.equal(messages.length, 1);
    await c.frame(120, 2);
    assert.equal(messages.length, 2);
    assert.ok(messages[1].timestamp > messages[0].timestamp);
  } finally {
    globalThis.createImageBitmap = saved;
  }
});
test("late bitmap from a stopped/replaced stream is closed and never inferred", async () => {
  const saved = globalThis.createImageBitmap;
  let resolve,
    closed = 0;
  globalThis.createImageBitmap = () => new Promise((r) => (resolve = r));
  try {
    const { capture: c, messages } = fixture();
    const inFlight = c.frame(40, 1);
    await c.stopVideo();
    c.running = true;
    resolve({
      close() {
        closed++;
      },
    });
    await inFlight;
    assert.equal(closed, 1);
    assert.equal(messages.length, 0);
    assert.equal(c.busy, false);
  } finally {
    globalThis.createImageBitmap = saved;
  }
});
test("worker result from old stream generation cannot change the active hand state", async () => {
  const previous = globalThis.Worker;
  globalThis.Worker = class {
    postMessage(data) {
      if (data.type === "init")
        queueMicrotask(() =>
          this.onmessage({ data: { type: "ready", delegate: "CPU" } }),
        );
    }
    terminate() {}
  };
  try {
    const { capture: c, results } = fixture();
    c.worker = null;
    await c.init();
    c.epoch = 3;
    c.running = true;
    c.worker.onmessage({ data: { type: "result", epoch: 2, hands: [] } });
    assert.equal(results.length, 0);
    c.worker.onmessage({ data: { type: "result", epoch: 3, hands: [] } });
    assert.equal(results.length, 1);
  } finally {
    globalThis.Worker = previous;
  }
});
test("metrics separate render rate and tracking rate for exactly 60 seconds", () => {
  const m = new Metrics();
  m.begin(0, { input_source: "synthetic-test" });
  for (let i = 1; i <= 3600; i++) {
    const t = (i * 1000) / 60;
    if (i % 3 === 0) m.track(t, { hands: [{}], inferenceMs: 20, ageMs: 28 });
    m.render(t, 3);
  }
  assert.equal(m.lastReport.complete, true);
  assert.equal(m.lastReport.render_fps, 60);
  assert.equal(m.lastReport.tracking_hz, 20);
  assert.equal(m.lastReport.sample_age_p95_ms, 28);
});
test("interrupted benchmark is never marked complete", () => {
  const m = new Metrics();
  m.begin(0, {});
  m.render(16, 2);
  const report = m.finish(30000, "tab-hidden");
  assert.equal(report.complete, false);
  assert.equal(report.abort_reason, "tab-hidden");
});
