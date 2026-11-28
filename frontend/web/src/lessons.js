import {
  LessonChemistry,
  initialMixture,
  appearance,
  SPECIES,
} from "./lesson-chemistry.js";
import { LessonVisuals } from "./lesson-visuals.js";
const $ = (id) => document.getElementById(id);
const text = (el, value) => {
  if (el.textContent !== value) el.textContent = value;
};
const option = (value, label) => {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = label;
  return o;
};
export class Lessons {
  constructor(data, adapter) {
    this.data = data;
    this.a = adapter;
    this.model = null;
    this.objects = new Map();
    this.visuals = new LessonVisuals(adapter.view);
    this.elapsed = 0;
    this.quizAnswers = new Map();
    this.bind();
  }
  get active() {
    return !!this.model;
  }
  get allowed() {
    return this.model?.lesson.setup.map((row) => row.stock) || [];
  }
  bind() {
    for (const grade of [10, 11, 12])
      $("lesson-grade").append(option(grade, `Lớp ${grade}`));
    $("lesson-grade").onchange = () => this.topics();
    $("lesson-topic").onchange = () => this.experiments();
    $("lesson-select").onchange = () => this.preview();
    $("lesson-start").onclick = () => {
      try {
        this.start($("lesson-select").value);
      } catch (e) {
        this.a.message(e.message);
      }
    };
    $("lesson-exit").onclick = () => {
      this.a.clear();
      this.a.message("Đã trở lại bàn tự do.");
    };
    $("lesson-restart").onclick = () => {
      if (this.model) this.start(this.model.lesson.id);
    };
    $("lesson-quiz").onclick = () => {
      if (this.model?.complete) {
        this.quizIndex = 0;
        this.drawQuestion();
        $("lesson-quiz-dialog").showModal();
      }
    };
    $("lesson-quiz-close").onclick = () => $("lesson-quiz-dialog").close();
    $("lesson-quiz-next").onclick = () => {
      this.quizIndex =
        (this.quizIndex + 1) % this.model.lesson.questions.length;
      this.drawQuestion();
    };
    $("projection-page").onchange = () => {
      this.visuals.page = +$("projection-page").value;
      if (this.model) this.update();
    };
    this.topics();
  }
  topics() {
    const grade = +$("lesson-grade").value,
      topics = [
        ...new Set(
          this.data.lessons
            .filter((l) => l.grade === grade)
            .map((l) => l.topic),
        ),
      ];
    $("lesson-topic").replaceChildren(...topics.map((t) => option(t, t)));
    this.experiments();
  }
  experiments() {
    const matches = this.data.lessons.filter(
      (l) =>
        l.grade === +$("lesson-grade").value &&
        l.topic === $("lesson-topic").value,
    );
    $("lesson-select").replaceChildren(
      ...matches.map((l) => {
        const o = option(
          l.id,
          l.title + (l.status === "ready" ? "" : " · đang phát triển"),
        );
        o.disabled = l.status !== "ready";
        return o;
      }),
    );
    this.preview();
  }
  preview() {
    const l = this.data.lessons.find((l) => l.id === $("lesson-select").value);
    $("lesson-start").disabled = l?.status !== "ready";
    text($("lesson-preview"), l ? l.objective : "Chưa có bài thực hành.");
  }
  start(id, restored = null) {
    const model = new LessonChemistry(this.data, id);
    if (restored) model.restore(restored.model);
    // Validate imported poses before clearing any existing work.
    const poses = restored?.poses || {};
    for (const [k, p] of Object.entries(poses))
      if (
        !model.vessels.has(k) ||
        !p ||
        ![p.x, p.y, p.z, p.roll, p.yaw, p.pitch].every(Number.isFinite) ||
        (p.sealed !== undefined && typeof p.sealed !== "boolean")
      )
        throw Error("Vị trí nhập không hợp lệ.");
    if (this.a.bench.active) this.a.bench.toggle();
    if (this.a.view.controls.enabled) $("view-mode").click();
    this.a.clear();
    this.model = model;
    model.onEvent = event => this.a.learning?.(event);
    this.a.learning?.({type: "lesson-start", lesson: id});
    this.lastCompletion = false;
    this.objects.clear();
    this.quizAnswers.clear();
    document.body.classList.add("lesson-active");
    $("lesson-panel").hidden = false;
    this.visuals.start(model.lesson);
    this.visuals.page = 0;
    $("projection-page").value = "0";
    const available = this.a.view.physics.limits;
    let other = 0;
    const spacing = Math.min(3.6, (available.xMax - available.xMin) / 3.6);
    try {
      for (const row of model.lesson.setup) {
        const x = row.role === "sample" ? 0 : ++other % 2 ? -spacing : spacing;
        const pose = poses[row.stock] || {
          x,
          y: -0.9,
          z: 0.35,
          roll: 0,
          yaw: 0,
          pitch: 0,
        };
        const m = model.get(row.stock);
        m.color = appearance(m).color;
        const o = this.a.create(row.stock, pose, {
          mixture: m,
          sealed: !!pose.sealed,
          roll: pose.roll,
          yaw: pose.yaw,
          pitch: pose.pitch,
        });
        if (!o) throw Error("Không đủ chỗ bố trí bài học.");
        o.lessonKey = row.stock;
        o.mixture = m;
        o.label.classList.add("lesson-label");
        o.label.querySelector("b").textContent = (o.stock.shortLabel || o.stock.name);
        this.objects.set(row.stock, o);
        this.refresh(o);
      }
    } catch (e) {
      this.a.clear();
      throw e;
    }
    text($("lab-title"), model.lesson.title);
    $("lesson-grade").value = String(model.lesson.grade);
    this.topics();
    $("lesson-topic").value = model.lesson.topic;
    this.experiments();
    $("lesson-select").value = id;
    this.preview();
    this.a.cards();
    this.a.resize();
    this.renderKnowledge();
    this.update();
    document.body.classList.add("sidebar-closed");
    $("sidebar-toggle").setAttribute("aria-expanded", "false");
    this.a.resize();
    document.querySelector("main").scrollTop = 0;
    this.a.message(model.lesson.steps[0]);
  }
  detach() {
    this.visuals.stop();
    this.model = null;
    this.objects.clear();
    $("lesson-panel").hidden = true;
    $("lesson-quiz-dialog").close();
    document.body.classList.remove("lesson-active", "sidebar-closed");
    $("sidebar-toggle").setAttribute("aria-expanded", "true");
    text($("lab-title"), "Bàn thí nghiệm 3D");
    this.a.cards();
  }
  canSpawn(stock) {
    return !this.active || this.allowed.includes(stock);
  }
  refresh(o) {
    const m = this.model.get(o.lessonKey),
      a = appearance(m);
    m.color = a.color;
    if (o.lessonVolume !== m.volume_ml) {
      o.mixture = m;
      this.a.view.updateMixture(o);
      o.lessonVolume = m.volume_ml;
    }
    this.visuals.update(o, m, 0.1);
    const quantity =
      o.stock.kind === "iron-strip"
        ? `${((m.mol.Fe || 0) * 55.845).toFixed(3)} g Fe`
        : o.stock.kind === "litmus"
          ? m.litmusBlue
            ? "Đã hóa xanh"
            : "Quỳ đỏ ẩm"
          : `${m.volume_ml.toFixed(1)} mL`;
    text(o.label.querySelector("span"), quantity);
    o.label.title = `${o.stock.name} — ${o.stock.formula} — ${quantity}`;
  }
  pour(source, target, amount = 2) {
    if (!source.lessonKey || !target.lessonKey)
      return { ok: false, message: "Chỉ sử dụng hóa chất của bài học." };
    this.a.view.scene.updateMatrixWorld(true);
    const aligned =
      this.a.view.pourTarget(source) === target &&
      source.pourable.axis.y <= Math.SQRT1_2;
    const response = this.model.transfer(
      source.lessonKey,
      target.lessonKey,
      amount,
      { kind: "pour", aligned, sealed: source.sealed || target.sealed },
    );
    if (response.ok) {
      source.version++;
      target.version++;
      this.refresh(source);
      this.refresh(target);
      this.a.view.stream(source, target, performance.now() + 300);
      this.update();
    }
    if (!response.ok) this.a.learning?.({type: source.sealed || target.sealed ? "blocked" : "pour-rejected", source: source.lessonKey, target: target.lessonKey, reason: response.message});
    this.a.message(response.message);
    return response;
  }
  tick(dt, now) {
    if (!this.model || this.a.bench.active) return;
    this.elapsed += dt;
    if (this.elapsed < 0.08) return;
    const elapsed = Math.min(this.elapsed, 0.2);
    this.elapsed = 0;
    const contacts = this.visuals.contacts(this.objects, this.model);
    this.model.step(elapsed, contacts);
    for (const [key, o] of this.objects) {
      const m = this.model.get(key);
      this.refresh(o);
      if (m.lastGasRate > 1e-8 && now - (o.lastLessonGas || 0) > 900) {
        this.a.view.effect(o, "bubbles", now, Math.min(1, m.lastGasRate / 0.00007));
        o.lastLessonGas = now;
      }
    }
    this.update();
  }
  status() {
    const m = this.model;
    if (!m) return "";
    if (m.lesson.id === "iron-copper") {
      const n = m.get("lesson-iron").mol.Cu || 0;
      return n > 0
        ? `Cu đã bám: ${(n * 1000).toFixed(2)} mmol · ${(n * 63.546).toFixed(3)} g. Nhấc sắt khỏi dung dịch để dừng.`
        : "Đưa thanh sắt qua miệng bình, ngập vào chất lỏng.";
    }
    if (m.lesson.id === "ammonium")
      return m.complete
        ? "Quỳ đỏ ẩm đã hóa xanh do khí NH₃."
        : m.observed
          ? "NH₃ không màu đang thoát (bọt là ký hiệu). Giữ giấy quỳ ẩm trên miệng bình."
          : "Rót NaOH vào NH₄Cl, sau đó thử khí bằng quỳ đỏ ẩm.";
    const sample = [...m.roles].find(([, r]) => r === "sample")[0],
      state = m.get(sample),
      a = appearance(state);
    if (m.lesson.id === "chloride")
      return a.solid
        ? `AgCl trắng: ${(a.solid.mol * 1000).toFixed(2)} mmol · ${(a.solid.mol * 143.32 * 1000).toFixed(1)} mg.`
        : "Chưa có kết tủa. Rót AgNO₃ vào mẫu NaCl.";
    if (m.lesson.id === "indicator")
      return `pH ≈ ${a.pH.toFixed(2)} · ${a.phenomenon} ${m.seenPink ? "Thêm HCl đến khi mất màu." : "Thêm NaOH để quan sát."}`;
    if(m.lesson.id==="neutralization")return `pH ≈ ${a.pH.toFixed(2)} · ${a.phenomenon}`;
    if(m.lesson.id==="dilution")return `V = ${state.volume_ml.toFixed(1)} mL · n(Cu²⁺) = ${(state.mol.Cu_2plus*1000).toFixed(2)} mmol · C = ${(state.mol.Cu_2plus/(state.volume_ml/1000)).toFixed(4)} M`;
    if(["copper-hydroxide","calcium-carbonate","carbon-dioxide"].includes(m.lesson.id))return m.observed?a.phenomenon:m.lesson.steps[1];
    return m.observed
      ? a.phenomenon
      : "Thêm thuốc thử biuret vào protein; so sánh với nước đối chứng.";
  }
  update() {
    const m = this.model,
      status = this.status();
    text($("lesson-status"), status);
    text(
      $("lesson-step"),
      m.complete ? "Đã quan sát đủ hiện tượng chính" : "Đang thực hành",
    );
    $("lesson-quiz").disabled = !m.complete;
    if (m.complete && !this.lastCompletion) this.a.learning?.({type: "completed", complete: true});
    this.lastCompletion = m.complete;
    text(
      $("lesson-observed"),
      m.observed
        ? `${status} ${m.lesson.phenomenon}`
        : "Chưa ghi nhận phản ứng. Phương trình bên dưới là dự đoán cần kiểm chứng.",
    );
    this.visuals.updateScreen(m, status);
    this.a.inspect();
  }
  renderKnowledge() {
    const l = this.model.lesson;
    const list = (id, rows) => {
      $(id).replaceChildren(
        ...rows.map((s) => {
          const p = document.createElement("li");
          p.textContent = s;
          return p;
        }),
      );
    };
    text($("lesson-objective"), l.objective);
    text($("lesson-equation"), l.equations.join("\n"));
    list("lesson-steps", l.steps);
    text($("lesson-explanation"), l.explanation);
    text($("lesson-application"), l.application);
    text($("lesson-safety"), l.safety);
    text($("lesson-limits"), l.limits);
    $("lesson-sources").replaceChildren(
      ...l.sources.map((key) => {
        const s = this.data.sources[key],
          a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent =
          s.title +
          (key === "curriculum"
            ? ` · trang ${l.curriculum.pages.join(", ")}`
            : "");
        return a;
      }),
    );
  }
  positionLabels() {
    const view = this.a.view,
      r = view.rect;
    const entries = [...this.objects.values()]
      .map((o) => ({ o, p: view.toScreen(o.group.position) }))
      .sort((a, b) => a.p.x - b.p.x || a.o.id - b.o.id);
    const gap = Math.min(160, (r.width - 24) / Math.max(entries.length, 1)),
      half = gap / 2;
    let last = -Infinity;
    for (const row of entries) {
      row.x = Math.max(row.p.x - r.left, last + gap);
      last = row.x;
    }
    const overflow = Math.max(
      0,
      (entries.at(-1)?.x || 0) - (r.width - half - 12),
    );
    for (const row of entries) {
      const x = Math.max(half + 12, row.x - overflow),
        y = r.height - 10;
      const transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`;
      if (row.o.labelTransform !== transform) {
        row.o.label.style.transform = transform;
        row.o.label.style.maxWidth = `${gap - 8}px`;
        row.o.labelTransform = transform;
      }
    }
  }
  describe(o) {
    if (!o?.lessonKey || !this.model) return null;
    const m = this.model.get(o.lessonKey);
    const amount = Object.entries(m.mol)
      .filter(([k, n]) => n > 1e-9 && k !== "H2O")
      .map(
        ([k, n]) =>
          `${SPECIES[k]?.formula || k}: ${(n * 1000).toFixed(3)} mmol`,
      )
      .join(" · ");
    return {
      name: o.stock.name,
      metrics: `${o.stock.formula}${["iron-strip", "litmus"].includes(o.stock.kind) ? "" : ` · ${m.volume_ml.toFixed(1)} mL`}${m.protein_g ? ` · protein ${(m.protein_g * 1000).toFixed(1)} mg` : ""}`,
      species: amount || m.note,
    };
  }
  drawQuestion() {
    text(
      $("lesson-score"),
      `Đã giải thích đúng ${this.quizAnswers.size}/${this.model.lesson.questions.length} câu.`,
    );
    const l = this.model.lesson,
      q = l.questions[this.quizIndex];
    text(
      $("lesson-question-count"),
      `Câu ${this.quizIndex + 1}/${l.questions.length} · ${l.title}`,
    );
    text($("lesson-question"), q.prompt);
    text(
      $("lesson-answer-feedback"),
      "Chọn câu trả lời; nếu chưa đúng, hãy dùng gợi ý để thử lại.",
    );
    $("lesson-answers").replaceChildren(
      ...q.options.map((label, i) => {
        const b = document.createElement("button");
        b.textContent = label;
        b.onclick = () => {
          const r = this.model.answer(this.quizIndex, i);
          this.a.learning?.({type: "answer", question: this.quizIndex, choice: i, correct: r.correct});
          text(
            $("lesson-answer-feedback"),
            (r.correct ? "Đúng. " : "Gợi ý: ") + r.text,
          );
          b.classList.toggle("correct", r.correct);
          if (r.correct) this.quizAnswers.set(this.quizIndex, i);
          text(
            $("lesson-score"),
            `Đã giải thích đúng ${this.quizAnswers.size}/${l.questions.length} câu.`,
          );
        };
        return b;
      }),
    );
  }
  snapshot() {
    return {
      schema: "hololab-lesson-1",
      model: this.model.snapshot(),
      poses: Object.fromEntries(
        [...this.objects].map(([k, o]) => [
          k,
          {
            ...o.target,
            roll: o.roll,
            yaw: o.yaw,
            pitch: o.pitch,
            sealed: o.sealed,
          },
        ]),
      ),
    };
  }
}
export function lessonStocks(data) {
  return data.stocks.map((stock) => ({
    ...stock,
    openVessel: stock.id === "lesson-copper",
    mixture: {
      ...initialMixture(stock.initial),
      color: appearance(initialMixture(stock.initial)).color,
    },
  }));
}
