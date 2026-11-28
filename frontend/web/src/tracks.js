import { clamp } from "./filters.js";
import { displayPoint } from "./coordinates.js";

export function observation(
  landmarks,
  label = "Unknown",
  score = 0,
  aspect = 16 / 9,
  mirror = true,
) {
  if (!Number.isFinite(aspect) || aspect <= 0) return null;
  if (
    landmarks?.length !== 21 ||
    landmarks.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))
  )
    return null;
  const points = landmarks.map((p) => displayPoint(p, mirror));
  const d = (i, j) =>
    Math.hypot(points[i].x - points[j].x, (points[i].y - points[j].y) / aspect);
  const palm = Math.max(d(5, 17), 0.8 * d(0, 9), 0.8 * d(0, 13));
  if (palm < 0.012) return null;
  const x = (points[4].x + points[8].x) / 2,
    y = (points[4].y + points[8].y) / 2;
  const center = { x: 0, y: 0 };
  for (const i of [0, 5, 9, 17]) {
    center.x += points[i].x / 4;
    center.y += points[i].y / 4;
  }
  const angle = Math.atan2(
    points[9].x - points[0].x,
    -(points[9].y - points[0].y) / aspect,
  );
  // Image XY ratio is used consistently; do not switch between world and image metrics.
  const fist =
    [8, 12, 16, 20].filter(
      (tip, i) => d(tip, 0) < 1.1 * d([6, 10, 14, 18][i], 0),
    ).length >= 3;
  return {
    points,
    x,
    y,
    center,
    palm,
    ratio: d(4, 8) / palm,
    angle,
    label,
    score,
    fist,
  };
}

// Occasionally the detector reports the same image hand twice. Only suppress
// near-identical 21-landmark skeletons, never just equal handedness labels.
export function distinctObservations(observations) {
  const rows = observations.filter(Boolean).slice(0, 2);
  if (rows.length !== 2) return rows;
  const [a,b] = rows;
  if (a.points?.length !== 21 || b.points?.length !== 21 ||
      Math.abs(Math.log(a.palm / b.palm)) > 0.2) return rows;
  const rms = Math.sqrt(a.points.reduce((s,p,i) => s +
    (p.x-b.points[i].x)**2 + (p.y-b.points[i].y)**2,0)/21);
  return rms < Math.min(a.palm,b.palm)*0.12 ? [a.score >= b.score ? a : b] : rows;
}

export class HandTracks {
  constructor() {
    this.tracks = [];
    this.counter = 0;
    this.lastFrame = -1;
  }
  reset() {
    this.tracks = [];
    this.counter = 0;
    this.lastFrame = -1;
  }
  create(obs, t) {
    const slot = [0, 1].find((i) => !this.tracks.some((tr) => tr.slot === i));
    const track = {
      id: ++this.counter,
      slot,
      pose: obs,
      lastSeen: t,
      observed: true,
      ambiguous: false,
      velocity: { x: 0, y: 0 },
      label: null,
      votes: [],
      held: false,
      recovered: false,
    };
    this.vote(track, obs, t);
    this.tracks.push(track);
    return track;
  }
  vote(track, obs, t) {
    if (obs.score < 0.7 || !["Left", "Right"].includes(obs.label)) return;
    track.votes.push({ label: obs.label, t });
    track.votes = track.votes.filter((v) => t - v.t < 1400);
    const votes = track.votes,
      left = votes.filter((v) => v.label === "Left").length;
    const winning = left > votes.length / 2 ? "Left" : "Right";
    const share = Math.max(left, votes.length - left) / votes.length;
    if (
      votes.length >= 4 &&
      share >= 0.8 &&
      t - votes[0].t >= 180 &&
      (!track.label || !track.held)
    ) {
      // Relabel only after sustained evidence; object ownership never uses this label.
      if (!track.label || t - votes[0].t >= 900) track.label = winning;
    }
  }
  cost(track, obs, t) {
    const dt = Math.min(220, t - track.lastSeen) / 1000;
    const px = track.pose.center.x + track.velocity.x * dt,
      py = track.pose.center.y + track.velocity.y * dt;
    const distance = Math.hypot(px - obs.center.x, (py - obs.center.y) * 0.7);
    if (distance > 0.3 + Math.min(0.18, (t - track.lastSeen) / 5000))
      return 100;
    const scale = 0.085 * Math.abs(Math.log(obs.palm / track.pose.palm));
    const previousLabel =
      track.label || (track.pose.score > 0.8 ? track.pose.label : null);
    const label =
      ["Left", "Right"].includes(previousLabel) &&
      obs.score > 0.8 &&
      previousLabel !== obs.label
        ? 0.055
        : 0;
    return distance + scale + label;
  }
  update(observations, t) {
    if (t <= this.lastFrame) return this.tracks;
    this.lastFrame = t;
    this.tracks = this.tracks.filter((tr) => tr.held || t - tr.lastSeen < 2200);
    for (const tr of this.tracks) {
      tr.previouslyObserved = tr.observed && !tr.ambiguous;
      tr.observed = false;
      tr.ambiguous = false;
      tr.recovered = false;
    }
    const obs = distinctObservations(observations),
      existing = this.tracks.slice(0, 2);
    const assignments = [];
    function enumerate(i, used, pairs, cost, tracker) {
      if (i === existing.length) {
        assignments.push({ pairs: [...pairs], cost });
        return;
      }
      enumerate(i + 1, used, [...pairs, [i, -1]], cost + 0.5, tracker);
      obs.forEach((o, j) => {
        if (!used.has(j)) {
          const c = tracker.cost(existing[i], o, t);
          if (c < 0.48)
            enumerate(
              i + 1,
              new Set([...used, j]),
              [...pairs, [i, j]],
              cost + c,
              tracker,
            );
        }
      });
    }
    enumerate(0, new Set(), [], 0, this);
    assignments.sort((a, b) => a.cost - b.cost);
    const best = assignments[0];
    const used = new Set();
    let ambiguous = false;
    if (existing.length === 2 && obs.length === 2 && assignments.length > 1) {
      const separation = Math.hypot(
        obs[0].center.x - obs[1].center.x,
        obs[0].center.y - obs[1].center.y,
      );
      const next = assignments.find(
        (a) => a !== best && a.pairs.every((p) => p[1] >= 0),
      );
      ambiguous = separation < 0.13 && next && next.cost - best.cost < 0.035;
    }
    if (ambiguous) {
      for (const tr of existing) tr.ambiguous = true;
      return this.tracks; // Preserve both owners; no position or pinch evidence this frame.
    }
    for (const [i, j] of best?.pairs || [])
      if (j >= 0) {
        const tr = existing[i],
          o = obs[j],
          dt = Math.max(0.01, (t - tr.lastSeen) / 1000);
        // Slow inference is not tracking loss. The former fixed 100 ms test
        // rebased every frame below 10 Hz, making a held tool stick in midair.
        const recovered = !tr.previouslyObserved || t - tr.lastSeen > 700;
        if (recovered) tr.velocity = { x: 0, y: 0 };
        const speed = recovered ? 0 : 0.5;
        tr.velocity.x = clamp(
          tr.velocity.x * (1 - speed) +
            ((o.center.x - tr.pose.center.x) / dt) * speed,
          -2,
          2,
        );
        tr.velocity.y = clamp(
          tr.velocity.y * (1 - speed) +
            ((o.center.y - tr.pose.center.y) / dt) * speed,
          -2,
          2,
        );
        tr.pose = o;
        tr.lastSeen = t;
        tr.observed = true;
        tr.recovered = recovered;
        this.vote(tr, o, t);
        used.add(j);
      }
    obs.forEach((o, j) => {
      if (!used.has(j) && this.tracks.length < 2) this.create(o, t);
    });
    return this.tracks;
  }
}
