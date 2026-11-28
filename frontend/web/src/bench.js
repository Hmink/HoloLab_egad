import { Titration, equilibrium } from "./titration.js";
import { buildStation } from "./environment.js";
import { PinchGate, OneEuro, angleDelta, clamp } from "./filters.js";
import { pointerPoint } from "./coordinates.js";
export class Bench {
  constructor(view, park) {
    this.view = view;
    this.park = park;
    this.model = new Titration();
    this.initialPh = this.model.value.ph;
    this.station = buildStation(view);
    this.active = false;
    this.owner = null;
    this.gates = new Map();
    this.lastUI = 0;
    this.valvePoint = { x: 0, y: 0 };
    const $ = (id) => document.getElementById(id);
    this.$ = $;
    $("titration-mode").onclick = () => this.toggle();
    $("t-reset").onclick = () => {
      try {
        const config = {
          acid: $("t-acid").value,
          base: $("t-base").value,
          acidM: Number($("t-acid-m").value),
          baseM: Number($("t-base-m").value),
          initialMl: Number($("t-volume").value),
        };
        this.model.reset(config);
        this.initialPh = this.model.value.ph;
        this.release();
        this.refresh();
      } catch (e) {
        $("t-feedback").textContent = e.message;
      }
    };
    $("t-valve").oninput = (e) => {
      this.release();
      this.model.open = Number(e.target.value);
    };
    $("t-drop").onclick = () => {
      this.model.add(0.05);
      this.refresh();
    };
    $("t-close").onclick = () => {
      this.release();
      this.refresh();
    };
    $("t-export").onclick = () => {
      const a = document.createElement("a");
      const u = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              {
                schema: "hololab-titration-1",
                config: this.model.config,
                ...this.model.value,
                history: this.model.history,
                model: "ideal dilute solution, 25 C, additive volumes",
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
      a.href = u;
      a.download = "HoloLab_chuan_do.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 1000);
    };
    this.$("reaction-library").addEventListener("click", () => this.release());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.release();
    });
    addEventListener("blur", () => this.release());
    this.$("camera").addEventListener("pause", () => this.release());
  }
  toggle() {
    this.park();
    this.release();
    this.gates.clear();
    this.active = !this.active;
    document.body.classList.toggle("titrating", this.active);
    for (const id of [
      "cards",
      "tabs",
      "experiment",
      "load",
      "clear",
      "save",
      "view-mode",
    ]) {
      const el = this.$(id);
      if (el) {
        el.inert = this.active;
        el.style.opacity = this.active ? ".4" : "";
      }
    }
    this.station.group.visible = this.active;
    this.view.objects.forEach((o) => {
      o.group.visible = !this.active;
      o.label.hidden = this.active;
    });
    this.$("titration-panel").hidden = !this.active;
    this.$("titration-mode").textContent = this.active
      ? "Về bàn tự do"
      : "Chuẩn độ";
    this.$("empty").hidden = this.active || this.view.objects.length > 0;
    this.$("valve-marker").hidden = !this.active;
    this.refresh();
  }
  release() {
    if (this.owner?.track) this.owner.track.held = false;
    this.model.open = 0;
    this.owner = null;
    this.$("t-valve").value = 0;
  }
  process(tracks, t, received, margin = 0.035) {
    if (!this.active) return;
    const ids = new Set(tracks.map((h) => h.id));
    for (const id of this.gates.keys()) if (!ids.has(id)) this.gates.delete(id);
    for (const tr of tracks) {
      if (!this.gates.has(tr.id))
        this.gates.set(tr.id, new PinchGate(0.43, 0.66));
      const gate = this.gates.get(tr.id);
      if (!tr.observed || tr.ambiguous) {
        gate.missing(t);
        if (this.owner?.id === tr.id) this.release();
        continue;
      }
      const event = gate.update(tr.pose.ratio, t);
      const p = pointerPoint(tr.pose, innerWidth, innerHeight, margin);
      if (
        event === "grab" &&
        !this.owner &&
        Math.hypot(p.x - this.valvePoint.x, p.y - this.valvePoint.y) < 65
      )
        this.owner = {
          id: tr.id,
          track: tr,
          angle: tr.pose.angle,
          raw: tr.pose.angle,
          continuous: tr.pose.angle,
          filter: new OneEuro(3, 4),
          base: this.model.open,
          last: received,
        };
      if (this.owner?.id === tr.id) {
        tr.held = true;
        this.owner.last = received;
        if (event === "release") {
          this.release();
          continue;
        }
        this.owner.continuous += angleDelta(tr.pose.angle, this.owner.raw);
        this.owner.raw = tr.pose.angle;
        const angle = this.owner.filter.update(this.owner.continuous, t);
        this.model.open = clamp(
          this.owner.base - (angle - this.owner.angle) / (Math.PI / 2),
          0,
          1,
        );
      }
    }
  }
  tick(dt, now) {
    if (!this.active) return;
    if (this.owner && now - this.owner.last > 250) this.release();
    this.model.step(dt);
    this.station.update(this.model, now);
    this.valvePoint = this.view.toScreen(
      this.station.valve.getWorldPosition(this.view.temp),
    );
    const marker = this.$("valve-marker");
    marker.style.left = `${this.valvePoint.x - this.view.rect.left}px`;
    marker.style.top = `${this.valvePoint.y - this.view.rect.top}px`;
    if (now - this.lastUI > 100) {
      this.refresh();
      this.lastUI = now;
    }
  }
  refresh() {
    const v = this.model.value;
    this.$("t-ph").textContent = v.ph.toFixed(2);
    this.$("t-used").textContent = this.model.addedMl.toFixed(2) + " mL";
    this.$("t-feedback").textContent = v.feedback;
    this.$("t-valve").value = this.model.open;
    this.$("t-config").textContent =
      `${this.model.config.acid} ${this.model.config.acidM} M · ${this.model.config.initialMl} mL / ${this.model.config.base} ${this.model.config.baseM} M`;
    const c = this.$("t-chart"),
      ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#345666";
    ctx.strokeRect(25, 6, c.width - 35, c.height - 25);
    ctx.fillStyle = "#b7ced8";
    ctx.font = "10px sans-serif";
    ctx.fillText("14", 3, 14);
    ctx.fillText("0", 10, c.height - 18);
    ctx.fillText("0", 25, c.height - 3);
    ctx.fillText("50 mL", c.width - 40, c.height - 3);
    ctx.strokeStyle = "#70dfc3";
    ctx.beginPath();
    const pts = [{ volume: 0, ph: this.initialPh }, ...this.model.history];
    pts.forEach((p, i) => {
      const x = 25 + (p.volume / 50) * (c.width - 35),
        y = 6 + ((14 - p.ph) / 14) * (c.height - 25);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }
}
