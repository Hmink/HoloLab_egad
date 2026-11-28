import test from "node:test";
import assert from "node:assert/strict";
import {
  cameraConstraints,
  configureCamera,
  CameraLoadPolicy,
  publicCameraSettings,
} from "../web/src/camera-quality.js";
test("HD default requests true stream pixels; Low and Full HD explicit dimensions", () => {
  assert.equal(cameraConstraints().width.ideal, 1280);
  assert.equal(cameraConstraints("LOW", true).height.exact, 480);
  assert.equal(cameraConstraints("FHD", true).width.exact, 1920);
});
test("Unsupported Full HD falls back to HD and reports actual resolution; autofocus only if supported", async () => {
  const calls = [];
  const tr = {
    getSettings: () => ({
      width: 1280,
      height: 720,
      frameRate: 30,
      deviceId: "private",
    }),
    getCapabilities: () => ({ focusMode: ["continuous"] }),
    applyConstraints: async (c) => {
      calls.push(c);
      if (c.width?.exact === 1920) throw Error("unsupported");
    },
  };
  const r = await configureCamera(tr, "FHD");
  assert.equal(r.applied, "HD");
  assert.equal(r.settings.width, 1280);
  assert.ok(r.note.includes("Full HD"));
  assert.equal(calls.at(-1).advanced[0].focusMode, "continuous");
  assert.equal(publicCameraSettings(tr).deviceId, undefined);
});
test("Auto camera policy waits for persistent overload, cools down, and never oscillates upward", () => {
  const p = new CameraLoadPolicy(),
    slow = { fps: 30, inferenceMs: 90, ageMs: 200 };
  assert.equal(p.next(0, "FHD", slow), null);
  assert.equal(p.next(9999, "FHD", slow), null);
  assert.equal(p.next(10000, "FHD", slow), "HD");
  assert.equal(p.next(11000, "HD", slow), null);
  assert.equal(p.next(25000, "HD", slow), "LOW");
  assert.equal(p.next(50000, "LOW", slow), null);
  assert.equal(
    p.next(51000, "LOW", { fps: 60, inferenceMs: 12, ageMs: 20 }),
    null,
  );
});
