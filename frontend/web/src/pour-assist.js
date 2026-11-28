/** Pour assist for hand control.
 *
 * Pouring needs the source mouth directly above a receiving opening (within its rim radius,
 * at the same depth) and a tilt past 45°. With a webcam, depth is invisible on screen and
 * narrow tubes are a few pixels wide, so this module:
 *  1. snaps: when the mouth the hand is steering is horizontally within `enterPx` of an upright
 *     vessel's opening on screen and above it (by at most `maxAbovePx`), the held vessel is
 *     shifted (x/z, and up if needed) so its mouth sits over that opening; leaving needs
 *     `exitPx` (hysteresis, no flicker);
 *  2. dwell-to-pour: holding the hand still for `dwellMs` while snapped tilts the vessel slowly
 *     and stops tilting further as soon as liquid flows, so the stream stays small. One dose
 *     (`doseMl`) is poured, then the vessel tilts back; nudge the hand and hold still again to
 *     pour another dose. Moving the hand or leaving the target untilts it, and nothing is poured
 *     once the receiver is `maxFill` full (no automatic overflow).
 * Chemistry, flow rate and conservation are untouched: the normal pour pipeline still decides
 * whether liquid actually leaves the mouth. Plain {x,y,z} objects only (unit-testable).
 */
export const ASSIST_DEFAULTS = Object.freeze({
  enterPx: 85, // horizontal screen distance to start snapping
  exitPx: 130, // ...and to stop (hysteresis)
  aboveSlackPx: 25, // mouth may be this far below the opening on screen
  maxAbovePx: 320, // ...and at most this far above it
  clearance: 0.35, // world units between receiving rim and source mouth (body must not sweep the rim)
  minUpright: 0.9, // receiving vessel axis.y (cos of tilt)
  dwellMs: 650,
  stillPx: 16,
  tiltRate: 0.9, // rad/s while no liquid flows yet
  untiltRate: 2.0, // rad/s, gentle so the vessel does not swing into the receiver
  pourRoll: 2.1, // rad (~120°) maximum, only reached by a nearly empty vessel
  doseMl: 2, // one assisted pour (same as one manual lesson pour)
  maxFill: 0.85, // receiver fill fraction at which assisted pouring stops
});

export class PourAssist {
  constructor(options = {}) {
    this.options = { ...ASSIST_DEFAULTS, ...options };
    this.enabled = true;
    this.states = new Map();
  }
  reset(id) {
    if (id === undefined) this.states.clear();
    else this.states.delete(id);
  }
  state(id, pointer, now) {
    let s = this.states.get(id);
    if (!s) {
      s = { target: null, extra: 0, sign: -1, stillAt: pointer ? { ...pointer } : null, stillSince: now, last: now,
        pouredFrom: null, done: false };
      this.states.set(id, s);
    }
    return s;
  }
  /**
   * source: {id, position, mouth, volume, flowing}  held vessel now (mouth: lowest rim point,
   *   volume: mL inside, flowing: liquid is currently leaving it)
   * candidates: [{id, center, upright, fill}]  receivers (center: rim centre, upright: axis.y,
   *   fill: volume / capacity)
   * position/roll: pose the hand is asking for; pointer: hand cursor (screen px)
   * project: world {x,y,z} -> screen {x,y}
   * Returns {position, roll, target, hold: 0..1,
   *   phase: 'off'|'idle'|'aligned'|'pouring'|'done'|'full'}
   */
  apply({ source, candidates, position, roll, pointer, now, project }) {
    const o = this.options,
      s = this.state(source.id, pointer, now);
    const dt = Math.max(0, Math.min(0.1, (now - s.last) / 1000));
    s.last = now;
    if (!this.enabled || !source.mouth) {
      s.target = null;
      s.extra = 0;
      return { position, roll, target: null, phase: "off", hold: 0 };
    }
    if (pointer && (!s.stillAt || Math.hypot(pointer.x - s.stillAt.x, pointer.y - s.stillAt.y) > o.stillPx)) {
      s.stillAt = { ...pointer };
      s.stillSince = now;
    }
    // Where the mouth would be if the vessel went exactly where the hand asks.
    const wanted = {
      x: source.mouth.x + position.x - source.position.x,
      y: source.mouth.y + position.y - source.position.y,
      z: source.mouth.z + position.z - source.position.z,
    };
    const ws = project(wanted);
    let best = null,
      bestDistance = Infinity;
    for (const c of candidates) {
      if (c.id === source.id || !(c.upright >= o.minUpright)) continue;
      const cs = project(c.center),
        d = Math.abs(ws.x - cs.x),
        above = cs.y - ws.y,
        limit = s.target === c.id ? o.exitPx : o.enterPx;
      if (d < limit && d < bestDistance && above >= -o.aboveSlackPx && above <= o.maxAbovePx) {
        best = c;
        bestDistance = d;
      }
    }
    const moved = s.stillSince === now;
    if (best && s.target !== best.id) {
      s.sign = best.center.x >= source.position.x ? -1 : 1; // tilt the top towards the receiver
      s.stillSince = now; // a fresh snap must be held still before pouring starts
    }
    if (!best || moved) s.done = false; // moving the hand re-arms the next dose
    s.target = best ? best.id : null;
    let out = position,
      phase = "idle";
    if (best) {
      const lift = Math.max(0, best.center.y + o.clearance - wanted.y);
      out = {
        x: position.x + best.center.x - wanted.x,
        y: position.y + lift,
        z: position.z + best.center.z - wanted.z,
      };
      phase = "aligned";
    }
    const hold = best ? Math.min(1, (now - s.stillSince) / o.dwellMs) : 0;
    const untilt = () => (s.extra = Math.max(0, s.extra - o.untiltRate * dt));
    if (best && (best.fill ?? 0) >= o.maxFill) {
      phase = "full";
      s.pouredFrom = null;
      untilt();
    } else if (best && s.done) {
      phase = "done";
      untilt();
    } else if (best && hold >= 1) {
      if (s.pouredFrom === null) s.pouredFrom = source.volume ?? 0;
      if (s.pouredFrom - (source.volume ?? 0) >= o.doseMl) {
        s.done = true;
        s.pouredFrom = null;
        phase = "done";
        untilt();
      } else {
        phase = "pouring";
        // Tilt only until it pours, then hold: the stream stays near its smallest rate.
        if (!source.flowing) s.extra = Math.min(o.pourRoll, s.extra + o.tiltRate * dt);
      }
    } else {
      s.pouredFrom = null;
      untilt();
    }
    return { position: out, roll: roll + s.sign * s.extra, target: best, phase, hold };
  }
}
