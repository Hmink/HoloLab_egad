import test from "node:test";
import assert from "node:assert/strict";
import { HandTracks, observation } from "../web/src/tracks.js";
import { Interaction } from "../web/src/interaction.js";
import { PinchGate, OneEuro } from "../web/src/filters.js";
import {
  containRect,
  pointerPoint,
  displayPoint,
  screenToPlane,
  planeToScreen,
} from "../web/src/coordinates.js";

const close = (a, b, epsilon = 1e-8) =>
  assert.ok(Math.abs(a - b) < epsilon, `${a} != ${b}`);
export function pose(
  x = 0.3,
  y = 0.5,
  ratio = 0.2,
  label = "Left",
  palm = 0.12,
  angle = 0,
) {
  return {
    x,
    y,
    center: { x, y },
    ratio,
    palm,
    angle,
    label,
    score: 0.99,
    points: [],
    fist: false,
  };
}
function harness(pick) {
  let next = 1;
  const objects = [],
    tracker = new HandTracks();
  const adapter = {
    pick: pick || (() => ({ type: "inventory", stock: "beaker" })),
    spawn: () => {
      const o = {
        id: next++,
        target: { x: 0, y: 0, z: 0 },
        roll: 0,
        yaw: 0,
        pitch: 0,
      };
      objects.push(o);
      return o;
    },
    action: () => {},
    select: () => {},
    park: () => {},
    toWorld: (p, z) => ({ x: p.x / 100, y: p.y / 100, z }),
    move: (o, p, r, yaw, pitch) =>
      Object.assign(o, { target: p, roll: r, yaw, pitch }),
  };
  const input = new Interaction(adapter, {
    width: 1000,
    height: 600,
    margin: 0,
  });
  let t = 0;
  function feed(observations, dt = 34) {
    t += dt;
    input.update(tracker.update(observations, t), t);
    return [...input.hands.values()];
  }
  return {
    feed,
    input,
    tracker,
    objects,
    adapter,
    get time() {
      return t;
    },
  };
}
test("pinch hysteresis: boundary jitter cannot release a valid hold", () => {
  const gate = new PinchGate();
  let grabs = 0,
    releases = 0;
  const rows = [
    0.8,
    0.2,
    0.2,
    0.2,
    ...Array.from({ length: 90 }, (_, i) => (i % 2 ? 0.45 : 0.62)),
    0.9,
    0.9,
    0.9,
    0.9,
    0.9,
  ];
  rows.forEach((r, i) => {
    const e = gate.update(r, i * 34);
    grabs += e === "grab";
    releases += e === "release";
  });
  assert.equal(grabs, 1);
  assert.equal(releases, 1);
});
test("one noisy open sample and missing frames never release", () => {
  const h = harness();
  for (let i = 0; i < 5; i++) h.feed([pose()]);
  const obj = h.objects[0];
  h.feed([pose(0.3, 0.5, 1)]);
  h.feed([]);
  h.feed([]);
  h.feed([pose()]);
  assert.equal(h.input.owners(obj).length, 1);
});
test("duplicate timestamps cannot complete pinch debounce or tracking update", () => {
  const gate = new PinchGate();
  for (let i = 0; i < 100; i++) assert.equal(gate.update(0.1, 1), null);
  assert.equal(gate.closed, false);
  const tr = new HandTracks();
  tr.update([pose()], 1);
  tr.update([pose(0.8)], 1);
  assert.equal(tr.tracks[0].pose.x, 0.3);
});
test("normalized pinch is invariant with hand size and camera aspect", () => {
  for (const aspect of [4 / 3, 16 / 9]) {
    const values = [];
    for (const scale of [0.04, 0.08, 0.2]) {
      const points = Array.from({ length: 21 }, () => ({
        x: 0.5,
        y: 0.5,
        z: 0,
      }));
      points[5] = { x: 0.5 - scale / 2, y: 0.5 };
      points[17] = { x: 0.5 + scale / 2, y: 0.5 };
      points[0] = { x: 0.5, y: 0.5 + scale * aspect };
      points[9] = { x: 0.5, y: 0.5 };
      points[4] = { x: 0.5 - scale * 0.15, y: 0.4 };
      points[8] = { x: 0.5 + scale * 0.15, y: 0.4 };
      values.push(observation(points, "Left", 1, aspect, false).ratio);
    }
    values.forEach((v) => close(v, 0.3));
  }
});
test("alternating high-confidence handedness never loses a held track", () => {
  const h = harness();
  for (let i = 0; i < 120; i++)
    h.feed([pose(0.3 + i * 0.001, 0.5, 0.2, i % 2 ? "Left" : "Right")]);
  assert.equal(h.objects.length, 1);
  assert.equal(h.tracker.counter, 1);
  assert.equal(h.input.owners(h.objects[0]).length, 1);
  assert.equal(h.input.events.filter((e) => e.type === "release").length, 0);
});
test("two independent hands: near/far, detector order changes, no ownership swap", () => {
  const h = harness();
  for (let i = 0; i < 80; i++) {
    const a = pose(0.2 + i * 0.002, 0.45, 0.2, "Left", 0.2),
      b = pose(0.8 - i * 0.001, 0.7, 0.2, "Right", 0.055);
    h.feed(i % 2 ? [b, a] : [a, b]);
  }
  assert.equal(h.objects.length, 2);
  const hands = [...h.input.hands.values()];
  assert.equal(hands[0].object.id, 1);
  assert.equal(hands[1].object.id, 2);
  assert.equal(hands[0].track.label, "Left");
  assert.equal(hands[1].track.label, "Right");
  assert.equal(hands[0].track.slot, 0);
  assert.equal(hands[1].track.slot, 1);
  h.feed([
    pose(0.36, 0.45, 0.9, "Left", 0.2),
    pose(0.72, 0.7, 0.2, "Right", 0.055),
  ]);
  for (let i = 0; i < 6; i++)
    h.feed([
      pose(0.36, 0.45, 0.9, "Left", 0.2),
      pose(0.72, 0.7, 0.2, "Right", 0.055),
    ]);
  assert.equal(hands[0].object, null);
  assert.equal(hands[1].object.id, 2);
});
test("brief loss keeps object and recovery rebases with zero target jump", () => {
  const h = harness();
  for (let i = 0; i < 5; i++) h.feed([pose()]);
  const o = h.objects[0],
    before = { ...o.target };
  for (let i = 0; i < 8; i++) h.feed([]);
  assert.equal(h.input.owners(o).length, 1);
  assert.deepEqual(o.target, before);
  h.feed([pose(0.4, 0.55)]);
  assert.deepEqual(o.target, before);
  h.feed([pose(0.42, 0.55)]);
  assert.ok(o.target.x > before.x);
});
test("timeout parks, never deletes, and requires opening before re-grab", () => {
  const h = harness();
  for (let i = 0; i < 5; i++) h.feed([pose()]);
  h.input.sweep(h.time + 1900);
  assert.equal(h.objects.length, 1);
  assert.equal(h.input.owners(h.objects[0]).length, 0);
  for (let i = 0; i < 8; i++) h.feed([pose()], 300);
  assert.equal(h.objects.length, 1);
  for (let i = 0; i < 6; i++) h.feed([pose(0.3, 0.5, 0.9)]);
  for (let i = 0; i < 6; i++) h.feed([pose()]);
  assert.equal(h.objects.length, 2);
});
test("stationary object does not jump on ordinary grab", () => {
  const o = { id: 99, target: { x: 7, y: 4, z: 0 }, roll: 0, yaw: 0, pitch: 0 };
  const h = harness(() => ({ type: "object", object: o }));
  for (let i = 0; i < 5; i++) h.feed([pose()]);
  assert.deepEqual(o.target, { x: 7, y: 4, z: 0 });
});
test("two hands on one object: remaining hand inherits without a jump", () => {
  const o = { id: 99, target: { x: 7, y: 4, z: 0 }, roll: 0, yaw: 0, pitch: 0 };
  const h = harness(() => ({ type: "object", object: o }));
  for (let i = 0; i < 7; i++)
    h.feed([pose(0.25), pose(0.75, 0.5, 0.2, "Right")]);
  assert.equal(h.input.owners(o).length, 2);
  for (let i = 0; i < 10; i++)
    h.feed([pose(0.25 - i * 0.004), pose(0.75 + i * 0.004, 0.5, 0.2, "Right")]);
  assert.ok(o.target.z > 0);
  const before = { ...o.target };
  for (let i = 0; i < 6; i++)
    h.feed([pose(0.214, 0.5, 0.9), pose(0.786, 0.5, 0.2, "Right")]);
  assert.equal(h.input.owners(o).length, 1);
  close(o.target.x, before.x, 0.02);
  close(o.target.y, before.y, 0.02);
  const after = { ...o.target };
  h.feed([pose(0.214, 0.5, 0.9), pose(0.786, 0.5, 0.2, "Right")]);
  close(o.target.x, after.x, 0.01);
  close(o.target.z, after.z, 0.01);
});
test("same-object dual hold freezes when one hand is missing; resumes without teleport", () => {
  const o = { id: 1, target: { x: 5, y: 3, z: 0 } };
  const h = harness(() => ({ type: "object", object: o }));
  for (let i = 0; i < 6; i++)
    h.feed([pose(0.25), pose(0.75, 0.5, 0.2, "Right")]);
  const before = { ...o.target };
  for (let i = 0; i < 5; i++) h.feed([pose(0.3)]);
  assert.deepEqual(o.target, before);
  h.feed([pose(0.31), pose(0.78, 0.5, 0.2, "Right")]);
  assert.deepEqual(o.target, before);
});
test("ambiguous overlap freezes instead of handing objects to the other hand", () => {
  const h = harness();
  for (let i = 0; i < 6; i++)
    h.feed([pose(0.4, 0.5, 0.2, "Unknown"), pose(0.6, 0.5, 0.2, "Unknown")]);
  for (let i = 1; i <= 8; i++)
    h.feed([
      pose(0.4 + i * 0.01, 0.5, 0.2, "Unknown"),
      pose(0.6 - i * 0.01, 0.5, 0.2, "Unknown"),
    ]);
  const ids = [...h.input.hands.values()].map((x) => x.object.id);
  h.feed([pose(0.5, 0.5, 0.2, "Unknown"), pose(0.5, 0.5, 0.2, "Unknown")]);
  assert.ok(h.tracker.tracks.every((t) => t.ambiguous));
  assert.deepEqual(
    [...h.input.hands.values()].map((x) => x.object.id),
    ids,
  );
});
test("crossing paths with depth difference retain identity despite reversed result arrays", () => {
  const h = harness();
  for (let i = 0; i <= 100; i++) {
    const x = 0.2 + i * 0.006,
      a = pose(x, 0.5, 0.2, "Left", 0.18),
      b = pose(1 - x, 0.5, 0.2, "Right", 0.065);
    h.feed(i % 2 ? [b, a] : [a, b]);
  }
  const a = h.tracker.tracks.find((t) => t.slot === 0),
    b = h.tracker.tracks.find((t) => t.slot === 1);
  close(a.pose.x, 0.8);
  close(b.pose.x, 0.2);
  assert.equal(h.objects.length, 2);
});
test("slot B remains B when A expires; new hand can reuse slot A", () => {
  const tr = new HandTracks();
  tr.update([pose(0.2), pose(0.8)], 1);
  for (let t = 101; t <= 2401; t += 100) tr.update([pose(0.8)], t);
  assert.equal(tr.tracks.length, 1);
  assert.equal(tr.tracks[0].slot, 1);
  tr.update([pose(0.2), pose(0.8)], 2501);
  assert.equal(tr.tracks.find((x) => x.id === 2).slot, 1);
  assert.equal(tr.tracks.at(-1).slot, 0);
});
test("movement reaches image edges without disposing of the object", () => {
  const h = harness();
  for (let i = 0; i < 5; i++) h.feed([pose()]);
  for (let i = 0; i <= 70; i++) h.feed([pose(0.3 + i * 0.01, 0.5)]);
  assert.equal(h.objects.length, 1);
  assert.equal(h.input.owners(h.objects[0]).length, 1);
  assert.ok(h.objects[0].target.x > 9.8);
});
test("depth and wrist rotation do not scale the vessel model", () => {
  const h = harness();
  for (let i = 0; i < 6; i++) h.feed([pose()]);
  for (let i = 0; i < 12; i++) h.feed([pose(0.3, 0.5, 0.2, "Left", 0.24, 0.8)]);
  assert.ok(h.objects[0].target.z > 0.6);
  assert.ok(h.objects[0].roll < -0.6);
  assert.equal(h.objects[0].scale, undefined);
});
test("rotate mode preserves the anchored position and uses yaw/pitch", () => {
  const h = harness();
  h.input.mode = "rotate";
  for (let i = 0; i < 6; i++) h.feed([pose()]);
  const before = { ...h.objects[0].target };
  for (let i = 0; i < 20; i++) h.feed([pose(0.3 + i * 0.005, 0.5 + i * 0.003)]);
  assert.deepEqual(h.objects[0].target, before);
  assert.ok(h.objects[0].yaw > 0.3);
  assert.ok(h.objects[0].pitch > 0.1);
});
test("late target acquisition uses one pinch cycle at most once", () => {
  let ready = false;
  const h = harness(() => (ready ? { type: "inventory", stock: "x" } : null));
  for (let i = 0; i < 7; i++) h.feed([pose()]);
  ready = true;
  for (let i = 0; i < 20; i++) h.feed([pose()]);
  assert.equal(h.objects.length, 1);
});
test("10/10 deterministic acquisition sequences per hand (synthetic, not camera evidence)", () => {
  for (const label of ["Left", "Right"])
    for (let attempt = 0; attempt < 10; attempt++) {
      const h = harness();
      const size = 0.04 + attempt * 0.016;
      for (let i = 0; i < 5; i++) h.feed([pose(0.3, 0.5, 0.9, label, size)]);
      for (let i = 0; i < 6; i++)
        h.feed([pose(0.3, 0.5, 0.22 + (i % 2) * 0.03, label, size)]);
      assert.equal(h.objects.length, 1);
      assert.equal(h.input.owners(h.objects[0]).length, 1);
    }
});
test("One Euro attenuates stationary jitter while following a ramp", () => {
  const f = new OneEuro(),
    raw = [],
    smooth = [];
  for (let i = 0; i < 90; i++) {
    const x = 0.5 + (i % 2 ? 0.004 : -0.004);
    const y = f.update(x, i * 33.33);
    if (i > 20) {
      raw.push(x - 0.5);
      smooth.push(y - 0.5);
    }
  }
  const rms = (a) => Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length);
  assert.ok(rms(smooth) < rms(raw) * 0.35);
  let lag;
  for (let i = 0; i < 45; i++) {
    const x = 0.5 + i * 0.01;
    lag = x - f.update(x, 3000 + i * 33.33);
  }
  assert.ok(lag < 0.03);
});
test("mirror, contain fit, edge mapping, perspective round-trip across aspect ratios", () => {
  for (const [w, h] of [
    [1280, 720],
    [800, 600],
    [600, 900],
  ]) {
    const r = containRect(w, h, 1280, 720);
    close(r.width / r.height, 16 / 9);
    assert.ok(r.width <= w && r.height <= h);
    close(displayPoint(displayPoint({ x: 0.2, y: 0.4 }, true), true).x, 0.2);
    assert.deepEqual(pointerPoint({ x: 0.035, y: 0.035 }, w, h), {
      x: 0,
      y: 0,
    });
    assert.deepEqual(pointerPoint({ x: 0.965, y: 0.965 }, w, h), {
      x: w,
      y: h,
    });
    const rect = { left: 300, top: 100, width: w, height: h };
    for (const z of [-1.8, 0, 1.5]) {
      const p = { x: 400, y: 250 };
      const q = planeToScreen(
        screenToPlane(p, rect, 48, w / h, z),
        rect,
        48,
        w / h,
      );
      close(p.x, q.x);
      close(p.y, q.y);
    }
  }
});

test("Physics regrab preserves a fallen vessel's orientation outside legacy angle limits", () => {
  const h = harness();
  h.adapter.preserveFreeOrientation = true;
  const o = h.adapter.spawn();
  o.roll = 2.8;
  o.pitch = 2.4;
  o.yaw = 0.2;
  h.adapter.pick = () => ({ type: "object", object: o });
  let p = pose(0.3, 0.4, 0.9);
  h.feed([p]);
  p.ratio = 0.2;
  for (let i = 0; i < 6; i++) h.feed([p]);
  assert.equal(h.input.owners(o).length, 1);
  close(o.roll, 2.8);
  close(o.pitch, 2.4);
  h.input.mode = "rotate";
  h.input.owners(o).forEach((hand) => h.input.rebase(hand));
  h.feed([p]);
  close(o.roll, 2.8);
  close(o.pitch, 2.4);
});
