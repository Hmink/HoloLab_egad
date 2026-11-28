import React, { useMemo, useState } from 'react';
import { href } from '../lib/routes.js';
import { chemicalIndex, filterLessons, savedLessonId, savedStatus, topicsOf } from '../lib/search.js';
import { EmptyArt, LessonThumb } from '../components/Art.jsx';
import { IconArrow, IconLibrary, IconSearch } from '../components/Icons.jsx';
import { labelInfo } from '../../src/lib/egad.js';

const LOCAL_NOTE = 'Lưu trên trình duyệt này';

function EmptyState({ title, text, action }) {
  return (
    <div className="hl-empty">
      <EmptyArt />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

/* ---------------- Tổng quan ---------------- */
export function Overview({ lessons, saved, onOpenSaved, user }) {
  const latest = saved[0];
  const ready = lessons.filter((l) => l.status === 'ready');
  return (
    <div className="hl-page">
      <header className="hl-page-head">
        <h1>{user ? `Chào ${user.username}!` : 'Chào bạn!'}</h1>
        <p>Hôm nay bạn muốn thử thí nghiệm nào?</p>
      </header>
      <div className="hl-overview">
        <section className="hl-panel hl-continue" aria-labelledby="hl-continue-title">
          <h2 id="hl-continue-title">Tiếp tục</h2>
          {latest ? (
            <div className="hl-continue-body">
              <LessonThumb index={Math.max(0, ready.findIndex((l) => l.id === savedLessonId(latest)))} />
              <div>
                <strong>{latest.name}</strong>
                <span className="hl-muted">{savedStatus(latest)} · {latest.date}</span>
                <span className="hl-chip hl-chip-quiet">{LOCAL_NOTE}</span>
              </div>
              <button type="button" className="hl-btn hl-btn-primary" onClick={() => onOpenSaved(latest)}>Tiếp tục</button>
            </div>
          ) : (
            <EmptyState title="Bạn chưa có phiên nào được lưu" text="Khi thực hành, bấm “Lưu” để có thể quay lại làm tiếp."
              action={<a className="hl-btn hl-btn-primary" href={href.experiments}>Chọn thí nghiệm đầu tiên</a>} />
          )}
        </section>

        <section className="hl-panel hl-shortcut" aria-labelledby="hl-shortcut-title">
          <span className="hl-feature-icon hl-tint-1"><IconLibrary size={28} /></span>
          <h2 id="hl-shortcut-title">Thư viện thí nghiệm</h2>
          <p>{ready.length} bài thực hành lớp 10–12, có mục tiêu và các bước cho từng bài.</p>
          <a className="hl-btn hl-btn-ghost" href={href.experiments}>Mở thư viện <IconArrow size={18} /></a>
        </section>

        <section className="hl-panel hl-recent" aria-labelledby="hl-recent-title">
          <div className="hl-panel-head"><h2 id="hl-recent-title">Hoạt động gần đây</h2><span className="hl-muted">{LOCAL_NOTE}</span></div>
          {saved.length ? (
            <ul className="hl-list">
              {saved.slice(0, 5).map((s, i) => (
                <li key={i}>
                  <div><strong>{s.name}</strong><span className="hl-muted">{savedStatus(s)} · {s.date}</span></div>
                  <button type="button" className="hl-btn hl-btn-ghost hl-btn-sm" onClick={() => onOpenSaved(s)}>Mở lại</button>
                </li>
              ))}
            </ul>
          ) : <p className="hl-muted">Chưa có hoạt động nào trên trình duyệt này.</p>}
        </section>
      </div>
    </div>
  );
}

/* ---------------- Thư viện thí nghiệm ---------------- */
export function Experiments({ lessons, stocks, saved, onPreview, onOpenSaved, onFree, notice }) {
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState('all');
  const [topic, setTopic] = useState('all');
  const loading = !lessons.length;
  const ready = useMemo(() => lessons.filter((l) => l.status === 'ready'), [lessons]);
  const chemicals = useMemo(() => chemicalIndex(lessons, stocks), [lessons, stocks]);
  const topics = useMemo(() => topicsOf(ready), [ready]);
  const rows = useMemo(() => filterLessons(lessons, { query, grade, topic }, chemicals), [lessons, query, grade, topic, chemicals]);
  const filtered = query.trim() !== '' || grade !== 'all' || topic !== 'all';
  const clear = () => { setQuery(''); setGrade('all'); setTopic('all'); };
  const savedFor = (id) => saved.find((s) => savedLessonId(s) === id);
  return (
    <div className="hl-page">
      <header className="hl-page-head hl-page-head-row">
        <div>
          <h1>Thư viện thí nghiệm</h1>
          <p>Chọn một bài để xem mục tiêu và các bước, rồi bắt đầu thực hành trên bàn thí nghiệm 3D.</p>
        </div>
        <button type="button" className="hl-btn hl-btn-ghost" onClick={onFree}>＋ Bàn thí nghiệm mới</button>
      </header>
      {notice && <p className="hl-notice" role="status">{notice}</p>}

      {saved.length > 0 && (
        <section className="hl-saved-strip" aria-labelledby="hl-saved-title">
          <h2 id="hl-saved-title">Tiếp tục phiên đã lưu <span className="hl-muted">· {LOCAL_NOTE}</span></h2>
          <div>
            {saved.slice(0, 4).map((s, i) => (
              <button type="button" className="saved-session" key={i} onClick={() => onOpenSaved(s)}>
                <strong>{s.name}</strong><small>{savedStatus(s)} · {s.date}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="hl-filters" role="search">
        <label className="hl-search">
          <IconSearch />
          <input type="search" aria-label="Tìm thí nghiệm" placeholder="Tìm theo tên bài, chủ đề hoặc hóa chất…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <select aria-label="Lọc lớp" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="all">Tất cả lớp</option>
          {[10, 11, 12].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
        <select aria-label="Lọc chủ đề" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">Tất cả chủ đề</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {filtered && <button type="button" className="hl-btn hl-btn-quiet" onClick={clear}>Xóa bộ lọc</button>}
      </div>
      {!loading && <p className="hl-count" aria-live="polite">Hiển thị {rows.length}/{ready.length} bài</p>}

      {loading ? (
        <ul className="hl-rows" aria-busy="true" aria-label="Đang tải danh sách thí nghiệm">
          {[0, 1, 2].map((i) => <li key={i} className="hl-row hl-skeleton"><span /><span /><span /></li>)}
        </ul>
      ) : rows.length ? (
        <ul className="hl-rows">
          {rows.map((l) => {
            const idx = ready.indexOf(l), resume = savedFor(l.id), chem = chemicals[l.id] || [];
            return (
              <li key={l.id}>
                <article className="hl-row experiment-card" onClick={(e) => { if (!e.target.closest('button')) onPreview(l); }}>
                  <LessonThumb index={idx} />
                  <div className="hl-row-body">
                    <h3>{l.title}</h3>
                    <p className="hl-clamp">{l.objective}</p>
                    <div className="hl-tags">
                      <span className="hl-chip">Lớp {l.grade}</span>
                      <span className="hl-chip hl-chip-quiet">{l.topic}</span>
                      {l.curriculum?.verified === false && <span className="hl-chip hl-chip-warn">Phân lớp đề xuất</span>}
                    </div>
                    {chem.length > 0 && <p className="hl-chem">Hóa chất: {chem.map((c) => c.name).join(', ')}</p>}
                  </div>
                  <div className="hl-row-actions">
                    {resume && <button type="button" className="hl-btn hl-btn-ghost hl-btn-sm" onClick={() => onOpenSaved(resume)}>Học tiếp</button>}
                    <button type="button" className="hl-btn hl-btn-primary hl-btn-sm" onClick={() => onPreview(l)} aria-label={`Bắt đầu: ${l.title}`}>Bắt đầu</button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Không tìm thấy thí nghiệm phù hợp" text="Thử từ khóa khác, ví dụ tên một hóa chất như “NaOH” hoặc “bạc”."
          action={<button type="button" className="hl-btn hl-btn-primary" onClick={clear}>Xóa bộ lọc</button>} />
      )}
    </div>
  );
}

/* ---------------- Lịch sử học ---------------- */
// `data` comes from lib/history.js (today: this browser only). A server source with the same shape
// (API v3.1 sessions) can replace it without touching this component.
function EgadTurn({ turn }) {
  const info = turn.result ? labelInfo(turn.result.label) : null;
  return (
    <li className="hl-turn">
      {turn.question && <p className="hl-turn-q">{turn.question}</p>}
      <p className="hl-turn-a"><span className="hl-muted">Bạn trả lời:</span> {turn.answer}</p>
      {turn.result ? (
        <div className="hl-turn-r">
          <p><span className="hl-muted">EGAD:</span> {turn.result.feedback}</p>
          <p className="hl-ai-note">Nhận định: <span className={`hl-label hl-label-${info.tone}`}>{info.text}</span> · Dự đoán của AI, chưa được giáo viên xác nhận.</p>
        </div>
      ) : turn.error ? <p className="hl-turn-r hl-muted">Chưa phân tích được: {turn.error.message}</p> : <p className="hl-turn-r hl-muted">Đang chờ phản hồi…</p>}
    </li>
  );
}

export function History({ data, onOpenSaved }) {
  const { sessions, live } = data;
  const [open, setOpen] = useState(null);
  return (
    <div className="hl-page">
      <header className="hl-page-head">
        <h1>Lịch sử học</h1>
        <p>Các phiên thực hành bạn đã lưu và các câu trả lời EGAD trong lần mở trang này. Lưu trên máy chủ và hội thoại EGAD đầy đủ sẽ có khi máy chủ hỗ trợ phiên học.</p>
      </header>

      {live.length > 0 && (
        <section className="hl-panel hl-live" aria-labelledby="hl-live-title">
          <div className="hl-panel-head">
            <h2 id="hl-live-title">Câu trả lời EGAD trong lần mở trang này</h2>
            <span className="hl-chip hl-chip-warn">Chưa lưu · mất khi tải lại trang</span>
          </div>
          {live.map((g) => (
            <details key={g.lessonId} className="hl-live-group">
              <summary><strong>{g.lesson?.title || g.lessonId}</strong> <span className="hl-muted">· {g.turns.length} câu trả lời</span></summary>
              <ol className="hl-turns">{g.turns.map((t) => <EgadTurn key={t.id} turn={t} />)}</ol>
            </details>
          ))}
        </section>
      )}

      {sessions.length ? (
        <ul className="hl-rows">
          {sessions.map((s) => {
            const expanded = open === s.key, detailId = `hl-session-${s.key}`;
            return (
              <li key={s.key}>
                <article className="hl-row hl-history-row">
                  <div className="hl-row-body">
                    <h3>{s.title}</h3>
                    <p className="hl-muted">{s.date}</p>
                    <div className="hl-tags"><span className="hl-chip">{s.status}</span><span className="hl-chip hl-chip-quiet">{LOCAL_NOTE}</span></div>
                  </div>
                  <div className="hl-row-actions">
                    <button type="button" className="hl-btn hl-btn-ghost hl-btn-sm" aria-expanded={expanded} aria-controls={detailId} onClick={() => setOpen(expanded ? null : s.key)}>{expanded ? 'Ẩn chi tiết' : 'Chi tiết'}</button>
                    <button type="button" className="hl-btn hl-btn-primary hl-btn-sm" onClick={() => onOpenSaved(s.raw)}>Xem lại</button>
                  </div>
                  {expanded && (
                    <div className="hl-session-detail" id={detailId}>
                      <dl>
                        <div><dt>Bài</dt><dd>{s.lesson ? `${s.lesson.title} · Lớp ${s.lesson.grade}` : 'Bàn thí nghiệm tự do'}</dd></div>
                        <div><dt>Trạng thái</dt><dd>{s.status}</dd></div>
                        <div><dt>Thời gian lưu</dt><dd>{s.date}</dd></div>
                        {s.lesson?.objective && <div><dt>Mục tiêu</dt><dd>{s.lesson.objective}</dd></div>}
                        <div><dt>EGAD</dt><dd>Phiên lưu trên trình duyệt chỉ gồm bàn thí nghiệm, không kèm câu trả lời EGAD.</dd></div>
                      </dl>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Chưa có phiên nào được lưu" text="Lịch sử xuất hiện khi bạn bấm “Lưu” trong lúc thực hành."
          action={<a className="hl-btn hl-btn-primary" href={href.experiments}>Chọn thí nghiệm đầu tiên</a>} />
      )}
    </div>
  );
}

/* ---------------- Xem trước bài ---------------- */
export function Preview({ lesson, index = 0, onClose, onStart }) {
  return (
    <div className="preview-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label="Xem trước thí nghiệm">
        <button type="button" className="preview-close" onClick={onClose}>Đóng</button>
        <div className="hl-preview-head">
          <LessonThumb index={index} />
          <div>
            <p className="hl-eyebrow">Lớp {lesson.grade} · {lesson.topic}</p>
            <h2>{lesson.title}</h2>
          </div>
        </div>
        <h3>Mục tiêu</h3>
        <p>{lesson.objective}</p>
        <h3>Các bước</h3>
        <ol>{lesson.steps.map((s, i) => <li key={i}>{s.replaceAll('Gắp', 'Nhấc').replaceAll('thả tay', 'thả chuột')}</li>)}</ol>
        <button type="button" className="primary hl-btn hl-btn-primary hl-btn-lg" onClick={onStart}>Bắt đầu thực hành</button>
      </section>
    </div>
  );
}

