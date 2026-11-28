// Hash routes (the Python server has no SPA fallback, so paths like /learn would 404).
//   #/                          intro            #/login, #/register   auth (not active yet)
//   #/learn/overview            overview         #/learn/experiments   library
//   #/learn/history             history          #/learn/experiments/<id>  practice (3D bench)
// Practice ids: a lesson id, "free" (empty bench) or "session" (a restored saved session).
export function parseRoute(hash = '') {
  const path = String(hash).replace(/^#/, '').split('?')[0];
  const parts = path.split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
  if (!parts.length) return { name: 'intro' };
  if (parts[0] === 'login' || parts[0] === 'register') return { name: parts[0] };
  if (parts[0] === 'learn') {
    if (parts[1] === 'experiments' && parts[2]) return { name: 'practice', id: parts[2] };
    if (['overview', 'experiments', 'history'].includes(parts[1])) return { name: parts[1] };
    if (!parts[1]) return { name: 'overview' };
  }
  return { name: 'intro', unknown: true };
}

export const href = {
  intro: '#/',
  login: '#/login',
  register: '#/register',
  overview: '#/learn/overview',
  experiments: '#/learn/experiments',
  history: '#/learn/history',
  practice: (id) => `#/learn/experiments/${encodeURIComponent(id)}`,
};

export const isLearnRoute = (r) => ['overview', 'experiments', 'history'].includes(r.name);
