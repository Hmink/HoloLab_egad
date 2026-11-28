import test from "node:test";
import assert from "node:assert/strict";
import { HandCapture } from "../web/src/capture.js";
test("Capture sends each camera timestamp at most once and never queues inference", async () => {
  const old = globalThis.createImageBitmap;
  let closed = 0;
  globalThis.createImageBitmap = async () => ({
    close() {
      closed++;
    },
  });
  try {
    const video = { readyState: 3, videoWidth: 1280, videoHeight: 720 };
    const c = new HandCapture(
      video,
      () => {},
      () => {},
    );
    c.running = true;
    const sent = [];
    c.worker = { postMessage: (msg) => sent.push(msg) };
    await c.frame(1000, 1);
    assert.equal(sent.length, 1);
    await c.frame(1100, 2);
    assert.equal(sent.length, 1);
    c.busy = false;
    await c.frame(1200, 1);
    assert.equal(sent.length, 1);
    await c.frame(1300, 3);
    assert.equal(sent.length, 2);
    assert.equal(sent[0].width, 640);
    assert.equal(sent[0].height, 360);
    assert.equal(c.maxHz, 60);
  } finally {
    globalThis.createImageBitmap = old;
  }
});
test("Capture drops stale epoch after async pixel conversion", async () => {
  const old = globalThis.createImageBitmap;
  let release,
    closed = 0;
  globalThis.createImageBitmap = () => new Promise((r) => (release = r));
  try {
    const c = new HandCapture(
      { readyState: 3, videoWidth: 640, videoHeight: 480 },
      () => {},
      () => {},
    );
    c.running = true;
    c.worker = { postMessage: () => assert.fail("stale frame sent") };
    const pending = c.frame(1000, 1);
    c.epoch++;
    release({
      close() {
        closed++;
      },
    });
    await pending;
    assert.equal(closed, 1);
    assert.equal(c.busy, false);
  } finally {
    globalThis.createImageBitmap = old;
  }
});

test("Changing camera quality drops old image epoch and suspends capture during reconfiguration", async () => {
  let resolve;
  const t = {
    applyConstraints: () => new Promise((r) => (resolve = r)),
    getCapabilities: () => ({}),
    getSettings: () => ({ width: 1280, height: 720 }),
  };
  const c = new HandCapture(
    {
      srcObject: { getVideoTracks: () => [t] },
      videoWidth: 1280,
      videoHeight: 720,
    },
    () => {},
    () => {},
  );
  c.running = true;
  const old = c.epoch;
  const pending = c.applyCameraQuality("HD");
  assert.equal(c.epoch, old + 1);
  assert.equal(c.qualityBusy, true);
  await c.frame(1000, 1);
  assert.equal(c.busy, false);
  resolve();
  await pending;
  assert.equal(c.qualityBusy, false);
});

test("Terminating a tracking worker clears its in-flight flag for the next backend", () => {
  let terminated = false;
  const video = { srcObject: null, pause() {}, removeAttribute() {} };
  const c = new HandCapture(
    video,
    () => {},
    () => {},
  );
  c.running = true;
  c.busy = true;
  c.ready = true;
  c.worker = {
    terminate() {
      terminated = true;
    },
  };
  c.close();
  assert.ok(terminated);
  assert.equal(c.busy, false);
  assert.equal(c.worker, null);
  assert.equal(c.ready, false);
});
