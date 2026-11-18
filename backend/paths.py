"""Shared locations. The static web app lives in ../frontend/web (override: HOLOLAB_WEB_DIR)."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WEB_DIR = Path(os.environ.get("HOLOLAB_WEB_DIR", ROOT.parent / "frontend" / "web"))
