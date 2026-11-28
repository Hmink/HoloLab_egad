import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_ANSWER, answerProblem, buildRecord, buildRequest, canRetry, canSubmit, conceptNames, exportJson, labelInfo, newSessionId, normalizeLessons } from '../src/lib/egad.js';

test('answerProblem validates length', () => {
  assert.ok(answerProblem('   '));
  assert.equal(answerProblem('ok'), null);
  assert.ok(answerProblem('x'.repeat(MAX_ANSWER + 1)));
  assert.equal(answerProblem('x'.repeat(MAX_ANSWER)), null);
});

test('canSubmit needs both consents, a valid answer and no pending request', () => {
  const ok = { answer: 'a', consent: true, busy: false };
  assert.equal(canSubmit(ok), true);
  assert.equal(canSubmit({ ...ok, consent: false }), false);
  assert.equal(canSubmit({ ...ok, busy: true }), false);
  assert.equal(canSubmit({ ...ok, answer: ' ' }), false);
});

test('buildRequest matches the backend contract', () => {
  assert.deepEqual(buildRequest({ lessonId: 'chloride', answer: ' hi ' }), { lesson: 'chloride', answer: 'hi', consent: true });
});

test('buildRequest adds question_id and session_id only when given', () => {
  assert.deepEqual(
    buildRequest({ lessonId: 'c', questionId: 'q1', sessionId: 's1', answer: 'a' }),
    { lesson: 'c', answer: 'a', consent: true, question_id: 'q1', session_id: 's1' },
  );
  assert.equal('question_id' in buildRequest({ lessonId: 'c', answer: 'a' }), false);
});

test('newSessionId fits the backend rule', () => {
  assert.match(newSessionId(), /^[A-Za-z0-9_-]{1,64}$/);
});

test('canRetry only for retryable errors', () => {
  assert.equal(canRetry({ retryable: true }), true);
  assert.equal(canRetry({ retryable: false }), false);
  assert.equal(canRetry(null), false);
});

test('buildRecord never marks a prediction as teacher verified', () => {
  const rec = buildRecord({ lessonId: 'c', question: 'q', answer: 'a', result: { label: 'correct', concepts: [], feedback: 'f', source: 'ollama:qwen3:8b' }, now: new Date('2026-01-01T00:00:00Z') });
  assert.equal(rec.at, '2026-01-01T00:00:00.000Z');
  assert.equal(rec.teacher_verified, false);
  assert.equal(rec.teacher_label, null);
  assert.equal(JSON.parse(exportJson([rec])).records.length, 1);
});

test('labelInfo falls back for unknown labels', () => {
  assert.equal(labelInfo('correct').tone, 'ok');
  assert.equal(labelInfo('zzz').text, 'zzz');
});

test('normalizeLessons keeps rubric lessons and maps lab multiple-choice questions', () => {
  const lessons = [
    { id: 'a', questions: [{ prompt: 'P1?', options: [] }, { id: 'x', text: 'T?' }, 'bad'] },
    { id: 'b', questions: [{ prompt: 'no rubric' }] },
  ];
  const out = normalizeLessons(lessons, { a: { concepts: [{ id: 'c' }] }, b: { concepts: [] } });
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].questions, [{ id: 'q1', text: 'P1?' }, { id: 'x', text: 'T?' }]);
});

test('conceptNames reads name or the lab rubric title', () => {
  assert.deepEqual(conceptNames({ concepts: [{ id: 'a', name: 'A' }, { id: 'b', title: 'B' }, { id: 'c' }] }), { a: 'A', b: 'B', c: 'c' });
});
