"""Passwords (argon2id), session tokens, rate limits, and the request checks of API v3.1 §1."""

from __future__ import annotations

import hashlib
import ipaddress
import math
import re
import secrets
import threading
import time
from collections import deque
from urllib.parse import urlsplit

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from fastapi import Request

from .config import Settings
from .errors import ApiError, invalid_field

USERNAME_RE = re.compile(r"^[a-z0-9_.-]{3,32}$")
PASSWORD_MIN, PASSWORD_MAX = 10, 128
COOKIE = "session"

# argon2-cffi defaults = RFC 9106 "low memory" profile (argon2id, t=3, m=64 MiB, p=4).
_hasher = PasswordHasher()
# Verified against when the username does not exist, so "no such user" takes as long as "wrong password".
_DUMMY_HASH = _hasher.hash(secrets.token_urlsafe(16))


# ---- validation (same rules as frontend/ui/lib/auth.js) -----------------------------------------
def check_username(username: object) -> str:
    if not isinstance(username, str) or not USERNAME_RE.fullmatch(username):
        raise invalid_field("username", "Tên đăng nhập dài 3–32 ký tự, chỉ gồm chữ thường không dấu, số và _ . -")
    return username


def check_new_password(password: object, username: str = "") -> str:
    if not isinstance(password, str) or not PASSWORD_MIN <= len(password) <= PASSWORD_MAX:
        raise invalid_field("password", f"Mật khẩu cần {PASSWORD_MIN}–{PASSWORD_MAX} ký tự.")
    if username and username in password.lower():
        raise invalid_field("password", "Mật khẩu không được chứa tên đăng nhập.")
    return password


# ---- passwords ------------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(stored_hash: str | None, password: str) -> bool:
    try:
        return _hasher.verify(stored_hash or _DUMMY_HASH, password) and stored_hash is not None
    except (VerificationError, InvalidHashError):
        return False


def needs_rehash(stored_hash: str) -> bool:
    return _hasher.check_needs_rehash(stored_hash)


# ---- session tokens -------------------------------------------------------------------------
def new_token() -> str:
    return secrets.token_urlsafe(32)  # 256 bits


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# ---- rate limits (in memory: one server process; restart clears them) ------------------------
class RateLimiter:
    def __init__(self, clock=time.monotonic):
        self._hits: dict[str, deque] = {}
        self._lock = threading.Lock()
        self.clock = clock

    def _window(self, key: str, window: float) -> deque:
        now, q = self.clock(), self._hits.setdefault(key, deque())
        while q and q[0] <= now - window:
            q.popleft()
        return q

    def retry_after(self, key: str, limit: int, window: float) -> float | None:
        """Seconds to wait if `key` already reached `limit` hits in the last `window` seconds."""
        with self._lock:
            q = self._window(key, window)
            return (q[0] + window - self.clock()) if len(q) >= limit else None

    def hit(self, key: str, window: float) -> None:
        with self._lock:
            self._window(key, window).append(self.clock())

    def reset(self, key: str) -> None:
        with self._lock:
            self._hits.pop(key, None)


def rate_limited(seconds: float) -> ApiError:
    wait = max(1, math.ceil(seconds))
    return ApiError(429, "rate_limited", f"Thử quá nhiều lần. Hãy đợi {wait} giây rồi thử lại.", retryable=True,
                    headers={"Retry-After": str(wait)}, retry_after_seconds=wait)


# ---- request context ------------------------------------------------------------------------
def _first(value: str | None) -> str | None:
    return value.split(",")[0].strip() if value else None


def client_ip(request: Request, settings: Settings) -> str:
    if settings.trust_forwarded:
        fwd = _first(request.headers.get("x-forwarded-for"))
        if fwd:
            return fwd
    return request.client.host if request.client else "unknown"


def scheme_and_host(request: Request, settings: Settings) -> tuple[str, str]:
    scheme = request.url.scheme
    host = request.headers.get("host", "")
    if settings.trust_forwarded:
        scheme = _first(request.headers.get("x-forwarded-proto")) or scheme
        host = _first(request.headers.get("x-forwarded-host")) or host
    return scheme.lower(), host.lower()


def _is_loopback(host: str) -> bool:
    name = urlsplit(f"//{host}").hostname or ""
    if name == "localhost":
        return True
    try:
        return ipaddress.ip_address(name).is_loopback
    except ValueError:
        return False


def require_same_origin(request: Request, settings: Settings) -> None:
    """v3.1 §1: every POST/PUT/PATCH/DELETE must carry an Origin equal to this server (blocks CSRF from
    other sites, on top of SameSite=Strict)."""
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return
    origin = request.headers.get("origin")
    scheme, host = scheme_and_host(request, settings)
    if not origin or origin.lower() != f"{scheme}://{host}":
        raise ApiError(403, "forbidden", "Yêu cầu không đến từ trang HoloLab của máy chủ này.")


def cookie_secure(request: Request, settings: Settings) -> bool:
    """Whether the session cookie gets the Secure flag; refuses to hand out a session over plain http
    to another machine (it would travel unencrypted over the LAN) unless explicitly allowed."""
    mode = settings.cookie_secure
    if mode in ("1", "true"):
        return True
    if mode in ("0", "false"):
        return False
    scheme, host = scheme_and_host(request, settings)
    if scheme == "https":
        return True
    if _is_loopback(host) or settings.allow_insecure_http:
        return False
    raise ApiError(503, "not_configured",
                   "Đăng nhập cần HTTPS khi truy cập từ máy khác. Hãy chạy HoloLab sau một reverse proxy HTTPS "
                   "(xem docs/BACKEND_XAC_THUC.md), hoặc chỉ khi thử nghiệm: HOLOLAB_ALLOW_INSECURE_HTTP=1.")
