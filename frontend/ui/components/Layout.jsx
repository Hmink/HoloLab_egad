import React, { useEffect, useRef, useState } from 'react';
import { href } from '../lib/routes.js';
import { Logo } from './Art.jsx';
import { IconClose, IconCollapse, IconExpand, IconHistory, IconLibrary, IconMenu, IconOverview } from './Icons.jsx';

const COLLAPSE_KEY = 'hololab-sidebar-collapsed';
const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode: ignore */ } };

export function TopNav({ route, user, onSignOut }) {
  const [open, setOpen] = useState(false);
  const learning = ['overview', 'experiments', 'history'].includes(route.name);
  useEffect(() => setOpen(false), [route.name]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);
  const link = (to, text, active) => <a href={to} aria-current={active ? 'page' : undefined}>{text}</a>;
  return (
    <header className="hl-topnav">
      <a className="hl-brand" href={href.intro} aria-label="HoloLab: trang giới thiệu">
        <Logo /><span><strong>HoloLab</strong><small>Phòng thí nghiệm Hóa học ảo</small></span>
      </a>
      <nav className="hl-topnav-main" aria-label="Điều hướng chính">
        {link(href.intro, 'Giới thiệu', route.name === 'intro')}
        {link(href.overview, 'Học tập', learning)}
      </nav>
      <div className="hl-topnav-account">
        {user ? (
          <>
            <span className="hl-user" title={user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}>{user.username}</span>
            <button type="button" className="hl-btn hl-btn-ghost" onClick={onSignOut}>Đăng xuất</button>
          </>
        ) : (
          <>
            <a className="hl-link-quiet" href={href.login} aria-current={route.name === 'login' ? 'page' : undefined}>Đăng nhập</a>
            <a className="hl-btn hl-btn-primary" href={href.register} aria-current={route.name === 'register' ? 'page' : undefined}>Đăng ký</a>
          </>
        )}
      </div>
      <button type="button" className="hl-icon-btn hl-topnav-toggle" aria-expanded={open} aria-controls="hl-topnav-menu"
        aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen((v) => !v)}>
        {open ? <IconClose /> : <IconMenu />}
      </button>
      {open && (
        <div className="hl-topnav-menu" id="hl-topnav-menu">
          {link(href.intro, 'Giới thiệu', route.name === 'intro')}
          {link(href.overview, 'Học tập', learning)}
          {user ? (
            <>
              <span className="hl-user">{user.username}</span>
              <button type="button" className="hl-btn hl-btn-ghost" onClick={onSignOut}>Đăng xuất</button>
            </>
          ) : (
            <>
              {link(href.login, 'Đăng nhập', route.name === 'login')}
              <a className="hl-btn hl-btn-primary" href={href.register}>Đăng ký</a>
            </>
          )}
        </div>
      )}
    </header>
  );
}

const ITEMS = [
  ['overview', 'Tổng quan', IconOverview, href.overview],
  ['experiments', 'Thư viện thí nghiệm', IconLibrary, href.experiments],
  ['history', 'Lịch sử học', IconHistory, href.history],
];

export function LearnLayout({ route, children }) {
  const [collapsed, setCollapsed] = useState(() => read(COLLAPSE_KEY) === '1');
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef(null);
  useEffect(() => setDrawer(false), [route.name]);
  useEffect(() => {
    if (!drawer) return undefined;
    drawerRef.current?.querySelector('a')?.focus();
    const onKey = (e) => e.key === 'Escape' && setDrawer(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [drawer]);
  const toggle = () => setCollapsed((c) => { write(COLLAPSE_KEY, c ? '0' : '1'); return !c; });
  const nav = (
    <nav aria-label="Khu học tập">
      {ITEMS.map(([name, text, Ico, to]) => (
        <a key={name} href={to} className="hl-side-link" aria-current={route.name === name ? 'page' : undefined} title={collapsed ? text : undefined}>
          <Ico /><span>{text}</span>
        </a>
      ))}
    </nav>
  );
  return (
    <div className={'hl-learn' + (collapsed ? ' is-collapsed' : '')}>
      <aside className="hl-sidebar" aria-label="Thanh bên">
        {nav}
        <button type="button" className="hl-side-collapse" onClick={toggle} aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}>
          {collapsed ? <IconExpand /> : <IconCollapse />}<span>Thu gọn</span>
        </button>
      </aside>
      {drawer && <div className="hl-drawer-scrim" onClick={() => setDrawer(false)} />}
      {drawer && (
        <aside className="hl-drawer" ref={drawerRef} aria-label="Menu khu học tập">
          <button type="button" className="hl-icon-btn hl-drawer-close" onClick={() => setDrawer(false)} aria-label="Đóng menu"><IconClose /></button>
          {nav}
        </aside>
      )}
      {/* A div, not <main>: the lab stylesheet gives every <main> a fixed 100dvh height. */}
      <div className="hl-learn-main" id="hl-content">
        <button type="button" className="hl-btn hl-btn-ghost hl-drawer-open" onClick={() => setDrawer(true)} aria-label="Mở menu khu học tập">
          <IconMenu /> Menu học tập
        </button>
        {children}
      </div>
    </div>
  );
}
