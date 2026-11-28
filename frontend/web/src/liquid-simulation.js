/** Scheduling is independent of inference and physics. At most one operation per vessel;
 * no catch-up bursts after a stalled frame, no double use of the same aliquot. */
export class LiquidSimulation {
  constructor(view, {transfer, spill, eligible}) {
    Object.assign(this, {view, transfer, spill, eligible});
    this.elapsed = 0;
    this.busy = new Set();
    this.lastCost = 0;
  }
  tick(dt, now) {
    this.elapsed += Math.min(dt, 0.1);
    if (this.elapsed < 0.08) return;
    const start = performance.now(), elapsed = Math.min(0.12, this.elapsed);
    this.elapsed = 0;
    this.view.scene.updateMatrixWorld();
    for (const o of this.view.objects) o.pourable?.updatePose();
    for (const o of this.view.objects) {
      const c = o.pourable;
      if (!c || this.busy.has(o.id)) continue;
      // rateCap: optional ceiling set by hand pour assist (a slower stream, same conservation).
      c.flowMlPerSecond = this.eligible(o, now) ? Math.min(c.rate(), c.rateCap ?? Infinity) : 0;
      if (!c.flowMlPerSecond) { this.view.stopStream(o); continue; }
      const target = this.view.pourTarget(o);
      if (target && this.busy.has(target.id)) continue;
      c.target = target?.id ?? null;
      const amount = Math.min(c.volume, c.flowMlPerSecond * elapsed);
      if (amount <= 1e-8) continue;
      this.busy.add(o.id);
      if (target) this.busy.add(target.id);
      this.apply(o, target, amount, now).finally(() => {
        this.busy.delete(o.id);
        if (target) this.busy.delete(target.id);
      });
    }
    this.lastCost = performance.now() - start;
  }
  async apply(source, target, amount, now) {
    try {
      let accepted = 0;
      if (target) {
        const room = Math.max(0, target.stock.capacity_ml - target.mixture.volume_ml);
        if (room > 1e-8) {
          const result = await this.transfer(source, target, Math.min(amount, room));
          if (!result?.ok) return; // Safety lockout/error is NOT converted into a spill.
          accepted = result.amount_ml;
        }
      }
      if (!this.view.objects.includes(source) || (target && !this.view.objects.includes(target))) return;
      const excess = Math.max(0, amount - accepted);
      source.pourable.overflowing = !!target && excess > 1e-8;
      if (excess > 1e-8) this.spill(source, excess, target, now);
      this.view.stream(source, target, performance.now() + 180);
    } catch (error) {
      this.view.stopStream(source);
      this.lastError = String(error);
    }
  }
}
