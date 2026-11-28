/** Ideal dilute aqueous equilibrium at 25 C. Volumes in mL, amounts in mmol. */
export function equilibrium({
  acid = "HCl",
  acidM = 0.1,
  base = "NaOH",
  baseM = 0.1,
  initialMl = 25,
  addedMl = 0,
}) {
  if (
    !["HCl", "HNO3", "CH3COOH"].includes(acid) ||
    !["NaOH", "KOH"].includes(base)
  )
    throw new Error("Cặp thuốc thử chưa được mô hình chuẩn độ hỗ trợ.");
  for (const x of [acidM, baseM, initialMl, addedMl])
    if (!Number.isFinite(x)) throw new Error("Số liệu không hữu hạn");
  if (
    acidM <= 0 ||
    acidM > 1 ||
    baseM <= 0 ||
    baseM > 1 ||
    initialMl <= 0 ||
    initialMl > 100 ||
    addedMl < 0 ||
    addedMl > 50
  )
    throw new Error("Thông số ngoài miền mô hình");
  const volume = initialMl + addedMl,
    acidAmount = acidM * initialMl,
    baseAmount = baseM * addedMl;
  const ca = acidAmount / volume,
    cb = baseAmount / volume,
    kw = 1e-14,
    ka = 1.8e-5;
  let H;
  if (acid === "CH3COOH") {
    // Electroneutrality H + Na = OH + acetate; bisection in pH handles all regions.
    let lo = -1,
      hi = 15;
    for (let i = 0; i < 64; i++) {
      const p = (lo + hi) / 2,
        h = 10 ** -p;
      const charge = h + cb - kw / h - (ca * ka) / (ka + h);
      if (charge > 0) lo = p;
      else hi = p;
    }
    H = 10 ** (-(lo + hi) / 2);
  } else {
    const excess = ca - cb,
      root = Math.sqrt(excess * excess + 4 * kw);
    H = excess >= 0 ? (excess + root) / 2 : (2 * kw) / (root - excess); // avoids cancellation in base excess
  }
  const ph = -Math.log10(H),
    equivalentMl = acidAmount / baseM;
  const pink = Math.min(1, Math.max(0, (ph - 8.2) / 1.8));
  return {
    ph,
    volume,
    addedMl,
    equivalentMl,
    acidRemainingMmol: Math.max(0, acidAmount - baseAmount),
    baseRemainingMmol: Math.max(0, baseAmount - acidAmount),
    reactedMmol: Math.min(acidAmount, baseAmount),
    pink,
    feedback:
      addedMl > equivalentMl + 0.1
        ? "Đã vượt điểm tương đương: bazơ dư. Sai tỉ lệ không có nghĩa phản ứng ngừng."
        : Math.abs(addedMl - equivalentMl) <= 0.1
          ? "Gần điểm tương đương. Điểm kết thúc chỉ thị không trùng chính xác điểm tương đương."
          : "Axit còn dư; tiếp tục thêm từng lượng nhỏ khi gần điểm tương đương.",
  };
}
export class Titration {
  constructor() {
    this.reset();
  }
  reset(config = {}) {
    const next = {
      acid: "HCl",
      base: "NaOH",
      acidM: 0.1,
      baseM: 0.1,
      initialMl: 25,
      ...config,
    };
    equilibrium({ ...next, addedMl: 0 });
    this.config = next;
    this.addedMl = 0;
    this.open = 0;
    this.history = [];
    this.sample();
  }
  sample() {
    this.value = equilibrium({ ...this.config, addedMl: this.addedMl });
    return this.value;
  }
  add(ml) {
    if (!Number.isFinite(ml) || ml < 0)
      throw new Error("Thể tích không hợp lệ");
    this.addedMl = Math.min(50, this.addedMl + ml);
    if (this.addedMl === 50) this.open = 0;
    this.sample();
    this.history.push({ volume: this.addedMl, ph: this.value.ph });
    if (this.history.length > 1500) this.history.shift();
    return this.value;
  }
  step(dt) {
    if (!Number.isFinite(dt) || dt < 0) throw new Error("dt không hợp lệ");
    if (this.open > 0) this.add(Math.min(dt, 0.1) * this.open * 1.5);
  }
}
