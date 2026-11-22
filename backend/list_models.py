"""List the Gemini models your API key can use with generateContent.

Run from the backend folder:  python list_models.py
Then put one of the names in backend/.env as GEMINI_MODEL=<name>.
The key is read from backend/.env and is never printed.
"""
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, build_opener

from envfile import load_dotenv
from paths import ROOT


def usable_models(data):
    """Names (without the 'models/' prefix) that support generateContent, flash/lite first."""
    names = [
        m["name"].removeprefix("models/")
        for m in data.get("models", [])
        if "generateContent" in m.get("supportedGenerationMethods", [])
    ]
    return sorted(names, key=lambda n: (("flash" not in n), n))


def main():
    load_dotenv(ROOT / ".env")
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key:
        raise SystemExit("Chưa có GEMINI_API_KEY trong backend/.env")
    base = os.environ.get("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com").rstrip("/")
    request = Request(f"{base}/v1beta/models?pageSize=1000", headers={"x-goog-api-key": key})
    try:
        with build_opener().open(request, timeout=30) as response:
            data = json.loads(response.read(2_000_000))
    except HTTPError as error:
        raise SystemExit(f"Google trả HTTP {error.code}. Nếu là 400/403, key sai hoặc chưa bật; hãy tạo lại key trong AI Studio.")
    except (URLError, OSError):
        raise SystemExit("Không kết nối được Google. Kiểm tra Internet.")
    names = usable_models(data)
    current = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    print(f"GEMINI_MODEL hiện tại: {current} -> {'CÓ trong danh sách' if current in names else 'KHÔNG có trong danh sách'}")
    print("Model dùng được với generateContent (flash ở đầu):")
    for name in names:
        print("  ", name)


if __name__ == "__main__":
    sys.exit(main())
