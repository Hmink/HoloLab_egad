/** Pure lesson chemistry. No Three.js, DOM, MediaPipe, randomness or collision hooks.
 * Amounts in mol, mL and g. Time constants are educational animation scales.
 */
export const SPECIES = Object.freeze({
  CuOH2: {formula:"Cu(OH)₂",solid:true},
  Ca_2plus: {formula:"Ca²⁺",charge:2},
  CO3_2minus: {formula:"CO₃²⁻",charge:-2},
  CaCO3: {formula:"CaCO₃",solid:true},
  HCO3_minus: {formula:"HCO₃⁻",charge:-1},
  CH3COOH: {formula:"CH₃COOH"},
  CH3COO_minus: {formula:"CH₃COO⁻",charge:-1},
  CO2: {formula:"CO₂"},
  H_plus: { formula: "H⁺", charge: 1 },
  OH_minus: { formula: "OH⁻", charge: -1 },
  Na_plus: { formula: "Na⁺", charge: 1 },
  Cl_minus: { formula: "Cl⁻", charge: -1 },
  NO3_minus: { formula: "NO₃⁻", charge: -1 },
  Ag_plus: { formula: "Ag⁺", charge: 1 },
  AgCl: { formula: "AgCl", solid: true },
  Cu_2plus: { formula: "Cu²⁺", charge: 2 },
  SO4_2minus: { formula: "SO₄²⁻", charge: -2 },
  Fe_2plus: { formula: "Fe²⁺", charge: 2 },
  Fe: { formula: "Fe", solid: true },
  Cu: { formula: "Cu", solid: true },
  NH4_plus: { formula: "NH₄⁺", charge: 1 },
  NH3: { formula: "NH₃" },
  H2O: { formula: "H₂O" },
  biuret_Cu: { formula: "Cu(II) trong thuốc thử", charge: 2 },
});
const EPS = 1e-12;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export function initialMixture(initial = {}) {
  return {
    volume_ml: 0,
    mol: {},
    escaped_mol: {},
    origins: {},
    temperature_K: 298.15,
    unknown: false,
    solid_copper_g: 0,
    protein_g: 0,
    indicator_g: 0,
    note: "Mô hình bài học.",
    ...structuredClone(initial),
    escaped_mol: { ...(initial.escaped_mol || {}) },
    mol: { ...(initial.mol || {}) },
  };
}
export function ph(m) {
  if (m.volume_ml <= EPS) return null;
  // These lessons do not yet solve carbonate/acetate equilibria; do not show a fabricated pH.
  if (["CO3_2minus","HCO3_minus","CH3COOH","CH3COO_minus"].some(k=>m.mol[k]>EPS)) return null;
  // Charge balance; NH4+/NH3 is a weak-base family. Hydrolysis of metal ions is not modeled.
  const L = m.volume_ml / 1000,
    totalN = ((m.mol.NH4_plus || 0) + (m.mol.NH3 || 0)) / L;
  let fixed = 0;
  for (const [key, n] of Object.entries(m.mol))
    if (!["H_plus", "OH_minus", "NH4_plus"].includes(key))
      fixed += ((SPECIES[key]?.charge || 0) * n) / L;
  let low = -14,
    high = 0;
  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2,
      h = 10 ** mid,
      f = h + fixed + (totalN * h) / (5.62e-10 + h) - 1e-14 / h;
    if (f > 0) high = mid;
    else low = mid;
  }
  return -(low + high) / 2;
}
export function appearance(m) {
  let color = [0.79, 0.91, 0.96],
    phenomenon = "Chưa có hiện tượng phản ứng.",
    solid = null;
  const blend = (target, t) => {
    color = color.map((c, i) => c + (target[i] - c) * clamp(t, 0, 1));
  };
  const L = Math.max(m.volume_ml / 1000, 1e-9);
  if (m.mol.Fe_2plus) blend([0.5, 0.78, 0.58], m.mol.Fe_2plus / L / 0.05);
  if (m.mol.Cu_2plus) blend([0.06, 0.43, 0.94], m.mol.Cu_2plus / L / 0.05);
  if (m.mol.biuret_Cu) blend([0.2, 0.55, 0.91], m.mol.biuret_Cu / L / 0.005);
  const pH = ph(m);
  if (m.indicator_g > EPS) {
    const strength = clamp((pH - 8.2) / 1.8, 0, 1);
    blend([0.92, 0.12, 0.56], strength);
    phenomenon =
      strength > 0.02
        ? "Phenolphthalein màu hồng."
        : "Phenolphthalein không màu.";
  }
  if (m.protein_g > EPS && m.mol.biuret_Cu > EPS && pH >= 10.5) {
    blend([0.53, 0.15, 0.75], clamp(m.protein_g / L / 1, 0, 1));
    phenomenon = "Phức Cu(II)–peptide màu tím.";
  }
  if ((m.mol.AgCl || 0) > EPS) {
    solid = { species: "AgCl", mol: m.mol.AgCl, color: [0.98, 0.98, 0.92] };
    phenomenon = "Kết tủa AgCl trắng; dung dịch vẩn đục rồi lắng.";
  }
  for(const [species,shade,name] of [["CuOH2",[.2,.65,.95],"Cu(OH)₂ xanh"],["CaCO3",[.97,.97,.94],"CaCO₃ trắng"]]) {
    if(m.mol[species]>EPS){solid={species,mol:m.mol[species],color:shade};phenomenon="Kết tủa "+name+".";}
  }
  if((m.mol.CO2||0)+(m.escaped_mol.CO2||0)>EPS)phenomenon="Khí CO₂ không màu thoát ra (bọt là minh họa).";
  return {
    color,
    solid,
    pH,
    phenomenon,
    purple: m.protein_g > EPS && m.mol.biuret_Cu > EPS && pH >= 10.5,
  };
}
export class LessonChemistry {
  constructor(data, id) {
    this.data = data;
    this.lesson = data.lessons.find((l) => l.id === id && l.status === "ready");
    if (!this.lesson) throw Error("Bài học chưa sẵn sàng.");
    this.vessels = new Map();
    this.roles = new Map();
    this.events = [];
    this.complete = false;
    this.seenPink = false;
    this.observed = false;
    this.time = 0;
    this.revision = 0;
    for (const row of this.lesson.setup) {
      const s = data.stocks.find((s) => s.id === row.stock);
      this.vessels.set(row.stock, initialMixture(s.initial));
      this.roles.set(row.stock, row.role);
    }
  }
  get(key) {
    const m = this.vessels.get(key);
    if (!m) throw Error("Dụng cụ không thuộc bài học.");
    return m;
  }
  record(event) {
    this.events.push({ t: this.time, ...event });
    this.onEvent?.(event);
    if (this.events.length > 2000) this.events.shift();
    this.revision++;
  }
  reaction(m, id, reactants, products) {
    const extent = Math.min(
      ...Object.entries(reactants).map(([key, c]) => (m.mol[key] || 0) / c),
    );
    if (extent <= EPS) return 0;
    for (const [k, c] of Object.entries(reactants))
      m.mol[k] = Math.max(0, (m.mol[k] || 0) - c * extent);
    for (const [k, c] of Object.entries(products))
      m.mol[k] = (m.mol[k] || 0) + c * extent;
    this.record({ type: "reaction", id, extent_mol: extent });
    return extent;
  }
  transfer(from, to, requested, action = {}) {
    if (
      from === to ||
      action.kind !== "pour" ||
      !action.aligned ||
      action.sealed ||
      !Number.isFinite(requested) ||
      requested <= 0
    )
      return {
        ok: false,
        message: "Cần nghiêng bình mở và rót đúng vào miệng bình nhận.",
      };
    const a = this.get(from),
      b = this.get(to),
      target = this.data.stocks.find((s) => s.id === to);
    if (!["beaker", "flask", "tube", "bottle", "dropper"].includes(target.kind))
      return { ok: false, message: "Dụng cụ này không chứa được dung dịch." };
    const ml = Math.min(
      requested,
      a.volume_ml,
      target.capacity_ml - b.volume_ml,
    );
    if (ml <= EPS)
      return {
        ok: false,
        message:
          a.volume_ml <= EPS
            ? "Bình nguồn đã hết dung dịch."
            : "Bình nhận đã đầy.",
      };
    const fraction = ml / a.volume_ml;
    for (const [key, n] of Object.entries(a.mol))
      if (!["Fe", "Cu"].includes(key)) {
        const dn = n * fraction;
        a.mol[key] -= dn;
        b.mol[key] = (b.mol[key] || 0) + dn;
      }
    for (const key of ["protein_g", "indicator_g"]) {
      const d = (a[key] || 0) * fraction;
      a[key] -= d;
      b[key] = (b[key] || 0) + d;
    }
    a.volume_ml -= ml;
    b.volume_ml += ml;
    this.record({ type: "pour", from, to, amount_ml: ml });
    for (const rule of this.data.reactionRules)
      if (rule.phase === "pour" && this.lesson.reactionIds.includes(rule.id))
        this.reaction(b, rule.id, rule.reactants, rule.products);
    this.observe(to);
    const visual = appearance(b);
    return { ok: true, amount_ml: ml, message: visual.phenomenon };
  }
  observe(key) {
    const m = this.get(key),
      a = appearance(m);
    if (this.roles.get(key) !== "sample") return;
    if(["copper-hydroxide","calcium-carbonate"].includes(this.lesson.id)&&a.solid)this.complete=this.observed=true;
    if(this.lesson.id==="carbon-dioxide"&&(m.mol.CO2||0)+(m.escaped_mol.CO2||0)>1e-8)this.complete=this.observed=true;
    if(this.lesson.id==="dilution"&&m.volume_ml>100.1)this.complete=this.observed=true;
    if(this.lesson.id==="neutralization"){
      this.observed=this.events.some(e=>e.type==="reaction"&&e.id==="neutralization");
      this.complete=this.observed&&(m.mol.H_plus||0)<1e-8;
    }
    if (this.lesson.id === "chloride" && (m.mol.AgCl || 0) > 1e-8)
      this.complete = this.observed = true;
    if (this.lesson.id === "indicator") {
      if (m.indicator_g > EPS && a.pH > 8.4)
        this.seenPink = this.observed = true;
      if (this.seenPink && a.pH < 8.2) this.complete = true;
    }
    if (this.lesson.id === "biuret" && a.purple)
      this.complete = this.observed = true;
  }
  step(dt, contacts = {}) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(0.2, dt);
    this.time += dt;
    if (this.lesson.id === "iron-copper" && contacts.immersed) {
      const metal = this.get("lesson-iron"),
        solution = this.get("lesson-copper");
      const extent = Math.min(
        metal.mol.Fe || 0,
        solution.mol.Cu_2plus || 0,
        0.00035 * dt,
      );
      if (extent > EPS) {
        metal.mol.Fe -= extent;
        metal.mol.Cu = (metal.mol.Cu || 0) + extent;
        solution.mol.Cu_2plus -= extent;
        solution.mol.Fe_2plus = (solution.mol.Fe_2plus || 0) + extent;
        this.observed = true;
        this.complete = (metal.mol.Cu || 0) > 0.00015;
        this.record({ type: "immersion-reaction", extent_mol: extent });
      }
    }
    if(this.lesson.id==="carbon-dioxide")for(const [key,m] of this.vessels){
      m.lastGasRate=0;
      if(!contacts.sealed?.has(key)){const escape=(m.mol.CO2||0)*(1-Math.exp(-dt*1.2));m.mol.CO2=(m.mol.CO2||0)-escape;m.escaped_mol.CO2=(m.escaped_mol.CO2||0)+escape;m.lastGasRate=escape/dt;if(escape>EPS)this.revision++;}
    }
    if (this.lesson.id === "ammonium")
      for (const [key, m] of this.vessels) {
        const escape = (m.mol.NH3 || 0) * (1 - Math.exp(-dt * 0.35));
        m.lastGasRate = 0;
        if (escape > EPS && !contacts.sealed?.has(key)) {
          m.mol.NH3 -= escape;
          m.escaped_mol.NH3 = (m.escaped_mol.NH3 || 0) + escape;
          m.lastGasRate = escape / dt;
          this.observed = true;
          this.revision++;
        }
        if (
          key === "lesson-ammonium" &&
          contacts.litmusAbove === key &&
          m.lastGasRate > 1e-8
        ) {
          this.complete = true;
          this.get("lesson-litmus").litmusBlue = true;
          this.revision++;
        }
      }
  }
  answer(index, choice) {
    const q = this.lesson.questions[index];
    if (
      !q ||
      !Number.isInteger(choice) ||
      choice < 0 ||
      choice >= q.options.length
    )
      throw Error("Lựa chọn không hợp lệ.");
    return {
      correct: choice === q.correct,
      text: choice === q.correct ? q.explanation : q.hint,
    };
  }
  snapshot() {
    return {
      lesson: this.lesson.id,
      vessels: Object.fromEntries(this.vessels),
      events: this.events,
      complete: this.complete,
      observed: this.observed,
      seenPink: this.seenPink,
      time: this.time,
    };
  }
  restore(raw) {
    if (raw.lesson !== this.lesson.id) throw Error("Sai bài học.");
    const entries = Object.entries(raw.vessels || {});
    if (entries.length !== this.vessels.size)
      throw Error("Thiếu dụng cụ bài học.");
    const allowed = new Set(
      [...this.vessels.values()]
        .flatMap((m) => Object.keys(m.mol))
        .concat(
          this.data.reactionRules
            .filter((r) => this.lesson.reactionIds.includes(r.id))
            .flatMap((r) => Object.keys(r.products)),
        ),
    );
    const next = new Map();
    for (const [key, value] of entries) {
      if (!this.vessels.has(key)) throw Error("Hóa chất ngoài bài học.");
      const cap = this.data.stocks.find((s) => s.id === key).capacity_ml;
      if (
        !Number.isFinite(value.volume_ml) ||
        value.volume_ml < 0 ||
        value.volume_ml > cap
      )
        throw Error("Thể tích không hợp lệ.");
      const m = initialMixture(value);
      for (const [k, n] of Object.entries(m.mol))
        if (!allowed.has(k) || !Number.isFinite(n) || n < 0 || n > 1)
          throw Error("Lượng chất không hợp lệ.");
      for (const [k, n] of Object.entries(m.escaped_mol))
        if (!(k === "NH3" || (k === "CO2" && this.lesson.id === "carbon-dioxide")) || !Number.isFinite(n) || n < 0 || n > 1)
          throw Error("Lượng khí không hợp lệ.");
      for (const key of ["protein_g", "indicator_g"])
        if (!Number.isFinite(m[key]) || m[key] < 0 || m[key] > 10)
          throw Error("Khối lượng không hợp lệ.");
      next.set(key, m);
    }
    this.vessels = next;
    this.complete = !!raw.complete;
    this.observed = !!raw.observed;
    this.seenPink = !!raw.seenPink;
    this.time = Number.isFinite(raw.time) ? Math.max(0, raw.time) : 0;
    this.events = Array.isArray(raw.events) ? raw.events.slice(-2000) : [];
    this.revision++;
  }
}
