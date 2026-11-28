import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseRoute, href } from '../ui/lib/routes.js';
import { chemicalIndex, filterLessons, normalizeVi, savedLessonId, savedStatus, topicsOf } from '../ui/lib/search.js';

const data = JSON.parse(fs.readFileSync(new URL('../web/data/lessons-thpt.json', import.meta.url)));
const chem = chemicalIndex(data.lessons, data.stocks);
const ids = (rows) => rows.map((l) => l.id);

test('hash routes', () => {
  assert.deepEqual(parseRoute(''), { name: 'intro' });
  assert.deepEqual(parseRoute('#/'), { name: 'intro' });
  assert.deepEqual(parseRoute('#/login'), { name: 'login' });
  assert.deepEqual(parseRoute('#/learn'), { name: 'overview' });
  assert.deepEqual(parseRoute('#/learn/experiments?grade=10'), { name: 'experiments' });
  assert.deepEqual(parseRoute('#/learn/experiments/chloride'), { name: 'practice', id: 'chloride' });
  assert.deepEqual(parseRoute(href.practice('a b')), { name: 'practice', id: 'a b' });
  assert.equal(parseRoute('#/nope').name, 'intro');
});

test('Vietnamese-insensitive normalisation, subscripts too', () => {
  assert.equal(normalizeVi('  Bạc  NITRAT '), 'bac nitrat');
  assert.equal(normalizeVi('Đồng(II)'), 'dong(ii)');
  assert.equal(normalizeVi('NH₄Cl'), 'nh4cl');
});

test('real data: 10 ready lessons, topics come from the data', () => {
  assert.equal(filterLessons(data.lessons).length, 10);
  assert.deepEqual(topicsOf(data.lessons), [...new Set(data.lessons.map((l) => l.topic))].sort((a, b) => a.localeCompare(b, 'vi')));
});

test('search by title, without diacritics, and by chemical name or formula', () => {
  // 'chloride' also matches lessons whose chemicals are ammonium chloride and calcium chloride
  assert.deepEqual(ids(filterLessons(data.lessons, { query: 'chloride' }, chem)), ['chloride', 'ammonium', 'calcium-carbonate']);
  assert.deepEqual(ids(filterLessons(data.lessons, { query: 'chloride', grade: '10' }, chem)), ['chloride']);
  assert.ok(ids(filterLessons(data.lessons, { query: 'nhan biet' }, chem)).includes('ammonium'));
  assert.deepEqual(ids(filterLessons(data.lessons, { query: 'silver nitrate' }, chem)), ['chloride']);
  assert.ok(ids(filterLessons(data.lessons, { query: 'NaOH' }, chem)).length >= 2);
  assert.ok(ids(filterLessons(data.lessons, { query: 'CuSO4' }, chem)).includes('iron-copper'));
  assert.deepEqual(filterLessons(data.lessons, { query: 'zzzz' }, chem), []);
});

test('grade and topic filters combine', () => {
  const g10 = filterLessons(data.lessons, { grade: '10' }, chem);
  assert.ok(g10.length && g10.every((l) => l.grade === 10));
  const topic = data.lessons[0].topic;
  const both = filterLessons(data.lessons, { grade: String(data.lessons[0].grade), topic }, chem);
  assert.ok(both.length && both.every((l) => l.topic === topic));
});

test('saved session: lesson id and status only from real flags', () => {
  const lesson = { data: { schema: 'hololab-lesson-1', model: { lesson: 'chloride', observed: true, complete: false } } };
  assert.equal(savedLessonId(lesson), 'chloride');
  assert.equal(savedStatus(lesson), 'Đã quan sát hiện tượng');
  assert.equal(savedStatus({ data: { schema: 'hololab-lesson-1', model: { lesson: 'x', complete: true } } }), 'Đã làm hết các bước');
  assert.equal(savedStatus({ data: { schema: 'hololab-lesson-1', model: { lesson: 'x' } } }), 'Đang làm dở');
  assert.equal(savedLessonId({ data: { schema: 'hololab3-session-1' } }), null);
  assert.equal(savedStatus({ data: { schema: 'hololab3-session-1' } }), 'Bàn thí nghiệm tự do');
  assert.equal(savedLessonId(null), null);
});
