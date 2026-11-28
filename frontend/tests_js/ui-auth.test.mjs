import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  CONSENT_VERSION, NOT_ENABLED, currentUser, login, logout, newPasswordProblem, normalizeUsername, register,
  usernameProblem, validateLogin, validateRegister,
} from '../ui/lib/auth.js';

// Minimal fetch double: records the call and returns a Response-like object.
function fake(status, body, { json = true } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: init.body ? JSON.parse(init.body) : undefined });
    return {
      status, ok: status >= 200 && status < 300,
      headers: { get: (h) => (h === 'Content-Type' ? (json ? 'application/json' : 'text/html') : null) },
      json: async () => body,
    };
  };
  return { fetchImpl, calls };
}
const user = { id: 'u1', username: 'tho_xanh', role: 'student', created_at: '2026-11-28T00:00:00Z' };

test('validation follows API v3.1 (username 3-32 a-z0-9_.-, password >= 10, consent required)', () => {
  assert.equal(normalizeUsername('  Tho_Xanh '), 'tho_xanh');
  assert.equal(usernameProblem('ab'), 'Tên đăng nhập dài 3–32 ký tự.');
  assert.match(usernameProblem('trần văn'), /chữ thường không dấu/);
  assert.equal(usernameProblem('hs.lop10a-07'), null);
  assert.match(newPasswordProblem('short'), /ít nhất 10/);
  assert.match(newPasswordProblem('tho_xanh_123456', 'tho_xanh'), /không được chứa tên/);
  assert.equal(newPasswordProblem('ba con meo vang'), null); // no forced upper/digit rules
  assert.deepEqual(validateLogin({ username: 'a', password: 'x' }), {}); // login: only "filled in"
  assert.deepEqual(Object.keys(validateRegister({ username: 'tho_xanh', password: 'ba con meo vang', confirm: 'khac', consent: false })), ['confirm', 'consent']);
  assert.deepEqual(validateRegister({ username: 'tho_xanh', password: 'ba con meo vang', confirm: 'ba con meo vang', consent: true }), {});
});

test('login/register send only what v3.1 expects, with the session cookie, never a token', async () => {
  const a = fake(200, { user });
  assert.deepEqual(await login({ username: 'tho_xanh', password: 'ba con meo vang' }, { fetchImpl: a.fetchImpl }), user);
  assert.equal(a.calls[0].url, '/api/v1/auth/login');
  assert.equal(a.calls[0].init.credentials, 'same-origin');
  assert.equal(a.calls[0].init.headers.Authorization, undefined);
  assert.deepEqual(a.calls[0].body, { username: 'tho_xanh', password: 'ba con meo vang' });

  const r = fake(201, { user });
  await register({ username: 'tho_xanh', password: 'ba con meo vang', confirm: 'ba con meo vang', consent: true }, { fetchImpl: r.fetchImpl });
  assert.equal(r.calls[0].url, '/api/v1/auth/register');
  assert.deepEqual(r.calls[0].body, { username: 'tho_xanh', password: 'ba con meo vang', consent: { version: CONSENT_VERSION } });
});

test('no auth backend yet -> "not_enabled", never a fake success', async () => {
  for (const [status, body, json] of [[404, { error: 'Not found' }, true], [405, null, false], [501, null, false], [200, null, false], [404, null, false]]) {
    await assert.rejects(login({ username: 'a', password: 'b' }, fake(status, body, { json })), (e) => e.code === 'not_enabled' && e.message === NOT_ENABLED);
  }
  assert.deepEqual(await currentUser(fake(404, null, { json: false })), { enabled: false, user: null });
  await assert.rejects(login({ username: 'a', password: 'b' }, { fetchImpl: async () => { throw new TypeError('Failed to fetch'); } }), (e) => e.code === 'network');
});

test('errors are mapped from error_code (not the server text)', async () => {
  await assert.rejects(login({ username: 'a', password: 'b' }, fake(401, { error: 'x', error_code: 'invalid_credentials', retryable: false })), /Tên đăng nhập hoặc mật khẩu không đúng/);
  await assert.rejects(register({ username: 'a', password: 'b' }, fake(409, { error: 'x', error_code: 'username_taken' })), /đã có người dùng/);
  await assert.rejects(login({ username: 'a', password: 'b' }, fake(429, { error_code: 'rate_limited', retry_after_seconds: 29.2 })), (e) => e.code === 'rate_limited' && /30 giây/.test(e.message));
  await assert.rejects(login({ username: 'a', password: 'b' }, fake(403, { error_code: 'account_disabled' })), /bị khóa/);
  await assert.rejects(login({ username: 'a', password: 'b' }, fake(500, { error: 'Lỗi DB' })), /Lỗi DB/);
  await assert.rejects(login({ username: 'a', password: 'b' }, fake(200, { user: { username: 'x', role: 'admin' } })), (e) => e.code === 'bad_response');
});

test('me and logout', async () => {
  assert.deepEqual(await currentUser(fake(200, { user })), { enabled: true, user });
  assert.deepEqual(await currentUser(fake(401, { error_code: 'unauthenticated' })), { enabled: true, user: null });
  const out = fake(204, null);
  await logout(out);
  assert.equal(out.calls[0].url, '/api/v1/auth/logout');
  await logout(fake(401, { error_code: 'unauthenticated' })); // already signed out: fine
});

test('the auth code never touches web storage', () => {
  for (const f of ['../ui/lib/auth.js', '../ui/pages/Auth.jsx']) {
    const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(src, /localStorage|sessionStorage|document\.cookie|Authorization/, f);
  }
});
