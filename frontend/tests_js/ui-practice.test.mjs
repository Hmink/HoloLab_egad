import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  _resetChatMemory, chatState, composerAction, getConsent, lessonQuestions, noModel, pageTurns, setConsent, subscribeChat, updateChat,
} from '../ui/lib/egad-chat.js';
import { browserHistory } from '../ui/lib/history.js';

const data = JSON.parse(fs.readFileSync(new URL('../web/data/lessons-thpt.json', import.meta.url)));
const rubrics = JSON.parse(fs.readFileSync(new URL('../web/data/egad-rubrics.json', import.meta.url)));
const ready = data.lessons.filter((l) => l.status === 'ready');

test('every ready lesson has EGAD questions and a rubric; ids follow the backend (q1, q2, …)', () => {
  for (const l of ready) {
    const qs = lessonQuestions(l);
    assert.ok(qs.length > 0, l.id);
    assert.ok(rubrics[l.id]?.concepts?.length, l.id);
    qs.forEach((q, i) => { assert.equal(q.id, l.questions[i].id ?? `q${i + 1}`); assert.equal(typeof q.text, 'string'); });
  }
  assert.deepEqual(lessonQuestions({ questions: [{ id: 'a', text: 'A?' }, { prompt: 'B?' }, null, { foo: 1 }] }), [{ id: 'a', text: 'A?' }, { id: 'q2', text: 'B?' }]);
  assert.deepEqual(lessonQuestions(null), []);
});

test('Enter sends, Shift+Enter and IME composition do not', () => {
  assert.equal(composerAction({ key: 'Enter' }), 'send');
  assert.equal(composerAction({ key: 'Enter', shiftKey: true }), null);
  assert.equal(composerAction({ key: 'Enter', isComposing: true }), null);
  // React synthetic events have no isComposing: it is read from nativeEvent
  assert.equal(composerAction({ key: 'Enter', nativeEvent: { isComposing: true } }), null);
  assert.equal(composerAction({ key: 'Enter', keyCode: 229 }), null);
  assert.equal(composerAction({ key: 'a' }), null);
});

test('no-model errors point to the rubric panel; other errors do not', () => {
  for (const code of ['llm_unavailable', 'model_not_found', 'not_configured', 'network']) assert.equal(noModel({ code }), true);
  for (const code of ['busy', 'invalid_model_output', 'invalid_answer', undefined]) assert.equal(noModel({ code }), false);
});

test('chat memory is per lesson, page-only, and a retry replaces the earlier error', () => {
  _resetChatMemory();
  let calls = 0;
  const off = subscribeChat(() => calls++);
  assert.equal(getConsent(), false);
  setConsent(true);
  assert.equal(getConsent(), true);
  updateChat('chloride', () => ({ messages: [
    { id: 'i', kind: 'intro' },
    { id: 'q', kind: 'question', text: 'Chất rắn màu trắng là gì?' },
    { id: 'a1', kind: 'answer', text: 'AgCl', at: '2026-11-28T01:00:00Z' },
    { id: 'e1', kind: 'error', answerId: 'a1', error: { message: 'Ollama bận', code: 'llm_unavailable', retryable: true } },
  ] }));
  assert.equal(pageTurns()[0].turns[0].error.code, 'llm_unavailable');
  updateChat('chloride', (s) => ({ messages: [...s.messages, { id: 'r1', kind: 'result', answerId: 'a1', result: { label: 'correct', feedback: 'Vì sao?' } }] }));
  updateChat('biuret', () => ({ messages: [{ id: 'b1', kind: 'answer', text: 'tím', at: '2026-11-28T02:00:00Z' }] }));
  const turns = pageTurns();
  assert.deepEqual(turns.map((t) => t.lessonId), ['biuret', 'chloride']); // newest first
  const t = turns[1].turns[0];
  assert.equal(t.question, 'Chất rắn màu trắng là gì?');
  assert.equal(t.result.label, 'correct');
  assert.equal(t.error, null);
  assert.equal(turns[0].turns[0].result, null); // still waiting
  assert.equal(chatState('dilution').messages.length, 0); // untouched lesson
  assert.ok(calls >= 4);
  off();
  _resetChatMemory();
  assert.deepEqual(pageTurns(), []);
});

test('browser history source: saved sessions + page turns in one shape', () => {
  const saved = [
    { name: 'Nhận biết ion chloride', date: '28/11/2026', data: { schema: 'hololab-lesson-1', model: { lesson: 'chloride', observed: true } } },
    { name: 'Bàn thí nghiệm 3D', date: '27/11/2026', data: { objects: [] } },
  ];
  const h = browserHistory({ saved, lessons: data.lessons, turns: [{ lessonId: 'chloride', turns: [{ answer: 'x' }] }] });
  assert.equal(h.source, 'browser');
  assert.equal(h.sessions[0].lesson.id, 'chloride');
  assert.equal(h.sessions[0].status, 'Đã quan sát hiện tượng');
  assert.equal(h.sessions[1].lesson, null);
  assert.equal(h.sessions[1].status, 'Bàn thí nghiệm tự do');
  assert.notEqual(h.sessions[0].key, h.sessions[1].key);
  assert.equal(h.live[0].lesson.title, data.lessons.find((l) => l.id === 'chloride').title);
  assert.equal(h.sessions[0].raw, saved[0]);
});
