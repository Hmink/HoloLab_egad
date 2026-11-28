import React, { useEffect, useId, useRef, useState } from 'react';
import { href } from '../lib/routes.js';
import {
  CONSENT_TEXT, PASSWORD_MAX, PASSWORD_MIN, login, normalizeUsername, register, validateLogin, validateRegister,
} from '../lib/auth.js';
import { IconLock } from '../components/Icons.jsx';

// Field with label, hint and error wired for screen readers (aria-invalid + aria-describedby).
function Field({ id, label, hint, error, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={'hl-field' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}</label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && <p className="hl-field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="hl-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function PasswordInput({ show, onToggle, ...props }) {
  return (
    <div className="hl-password">
      <input {...props} type={show ? 'text' : 'password'} spellCheck={false} autoCapitalize="none" maxLength={PASSWORD_MAX} />
      {/* Reachable by keyboard (no tabIndex=-1) and announces its state. */}
      <button type="button" className="hl-password-toggle" onClick={onToggle} aria-pressed={show}
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{show ? 'Ẩn' : 'Hiện'}</button>
    </div>
  );
}

function FormAlert({ error, alertRef }) {
  if (!error) return null;
  return <div className="hl-form-alert" role="alert" tabIndex={-1} ref={alertRef}>{error}</div>;
}

function useSubmit(action) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const alertRef = useRef(null);
  // Move focus to the message once it is on screen and the form is enabled again (the submit button
  // was disabled while sending, which drops focus to <body>).
  useEffect(() => { if (error && !busy) alertRef.current?.focus(); }, [attempt, busy]);
  const run = async (...args) => {
    setBusy(true); setError('');
    try { await action(...args); }
    catch (e) { setError(e.message); setAttempt((n) => n + 1); }
    finally { setBusy(false); }
  };
  return { busy, error, alertRef, run };
}

// Focus the first invalid field so keyboard users land on the problem.
const focusFirst = (form, errors) => {
  const name = Object.keys(errors)[0];
  if (name) form.querySelector(`[name="${name}"]`)?.focus();
};

function AuthCard({ title, lead, children, footer }) {
  return (
    <div className="hl-auth">
      <section className="hl-panel hl-auth-card" aria-labelledby="hl-auth-title">
        <span className="hl-feature-icon hl-tint-1"><IconLock size={28} /></span>
        <h1 id="hl-auth-title">{title}</h1>
        {lead && <p className="hl-muted">{lead}</p>}
        {children}
        {footer && <div className="hl-auth-foot">{footer}</div>}
      </section>
    </div>
  );
}

/* ---------------- Đăng nhập ---------------- */
export function LoginPage({ onSignedIn }) {
  const uid = useId();
  const [values, setValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const { busy, error, alertRef, run } = useSubmit(async () => onSignedIn(await login(values)));
  const set = (k) => (e) => { const v = k === 'username' ? normalizeUsername(e.target.value) : e.target.value; setValues((s) => ({ ...s, [k]: v })); setErrors((s) => ({ ...s, [k]: undefined })); };
  const submit = (e) => {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length) { focusFirst(e.currentTarget, found); return; }
    run();
  };
  return (
    <AuthCard title="Đăng nhập" lead="Đăng nhập để lưu quá trình học trên máy chủ của lớp."
      footer={<>
        <p>Chưa có tài khoản? <a href={href.register}>Đăng ký</a></p>
        <p className="hl-muted">Quên mật khẩu? Hãy nhờ giáo viên đặt lại (HoloLab không dùng email).</p>
        <p className="hl-muted">Không đăng nhập vẫn làm được mọi thí nghiệm. <a href={href.overview}>Vào khu học tập</a></p>
      </>}>
      <form className="hl-form" onSubmit={submit} noValidate aria-busy={busy}>
        <FormAlert error={error} alertRef={alertRef} />
        <Field id={`${uid}-u`} label="Tên đăng nhập" error={errors.username}>
          {(a) => <input {...a} name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={32}
            value={values.username} onChange={set('username')} disabled={busy} />}
        </Field>
        <Field id={`${uid}-p`} label="Mật khẩu" error={errors.password}>
          {(a) => <PasswordInput {...a} name="password" autoComplete="current-password" value={values.password}
            onChange={set('password')} disabled={busy} show={show} onToggle={() => setShow((v) => !v)} />}
        </Field>
        <button type="submit" className="hl-btn hl-btn-primary hl-btn-lg hl-form-submit" disabled={busy}>
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
    </AuthCard>
  );
}

/* ---------------- Đăng ký (học sinh) ---------------- */
export function RegisterPage({ onSignedIn }) {
  const uid = useId();
  const [values, setValues] = useState({ username: '', password: '', confirm: '', consent: false });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const { busy, error, alertRef, run } = useSubmit(async () => onSignedIn(await register(values)));
  const set = (k) => (e) => {
    const v = k === 'consent' ? e.target.checked : k === 'username' ? normalizeUsername(e.target.value) : e.target.value;
    setValues((s) => ({ ...s, [k]: v })); setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const submit = (e) => {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length) { focusFirst(e.currentTarget, found); return; }
    run();
  };
  return (
    <AuthCard title="Đăng ký tài khoản học sinh" lead="Tài khoản giúp lưu bài làm và câu trả lời EGAD trên máy chủ của lớp, để bạn và giáo viên xem lại."
      footer={<>
        <p>Đã có tài khoản? <a href={href.login}>Đăng nhập</a></p>
        <p className="hl-muted">Tài khoản giáo viên do người quản trị tạo trên máy chủ, không đăng ký ở đây.</p>
      </>}>
      <form className="hl-form" onSubmit={submit} noValidate aria-busy={busy}>
        <FormAlert error={error} alertRef={alertRef} />
        <Field id={`${uid}-u`} label="Tên đăng nhập" error={errors.username}
          hint="3–32 ký tự: chữ thường không dấu, số, _ . -  Không dùng họ tên thật (ví dụ: hs.lop10a.07, tho_xanh)">
          {(a) => <input {...a} name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={32}
            value={values.username} onChange={set('username')} disabled={busy} />}
        </Field>
        <Field id={`${uid}-p`} label="Mật khẩu" error={errors.password}
          hint={`Ít nhất ${PASSWORD_MIN} ký tự. Một câu ngắn dễ nhớ là mật khẩu tốt (ví dụ ba từ ghép lại).`}>
          {(a) => <PasswordInput {...a} name="password" autoComplete="new-password" value={values.password}
            onChange={set('password')} disabled={busy} show={show} onToggle={() => setShow((v) => !v)} />}
        </Field>
        <Field id={`${uid}-c`} label="Nhập lại mật khẩu" error={errors.confirm}>
          {(a) => <PasswordInput {...a} name="confirm" autoComplete="new-password" value={values.confirm}
            onChange={set('confirm')} disabled={busy} show={show} onToggle={() => setShow((v) => !v)} />}
        </Field>
        <div className={'hl-field hl-check' + (errors.consent ? ' has-error' : '')}>
          <label>
            <input type="checkbox" name="consent" checked={values.consent} onChange={set('consent')} disabled={busy}
              aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} />
            <span>{CONSENT_TEXT}</span>
          </label>
          {errors.consent && <p className="hl-field-error" id={`${uid}-consent-error`}>{errors.consent}</p>}
        </div>
        <button type="submit" className="hl-btn hl-btn-primary hl-btn-lg hl-form-submit" disabled={busy}>
          {busy ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </button>
      </form>
    </AuthCard>
  );
}
