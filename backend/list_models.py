"""List the models installed in your local Ollama.

Run from the backend folder:  python list_models.py
Then set OLLAMA_MODEL=<name> in backend/.env (install one with: ollama pull qwen3:8b).
"""
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import ProxyHandler, Request, build_opener

from egad_llm import DEFAULTS, ProviderError, check_local, config
from envfile import load_dotenv
from paths import ROOT


def installed_models(data):
    """Names of installed models, from the JSON returned by GET /api/tags."""
    return sorted(m["name"] for m in data.get("models", []) if isinstance(m.get("name"), str))


def main():
    load_dotenv(ROOT / ".env")
    cfg = config(os.environ)
    try:
        check_local(cfg["OLLAMA_URL"], os.environ)
    except ProviderError as error:
        raise SystemExit(str(error))
    request = Request(cfg["OLLAMA_URL"].rstrip("/") + "/api/tags")
    try:
        with build_opener(ProxyHandler({})).open(request, timeout=10) as response:
            data = json.loads(response.read(2_000_000))
    except HTTPError as error:
        raise SystemExit(f"Ollama trả HTTP {error.code}.")
    except (URLError, OSError):
        raise SystemExit(f"Không kết nối được Ollama tại {cfg['OLLAMA_URL']}. Chạy 'ollama serve' chưa?")
    names = installed_models(data)
    current = cfg["OLLAMA_MODEL"]
    print(f"OLLAMA_MODEL hiện tại: {current} -> {'ĐÃ CÀI' if current in names else 'CHƯA CÀI (chạy: ollama pull ' + current + ')'}")
    print("Model đã cài:" if names else "Chưa cài model nào.")
    for name in names:
        print("  ", name)


if __name__ == "__main__":
    sys.exit(main())
