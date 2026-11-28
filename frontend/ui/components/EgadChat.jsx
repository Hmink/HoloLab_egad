import React, { useEffect, useReducer, useRef, useState } from 'react';
import { assess } from '../../src/api.js';
import { MAX_ANSWER, answerProblem, buildRequest, conceptNames, labelInfo, newSessionId } from '../../src/lib/egad.js';
import { chatState, composerAction, getConsent, lessonQuestions, noModel, setConsent, subscribeChat, updateChat } from '../lib/egad-chat.js';
import { AssistantAvatar } from './Art.jsx';
import { IconExpand, IconLibrary, IconRefresh, IconSend } from './Icons.jsx';

const AI_NOTE = 'Dự đoán của AI, chưa được giáo viên xác nhận.';
let rubricsPromise = null;
const loadRubrics = () => (rubricsPromise ??= fetch('/data/egad-rubrics.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
let seq = 0;
const nextId = () => `m${++seq}`;

function seed(lesson) {
  const questions = lessonQuestions(lesson);
  const messages = [{ id: nextId(), kind: 'intro' }];
  if (questions.length) messages.push({ id: nextId(), kind: 'question', qid: questions[0].id, text: questions[0].text, n: 1, total: questions.length });
  return { messages, question: 0 };
}

function Result({ result, names }) {
  const overall = labelInfo(result.label);
  return (
    <>
      <p>{result.feedback}</p>
      <p className="hl-ai-note">{AI_NOTE}</p>
      <details className="hl-msg-details">
        <summary>Xem nhận xét chi tiết</summary>
        <p>Nhận định chung: <span className={`hl-label hl-label-${overall.tone}`}>{overall.text}</span></p>
        <ul>
          {(result.concepts || []).map((c) => {
            const info = labelInfo(c.label);
            return (
              <li key={c.id}>
                <strong>{names[c.id] || c.id}</strong> <span className={`hl-label hl-label-${info.tone}`}>{info.text}</span>
                {c.reason && <span className="hl-msg-reason">{c.reason}</span>}
                {c.evidence?.length > 0 && <span className="hl-msg-evidence">Trích từ câu trả lời: “{c.evidence.join('”; “')}”</span>}
              </li>
            );
          })}
        </ul>
        {result.source && <p className="hl-muted">Nguồn: {result.source}</p>}
      </details>
    </>
  );
}

/** EGAD panel on the practice screen. `lesson` is null on the free bench. */
export function EgadChat({ lesson, onClose, onOpenRubric, onLibrary }) {
  const [, rerender] = useReducer((x) => x + 1, 0);
  const [draft, setDraft] = useState('');
  const [problem, setProblem] = useState('');
  const [names, setNames] = useState({});
  const log = useRef(null);
  const lessonId = lesson?.id || null;
  const questions = lessonQuestions(lesson);

  useEffect(() => subscribeChat(rerender), []);
  useEffect(() => {
    if (!lesson) return;
    loadRubrics().then((r) => setNames(conceptNames(r[lesson.id])));
    if (!chatState(lesson.id).messages.length) updateChat(lesson.id, () => seed(lesson));
    setDraft(''); setProblem('');
  }, [lessonId]);

  const state = lessonId ? chatState(lessonId) : null;
  const messages = state?.messages || [];
  const pending = Boolean(state?.pending);
  const consent = getConsent();
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages.length, pending]);

  async function send(text, qid, answerId) {
    const sessionId = state.sessionId || newSessionId();
    const at = new Date().toISOString();
    updateChat(lessonId, (s) => ({
      sessionId,
      pending: answerId,
      messages: s.messages.some((m) => m.id === answerId) ? s.messages : [...s.messages, { id: answerId, kind: 'answer', text, qid, at }],
    }));
    let reply;
    try {
      const result = await assess(buildRequest({ lessonId, questionId: qid, sessionId, answer: text }));
      reply = { id: nextId(), kind: 'result', answerId, result };
    } catch (e) {
      reply = { id: nextId(), kind: 'error', answerId, text, qid, error: { message: e.message, code: e.code || 'unknown', retryable: e.retryable === true } };
    }
    updateChat(lessonId, (s) => ({ pending: null, messages: [...s.messages, reply] }));
  }

  function submit() {
    if (pending) return;
    if (!consent) { setProblem('Hãy đánh dấu đồng ý trước khi gửi.'); return; }
    const p = answerProblem(draft);
    if (p) { setProblem(p); return; }
    const q = questions[state.question];
    setProblem(''); setDraft('');
    send(draft.trim(), q?.id, nextId());
  }

  function retry(m) {
    if (pending) return;
    updateChat(lessonId, (s) => ({ messages: s.messages.map((x) => (x.id === m.id ? { ...x, retried: true } : x)) }));
    send(m.text, m.qid, m.answerId);
  }

  function nextQuestion() {
    if (!questions.length || pending) return;
    const i = (state.question + 1) % questions.length, q = questions[i];
    updateChat(lessonId, (s) => ({ question: i, messages: [...s.messages, { id: nextId(), kind: 'question', qid: q.id, text: q.text, n: i + 1, total: questions.length }] }));
  }

  function clear() {
    if (pending) return;
    updateChat(lessonId, () => ({ ...seed(lesson), sessionId: null }));
  }

  const current = questions[state?.question ?? 0];
  return (
    <section className="hl-chat" aria-labelledby="hl-chat-title"
      onKeyDown={(e) => { if (e.key === 'Escape' && matchMedia('(max-width: 900px)').matches) onClose(); }}>
      <header className="hl-chat-head">
        <AssistantAvatar size={42} />
        <div>
          <h2 id="hl-chat-title">EGAD</h2>
          <p>Trợ lý giải thích hiện tượng</p>
        </div>
        <button type="button" className="hl-icon-btn" onClick={onClose} aria-label="Thu gọn khung EGAD" title="Thu gọn"><IconExpand /></button>
      </header>

      {!lesson ? (
        <div className="hl-chat-empty">
          <p>EGAD đặt câu hỏi theo từng bài thực hành. Hãy chọn một bài trong thư viện để bắt đầu giải thích cùng EGAD.</p>
          <button type="button" className="hl-btn hl-btn-ghost hl-btn-sm" onClick={onLibrary}><IconLibrary size={18} /> Mở thư viện</button>
        </div>
      ) : (
        <>
          <div className="hl-chat-log" ref={log} role="log" aria-live="polite" aria-label="Hội thoại với EGAD">
            {messages.map((m) => {
              if (m.kind === 'intro') return (
                <div key={m.id} className="hl-msg hl-msg-egad">
                  <p>Chào bạn! Sau khi quan sát hiện tượng, hãy giải thích bằng lời của bạn.</p>
                  <p className="hl-ai-note">Mỗi câu trả lời được phân tích riêng: EGAD chưa nhớ các câu trả lời trước.</p>
                </div>
              );
              if (m.kind === 'question') return (
                <div key={m.id} className="hl-msg hl-msg-egad hl-msg-question">
                  <span className="hl-msg-tag">Câu hỏi {m.n}/{m.total}</span>
                  <p>{m.text}</p>
                </div>
              );
              if (m.kind === 'answer') return (
                <div key={m.id} className="hl-msg hl-msg-student"><span className="hl-sr">Bạn trả lời: </span><p>{m.text}</p></div>
              );
              if (m.kind === 'result') return (
                <div key={m.id} className="hl-msg hl-msg-egad"><span className="hl-sr">EGAD phản hồi: </span><Result result={m.result} names={names} /></div>
              );
              if (m.kind === 'error') return (
                <div key={m.id} className="hl-msg hl-msg-error" role="alert">
                  <p>{m.error.message}</p>
                  {noModel(m.error) && <p>EGAD chưa dùng được mô hình trên máy chủ này. Bạn vẫn có thể tự kiểm tra bằng bảng tiêu chí của bài.</p>}
                  <div className="hl-msg-actions">
                    {m.error.retryable && !m.retried && <button type="button" className="hl-btn hl-btn-ghost hl-btn-sm" onClick={() => retry(m)} disabled={pending}><IconRefresh size={16} /> Thử lại</button>}
                    {noModel(m.error) && <button type="button" className="hl-btn hl-btn-quiet hl-btn-sm" onClick={onOpenRubric}>Mở bảng tiêu chí</button>}
                  </div>
                </div>
              );
              return null;
            })}
            {pending && <div className="hl-msg hl-msg-egad hl-msg-pending" aria-busy="true"><p>EGAD đang đọc câu trả lời…</p></div>}
          </div>

          <div className="hl-chat-compose">
            <label className="hl-consent">
              <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setProblem(''); }} />
              <span>Tôi đồng ý gửi câu trả lời tới EGAD chạy trên máy chủ của lớp để phân tích. Không nhập họ tên hay thông tin cá nhân.</span>
            </label>
            <div className="hl-chat-q">
              <span>{current ? `Đang trả lời câu ${state.question + 1}/${questions.length}` : 'Bài này chưa có câu hỏi'}</span>
              {questions.length > 1 && <button type="button" className="hl-link-btn" onClick={nextQuestion} disabled={pending}>Câu hỏi khác</button>}
            </div>
            <div className="hl-chat-input">
              <textarea aria-label="Câu trả lời của bạn" placeholder="Giải thích bằng lời của bạn…" rows={3} maxLength={MAX_ANSWER}
                value={draft} onChange={(e) => { setDraft(e.target.value); if (problem) setProblem(''); }}
                onKeyDown={(e) => { if (composerAction(e) === 'send') { e.preventDefault(); submit(); } }} />
              <button type="button" className="hl-btn hl-btn-primary hl-chat-send" onClick={submit} disabled={pending || !consent || !draft.trim()} aria-label="Gửi câu trả lời">
                <IconSend size={20} /><span>Gửi</span>
              </button>
            </div>
            {problem && <p className="hl-chat-problem" role="alert">{problem}</p>}
            <div className="hl-chat-foot">
              <span>Enter để gửi · Shift+Enter xuống dòng · {draft.length}/{MAX_ANSWER}</span>
              <span className="hl-chat-links">
                <button type="button" className="hl-link-btn" onClick={onOpenRubric}>Bảng tiêu chí</button>
                <button type="button" className="hl-link-btn" onClick={clear} disabled={pending || messages.length <= 2}>Xóa hội thoại</button>
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
