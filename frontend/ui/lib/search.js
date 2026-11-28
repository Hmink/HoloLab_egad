// Library search and filters. Pure functions (unit-tested in tests_js/ui-library.test.mjs).

/** Lower-case, strip Vietnamese diacritics (đ -> d), NFKC so subscripts match: "NH₃" -> "nh3". */
export function normalizeVi(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

/** lesson id -> [{name, formula}] for the chemicals in the lesson's setup (stocks of lessons-thpt.json). */
export function chemicalIndex(lessons, stocks) {
  const byId = new Map((stocks || []).map((s) => [s.id, s]));
  const index = {};
  for (const l of lessons || []) {
    index[l.id] = (l.setup || [])
      .map((row) => byId.get(row.stock))
      .filter(Boolean)
      .map((s) => ({ name: s.name, formula: s.formula }));
  }
  return index;
}

export function topicsOf(lessons) {
  return [...new Set((lessons || []).map((l) => l.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
}

/** Only real, ready lessons; query matches title, topic, objective or chemical names/formulas. */
export function filterLessons(lessons, { query = '', grade = 'all', topic = 'all' } = {}, chemicals = {}) {
  const q = normalizeVi(query);
  return (lessons || []).filter((l) => {
    if (l.status !== 'ready') return false;
    if (grade !== 'all' && l.grade !== Number(grade)) return false;
    if (topic !== 'all' && l.topic !== topic) return false;
    if (!q) return true;
    const chem = (chemicals[l.id] || []).map((c) => `${c.name} ${c.formula}`).join(' ');
    return normalizeVi(`${l.title} ${l.topic} ${l.objective || ''} ${chem}`).includes(q);
  });
}

/** Lesson id of a saved session entry (localStorage "hololab-saved-v38"), or null for a free bench. */
export function savedLessonId(entry) {
  const d = entry?.data;
  return d?.schema === 'hololab-lesson-1' && typeof d.model?.lesson === 'string' ? d.model.lesson : null;
}

/** Human status of a saved session, only from flags the lab really records. */
export function savedStatus(entry) {
  const m = entry?.data?.model;
  if (!savedLessonId(entry)) return 'Bàn thí nghiệm tự do';
  if (m?.complete) return 'Đã làm hết các bước';
  if (m?.observed) return 'Đã quan sát hiện tượng';
  return 'Đang làm dở';
}
