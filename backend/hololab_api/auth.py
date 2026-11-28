"""API v3.1 §2: POST /auth/register, POST /auth/login, POST /auth/logout, GET /auth/me.

Session = HttpOnly cookie "session" (SameSite=Strict, Secure on HTTPS). Students sign up themselves;
teachers are created on the server (python manage.py create-teacher)."""

from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, Request, Response
from pydantic import BaseModel, ConfigDict
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import security as sec
from .errors import NO_STORE, ApiError, invalid_field
from .models import AuthSession, User, aware, utcnow

router = APIRouter(prefix="/api/v1/auth")
TOUCH_EVERY = timedelta(minutes=1)  # write last_seen_at at most once a minute per session


class ConsentIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    version: str


class RegisterIn(BaseModel):
    # extra="forbid": a "role" (or any unknown field) is rejected, never silently accepted.
    model_config = ConfigDict(extra="forbid")
    username: str
    password: str
    consent: ConsentIn


class LoginIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    username: str
    password: str


def ctx(request: Request):
    return request.app.state.ctx


def db_session(request: Request):
    db = ctx(request).sessions()
    try:
        yield db
    finally:
        db.close()


def same_origin(request: Request) -> None:
    sec.require_same_origin(request, ctx(request).settings)


def _set_cookie(response: Response, request: Request, token: str, max_age: int) -> None:
    response.set_cookie(sec.COOKIE, token, max_age=max_age, path="/", httponly=True, samesite="strict",
                        secure=sec.cookie_secure(request, ctx(request).settings))


def _clear_cookie(response: Response, request: Request) -> None:
    try:
        secure = sec.cookie_secure(request, ctx(request).settings)
    except ApiError:
        secure = False
    response.delete_cookie(sec.COOKIE, path="/", httponly=True, samesite="strict", secure=secure)


def _start_session(db: Session, user: User, request: Request, response: Response) -> None:
    settings = ctx(request).settings
    # Decide the cookie flags first: on plain http from another machine this refuses before anything is written.
    sec.cookie_secure(request, settings)
    token, now = sec.new_token(), utcnow()
    max_age = timedelta(days=settings.session_max_days)
    db.add(AuthSession(user_id=user.id, token_hash=sec.token_hash(token), created_at=now, last_seen_at=now, expires_at=now + max_age))
    user.last_active_at = now
    db.commit()
    # The cookie may outlive inactivity; the server enforces the 24 h idle limit on every request.
    _set_cookie(response, request, token, int(max_age.total_seconds()))
    response.headers.update(NO_STORE)


def current_session(request: Request, db: Session = Depends(db_session)) -> AuthSession:
    """The signed-in session, or 401 unauthenticated. Expired, idle or disabled-account sessions are removed."""
    token = request.cookies.get(sec.COOKIE)
    if not token:
        raise ApiError(401, "unauthenticated", "Bạn chưa đăng nhập.")
    row = db.scalar(select(AuthSession).where(AuthSession.token_hash == sec.token_hash(token)))
    now, settings = utcnow(), ctx(request).settings
    if row is None:
        raise ApiError(401, "unauthenticated", "Phiên đăng nhập không còn hiệu lực.")
    idle = now - aware(row.last_seen_at) > timedelta(hours=settings.session_idle_hours)
    if idle or aware(row.expires_at) <= now or not row.user.active:
        db.delete(row)
        db.commit()
        raise ApiError(401, "unauthenticated", "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.")
    if now - aware(row.last_seen_at) > TOUCH_EVERY:
        row.last_seen_at = now
        row.user.last_active_at = now
        db.commit()
    return row


def current_user(row: AuthSession = Depends(current_session)) -> User:
    return row.user


@router.post("/register", status_code=201, dependencies=[Depends(same_origin)])
def register(body: RegisterIn, request: Request, response: Response, db: Session = Depends(db_session)):
    c = ctx(request)
    ip = sec.client_ip(request, c.settings)
    wait = c.limiter.retry_after(f"register:ip:{ip}", c.settings.register_per_ip, c.settings.register_window_sec)
    if wait:
        raise sec.rate_limited(wait)
    username = sec.check_username(body.username)
    password = sec.check_new_password(body.password, username)
    if body.consent.version not in c.settings.consent_versions:
        raise invalid_field("consent", "Phiên bản văn bản đồng ý không hợp lệ. Hãy tải lại trang rồi đăng ký lại.")
    sec.cookie_secure(request, c.settings)  # refuse plain-http LAN sign-up before creating the account
    if db.scalar(select(User.id).where(User.username == username)):
        raise ApiError(409, "username_taken", "Tên đăng nhập này đã có người dùng.")
    c.limiter.hit(f"register:ip:{ip}", c.settings.register_window_sec)  # count attempts that reach the database
    now = utcnow()
    user = User(username=username, password_hash=sec.hash_password(password), role="student",  # never from the request
                consent_version=body.consent.version, consent_at=now, created_at=now)
    db.add(user)
    try:
        db.flush()
    except IntegrityError:  # two sign-ups with the same name at the same moment
        db.rollback()
        raise ApiError(409, "username_taken", "Tên đăng nhập này đã có người dùng.") from None
    _start_session(db, user, request, response)
    return {"user": user.public()}


@router.post("/login", dependencies=[Depends(same_origin)])
def login(body: LoginIn, request: Request, response: Response, db: Session = Depends(db_session)):
    c, s = ctx(request), ctx(request).settings
    ip = sec.client_ip(request, s)
    username = body.username.strip().lower()[:64]
    keys = (f"login:user:{username}", s.login_fail_per_user), (f"login:ip:{ip}", s.login_fail_per_ip)
    waits = [w for key, limit in keys if (w := c.limiter.retry_after(key, limit, s.login_window_sec))]
    if waits:
        raise sec.rate_limited(max(waits))
    user = db.scalar(select(User).where(User.username == username)) if sec.USERNAME_RE.fullmatch(username) else None
    # Always run argon2 (dummy hash for unknown names): the response time does not reveal which names exist.
    ok = sec.verify_password(user.password_hash if user else None, body.password[: sec.PASSWORD_MAX * 4])
    if not ok:
        for key, _ in keys:
            c.limiter.hit(key, s.login_window_sec)
        raise ApiError(401, "invalid_credentials", "Tên đăng nhập hoặc mật khẩu không đúng.")
    if not user.active:  # only said after a correct password, so it does not leak which accounts exist
        raise ApiError(403, "account_disabled", "Tài khoản đã bị khóa. Hãy liên hệ giáo viên.")
    c.limiter.reset(f"login:user:{username}")
    if sec.needs_rehash(user.password_hash):
        user.password_hash = sec.hash_password(body.password)
    _start_session(db, user, request, response)
    return {"user": user.public()}


@router.post("/logout", status_code=204, dependencies=[Depends(same_origin)])
def logout(request: Request, row: AuthSession = Depends(current_session), db: Session = Depends(db_session)):
    db.execute(delete(AuthSession).where(AuthSession.id == row.id))
    db.commit()
    response = Response(status_code=204, headers=NO_STORE)
    _clear_cookie(response, request)
    return response


@router.get("/me")
def me(response: Response, user: User = Depends(current_user)):
    response.headers.update(NO_STORE)
    return {"user": user.public()}
