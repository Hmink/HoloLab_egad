export class Metrics {
  constructor() {
    this.renders = [];
    this.tracking = [];
    this.gestures = [];
    this.lastRender = null;
    this.current = null;
    this.lastReport = null;
  }
  render(t, cost, physicsCost = 0) {
    this.renders.push({ t, cost, physicsCost });
    while (this.renders.length && t - this.renders[0].t > 3000)
      this.renders.shift();
    if (this.current) {
      this.current.render.push({ t, cost, physicsCost });
      if (t - this.current.start >= 60000) this.finish(t);
    }
  }
  track(t, data) {
    const row = {
      t,
      inferenceMs: data.inferenceMs,
      captureMs: data.captureMs ?? null,
      queueMs: data.queueMs ?? null,
      preprocessMs: data.preprocessMs ?? null,
      modelMs: data.modelMs ?? null,
      transportMs: data.transportMs ?? null,
      ageMs: data.ageMs,
      hands: data.hands.length,
    };
    this.tracking.push(row);
    while (this.tracking.length && t - this.tracking[0].t > 3000)
      this.tracking.shift();
    if (this.current) this.current.track.push(row);
  }
  gesture(t,event) {
    if (!Number.isFinite(event.debounceMs)) return;
    const row={t,type:event.type,debounceMs:event.debounceMs};
    this.gestures.push(row);
    if(this.gestures.length>100)this.gestures.shift();
    this.current?.gesture.push(row);
  }
  rate(rows, t) {
    const data = rows.filter((x) => t - x.t <= 2000);
    return data.length > 1
      ? ((data.length - 1) * 1000) / (data.at(-1).t - data[0].t)
      : 0;
  }
  fps(t) {
    return this.rate(this.renders, t);
  }
  hz(t) {
    return this.tracking.length && t - this.tracking.at(-1).t < 1000
      ? this.rate(this.tracking, t)
      : 0;
  }
  begin(t, metadata) {
    this.current = { start: t, render: [], track: [], gesture: [], metadata };
  }
  finish(t, reason = null) {
    const run = this.current;
    if (!run) return null;
    this.current = null;
    const mean = (a) =>
      a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
    const p95 = (a) =>
      a.length
        ? [...a].sort((a, b) => a - b)[Math.ceil(a.length * 0.95) - 1]
        : null;
    const duration = (t - run.start) / 1000;
    const intervals = run.render.slice(1).map((x, i) => x.t - run.render[i].t);
    const bins = Array.from({length:Math.floor(duration)},()=>0);
    for(const row of run.render){const bin=Math.floor((row.t-run.start)/1000);if(bin<bins.length)bins[bin]++;}
    this.lastReport = {
      schema: "hololab-benchmark-1",
      ...run.metadata,
      duration_s: duration,
      complete: duration >= 60 && !reason,
      abort_reason: reason,
      render_frames: run.render.length,
      render_fps: run.render.length / duration,
      render_fps_min_1s: bins.length ? Math.min(...bins) : null,
      render_interval_mean_ms: mean(intervals),
      render_interval_p95_ms: p95(intervals),
      render_cpu_mean_ms: mean(run.render.map((x) => x.cost)),
      physics_cpu_mean_ms: mean(run.render.map((x) => x.physicsCost || 0)),
      physics_cpu_p95_ms: p95(run.render.map((x) => x.physicsCost || 0)),
      tracking_samples: run.track.length,
      tracking_hz: run.track.length / duration,
      detected_samples: run.track.filter((x) => x.hands > 0).length,
      inference_mean_ms: mean(run.track.map((x) => x.inferenceMs)),
      capture_mean_ms: mean(run.track.map(x => x.captureMs).filter(x => x !== null)),
      worker_queue_mean_ms: mean(run.track.map(x => x.queueMs).filter(x => x !== null)),
      preprocess_mean_ms: mean(run.track.map(x => x.preprocessMs).filter(x => x !== null)),
      model_mean_ms: mean(run.track.map(x => x.modelMs).filter(x => x !== null)),
      transport_mean_ms: mean(
        run.track.map((x) => x.transportMs).filter((x) => x !== null),
      ),
      sample_age_p95_ms: p95(run.track.map((x) => x.ageMs)),
      gesture_debounce_mean_ms: mean(run.gesture.map(x=>x.debounceMs)),
      gesture_decisions: run.gesture.length,
      end_to_end_latency_ms: null,
      physics_fixed_step_hz: 120,
      target_render_50: run.render.length / duration >= 50,
      target_tracking_50: run.track.length / duration >= 50,
      target_render_45: run.render.length / duration >= 45,
      note: "Render FPS is not tracking Hz. Sample age is not end-to-end motion latency. No images saved.",
    };
    return this.lastReport;
  }
}
