import { OneEuro, PinchGate, clamp, angleDelta } from "./filters.js";
import { pointerPoint } from "./coordinates.js";

export const STATES = Object.freeze({
  IDLE: "IDLE",
  HOVER: "HOVER",
  GRABBING: "GRABBING",
  DRAGGING: "DRAGGING",
  RELEASED: "RELEASED",
  PINCH_START: "PINCH_START",
  ROTATING: "ROTATING",
  RELEASING: "RELEASING",
});
export const TRACKING_HOLD_MS = 700;
// After a re-anchor (tracking recovery, resize, mode change) the hold offset eases back to
// its goal instead of being frozen. Without this, every short tracking dropout while the hand
// keeps moving added the hand's travel to a permanent hand-to-object gap.
export const OFFSET_SETTLE_MS = 120;

export class Interaction {
  constructor(
    adapter,
    {
      width = 1280,
      height = 800,
      margin = 0.035,
      close = 0.43,
      open = 0.66,
      assist = false,
    } = {},
  ) {
    this.adapter = adapter;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.close = close;
    this.open = open;
    this.hands = new Map();
    this.dual = new Map();
    this.mode = "move";
    // Hand assist: grip under the pinch, depth held at grab depth, adapter.pourAssist hook.
    this.assist = assist;
    this.events = [];
    this.now = 0;
  }
  record(event) {
    this.events.push({ t: this.now, ...event });
    if (this.events.length > 2000) this.events.shift();
  }
  stateFor(track) {
    if (!this.hands.has(track.id))
      this.hands.set(track.id, {
        id: track.id,
        track,
        state: STATES.IDLE,
        gate: new PinchGate(this.close, this.open),
        fx: new OneEuro(),
        fy: new OneEuro(),
        fp: new OneEuro(2, 4),
        fa: new OneEuro(3, 4),
        angleRaw: null,
        angleContinuous: 0,
        pointer: null,
        object: null,
        anchor: null,
        missing: false,
        lastValid: -Infinity,
        lastReceived: -Infinity,
        lastConfirmed: -Infinity,
        recoverySamples: 0,
        grip: "pinch",
        fistArmed: true,
        releaseAt: 0,
        consumed: false,
        hoverKey: null,
        hoverSince: 0,
      });
    return this.hands.get(track.id);
  }
  owners(object) {
    return [...this.hands.values()].filter((h) => h.object === object);
  }
  rebase(h) {
    if (!h.object || !h.pointer) return;
    const o = h.object,
      p = h.track.pose,
      goal = h.resetGoal ? null : h.anchor?.goal;
    h.resetGoal = false;
    const at = this.adapter.toWorld(h.pointer, o.target.z);
    h.anchor = {
      point: { ...h.pointer },
      position: { ...o.target },
      offset: { x: o.target.x - at.x, y: o.target.y - at.y },
      palm: h.palm || p.palm,
      angle: h.angle ?? p.angle,
      roll: o.roll || 0,
      yaw: o.yaw || 0,
      pitch: o.pitch || 0,
    };
    // Re-anchoring never jumps (offset = current gap), but the goal survives so the gap drains.
    h.anchor.goal = goal ? { ...goal } : { ...h.anchor.offset };
    h.anchor.updated = this.now;
  }
  startDual(object) {
    const owners = this.owners(object);
    if (owners.length !== 2) return;
    const [a, b] = owners,
      mid = {
        x: (a.pointer.x + b.pointer.x) / 2,
        y: (a.pointer.y + b.pointer.y) / 2,
      };
    const at = this.adapter.toWorld(mid, object.target.z);
    this.dual.set(object.id, {
      offset: { x: object.target.x - at.x, y: object.target.y - at.y },
      z: object.target.z,
      roll: object.roll || 0,
      angle: Math.atan2(b.pointer.y - a.pointer.y, b.pointer.x - a.pointer.x),
      accumulated: 0,
      distance: Math.max(
        30,
        Math.hypot(b.pointer.x - a.pointer.x, b.pointer.y - a.pointer.y),
      ),
      resume: false,
    });
    this.record({
      type: "dual",
      object: object.id,
      hands: owners.map((h) => h.id),
    });
  }
  grab(h) {
    const hit = this.adapter.pick(h.pointer);
    if (!hit) return false;
    if (hit.type === "action") {
      this.adapter.action(hit.action);
      h.consumed = true;
      return true;
    }
    const object =
      hit.type === "inventory"
        ? this.adapter.spawn(hit.stock, h.pointer)
        : hit.object;
    if (!object || object.mouseOwned || this.owners(object).length >= 2)
      return false;
    h.object = object;
    h.state = STATES.DRAGGING;
    h.track.held = true;
    h.lastConfirmed = h.lastReceived;
    this.adapter.acquire?.(object);
    this.rebase(h);
    this.adapter.select(object);
    this.record({ type: "grab", hand: h.id, object: object.id, debounceMs:h.gate.lastDecision?.debounceMs });
    if (hit.type === "inventory") h.anchor.offset = { x: 0, y: 0 };
    // With assist, the vessel's grip point (not wherever the pinch landed) settles under the hand.
    h.anchor.goal =
      hit.type === "inventory"
        ? { x: 0, y: 0 }
        : this.assist && this.adapter.gripOffset
          ? this.adapter.gripOffset(object)
          : { ...h.anchor.offset };
    if (this.owners(object).length === 2) this.startDual(object);
    h.consumed = true;
    return true;
  }
  release(h, reason = "gesture") {
    if (h.object) {
      const obj = h.object;
      h.state = STATES.RELEASING;
      h.object = null;
      h.track.held = false;
      this.dual.delete(obj.id);
      const remaining = this.owners(obj);
      remaining.forEach((other) => {
        this.rebase(other);
        // Two-hand control legitimately moved the vessel relative to this hand: on the next
        // re-anchor, adopt that relation as the new goal instead of easing back to the old one.
        other.resetGoal = true;
        other.needsRebase = true;
      });
      this.adapter.park?.(obj, reason);
      this.record({ type: "release", hand: h.id, object: obj.id, reason,
        debounceMs:reason === "gesture" ? h.gate.lastDecision?.debounceMs : undefined });
    }
    h.state = STATES.RELEASED;
    h.releaseAt = this.now;
    h.anchor = null;
    if (reason !== "gesture") h.gate.reset(true);
    h.gate.configure(this.close, this.open);
    h.fistArmed = false;
    h.grip = "pinch";
  }
  parkAll(reason = "manual") {
    for (const h of this.hands.values()) this.release(h, reason);
    this.dual.clear();
  }
  reset() {
    this.parkAll("reset");
    this.hands.clear();
  }
  setThreshold(close) {
    if (!Number.isFinite(close)) return;
    close = clamp(close, 0.25, 0.6);
    this.close = close;
    this.open = Math.max(close + 0.2, 0.6);
    for (const h of this.hands.values()) {
      h.gate.configure(this.close, this.open);
    }
  }
  rebaseOnNextSample() {
    for (const h of this.hands.values()) h.needsRebase = true;
  }
  setMode(mode) {
    if (!["move", "rotate"].includes(mode) || mode === this.mode) return;
    this.mode = mode;
    this.rebaseOnNextSample();
  }
  update(tracks, t, receivedAt = t) {
    this.now = t;
    const alive = new Set(tracks.map((tr) => tr.id));
    for (const h of this.hands.values())
      if (!alive.has(h.id)) {
        this.release(h, "expired");
        this.hands.delete(h.id);
      }
    for (const track of tracks) {
      const h = this.stateFor(track);
      h.track = track;
      if (!track.observed || track.ambiguous) {
        h.gate.missing(t);
        h.missing = true;
        h.recoverySamples = 0;
        if (h.object && receivedAt - h.lastConfirmed > TRACKING_HOLD_MS)
          this.release(h, "tracking-timeout");
        continue;
      }
      const pose = track.pose;
      if (!pose.fist) h.fistArmed = true;
      const recovering = h.missing || track.recovered || h.needsRebase;
      if (recovering) {
        h.fx.reset();
        h.fy.reset();
        h.fp.reset();
        h.fa.reset();
        h.angleRaw = null;
      }
      const filtered = { x: h.fx.update(pose.x, t), y: h.fy.update(pose.y, t) };
      const pointer = pointerPoint(
        filtered,
        this.width,
        this.height,
        this.margin,
      );
      h.pointer = pointer;
      h.lastValid = t;
      h.lastReceived = receivedAt;
      // A lone intermittent detection must not renew a stale hold forever.
      // Require two consecutive samples after a gap; clear opening can still
      // release immediately after its normal debounce.
      if (recovering) h.recoverySamples = 0;
      h.recoverySamples++;
      if (!h.object || h.recoverySamples >= 2) h.lastConfirmed = receivedAt;
      h.missing = false;
      h.needsRebase = false;
      h.palm = Math.exp(h.fp.update(Math.log(pose.palm), t));
      h.angleContinuous =
        h.angleRaw === null
          ? pose.angle
          : h.angleContinuous + angleDelta(pose.angle, h.angleRaw);
      h.angleRaw = pose.angle;
      h.angle = h.fa.update(h.angleContinuous, t);
      if (recovering && h.object) {
        this.rebase(h);
        if (this.dual.has(h.object.id))
          this.dual.get(h.object.id).resume = true;
        this.record({ type: "recover", hand: h.id, object: h.object.id });
      }
      // Fist is an optional rotation grip only when the grab STARTED as a fist.
      // It must never mask opening thumb/index on a pinch-origin hold.
      if (!h.gate.closed && h.gate.pending === null && !h.gate.requireOpen)
        h.grip = this.mode === "rotate" && h.fistArmed && pose.fist && pose.ratio > h.gate.open ? "fist" : "pinch";
      const ratio = h.grip === "fist" ? (pose.fist ? 0.1 : 1.5) : pose.ratio;
      const event = h.gate.update(ratio, t);
      if (event === "grab") this.grab(h);
      else if (event === "release") {
        this.release(h);
        h.consumed = false;
        h.hoverKey = null;
      }
      if (!h.object) {
        // If pinch began just outside a narrow target, a brief stable hover can acquire it.
        // One close/open cycle can activate at most one action or inventory item.
        if (h.gate.closed && !h.consumed) {
          const hit = this.adapter.pick(h.pointer),
            key = hit
              ? `${hit.type}:${hit.stock || hit.object?.id || hit.action}`
              : null;
          if (key !== h.hoverKey) {
            h.hoverKey = key;
            h.hoverSince = t;
          }
          if (key && t - h.hoverSince >= 80) this.grab(h);
        }
        if (h.state !== STATES.RELEASED || t - h.releaseAt > 130) {
          const hit = this.adapter.pick(h.pointer);
          if (!h.object)
            h.state =
              h.gate.pending === true
                ? STATES.PINCH_START
                : hit
                  ? STATES.HOVER
                  : STATES.IDLE;
        }
      }
      track.held = !!h.object;
      if (h.object) h.state = this.mode === "rotate" ? STATES.ROTATING : STATES.DRAGGING;
    }
    // Apply each object once: two independent hands cannot overwrite each other.
    const objects = new Set(
      [...this.hands.values()].map((h) => h.object).filter(Boolean),
    );
    for (const object of objects) {
      const owners = this.owners(object);
      if (owners.some((h) => !h.track.observed || h.track.ambiguous || h.needsRebase)) {
        if (this.dual.has(object.id)) this.dual.get(object.id).resume = true;
        continue;
      }
      if (owners.length === 2) {
        let dual = this.dual.get(object.id);
        if (!dual || dual.resume) {
          this.startDual(object);
          dual = this.dual.get(object.id);
        }
        const [a, b] = owners;
        const mid = {
          x: (a.pointer.x + b.pointer.x) / 2,
          y: (a.pointer.y + b.pointer.y) / 2,
        };
        const distance = Math.max(
          30,
          Math.hypot(b.pointer.x - a.pointer.x, b.pointer.y - a.pointer.y),
        );
        const z = clamp(
          dual.z + Math.log(distance / dual.distance) * 1.1,
          -1.8,
          1.5,
        );
        const at = this.adapter.toWorld(mid, z);
        const angle = Math.atan2(b.pointer.y - a.pointer.y, b.pointer.x - a.pointer.x);
        dual.accumulated += angleDelta(angle, dual.angle);
        dual.angle = angle;
        const roll = dual.roll - dual.accumulated;
        this.adapter.move(
          object,
          { x: at.x + dual.offset.x, y: at.y + dual.offset.y, z },
          roll,
          object.yaw,
          object.pitch,
        );
      } else {
        const h = owners[0],
          a = h.anchor,
          p = h.track.pose;
        if (!a) continue;
        if (this.mode === "rotate") {
          this.adapter.move(
            object,
            { ...a.position },
            a.roll,
            a.yaw + ((h.pointer.x - a.point.x) / this.width) * 5,
            a.pitch + ((h.pointer.y - a.point.y) / this.height) * Math.PI * 2,
          );
        } else {
          const k = 1 - Math.exp(-Math.max(0, this.now - (a.updated ?? this.now)) / OFFSET_SETTLE_MS);
          a.updated = this.now;
          if (a.goal) {
            a.offset.x += (a.goal.x - a.offset.x) * k;
            a.offset.y += (a.goal.y - a.offset.y) * k;
          }
          // Palm size is a noisy depth cue (it changes when the wrist turns). With assist the
          // vessel keeps its grab depth; pour assist aligns depth with the receiving vessel.
          const z = this.assist
            ? a.position.z
            : clamp(a.position.z + Math.log(h.palm / a.palm) * 1.2, -1.8, 1.5);
          const at = this.adapter.toWorld(h.pointer, z);
          let position = { x: at.x + a.offset.x, y: at.y + a.offset.y, z },
            roll = a.roll - (h.angle - a.angle);
          if (this.assist && this.adapter.pourAssist)
            ({ position, roll } = this.adapter.pourAssist(object, position, roll, h.pointer, this.now));
          this.adapter.move(object, position, roll, a.yaw, a.pitch);
        }
      }
    }
  }
  sweep(t) {
    // Render time can expire a stalled camera without inventing new evidence.
    this.now = t;
    for (const h of this.hands.values())
      if (h.object && t - h.lastConfirmed > TRACKING_HOLD_MS)
        this.release(h, h.missing ? "tracking-timeout" : "stalled-camera");
  }
  validOwners(object, t) {
    const owners = this.owners(object);
    return (
      owners.length > 0 &&
      owners.every(
        (h) =>
          h.track.observed &&
          !h.track.ambiguous &&
          t - h.lastReceived < 180 &&
          t - h.lastValid < 300,
      )
    );
  }
}
