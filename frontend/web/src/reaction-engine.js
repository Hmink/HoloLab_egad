/** Molecular stoichiometry only. Preset equations, not arbitrary mixture prediction. */
export function atoms(formula) {
  const tokens = formula.match(/[A-Z][a-z]?|\d+|[()]/g) || [];
  if (tokens.join("") !== formula)
    throw new Error("Unsupported formula " + formula);
  const stack = [{}];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "(") {
      stack.push({});
      continue;
    }
    if (t === ")") {
      if (stack.length < 2) throw new Error("Unmatched bracket");
      const part = stack.pop();
      const n = /^\d+$/.test(tokens[i + 1]) ? Number(tokens[++i]) : 1;
      for (const [a, c] of Object.entries(part))
        stack.at(-1)[a] = (stack.at(-1)[a] || 0) + c * n;
      continue;
    }
    if (!/^[A-Z]/.test(t)) throw new Error("Unexpected coefficient");
    const n = /^\d+$/.test(tokens[i + 1]) ? Number(tokens[++i]) : 1;
    stack.at(-1)[t] = (stack.at(-1)[t] || 0) + n;
  }
  if (stack.length !== 1) throw new Error("Unclosed bracket");
  return stack[0];
}
export function balanced(r) {
  const tally = {};
  for (const [side, sign] of [
    [r.reactants, -1],
    [r.products, 1],
  ])
    for (const [f, n] of Object.entries(side)) {
      if (!Number.isInteger(n) || n <= 0) return false;
      for (const [a, c] of Object.entries(atoms(f)))
        tally[a] = (tally[a] || 0) + sign * n * c;
    }
  return Object.values(tally).every((n) => n === 0);
}
export function react(r, amounts, conditionsMet = false) {
  if (!balanced(r)) throw new Error("Phương trình không bảo toàn nguyên tố");
  if (!conditionsMet)
    return {
      status: "condition_required",
      message: "Chưa xác nhận điều kiện: " + r.condition,
    };
  for (const [f, n] of Object.entries(amounts))
    if (!Number.isFinite(n) || n < 0 || n > 1000)
      throw new Error("Số mol không hợp lệ: " + f);
  const extra = Object.keys(amounts).filter(
    (f) => !(f in r.reactants) && amounts[f] > 0,
  );
  if (extra.length)
    return {
      status: "unsupported_mixture",
      message:
        "Có chất ngoài phương trình: " +
        extra.join(", ") +
        ". Không suy đoán phản ứng.",
    };
  const extent = Math.min(
    ...Object.entries(r.reactants).map(([f, n]) => (amounts[f] || 0) / n),
  );
  const remaining = {},
    products = {};
  for (const [f, n] of Object.entries(r.reactants))
    remaining[f] = Math.max(0, (amounts[f] || 0) - n * extent);
  for (const [f, n] of Object.entries(r.products)) products[f] = n * extent;
  const limiting = Object.keys(remaining).filter((f) => remaining[f] < 1e-12);
  return {
    status: extent > 0 ? "calculated" : "missing_reactant",
    extent_mol: extent,
    limiting,
    remaining_mol: remaining,
    products_mol: products,
    phenomenon: r.phenomenon,
    precipitate_colors: r.precipitate_colors,
    hazard: r.hazard,
    limitation:
      r.limitation ||
      "Lượng sản phẩm lý thuyết tối đa; không tính cân bằng, tốc độ hoặc phản ứng cạnh tranh.",
    message:
      extent > 0
        ? "Chất giới hạn quyết định lượng phản ứng. Chất dư vẫn còn trong bình."
        : "Thiếu chất tham gia, chưa có phản ứng theo phương trình này.",
  };
}
