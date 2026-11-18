"""Local browser adapter for the unchanged Python chemistry model. No cloud calls."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "python_vendor"))

from dataclasses import asdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from math import isfinite, pi
import argparse
import json
import os
import threading
import webbrowser
import socket

from paths import WEB_DIR
from version import VERSION


def load_dotenv(path):
    """Minimal .env reader (no dependency). Real environment variables win."""
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_dotenv(ROOT / ".env")

try:
    from chemlab.chemistry import load_database
    from lab3d.catalog import CATALOG, STOCK
    from lab3d.mixture import Mixture, transfer
except ImportError as error:
    raise SystemExit(
        f"Thiếu mã lõi hóa học ({error.name}). Cần các thư mục chemlab/, lab3d/, data/ cạnh server.py (trong backend/) "
        "và giao diện ở frontend/web/."
    ) from error
from native_tracking import NativeTracking
from egad_llm import assess as assess_egad

DB = load_database(ROOT / "data/chemistry.json")
NATIVE = NativeTracking(WEB_DIR / "models" / "hand_landmarker.task")


def finite(value, low, high):
    return type(value) in (int, float) and isfinite(value) and low <= value <= high


def validate_mix(raw, item):
    if not isinstance(raw, dict):
        raise ValueError("Mixture must be an object")
    mix = Mixture(**raw)
    if not finite(mix.volume_ml, 0, item.capacity_ml) or not finite(
        mix.solid_copper_g, 0, 100
    ):
        raise ValueError("Invalid quantity/capacity")
    for name, allowed in (
        ("mol", DB["species"]),
        ("escaped_mol", DB["species"]),
        ("origins", STOCK),
    ):
        mapping = getattr(mix, name)
        if (
            not isinstance(mapping, dict)
            or len(mapping) > 100
            or any(
                key not in allowed or not finite(value, 0, 10000)
                for key, value in mapping.items()
            )
        ):
            raise ValueError("Invalid species or quantities")
    if mix.temperature_K is not None and not finite(mix.temperature_K, 1, 10000):
        raise ValueError("Invalid temperature")
    if (
        type(mix.unknown) is not bool
        or not isinstance(mix.note, str)
        or len(mix.note) > 4000
    ):
        raise ValueError("Invalid model status")
    return mix


def mix_payload(mix):
    return {**asdict(mix), "color": mix.color, "qualitative": "qualitative" in mix.tags}


def clean_mix(raw, item):
    # color and qualitative are display-only fields; never inputs to chemistry.
    return validate_mix(
        {k: v for k, v in raw.items() if k not in ("color", "qualitative")}, item
    )


def transfer_request(data):
    source, target = data["source"], data["target"]
    if source["id"] == target["id"]:
        raise ValueError("Cannot pour into the source vessel")
    a, b = STOCK[source["stock"]], STOCK[target["stock"]]
    src, dst = clean_mix(source["mixture"], a), clean_mix(target["mixture"], b)
    if source.get("sealed"):
        return {"ok": False, "message": "Nguồn đang đóng nắp. Nhấn K để mở."}
    requested = data.get("amount_ml", 0.2 if a.kind == "dropper" else 10.0)
    if not finite(requested, 1e-12, 1000):
        raise ValueError("Invalid transfer amount")
    result, message = transfer(
        src,
        dst,
        DB,
        requested,
        b.capacity_ml,
        sealed=target.get("sealed") is True,
        allow_risk=data.get("allow_risk") is True,
    )
    if result is None:
        return {"ok": False, "message": message}
    return {
        "ok": True,
        "message": message,
        **{k: v for k, v in result.items() if k not in ("source", "target")},
        "source": mix_payload(result["source"]),
        "target": mix_payload(result["target"]),
    }


def session_request(data):
    if not isinstance(data, dict) or data.get("schema") not in (
        "hololab3-session-1",
        "chemlab3d-session-1",
        "chemlab3d-experiment-1",
    ):
        raise ValueError("Unknown session schema")
    rows = data.get("objects", [])
    if not isinstance(rows, list) or len(rows) > 16:
        raise ValueError("At most 16 objects per desk")
    ids = set()
    result = []
    for index, row in enumerate(rows):
        item = STOCK[row["stock"]]
        oid = row.get("id", index + 1)
        if type(oid) is not int or oid < 1 or oid in ids:
            raise ValueError("Invalid or duplicate object ID")
        ids.add(oid)
        mix = (
            clean_mix(row["mixture"], item) if "mixture" in row else Mixture.stock(item)
        )
        degrees = data["schema"] != "hololab3-session-1"
        roll = row.get("roll", 0)
        yaw = row.get("yaw", 0)
        pitch = row.get("pitch", 0)
        limit = 360 if degrees else 10
        if not all(finite(v, -limit, limit) for v in (roll, yaw, pitch)):
            raise ValueError("Invalid orientation")
        if degrees:
            xn, yn = row.get("x_norm", 0.5), row.get("y_norm", 0.5)
            if not finite(xn, 0, 1) or not finite(yn, 0, 1):
                raise ValueError("Invalid normalized coordinates")
            position = None
            normalized = {"x": xn, "y": yn}
        else:
            position = row["position"]
            normalized = None
            if not isinstance(position, dict) or not all(
                finite(position.get(k), -30, 30) for k in ("x", "y", "z")
            ):
                raise ValueError("Invalid position")
            if not finite(position["z"], -1.8, 1.5):
                raise ValueError("Invalid depth")
        result.append(
            {
                "id": oid,
                "stock": item.id,
                "mixture": mix_payload(mix),
                "position": position,
                "normalized": normalized,
                "roll": roll * pi / 180 if degrees else roll,
                "yaw": yaw * pi / 180 if degrees else yaw,
                "pitch": pitch * pi / 180 if degrees else pitch,
                "sealed": row.get("sealed") is True,
            }
        )
    events = data.get("events", [])
    if not isinstance(events, list):
        raise ValueError("Invalid events")
    return {
        "objects": result,
        "allow_risk": data.get("allow_risk") is True,
        "events": events[-3000:],
    }


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".mjs": "text/javascript",
        ".wasm": "application/wasm",
        ".task": "application/octet-stream",
    }

    def setup(self):
        super().setup()
        self.connection.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

    def log_message(self, *args):
        pass

    def json(self, payload, status=200):
        raw = json.dumps(payload, ensure_ascii=False, allow_nan=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        try:
            self.end_headers()
            self.wfile.write(raw)
        except (BrokenPipeError, ConnectionResetError):
            pass  # tab closed during inference

    def do_GET(self):
        if self.path == "/api/catalog":
            self.json(
                {
                    "version": VERSION,
                    "native_tracking": bool(NATIVE.available),
                    "stocks": [
                        {**asdict(x), "mixture": mix_payload(Mixture.stock(x))}
                        for x in CATALOG
                    ],
                    "species": DB["species"],
                    "reactions": DB["reactions"],
                }
            )
            return
        if self.path == "/api/health":
            self.json({"ok": True, "version": VERSION})
            return
        if self.path.startswith("/api/experiment/"):
            name = self.path.rsplit("/", 1)[-1]
            if name not in {p.name for p in (ROOT / "experiments").glob("*.json")}:
                self.json({"error": "Unknown experiment"}, 404)
                return
            self.json(
                json.loads((ROOT / "experiments" / name).read_text(encoding="utf-8"))
            )
            return
        super().do_GET()

    def do_POST(self):
        # Local compute endpoints only. Reject cross-origin form/fetch requests.
        origin = self.headers.get("Origin")
        if origin and origin not in (
            f"http://localhost:{self.server.server_port}",
            f"http://127.0.0.1:{self.server.server_port}",
        ):
            self.json({"error": "Origin not allowed"}, 403)
            return
        if self.path == "/api/tracking/frame":
            try:
                size = int(self.headers.get("Content-Length", 0))
                if (
                    self.headers.get("Content-Type") != "image/jpeg"
                    or not 0 < size < 2_000_000
                ):
                    raise ValueError("JPEG camera frame required")
                self.json(NATIVE.detect(self.rfile.read(size)))
            except BlockingIOError:
                self.json({"error": "busy"}, 429)
            except (ValueError, RuntimeError) as error:
                self.json({"error": str(error)}, 400)
            return
        if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
            self.json({"error": "JSON required"}, 415)
            return
        try:
            size = int(self.headers.get("Content-Length", 0))
            if not 0 < size <= 2_000_000:
                raise ValueError("Invalid payload size")
            data = json.loads(self.rfile.read(size))
            if self.path == "/api/tracking/init":
                self.json(NATIVE.initialize())
            elif self.path in ("/api/egad/assess", "/api/egad/local"):
                self.json(assess_egad(data))
            elif self.path == "/api/transfer":
                self.json(transfer_request(data))
            elif self.path == "/api/session":
                self.json(session_request(data))
            else:
                self.json({"error": "Not found"}, 404)
        except (
            ValueError,
            KeyError,
            TypeError,
            AttributeError,
            RuntimeError,
        ) as error:
            self.json({"error": str(error)}, 400)
        except ImportError:
            self.json({"error": "Tính năng chưa được cài đặt"}, 400)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--browser-tracking", action="store_true")
    args = parser.parse_args()
    if not WEB_DIR.is_dir():
        raise SystemExit(f"Chưa có giao diện web tại {WEB_DIR}. Xem frontend/README.md.")
    if args.browser_tracking:
        NATIVE.available = False
    server = ThreadingHTTPServer(
        ("127.0.0.1", args.port), partial(Handler, directory=str(WEB_DIR))
    )
    url = f"http://127.0.0.1:{server.server_port}"
    print(f"HoloLab AR V{VERSION}: {url}\nGiu cua so nay mo. Ctrl+C de dung.", flush=True)
    if not args.no_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        NATIVE.close()


if __name__ == "__main__":
    main()
