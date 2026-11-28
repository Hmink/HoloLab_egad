import test from "node:test";
import assert from "node:assert/strict";
import { HandTracks } from "../web/src/tracks.js";
import { Interaction } from "../web/src/interaction.js";
import { PourAssist } from "../web/src/pour-assist.js";

function pose(x = 0.3, y = 0.5, ratio = 0.2, palm = 0.12, angle = 0) {
  return { x, y, center: { x, y }, ratio, palm, angle, label: "Left", score: 0.99, points: [], fist: false };
}
// Same scale as interaction.test.mjs: 1000x600 screen, world = screen / 100.
function harness({ assist = false, grip = null, object = null } = {}) {
  const tracker = new HandTracks();
  const o = object || { id: 1, target: { x: 3, y: 3, z: 0 }, roll: 0, yaw: 0, pitch: 0 };
  const adapter = {
    pick: () => ({ type: "object", object: o }),
    spawn: () => null,
    action: () => {},
    select: () => {},
    park: () => {},
    toWorld: (p, z) => ({ x: p.x / 100, y: p.y / 100, z }),
    move: (obj, p, r, yaw, pitch) => Object.assign(obj, { target: p, roll: r, yaw, pitch }),
  };
  if (grip) adapter.gripOffset = () => grip;
  const input = new Interaction(adapter, { width: 1000, height: 600, margin: 0, assist });
  let t = 0;
  const feed = (obs, dt = 34) => {
    t += dt;
    input.update(tracker.update(obs, t), t);
  };
  // world point currently under the hand (no filter lag once the hand is still)
  const hand = () => {
    const h = [...input.hands.values()][0];
    return { x: h.pointer.x / 100, y: h.pointer.y / 100 };
  };
  return { feed, input, o, hand };
}
const gap = (h) => Math.hypot(h.o.target.x - h.hand().x, h.o.target.y - h.hand().y);

test("tracking dropouts while the hand moves no longer accumulate a hand-to-object gap", () => {
  const h = harness();
  for (let i = 0; i < 6; i++) h.feed([pose(0.3, 0.5)]);
  assert.equal(h.input.owners(h.o).length, 1);
  const start = { x: h.o.target.x - h.hand().x, y: h.o.target.y - h.hand().y };
  let x = 0.3;
  for (let d = 0; d < 4; d++) {
    for (let i = 0; i < 4; i++) h.feed([]); // ~140 ms lost
    x += 0.06; // the hand moved 60 px meanwhile
    for (let i = 0; i < 20; i++) h.feed([pose(x, 0.5)]);
  }
  const now = { x: h.o.target.x - h.hand().x, y: h.o.target.y - h.hand().y };
  assert.ok(Math.hypot(now.x - start.x, now.y - start.y) < 0.02, JSON.stringify({ start, now }));
});

test("recovery still never jumps on the first sample (eases back instead)", () => {
  const h = harness();
  for (let i = 0; i < 6; i++) h.feed([pose(0.3, 0.5)]);
  const before = { ...h.o.target };
  for (let i = 0; i < 4; i++) h.feed([]);
  h.feed([pose(0.5, 0.5)]);
  assert.deepEqual(h.o.target, before);
  h.feed([pose(0.5, 0.5)]);
  const step = h.o.target.x - before.x;
  assert.ok(step > 0 && step < 2, `eased step ${step}`); // moves towards the hand, not all at once
});

test("assist: grip point settles under the pinch, without an instant jump at grab", () => {
  const grip = { x: 0, y: -0.4 };
  const h = harness({ assist: true, grip });
  // pinch 50 px right of and 40 px above the object origin
  for (let i = 0; i < 4; i++) h.feed([pose(0.35, 0.46, 0.9)]);
  let grabbedAt = null;
  for (let i = 0; i < 4 && !grabbedAt; i++) {
    h.feed([pose(0.35, 0.46)]);
    if (h.input.owners(h.o).length) grabbedAt = { ...h.o.target };
  }
  assert.ok(grabbedAt);
  assert.deepEqual(grabbedAt, { x: 3, y: 3, z: 0 });
  for (let i = 0; i < 20; i++) h.feed([pose(0.35, 0.46)]);
  assert.ok(Math.abs(h.o.target.x - h.hand().x - grip.x) < 0.01);
  assert.ok(Math.abs(h.o.target.y - h.hand().y - grip.y) < 0.01);
});

test("assist keeps grab depth when palm size changes; assist off keeps the old depth cue", () => {
  for (const assist of [true, false]) {
    const h = harness({ assist });
    for (let i = 0; i < 6; i++) h.feed([pose(0.3, 0.5, 0.2, 0.12)]);
    for (let i = 0; i < 10; i++) h.feed([pose(0.3, 0.5, 0.2, 0.06)]); // wrist turns: palm halves
    if (assist) assert.equal(h.o.target.z, 0);
    else assert.ok(h.o.target.z < -0.5);
  }
});

test("assist: pourAssist hook can override the pose, only when assist is on", () => {
  for (const assist of [true, false]) {
    const h = harness({ assist });
    let calls = 0;
    h.input.adapter.pourAssist = (o, p, roll) => { calls++; return { position: { ...p, z: 0.5 }, roll: roll + 1 }; };
    for (let i = 0; i < 8; i++) h.feed([pose(0.3, 0.5)]);
    assert.equal(calls > 0, assist);
    assert.equal(h.o.target.z === 0.5, assist);
  }
});

// --- PourAssist ------------------------------------------------------------------
const project = (p) => ({ x: p.x * 100, y: 600 - p.y * 100 }); // simple orthographic view
const tube = { id: 2, center: { x: 5, y: 1, z: 0.3 }, upright: 1, fill: 0.4 };
function source(x, y, z = 0) {
  return { id: 1, position: { x, y: y - 1, z }, mouth: { x: x + 0.1, y, z } };
}

test("pour assist: snaps mouth over the opening (x and depth), lifts above the rim", () => {
  const a = new PourAssist();
  const s = source(5.3, 1.05, -0.4); // 40 px right, slightly above, wrong depth
  const r = a.apply({ source: s, candidates: [tube], position: s.position, roll: 0, pointer: { x: 0, y: 0 }, now: 0, project });
  assert.equal(r.phase, "aligned");
  const mouth = { x: s.mouth.x + r.position.x - s.position.x, y: s.mouth.y + r.position.y - s.position.y, z: s.mouth.z + r.position.z - s.position.z };
  assert.ok(Math.abs(mouth.x - 5) < 1e-9 && Math.abs(mouth.z - 0.3) < 1e-9);
  assert.ok(mouth.y >= 1 + a.options.clearance - 1e-9);
});

test("pour assist: ignores far, below, tipped and self targets; hysteresis on exit", () => {
  const a = new PourAssist();
  const at = (x, y, cands = [tube]) => a.apply({ source: source(x, y), candidates: cands, position: source(x, y).position, roll: 0, pointer: null, now: 0, project });
  assert.equal(at(6.5, 2).phase, "idle"); // 160 px away
  assert.equal(at(5, 0.2).phase, "idle"); // below the opening
  assert.equal(at(5, 2, [{ ...tube, upright: 0.5 }]).phase, "idle"); // receiver tipped over
  assert.equal(at(5, 2, [{ ...tube, id: 1 }]).phase, "idle"); // itself
  assert.equal(at(5.6, 2).phase, "aligned"); // 70 px: enter
  assert.equal(at(5.95, 2).phase, "aligned"); // 105 px: still held (exit 130)
  assert.equal(at(6.5, 2).phase, "idle");
  assert.equal(at(5.95, 2).phase, "idle"); // re-entry needs < 85 px again
});

test("pour assist: hold still to tilt slowly; stop tilting further once liquid flows", () => {
  const a = new PourAssist();
  const s = { ...source(5, 2), volume: 30, flowing: false };
  let now = 0, r;
  const step = (pointer) => { now += 50; r = a.apply({ source: s, candidates: [tube], position: s.position, roll: 0, pointer, now, project }); };
  for (let i = 0; i < 12; i++) step({ x: 500, y: 400 }); // 600 ms: not yet
  assert.equal(r.phase, "aligned");
  assert.equal(r.roll, 0);
  for (let i = 0; i < 10; i++) step({ x: 501, y: 401 }); // jitter below stillPx keeps the dwell
  assert.equal(r.phase, "pouring");
  const tilt = Math.abs(r.roll);
  assert.ok(tilt > 0.2 && tilt < 0.6, `slow tilt ${tilt}`); // 0.9 rad/s, not a sudden flip
  s.flowing = true;
  for (let i = 0; i < 10; i++) step({ x: 501, y: 401 });
  assert.equal(Math.abs(r.roll), tilt); // held while it pours
});

test("pour assist: pours one dose, tilts back, nudge + hold pours the next dose", () => {
  const a = new PourAssist();
  const s = { ...source(5, 2), volume: 30, flowing: false };
  let now = 0, r;
  const step = (pointer) => { now += 50; r = a.apply({ source: s, candidates: [tube], position: s.position, roll: 0, pointer, now, project }); };
  for (let i = 0; i < 20; i++) step({ x: 500, y: 400 });
  assert.equal(r.phase, "pouring");
  s.flowing = true;
  s.volume -= a.options.doseMl; // the liquid simulation moved one dose
  step({ x: 500, y: 400 });
  assert.equal(r.phase, "done");
  for (let i = 0; i < 30; i++) step({ x: 500, y: 400 }); // keeps still: no second dose
  assert.equal(r.phase, "done");
  assert.equal(r.roll, 0);
  s.flowing = false;
  step({ x: 530, y: 400 }); // nudge re-arms
  assert.equal(r.phase, "aligned");
  for (let i = 0; i < 20; i++) step({ x: 530, y: 400 });
  assert.equal(r.phase, "pouring");
});

test("pour assist: never pours into a nearly full receiver; moving away untilts", () => {
  const a = new PourAssist();
  const s = { ...source(5, 2), volume: 30, flowing: false };
  let now = 0, r;
  const step = (pointer, cands = [tube]) => { now += 50; r = a.apply({ source: s, candidates: cands, position: s.position, roll: 0, pointer, now, project }); };
  for (let i = 0; i < 30; i++) step({ x: 500, y: 400 }, [{ ...tube, fill: 0.9 }]);
  assert.equal(r.phase, "full");
  assert.equal(r.roll, 0);
  for (let i = 0; i < 30; i++) step({ x: 500, y: 400 });
  assert.ok(Math.abs(r.roll) > 0);
  const far = { ...s, position: { x: 8, y: 1, z: 0 }, mouth: { x: 8.1, y: 2, z: 0 } };
  for (let i = 0; i < 30; i++) { now += 50; r = a.apply({ source: far, candidates: [tube], position: far.position, roll: 0, pointer: { x: 800, y: 400 }, now, project }); }
  assert.equal(r.phase, "idle");
  assert.equal(r.roll, 0);
});

test("pour assist: disabled returns the hand pose unchanged", () => {
  const a = new PourAssist();
  a.enabled = false;
  const s = source(5, 2);
  const r = a.apply({ source: s, candidates: [tube], position: s.position, roll: 0.3, pointer: null, now: 0, project });
  assert.deepEqual(r.position, s.position);
  assert.equal(r.roll, 0.3);
  assert.equal(r.phase, "off");
});
