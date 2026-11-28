export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const angleDelta = (a, b) =>
  Math.atan2(Math.sin(a - b), Math.cos(a - b));

export class OneEuro {
  constructor(minCutoff = 2.2, beta = 7, derivativeCutoff = 1) {
    Object.assign(this, { minCutoff, beta, derivativeCutoff });
    this.reset();
  }
  reset() {
    this.time = null;
    this.value = 0;
    this.raw = 0;
    this.velocity = 0;
  }
  alpha(c, dt) {
    return dt / (dt + 1 / (2 * Math.PI * c));
  }
  update(x, t) {
    if (this.time === null) {
      this.time = t;
      this.raw = this.value = x;
      return x;
    }
    if (t <= this.time) return this.value;
    const dt = Math.min(0.15, (t - this.time) / 1000);
    this.velocity +=
      this.alpha(this.derivativeCutoff, dt) *
      ((x - this.raw) / dt - this.velocity);
    this.value +=
      this.alpha(this.minCutoff + this.beta * Math.abs(this.velocity), dt) *
      (x - this.value);
    this.time = t;
    this.raw = x;
    return this.value;
  }
}

export class PinchGate {
  constructor(close = 0.43, open = 0.66) {
    this.close = close;
    this.open = open;
    this.reset();
  }
  reset(requireOpen = false) {
    this.closed = false;
    this.pending = null;
    this.elapsed = 0;
    this.time = null;
    this.requireOpen = requireOpen;
    this.strongOpen = false;
    this.pendingStart = null;
    this.lastDecision = null;
  }
  configure(close, open) {
    // A settings edit is not gesture evidence. Keep the current hold's release
    // threshold until it ends; new acquisitions use the new thresholds.
    this.close = close;
    this.nextOpen = open;
    if (!this.closed) this.open = open;
    this.pending = null;
    this.elapsed = 0;
    this.strongOpen = false;
  }
  update(ratio, t) {
    if (!Number.isFinite(ratio) || (this.time !== null && t <= this.time))
      return null;
    const dt = this.time === null ? 0 : Math.min(70, t - this.time);
    this.time = t;
    if (this.requireOpen) {
      if (ratio > this.open) this.requireOpen = false;
      return null;
    }
    const next = this.closed ? ratio <= this.open : ratio < this.close;
    if (next === this.closed) {
      this.pending = null;
      this.elapsed = 0;
      this.strongOpen = false;
      return null;
    }
    if (this.pending !== next) {
      this.pending = next;
      this.elapsed = 0;
      this.pendingStart = t;
      this.strongOpen = !next && ratio >= Math.max(0.9, this.open + 0.18);
    } else this.elapsed += dt;
    this.strongOpen &&= !next && ratio >= Math.max(0.9, this.open + 0.18);
    // Two/three clearly open samples release quickly. A single outlier never
    // releases; ambiguous openings retain the longer existing debounce.
    if (this.elapsed < (next ? 55 : this.strongOpen ? 32 : 105)) return null;
    this.closed = next;
    this.lastDecision = {type:next ? "grab" : "release", debounceMs:t-this.pendingStart};
    this.pending = null;
    this.elapsed = 0;
    if (!next && this.nextOpen !== undefined) this.open = this.nextOpen;
    return next ? "grab" : "release";
  }
  missing(t) {
    // Short gaps pause evidence; they never count as an open hand.
    this.pending = null;
    this.elapsed = 0;
    this.strongOpen = false;
    this.time = t;
  }
}
