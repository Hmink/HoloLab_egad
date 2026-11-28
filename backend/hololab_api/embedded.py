"""Run the v3.1 API inside server.py: uvicorn on a private loopback port, and a small forwarder so the
browser keeps talking to ONE origin (the lab page, the session cookie and the Origin check stay simple).

server.py calls start() at launch and forward() for every /api/v1/* request. If the API cannot start
(packages not installed, no database, tables not migrated) start() returns a reason and server.py keeps
serving the lab: the login page then says "chưa được kích hoạt"."""

from __future__ import annotations

import http.client
import socket
import threading
import time
from dataclasses import replace

from .config import from_env

# Request headers passed on to the API. Hop-by-hop and X-Forwarded-* from the client are not.
PASS_REQUEST = ("content-type", "accept", "cookie", "origin", "user-agent")
PASS_RESPONSE = ("content-type", "set-cookie", "cache-control", "retry-after", "x-content-type-options")
MAX_BODY = 64 * 1024


class Embedded:
    def __init__(self, port: int, server):
        self.port, self.server = port, server

    def forward(self, handler, trust_upstream: bool) -> None:
        """Forward the current request of a BaseHTTPRequestHandler to the API and write its response."""
        size = int(handler.headers.get("Content-Length") or 0)
        if size > MAX_BODY:
            return _send(handler, 413, b'{"error":"Yeu cau qua lon","error_code":"invalid_input","retryable":false}',
                         [("Content-Type", "application/json")])
        body = handler.rfile.read(size) if size else None
        headers = {k: v for k in PASS_REQUEST if (v := handler.headers.get(k)) is not None}
        headers["Host"] = handler.headers.get("Host", "")
        # The API trusts X-Forwarded-*; only this forwarder can reach its loopback port.
        if trust_upstream and handler.headers.get("X-Forwarded-For"):
            # An HTTPS reverse proxy (Caddy/nginx) in front of server.py already set them.
            for name in ("X-Forwarded-For", "X-Forwarded-Proto", "X-Forwarded-Host"):
                if handler.headers.get(name):
                    headers[name] = handler.headers[name]
        else:
            headers["X-Forwarded-For"] = handler.client_address[0]
            headers["X-Forwarded-Proto"] = "http"
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=30)
        try:
            conn.request(handler.command, handler.path, body=body, headers=headers)
            res = conn.getresponse()
            data = res.read()
            out = [(k, v) for k, v in res.getheaders() if k.lower() in PASS_RESPONSE]
            _send(handler, res.status, data, out)
        except OSError:
            _send(handler, 503, '{"error":"Máy chủ tài khoản không phản hồi.","error_code":"not_configured","retryable":true}'.encode(),
                  [("Content-Type", "application/json")])
        finally:
            conn.close()


def _send(handler, status: int, data: bytes, headers) -> None:
    handler.send_response(status)
    for k, v in headers:
        handler.send_header(k, v)
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    if handler.command != "HEAD":
        handler.wfile.write(data)


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def start(env=None) -> tuple[Embedded | None, str]:
    """Returns (embedded, message). embedded is None when accounts stay off; message says why."""
    settings = from_env(env)
    if not settings.database_url:
        return None, "Tài khoản: tắt (chưa đặt HOLOLAB_DATABASE_URL)."
    try:
        import uvicorn

        from .app import create_app
        from .db import make_engine, schema_problem
    except ImportError as error:
        return None, f"Tài khoản: tắt (thiếu gói '{error.name}': pip install -r requirements-api.txt)."
    engine = make_engine(settings.database_url)
    problem = schema_problem(engine)
    if problem:
        engine.dispose()
        return None, f"Tài khoản: tắt ({problem})."
    app = create_app(replace(settings, trust_forwarded=True), engine=engine)
    port = _free_port()
    server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning", proxy_headers=False,
                                           server_header=False, date_header=False))
    threading.Thread(target=server.run, name="hololab-api", daemon=True).start()
    deadline = time.monotonic() + 10
    while not server.started and time.monotonic() < deadline:
        time.sleep(0.05)
    if not server.started:
        return None, "Tài khoản: tắt (API không khởi động được)."
    return Embedded(port, server), f"Tài khoản: bật ({engine.url.get_backend_name()})."
