// Pure helpers for the EGAD chat panel on the practice screen (no React, unit-tested).
//
// Today each message is ONE independent assessment (POST /api/egad/assess). The panel shows it as a
// conversation but must never imply that EGAD remembers earlier turns: multi-turn dialogue waits for
// the session backend (/api/v1/sessions, API v3.1).

// Errors that mean "there is no usable model on this server": the lab's rubric panel is offered instead.
export const NO_MODEL_CODES = new Set(['llm_unavailable', 'model_not_found', 'not_configured', 'network']);

// Same rules as the backend and the /app/ EGAD page: {id, text} or the lab's {prompt}; ids default to q1, q2…
export function lessonQuestions(lesson) {
  return (lesson?.questions || [])
    .map((q, i) => (q && typeof (q.text ?? q.prompt) === 'string' ? { id: String(q.id ?? `q${i + 1}`), text: q.text ?? q.prompt } : null))
    .filter(Boolean);
}

// Enter sends; Shift+Enter is a new line; never send while an IME (Vietnamese Telex/VNI) is composing.
export function composerAction(event) {
  if (event.key !== 'Enter' || event.shiftKey) return null;
  // React's synthetic KeyboardEvent has no isComposing: read it from the native event.
  if (event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229) return null;
  return 'send';
}

export function noModel(error) {
  return NO_MODEL_CODES.has(error?.code);
}

// ---- in-page memory -------------------------------------------------------------------------
// Turns live only in this page's memory (lost on reload). Nothing here is written to storage:
// the History page says so, instead of pretending the conversation was saved.
const memory = new Map();
const listeners = new Set();
let consent = false;

export function chatState(lessonId) {
  if (!memory.has(lessonId)) memory.set(lessonId, { lessonId, sessionId: null, question: 0, messages: [] });
  return memory.get(lessonId);
}

export function updateChat(lessonId, change) {
  const next = { ...chatState(lessonId), ...change(chatState(lessonId)) };
  memory.set(lessonId, next);
  listeners.forEach((f) => f());
  return next;
}

export function subscribeChat(f) {
  listeners.add(f);
  return () => listeners.delete(f);
}

export const getConsent = () => consent;
export function setConsent(value) {
  consent = Boolean(value);
  listeners.forEach((f) => f());
}

// Answered turns of this page, newest lesson first: [{lessonId, turns:[{question, answer, result|error, at}]}]
export function pageTurns() {
  const out = [];
  for (const state of memory.values()) {
    const turns = [];
    let question = null;
    for (const m of state.messages) {
      if (m.kind === 'question') question = m.text;
      if (m.kind === 'answer') turns.push({ question, answer: m.text, at: m.at, result: null, error: null, id: m.id });
      const turn = turns.find((t) => t.id === m.answerId);
      if (turn && m.kind === 'result') Object.assign(turn, { result: m.result, error: null });
      if (turn && m.kind === 'error') Object.assign(turn, { error: m.error });
    }
    if (turns.length) out.push({ lessonId: state.lessonId, turns, last: turns.at(-1).at });
  }
  return out.sort((a, b) => b.last.localeCompare(a.last));
}

// test hook
export function _resetChatMemory() {
  memory.clear();
  consent = false;
}
