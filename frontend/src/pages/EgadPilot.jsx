import { useEffect, useState } from 'react';
import { ApiError, assess, getLessons, getRubrics } from '../api.js';
import { MAX_ANSWER, answerProblem, buildRecord, buildRequest, canRetry, canSubmit, conceptNames, exportJson, labelInfo, newSessionId, normalizeLessons } from '../lib/egad.js';

// Synthetic answers for testing. Do not paste real student data while testing.
const SAMPLES = [
  { name: 'Đầy đủ', text: 'Có kết tủa trắng AgCl: Ag⁺ + Cl⁻ → AgCl↓. Kết tủa không tan trong HNO₃ loãng nhưng tan trong dung dịch NH₃ vì tạo phức [Ag(NH₃)₂]⁺.' },
  { name: 'Thiếu ý', text: 'Có kết tủa trắng xuất hiện khi nhỏ AgNO₃ vào NaCl.' },
  { name: 'Hiểu sai', text: 'Kết tủa tạo thành là AgNO₃ màu xanh và tan hoàn toàn trong nước.' },
];

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function Result({ result, names }) {
  const info = labelInfo(result.label);
  return (
    <div className="result" aria-live="polite">
      <p className="warning">⚠ Dự đoán của AI, chưa được giáo viên xác nhận. Không dùng để chấm điểm.</p>
      <p>Kết luận: <span className={`badge ${info.tone}`}>{info.text}</span></p>
      <table>
        <thead><tr><th>Ý</th><th>Mức</th><th>Lý do</th><th>Trích dẫn</th></tr></thead>
        <tbody>
          {result.concepts.map((c) => (
            <tr key={c.id}>
              <td>{names[c.id] ?? c.id}</td>
              <td><span className={`badge ${labelInfo(c.label).tone}`}>{labelInfo(c.label).text}</span></td>
              <td>{c.reason}</td>
              <td>{c.evidence.length ? c.evidence.map((q) => `“${q}”`).join(' ') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Gợi ý tiếp theo:</strong> {result.feedback}</p>
    </div>
  );
}

export default function EgadPilot() {
  const [sessionId] = useState(newSessionId);
  const [lessons, setLessons] = useState(null);
  const [rubrics, setRubrics] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [lessonId, setLessonId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [answer, setAnswer] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null); // {message, retryable}
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    Promise.all([getLessons(), getRubrics().catch(() => ({}))])
      .then(([raw, rub]) => {
        setRubrics(rub);
        const list = normalizeLessons(raw, rub);
        setLessons(list);
        setLessonId(list[0]?.id ?? '');
        setQuestionId(list[0]?.questions?.[0]?.id ?? '');
      })
      .catch((e) => setLoadError(e.message));
  }, []);

  const lesson = lessons?.find((l) => l.id === lessonId);
  const question = lesson?.questions?.find((q) => q.id === questionId);
  const names = conceptNames(rubrics[lessonId]);
  const problem = answer.length ? answerProblem(answer) : null;

  function pickLesson(id) {
    setLessonId(id);
    setQuestionId(lessons.find((l) => l.id === id)?.questions?.[0]?.id ?? '');
    setResult(null);
    setError(null);
  }

  async function submit(event) {
    event?.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await assess(buildRequest({ lessonId, questionId, sessionId, answer }));
      setResult(out);
      setRecords((r) => [...r, buildRecord({ lessonId, question: question?.text ?? null, answer: answer.trim(), result: out })]);
    } catch (e) {
      setError(e instanceof ApiError ? { message: e.message, retryable: canRetry(e) } : { message: 'Lỗi không xác định.', retryable: false });
    } finally {
      setBusy(false);
    }
  }

  if (loadError) return <section className="card"><p className="error">Không tải được bài học: {loadError}</p></section>;
  if (!lessons) return <section className="card"><p>Đang tải bài học…</p></section>;

  return (
    <div className="stack">
      <section className="card">
        <h1>EGAD thử nghiệm</h1>
        <p className="note">Câu trả lời được phân tích bởi mô hình chạy ngay trên máy chủ (Ollama), không gửi tới dịch vụ bên ngoài. Khi thử nghiệm, vẫn nên dùng dữ liệu mô phỏng hoặc ẩn danh.</p>
        <form onSubmit={submit}>
          <label>Bài học
            <select value={lessonId} onChange={(e) => pickLesson(e.target.value)}>
              {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </label>
          <label>Câu hỏi
            <select value={questionId} onChange={(e) => setQuestionId(e.target.value)}>
              {lesson?.questions?.map((q, i) => <option key={q.id} value={q.id}>Câu {i + 1}</option>)}
            </select>
          </label>
          {question && <blockquote>{question.text}</blockquote>}
          <div className="row">
            <span>Câu mẫu mô phỏng:</span>
            {SAMPLES.map((s) => <button type="button" key={s.name} className="ghost" onClick={() => setAnswer(s.text)}>{s.name}</button>)}
          </div>
          <label>Câu trả lời
            <textarea rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} aria-invalid={problem ? 'true' : undefined} />
          </label>
          <p className={problem ? 'error' : 'note'}>{problem ?? `${answer.length}/${MAX_ANSWER} ký tự`}</p>
          <label className="check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Tôi đồng ý cho hệ thống xử lý câu trả lời này.</label>
          <button type="submit" disabled={!canSubmit({ answer, consent, busy })}>{busy ? 'Đang phân tích…' : 'Phân tích thử'}</button>
        </form>
        {error && (
          <div className="row" role="alert">
            <p className="error">{error.message}</p>
            {error.retryable && <button type="button" className="ghost" disabled={busy} onClick={() => submit()}>Thử chấm lại</button>}
          </div>
        )}
        {result && <Result result={result} names={names} />}
      </section>

      <section className="card">
        <h2>Nhật ký phiên ({records.length})</h2>
        <p className="note">Chỉ lưu trong trang này; tải lại trang sẽ mất. Không gửi đi đâu.</p>
        <div className="row">
          <button type="button" disabled={!records.length} onClick={() => download('egad-log.json', exportJson(records))}>Xuất JSON</button>
          <button type="button" className="ghost" disabled={!records.length} onClick={() => setRecords([])}>Xóa nhật ký</button>
        </div>
      </section>
    </div>
  );
}
