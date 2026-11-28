"""Settings of the v3.1 API, read from the environment (backend/.env). No secrets live in code."""

from __future__ import annotations

import os
from dataclasses import dataclass, field

# Consent texts the server accepts at sign-up. The frontend sends CONSENT_VERSION from
# frontend/ui/lib/auth.js; keep older versions here while existing users agreed to them.
DEFAULT_CONSENT_VERSIONS = ("hololab-consent-2026-11",)


def _flag(value: str | None, default: bool = False) -> bool:
    if value is None or value == "":
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


@dataclass(frozen=True)
class Settings:
    database_url: str | None
    # "auto": Secure cookie when the browser used HTTPS; on plain http only for localhost/127.0.0.1.
    cookie_secure: str = "auto"
    # Plain http from another machine (LAN) leaks the session cookie. Refused unless explicitly allowed.
    allow_insecure_http: bool = False
    # Trust X-Forwarded-For / X-Forwarded-Proto / X-Forwarded-Host. Only when every request comes through
    # a proxy you run (server.py's internal forwarding, Caddy/nginx). Never when clients reach the API directly.
    trust_forwarded: bool = False
    session_idle_hours: float = 24.0  # API v3.1: expires after 24 h without activity
    session_max_days: float = 30.0  # absolute cap, even for an always-active session
    consent_versions: tuple[str, ...] = DEFAULT_CONSENT_VERSIONS
    # In-memory rate limits (one server process). Failures per window.
    login_fail_per_user: int = 10
    login_fail_per_ip: int = 50
    login_window_sec: int = 15 * 60
    register_per_ip: int = 10
    register_window_sec: int = 60 * 60
    extra: dict = field(default_factory=dict)

    @property
    def enabled(self) -> bool:
        return bool(self.database_url)


def from_env(env: dict | None = None, **overrides) -> Settings:
    env = os.environ if env is None else env
    versions = tuple(v.strip() for v in (env.get("HOLOLAB_CONSENT_VERSIONS") or "").split(",") if v.strip())
    values = dict(
        database_url=(env.get("HOLOLAB_DATABASE_URL") or "").strip() or None,
        cookie_secure=(env.get("HOLOLAB_COOKIE_SECURE") or "auto").strip().lower(),
        allow_insecure_http=_flag(env.get("HOLOLAB_ALLOW_INSECURE_HTTP")),
        trust_forwarded=_flag(env.get("HOLOLAB_TRUST_FORWARDED")),
        consent_versions=versions or DEFAULT_CONSENT_VERSIONS,
    )
    values.update(overrides)
    if values["cookie_secure"] not in ("auto", "1", "0", "true", "false"):
        raise ValueError("HOLOLAB_COOKIE_SECURE phải là auto, 1 hoặc 0")
    return Settings(**values)
