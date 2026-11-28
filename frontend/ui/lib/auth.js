// Auth client for API v3.1 (§2): POST /api/v1/auth/register|login|logout, GET /api/v1/auth/me.
//
// Security rules (prompt_giao_dien_v2 §10, API v3.1 §1):
// - The server keeps the session in an HttpOnly cookie. Nothing (token, password, user) is written to
//   localStorage/sessionStorage here; the signed-in user lives only in page memory and comes from /auth/me.
// - Never pretend a login worked: if the backend has no auth endpoints yet (404/405/501, HTML page,
//   no connection) the caller gets code "not_enabled" and the page says so.
// - The UI relies on error_code, not on the server's message text.

export const API = '/api/v1/auth';
// Version of the consent text shown on the register page. The backend stores it with the time of consent;
// bump it whenever CONSENT_TEXT changes.
export const CONSENT_VERSION = 'hololab-consent-2026-11';
export const CONSENT_TEXT =
  'Tôi đồng ý để HoloLab lưu tên đăng nhập, câu trả lời và quá trình thực hành của tôi trên máy chủ của lớp, ' +
  'để giáo viên xem và để tôi xem lại. Dữ liệu được giữ tối đa 1 tháng và không gửi ra dịch vụ bên ngoài.';

export const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128; // client-side cap only, so a pasted novel is not sent to argon2

export class AuthError extends Error {
  constructor(message, { code = 'unknown', status = 0, retryAfter = null, field = null } = {}) {
    super(message);
    Object.assign(this, { code, status, retryAfter, field });
  }
}

export const NOT_ENABLED = 'Chức năng đăng nhập chưa được kích hoạt trên máy chủ này. Bạn vẫn dùng được mọi thí nghiệm mà không cần tài khoản.';

// ---- validation (same rules as the backend; the backend still re-checks everything) ----------
/** Usernames are typed in lower case: normalise while typing instead of rejecting "An". */
export const normalizeUsername = (v) => String(v).trim().toLowerCase();

export function usernameProblem(username) {
  if (!username) return 'Hãy nhập tên đăng nhập.';
  if (username.length < 3 || username.length > 32) return 'Tên đăng nhập dài 3–32 ký tự.';
  if (!USERNAME_RE.test(username)) return 'Chỉ dùng chữ thường không dấu, số và các dấu _ . -';
  return null;
}

export function newPasswordProblem(password, username = '') {
  if (!password) return 'Hãy nhập mật khẩu.';
  if (password.length < PASSWORD_MIN) return `Mật khẩu cần ít nhất ${PASSWORD_MIN} ký tự.`;
  if (password.length > PASSWORD_MAX) return `Mật khẩu tối đa ${PASSWORD_MAX} ký tự.`;
  if (username && password.toLowerCase().includes(username)) return 'Mật khẩu không được chứa tên đăng nhập.';
  return null;
}

/** Login only checks that fields are filled: length rules belong to sign-up (old accounts, reset passwords). */
export function validateLogin({ username, password }) {
  const errors = {};
  if (!username) errors.username = 'Hãy nhập tên đăng nhập.';
  if (!password) errors.password = 'Hãy nhập mật khẩu.';
  return errors;
}

export function validateRegister({ username, password, confirm, consent }) {
  const errors = {};
  const u = usernameProblem(username);
  if (u) errors.username = u;
  const p = newPasswordProblem(password, username);
  if (p) errors.password = p;
  if (!confirm) errors.confirm = 'Hãy nhập lại mật khẩu.';
  else if (confirm !== password) errors.confirm = 'Hai mật khẩu chưa khớp.';
  if (!consent) errors.consent = 'Cần đồng ý để tạo tài khoản.';
  return errors;
}

// ---- API ------------------------------------------------------------------------------------
const MESSAGES = {
  invalid_credentials: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  username_taken: 'Tên đăng nhập này đã có người dùng. Hãy chọn tên khác.',
  account_disabled: 'Tài khoản đã bị khóa. Hãy liên hệ giáo viên.',
  unauthenticated: 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.',
  forbidden: 'Bạn không có quyền thực hiện thao tác này.',
};

function problem(status, body) {
  const code = body?.error_code;
  if (code === 'rate_limited') {
    const s = Number(body.retry_after_seconds);
    const wait = Number.isFinite(s) && s > 0 ? `${Math.ceil(s)} giây` : 'một lúc';
    return new AuthError(`Bạn đã thử quá nhiều lần. Hãy đợi ${wait} rồi thử lại.`, { code, status, retryAfter: Number.isFinite(s) ? s : null });
  }
  if (code === 'invalid_input' || code === 'invalid_field') {
    const field = body?.details?.field ?? null;
    return new AuthError(body?.error || 'Thông tin chưa hợp lệ.', { code, status, field });
  }
  if (MESSAGES[code]) return new AuthError(MESSAGES[code], { code, status });
  return new AuthError(body?.error || `Máy chủ báo lỗi (HTTP ${status}). Hãy thử lại sau.`, { code: code || 'unknown', status });
}

/**
 * One call to /api/v1/auth/<path>. Returns the parsed JSON body (null for 204).
 * `fetchImpl` is injectable for tests.
 */
export async function authRequest(path, { method = 'GET', body, fetchImpl = globalThis.fetch } = {}) {
  let res;
  try {
    res = await fetchImpl(`${API}/${path}`, {
      method,
      credentials: 'same-origin', // session cookie; never an Authorization header
      headers: body === undefined ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new AuthError('Không kết nối được máy chủ HoloLab. Máy chủ (python server.py) còn chạy không?', { code: 'network' });
  }
  if (res.status === 204) return null;
  const isJson = (res.headers?.get?.('Content-Type') || '').includes('application/json');
  let data = null;
  if (isJson) { try { data = await res.json(); } catch { data = null; } }
  // No auth backend yet: the route is unknown (404 without a v3.1 error_code), not allowed, or a non-API page.
  if ([404, 405, 501].includes(res.status) && !data?.error_code) throw new AuthError(NOT_ENABLED, { code: 'not_enabled', status: res.status });
  if (res.ok && !isJson) throw new AuthError(NOT_ENABLED, { code: 'not_enabled', status: res.status });
  if (!res.ok) throw problem(res.status, data);
  return data;
}

const userOf = (data) => {
  const u = data?.user;
  if (!u || typeof u.username !== 'string' || !['student', 'teacher'].includes(u.role)) {
    throw new AuthError('Máy chủ trả dữ liệu tài khoản không hợp lệ.', { code: 'bad_response' });
  }
  return { id: u.id, username: u.username, role: u.role, created_at: u.created_at ?? null };
};

export async function login({ username, password }, opts) {
  return userOf(await authRequest('login', { method: 'POST', body: { username, password }, ...opts }));
}

/** Students only: teachers are created on the server (python manage.py create-teacher). Logs in on success. */
export async function register({ username, password }, opts) {
  return userOf(await authRequest('register', { method: 'POST', body: { username, password, consent: { version: CONSENT_VERSION } }, ...opts }));
}

export async function logout(opts) {
  try { await authRequest('logout', { method: 'POST', body: {}, ...opts }); } catch (e) { if (e.code !== 'unauthenticated' && e.code !== 'not_enabled') throw e; }
}

/** Current user, or null when signed out. `enabled` tells whether the server has accounts at all. */
export async function currentUser(opts) {
  try {
    return { enabled: true, user: userOf(await authRequest('me', opts)) };
  } catch (e) {
    if (e.code === 'unauthenticated') return { enabled: true, user: null };
    if (e.code === 'not_enabled') return { enabled: false, user: null };
    return { enabled: null, user: null, error: e }; // unknown (offline, server error): show signed out
  }
}
