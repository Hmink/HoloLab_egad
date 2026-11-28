"""Create a reproducible source ZIP with offline dependencies and QA evidence.

Screenshots are internal QA artifacts, never deliverables. Run the source audit
after final edits, then this script. It does not run or claim the webcam tests.
"""
from pathlib import Path
import hashlib
import json
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
target = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / "HoloLab_ChemLab_V3_8_Mouse.zip"
assert ROOT not in target.parents, "Write the archive outside the project"
excluded = {"__pycache__", "node_modules", ".git", ".venv"}
images = {".png", ".jpg", ".jpeg", ".webp", ".mp4", ".webm", ".y4m"}
files = []
for file in sorted(ROOT.rglob("*")):
    if not file.is_file():
        continue
    relative = file.relative_to(ROOT)
    if excluded.intersection(relative.parts) or file.suffix in {".pyc", ".pyo"}:
        continue
    if relative.parts[0].startswith("validation") and file.suffix.lower() in images:
        continue
    if file.name.startswith(".env") or file.name == "soak-progress.json":
        continue
    files.append((file, relative.as_posix()))
with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for file, name in files:
        info = zipfile.ZipInfo(name, (2026, 11, 5, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = (0o100755 if file.suffix == ".sh" else 0o100644) << 16
        archive.writestr(info, file.read_bytes())
with zipfile.ZipFile(target) as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    assert "server.py" in names and "START_WINDOWS.bat" in names
    assert "web/data/reaction-hints.json" in names
print(json.dumps({"path": str(target), "files": len(files), "bytes": target.stat().st_size,
                  "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "zip_crc_ok": True}))
