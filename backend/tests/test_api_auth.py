"""API v3.1 accounts: register/login/logout/me, sessions, rate limits, Origin/HTTPS rules, admin commands,
and the server.py forwarding. Runs on a fresh SQLite file per test (tables built by the real migration);
set HOLOLAB_TEST_DATABASE_URL=postgresql+psycopg://... to run the same tests on PostgreSQL."""

from __future__ import annotations

import io
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from contextlib import redirect_stdout
from datetime import timedelta
from pathlib import Path
from unittest import mock

BACKEND = Path(__file__).resolve().parent.parent

try:
    from fastapi.testclient import TestClient
    from sqlalchemy import select, text

    from hololab_api.app import create_app
    from hololab_api.config import from_env
    from hololab_api.db import make_engine, make_sessionmaker, migrate, schema_problem
    from hololab_api.models import AuthSession, User, utcnow
    from hololab_api.security import RateLimiter, token_hash

    HAVE_API = True
except ImportError:  # pip install -r requirements-api.txt
    HAVE_API = False

PG_URL = os.environ.get("HOLOLAB_TEST_DATABASE_URL")
BASE = "http://127.0.0.1"
ORIGIN = {"Origin": BASE}
CONSENT = {"version": "hololab-consent-2026-11"}
GOOD = {"username": "tho_xanh", "password": "ba con meo vang", "consent": CONSENT}


class Clock:
    def __init__(self):
        self.now = 1000.0

    def __call__(self):
        return self.now


@unittest.skipUnless(HAVE_API, "cần pip install -r requirements-api.txt")
class AuthApiTests(unittest.TestCase):
    def setUp(self):
        if PG_URL:
            self.url = PG_URL
            engine = make_engine(self.url)
            with engine.begin() as conn:
                conn.execute(text("DROP TABLE IF EXISTS auth_sessions, users, alembic_version CASCADE"))
            engine.dispose()
        else:
            self.tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)  # Windows: never fail a test on cleanup
            self.url = f"sqlite:///{self.tmp.name}/test.db"
        migrate(self.url)
        self.engine = make_engine(self.url)
        self.db = make_sessionmaker(self.engine)
        self.clock = Clock()
        self.client = self.make_client()

    def tearDown(self):
        self.client.close()
        self.engine.dispose()
        if not PG_URL:
            self.tmp.cleanup()

    def make_client(self, base=BASE, **overrides):
        settings = from_env({}, database_url=self.url, login_fail_per_user=3, login_fail_per_ip=6, register_per_ip=4, **overrides)
        return TestClient(create_app(settings, engine=self.engine, limiter=RateLimiter(self.clock)), base_url=base)

    def register(self, client=None, **body):
        return (client or self.client).post("/api/v1/auth/register", json={**GOOD, **body}, headers=ORIGIN)

    def login(self, username="tho_xanh", password="ba con meo vang", client=None, origin=ORIGIN):
        return (client or self.client).post("/api/v1/auth/login", json={"username": username, "password": password}, headers=origin)

    def user(self, username="tho_xanh"):
        with self.db() as db:
            return db.scalar(select(User).where(User.username == username))

    # ---- sign-up --------------------------------------------------------------------------
    def test_register_creates_student_signs_in_and_stores_consent(self):
        r = self.register()
        self.assertEqual(r.status_code, 201, r.text)
        self.assertEqual(r.json()["user"]["username"], "tho_xanh")
        self.assertEqual(r.json()["user"]["role"], "student")
        self.assertEqual(set(r.json()["user"]), {"id", "username", "role", "created_at"})
        cookie = r.headers["set-cookie"].lower()
        for flag in ("session=", "httponly", "samesite=strict", "path=/"):
            self.assertIn(flag, cookie)
        self.assertNotIn("secure", cookie)  # plain http on 127.0.0.1 only
        self.assertEqual(r.headers["cache-control"], "no-store")
        me = self.client.get("/api/v1/auth/me")
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.json()["user"]["username"], "tho_xanh")
        u = self.user()
        self.assertEqual(u.consent_version, CONSENT["version"])
        self.assertIsNotNone(u.consent_at)
        self.assertTrue(u.password_hash.startswith("$argon2id$"))
        with self.db() as db:  # only the SHA-256 of the cookie token is stored
            row = db.scalar(select(AuthSession))
            self.assertEqual(row.token_hash, token_hash(self.client.cookies["session"]))

    def test_register_never_takes_a_role_from_the_request(self):
        r = self.register(role="teacher")
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.json()["error_code"], "invalid_input")
        self.assertIsNone(self.user())

    def test_register_validation_and_duplicates(self):
        cases = [({"username": "Ab"}, "username"), ({"username": "trần văn"}, "username"), ({"password": "ngan"}, "password"),
                 ({"password": "tho_xanh_12345"}, "password"), ({"consent": {"version": "cu"}}, "consent")]
        for body, field in cases:
            r = self.register(**body)
            self.assertEqual((r.status_code, r.json()["error_code"], r.json()["details"]["field"]), (400, "invalid_field", field), body)
        r = self.client.post("/api/v1/auth/register", json={"username": "abc", "password": "x" * 12}, headers=ORIGIN)
        self.assertEqual(r.status_code, 400)  # missing consent
        self.assertIn(r.json()["error_code"], ("invalid_field", "invalid_input"))
        self.assertEqual(self.register().status_code, 201)
        other = self.make_client()
        r = self.register(client=other, password="mot cau khac han")
        self.assertEqual((r.status_code, r.json()["error_code"], r.json()["retryable"]), (409, "username_taken", False))

    def test_every_error_has_the_v31_shape(self):
        for r in (self.client.get("/api/v1/auth/me"), self.client.get("/api/v1/khong-co"),
                  self.client.post("/api/v1/auth/login", content=b"not json", headers={**ORIGIN, "Content-Type": "application/json"})):
            body = r.json()
            self.assertEqual(set(body) >= {"error", "error_code", "retryable"}, True, body)
        self.assertEqual(self.client.get("/api/v1/khong-co").json()["error_code"], "not_found")

    # ---- Origin / HTTPS -------------------------------------------------------------------
    def test_writes_need_this_servers_origin(self):
        for headers in ({}, {"Origin": "http://evil.example"}, {"Origin": "https://127.0.0.1"}):
            r = self.client.post("/api/v1/auth/register", json=GOOD, headers=headers)
            self.assertEqual((r.status_code, r.json()["error_code"]), (403, "forbidden"), headers)
        self.assertIsNone(self.user())

    def test_plain_http_from_another_machine_is_refused_unless_allowed(self):
        lan = self.make_client(base="http://192.168.1.10:8765")
        r = lan.post("/api/v1/auth/register", json=GOOD, headers={"Origin": "http://192.168.1.10:8765"})
        self.assertEqual((r.status_code, r.json()["error_code"]), (503, "not_configured"))
        self.assertIsNone(self.user())  # refused before creating the account
        lan_ok = self.make_client(base="http://192.168.1.10:8765", allow_insecure_http=True)
        self.assertEqual(lan_ok.post("/api/v1/auth/register", json=GOOD, headers={"Origin": "http://192.168.1.10:8765"}).status_code, 201)

    def test_https_behind_a_trusted_proxy_sets_secure_cookie(self):
        proxied = self.make_client(base="http://127.0.0.1:9000", trust_forwarded=True)
        headers = {"Origin": "https://lab.truong.edu.vn", "X-Forwarded-Proto": "https", "X-Forwarded-Host": "lab.truong.edu.vn",
                   "X-Forwarded-For": "10.0.0.7"}
        r = proxied.post("/api/v1/auth/register", json=GOOD, headers=headers)
        self.assertEqual(r.status_code, 201, r.text)
        self.assertIn("secure", r.headers["set-cookie"].lower())
        # without trust, the forwarded headers are ignored -> the https Origin does not match
        r = self.make_client(base="http://127.0.0.1:9000").post("/api/v1/auth/login", json={"username": "a", "password": "b"}, headers=headers)
        self.assertEqual(r.status_code, 403)

    # ---- login / logout / sessions --------------------------------------------------------
    def test_login_logout_cycle(self):
        self.register()
        self.client.cookies.clear()
        self.assertEqual(self.client.get("/api/v1/auth/me").status_code, 401)
        r = self.login()
        self.assertEqual(r.status_code, 200, r.text)
        self.assertEqual(self.client.get("/api/v1/auth/me").json()["user"]["role"], "student")
        r = self.client.post("/api/v1/auth/logout", headers=ORIGIN)
        self.assertEqual(r.status_code, 204)
        self.assertIn("max-age=0", r.headers["set-cookie"].lower())
        me = self.client.get("/api/v1/auth/me")
        self.assertEqual((me.status_code, me.json()["error_code"]), (401, "unauthenticated"))
        with self.db() as db:
            self.assertEqual(db.query(AuthSession).count(), 1)  # the register session (other cookie jar) remains

    def test_wrong_password_and_unknown_user_look_the_same(self):
        self.register()
        a, b, c = self.login(password="sai mat khau"), self.login(username="khong_co_ai"), self.login(username="TRẦN")
        for r in (a, b, c):
            self.assertEqual((r.status_code, r.json()["error_code"], r.json()["error"]), (401, "invalid_credentials", a.json()["error"]))

    def test_login_rate_limit_per_username_then_window_expires(self):
        self.register()
        for _ in range(3):
            self.assertEqual(self.login(password="sai mat khau").status_code, 401)
        r = self.login()  # even the right password waits: no guessing during the lock
        self.assertEqual((r.status_code, r.json()["error_code"], r.json()["retryable"]), (429, "rate_limited", True))
        self.assertEqual(r.json()["retry_after_seconds"], 900)
        self.assertEqual(r.headers["retry-after"], "900")
        self.clock.now += 901
        self.assertEqual(self.login().status_code, 200)

    def test_login_rate_limit_per_ip_across_usernames(self):
        for i in range(6):
            self.login(username=f"ten_{i}", password="sai mat khau")
        self.assertEqual(self.login(username="ten_moi", password="x").status_code, 429)

    def test_register_rate_limit_per_ip(self):
        for i in range(4):
            self.assertEqual(self.register(username=f"hs_{i}").status_code, 201)
        r = self.register(username="hs_moi")
        self.assertEqual((r.status_code, r.json()["error_code"]), (429, "rate_limited"))
        self.assertIsNone(self.user("hs_moi"))
        self.clock.now += 3601
        self.assertEqual(self.register(username="hs_moi").status_code, 201)

    def test_idle_and_absolute_expiry_remove_the_session(self):
        self.register()
        with self.db() as db:
            row = db.scalar(select(AuthSession))
            row.last_seen_at = utcnow() - timedelta(hours=25)
            db.commit()
        self.assertEqual(self.client.get("/api/v1/auth/me").status_code, 401)
        with self.db() as db:
            self.assertEqual(db.query(AuthSession).count(), 0)
        self.login()
        with self.db() as db:
            row = db.scalar(select(AuthSession))
            row.expires_at = utcnow() - timedelta(seconds=1)
            db.commit()
        self.assertEqual(self.client.get("/api/v1/auth/me").status_code, 401)

    def test_disabled_account(self):
        self.register()
        with self.db() as db:
            db.scalar(select(User)).active = False
            db.commit()
        self.assertEqual(self.client.get("/api/v1/auth/me").status_code, 401)  # live session ends
        self.assertEqual(self.login(password="sai mat khau").json()["error_code"], "invalid_credentials")
        self.assertEqual(self.login().json()["error_code"], "account_disabled")  # only after the right password

    # ---- server-side admin commands -------------------------------------------------------
    def test_manage_create_teacher_set_password_set_active(self):
        import manage

        def run(*argv, stdin=""):
            out = io.StringIO()
            with mock.patch.dict(os.environ, {"HOLOLAB_DATABASE_URL": self.url}), mock.patch("sys.stdin", io.StringIO(stdin)), redirect_stdout(out):
                manage.main(list(argv))
            return out.getvalue()

        self.assertIn("giáo viên", run("create-teacher", "gv.hoa", "--password-stdin", stdin="mat khau giao vien\n"))
        r = self.login("gv.hoa", "mat khau giao vien")
        self.assertEqual(r.json()["user"]["role"], "teacher")
        with self.assertRaises(SystemExit):
            run("create-teacher", "gv.hoa", "--password-stdin", stdin="mat khau giao vien\n")
        with self.assertRaises(SystemExit):
            run("create-teacher", "gv2", "--password-stdin", stdin="ngan\n")
        run("set-password", "gv.hoa", "--password-stdin", stdin="mot mat khau moi\n")
        self.assertEqual(self.client.get("/api/v1/auth/me").status_code, 401)  # signed out everywhere
        self.assertEqual(self.login("gv.hoa", "mot mat khau moi").status_code, 200)
        run("set-active", "gv.hoa", "off")
        self.assertEqual(self.login("gv.hoa", "mot mat khau moi").json()["error_code"], "account_disabled")
        self.assertIsNone(schema_problem(self.engine))


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


@unittest.skipUnless(HAVE_API, "cần pip install -r requirements-api.txt")
class ServerForwardingTests(unittest.TestCase):
    """server.py starts the API itself and forwards /api/v1/*; without a database it answers 404."""

    def start(self, env):
        port = free_port()
        proc = subprocess.Popen([sys.executable, "server.py", "--no-browser", "--browser-tracking", "--port", str(port)],
                                cwd=BACKEND, env={**os.environ, "PYTHONIOENCODING": "utf-8", **env},  # Windows pipes default to cp1252
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
        self.addCleanup(proc.stdout.close)
        self.addCleanup(proc.wait, 10)
        self.addCleanup(proc.kill)
        lines = []
        deadline = time.time() + 30
        while time.time() < deadline:
            line = proc.stdout.readline()
            lines.append(line)
            if "Giu cua so" in line or proc.poll() is not None:
                break
        return f"http://127.0.0.1:{port}", "".join(lines)

    def call(self, base, path, body=None, cookie=None):
        req = urllib.request.Request(base + path, data=None if body is None else json.dumps(body).encode(),
                                     method="GET" if body is None else "POST")
        req.add_header("Origin", base)
        if body is not None:
            req.add_header("Content-Type", "application/json")
        if cookie:
            req.add_header("Cookie", cookie)
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        try:
            with opener.open(req, timeout=20) as r:
                return r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            return e.code, e.headers, e.read()

    def test_without_database_auth_is_off_and_lab_still_runs(self):
        base, out = self.start({"HOLOLAB_DATABASE_URL": ""})
        self.assertIn("Tài khoản: tắt", out)
        status, _, body = self.call(base, "/api/v1/auth/login", {"username": "a", "password": "b"})
        self.assertEqual(status, 404)
        self.assertNotIn("error_code", json.loads(body))  # frontend: "chưa được kích hoạt"
        self.assertEqual(self.call(base, "/api/health")[0], 200)

    def test_unmigrated_database_keeps_auth_off_with_a_clear_reason(self):
        tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        self.addCleanup(tmp.cleanup)
        _, out = self.start({"HOLOLAB_DATABASE_URL": f"sqlite:///{tmp.name}/empty.db"})
        self.assertIn("manage.py migrate", out)

    def test_register_me_logout_through_server_py(self):
        tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        self.addCleanup(tmp.cleanup)
        url = PG_URL or f"sqlite:///{tmp.name}/hololab.db"
        if PG_URL:
            engine = make_engine(url)
            with engine.begin() as conn:
                conn.execute(text("DROP TABLE IF EXISTS auth_sessions, users, alembic_version CASCADE"))
            engine.dispose()
        migrate(url)
        base, out = self.start({"HOLOLAB_DATABASE_URL": url})
        self.assertIn("Tài khoản: bật", out)
        status, headers, body = self.call(base, "/api/v1/auth/register", GOOD)
        self.assertEqual(status, 201, body)
        cookie = headers["Set-Cookie"].split(";")[0]
        self.assertIn("HttpOnly", headers["Set-Cookie"])
        status, _, body = self.call(base, "/api/v1/auth/me", cookie=cookie)
        self.assertEqual((status, json.loads(body)["user"]["username"]), (200, "tho_xanh"))
        status, _, _ = self.call(base, "/api/v1/auth/logout", {}, cookie=cookie)
        self.assertEqual(status, 204)
        self.assertEqual(self.call(base, "/api/v1/auth/me", cookie=cookie)[0], 401)
        self.assertEqual(self.call(base, "/", None)[0], 200)  # the lab page is still served


if __name__ == "__main__":
    unittest.main()
