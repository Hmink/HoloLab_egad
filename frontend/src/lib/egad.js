// Pure helpers (no React) so they can be unit-tested with `node --test`.

export const MAX_ANSWER = 1000;

export const LABELS = {
  correct: { text: 'Đúng', tone: 'ok' },
  incomplete: { text: 'Chưa đầy đủ', tone: 'warn' },
  misconception: { text: 'Hiểu sai', tone: 'bad' },
  insufficient: { text: 'Chưa đủ thông tin', tone: 'muted' },
};

export function labelInfo(label) {
  return LABELS[label] ?? { text: String(label), tone: 'muted' };
}

export function answerProblem(answer) {
  const n = answer.trim().length;
  if (n === 0) return 'Hãy nhập câu trả lời.';
  if (answer.length > MAX_ANSWER) return `Tối đa ${MAX_ANSWER} ký tự (đang ${answer.length}).`;
  return null;
}

export function canSubmit({ answer, consent, consentCloud, busy }) {
  return !busy && consent && consentCloud && answerProblem(answer) === null;
}

export function newSessionId() {
  const id = globalThis.crypto?.randomUUID?.() ?? `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return id.slice(0, 64);
}

// lab_actions is reserved for the 3D lab (phase 4); the backend ignores it today, so it is not sent.
export function buildRequest({ lessonId, questionId, sessionId, answer }) {
  const body = { lesson: lessonId, answer: answer.trim(), consent: true, consent_cloud: true };
  if (questionId) body.question_id = questionId;
  if (sessionId) body.session_id = sessionId;
  return body;
}

// One record of the exported log. teacher_label stays null until a teacher fills it in.
export function buildRecord({ lessonId, question, answer, result, now = new Date() }) {
  return {
    at: now.toISOString(),
    lesson: lessonId,
    question,
    answer,
    prediction: { label: result.label, concepts: result.concepts, feedback: result.feedback },
    source: result.source,
    teacher_verified: false,
    teacher_label: null,
  };
}

// Offer a retry only for errors the backend (or the network) marked as temporary.
export function canRetry(error) {
  return Boolean(error?.retryable);
}

export function exportJson(records) {
  return JSON.stringify({ schema: 'hololab-egad-log-1', records }, null, 2);
}
