import { useEffect, useState } from 'react';
import { getHealth } from './api.js';
import Home from './pages/Home.jsx';
import EgadPilot from './pages/EgadPilot.jsx';

const ROUTES = { '#/': Home, '#/egad': EgadPilot };

function useHash() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function BackendStatus() {
  const [state, setState] = useState({ kind: 'checking' });
  useEffect(() => {
    getHealth()
      .then((h) => setState({ kind: 'ok', version: h.version, chemistry: h.chemistry }))
      .catch(() => setState({ kind: 'down' }));
  }, []);
  if (state.kind === 'checking') return <span className="status muted">Backend: đang kiểm tra…</span>;
  if (state.kind === 'down') return <span className="status bad">Backend: không kết nối được</span>;
  return <span className="status ok">Backend v{state.version}{state.chemistry ? '' : ' · chưa có lõi hóa học'}</span>;
}

export default function App() {
  const hash = useHash();
  const Page = ROUTES[hash] ?? Home;
  return (
    <>
      <header className="topbar">
        <strong>HoloLab</strong>
        <nav>
          <a href="#/" aria-current={Page === Home ? 'page' : undefined}>Trang chủ</a>
          <a href="#/egad" aria-current={Page === EgadPilot ? 'page' : undefined}>EGAD thử nghiệm</a>
        </nav>
        <BackendStatus />
      </header>
      <main>
        <Page />
      </main>
    </>
  );
}
