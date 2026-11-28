import React, { useEffect, useRef } from 'react';
import { IconChat, IconHelp, IconRefresh, IconRedo, IconSave, IconTrash, IconUndo, IconUpright } from './Icons.jsx';

// Where #workspace starts inside <main> (toolbar rows, camera deck…) -> --hl-bench-top, so the CSS can
// give the 3D bench exactly the rest of the viewport. The lab's own ResizeObserver then resizes the canvas.
function useBenchTop() {
  useEffect(() => {
    const main = document.querySelector('main'), ws = document.getElementById('workspace');
    if (!main || !ws || typeof ResizeObserver === 'undefined') return undefined;
    let last = -1;
    const measure = () => {
      const top = Math.round(ws.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop);
      if (top > 0 && top !== last) { last = top; document.body.style.setProperty('--hl-bench-top', `${top}px`); }
    };
    const ro = new ResizeObserver(measure);
    for (const el of [document.getElementById('mouse-shell'), document.querySelector('.camera-deck'), document.getElementById('settings-notice')]) if (el) ro.observe(el);
    addEventListener('resize', measure);
    measure();
    return () => { ro.disconnect(); removeEventListener('resize', measure); };
  }, []);
}

const MODES = [['move', 'Di chuyển'], ['rotate', 'Nghiêng / rót'], ['depth', 'Gần / xa']];
const HINTS = {
  move: 'Giữ chuột trái trên bình để kéo · Thả chuột: bình rơi',
  rotate: 'Giữ chuột và kéo ngang để nghiêng bình · Kéo dọc để xoay trước/sau',
  depth: 'Giữ chuột và kéo lên/xuống để đổi chiều sâu',
};

/**
 * Practice-screen toolbar. Button names are relied on by the browser QA scripts
 * ("‹ Thư viện", "Di chuyển", "Dựng thẳng", "Lưu", "Hoàn tác", "Làm lại", …): keep them.
 * The lab's own controls (stock panel, camera, Hand assist, full screen) stay the same DOM nodes with
 * their original handlers; they are only moved into the `labTools` slot.
 */
export function LabToolbar({ title, mode, onMode, onLibrary, onUpright, onSave, onUndo, onRedo, onReset, onRemove, onHelp, egadOpen, onEgad }) {
  const slot = useRef(null);
  useEffect(() => {
    const tools = document.querySelector('main > .toolbar');
    if (tools && slot.current && tools.parentElement !== slot.current) slot.current.append(tools);
  }, []);
  useBenchTop();
  const tool = (label, onClick, Icon, extra = {}) => (
    <button type="button" onClick={onClick} title={label} {...extra}>{Icon && <Icon size={18} />}<span className="hl-tool-label">{label}</span></button>
  );
  return (
    <>
      <div className="hl-practice-head">
        <button type="button" className="hl-back" onClick={onLibrary}>‹ Thư viện</button>
        <h1 className="hl-practice-title">{title}</h1>
        <button type="button" className="hl-egad-toggle" aria-controls="egad-dock" aria-expanded={egadOpen} onClick={onEgad}>
          <IconChat size={18} />EGAD
        </button>
      </div>
      <nav className="lab-mouse-toolbar" aria-label="Công cụ thực hành">
        <div className="hl-tool-group mode-switch" role="group" aria-label="Chế độ chuột">
          {MODES.map(([v, t]) => <button type="button" key={v} aria-pressed={mode === v} onClick={() => onMode(v)}>{t}</button>)}
        </div>
        <div className="hl-tool-group" role="group" aria-label="Chỉnh sửa">
          {tool('Dựng thẳng', onUpright, IconUpright)}
          {tool('Hoàn tác', onUndo, IconUndo)}
          {tool('Làm lại', onRedo, IconRedo)}
          {tool('Bắt đầu lại', onReset, IconRefresh)}
          {tool('Xóa vật', onRemove, IconTrash)}
          {tool('Lưu', onSave, IconSave)}
        </div>
        <div className="hl-tool-group hl-lab-tools" ref={slot} role="group" aria-label="Kho, camera và hiển thị" />
        {tool('Trợ giúp', onHelp, IconHelp, { className: 'hl-help-btn' })}
      </nav>
      <div className="mouse-hint">{HINTS[mode]} · Chuột phải + kéo: nghiêng nhanh</div>
    </>
  );
}
