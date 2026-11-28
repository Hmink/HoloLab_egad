"""Syntax, JSON and exact-source audit. No npm install or app state changes."""
from pathlib import Path
import ast
import difflib
import hashlib
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "validation_v36"
OUT.mkdir(exist_ok=True)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


js = sorted((ROOT / "web/src").glob("*.js"))
js += sorted((ROOT / "tests_js").glob("*.mjs"))
js += sorted((ROOT / "tools").glob("*v36.mjs"))
for file in js:
    subprocess.run(["node", "--check", str(file)], check=True, capture_output=True)
py = list(ROOT.glob("*.py"))
for folder in ("chemlab", "lab3d", "tests", "tools"):
    py.extend(p for p in (ROOT / folder).rglob("*.py") if "__pycache__" not in p.parts)
for file in py:
    ast.parse(file.read_text(encoding="utf-8-sig"), filename=str(file))
json_files = list((ROOT / "web/data").glob("*.json")) + list((ROOT / "data").glob("*.json"))
json_files += [ROOT / "web/profiles.json", ROOT / "package.json", ROOT / "package-lock.json"]
for file in json_files:
    json.loads(file.read_text())
runtime = {}
for folder in ("web", "chemlab", "lab3d", "data", "python_vendor"):
    for file in sorted((ROOT / folder).rglob("*")):
        if file.is_file() and "__pycache__" not in file.parts and file.suffix not in (".pyc", ".pyo"):
            runtime[file.relative_to(ROOT).as_posix()] = digest(file)
for name in ("server.py", "START_WINDOWS.bat", "START_LINUX.sh", "requirements.txt", "package.json", "package-lock.json"):
    runtime[name] = digest(ROOT / name)
(OUT / "SOURCE_SHA256.json").write_text(json.dumps(runtime, indent=2) + "\n")
report = {"js_syntax_files": len(js), "python_ast_files": len(py), "json_files": len(json_files), "passed": True}
if len(sys.argv) > 1:
    baseline = Path(sys.argv[1]).resolve()
    changed = []
    diffs = []
    for file in sorted(ROOT.rglob("*")):
        if not file.is_file():
            continue
        rel = file.relative_to(ROOT)
        if ({"__pycache__", "node_modules", ".git"}.intersection(rel.parts)
                or rel.parts[0].startswith("validation") or rel.parts[0] == "patches"):
            continue
        old = baseline / rel
        if old.exists() and digest(old) == digest(file):
            continue
        changed.append({"file": rel.as_posix(), "status": "modified" if old.exists() else "new",
                        "before_sha256": digest(old) if old.exists() else None, "after_sha256": digest(file)})
        try:
            before = old.read_text().splitlines(keepends=True) if old.exists() else []
            after = file.read_text().splitlines(keepends=True)
            diffs.extend(difflib.unified_diff(before, after, fromfile=f"a/{rel}", tofile=f"b/{rel}"))
        except UnicodeError:
            pass
    (OUT / "changed_files.json").write_text(json.dumps(changed, indent=2, ensure_ascii=False) + "\n")
    preserved = {}
    for name in ("camera-quality", "hand-worker", "coordinates", "lesson-geometry", "titration", "bench", "reaction-engine", "reaction-ui", "vessel-details", "liquid-simulation", "pourable", "spill-ledger", "student-logger", "ai-tutor", "lessons", "lesson-chemistry", "lesson-visuals"):
        rel = f"web/src/{name}.js"
        preserved[rel] = {"sha256": digest(ROOT / rel), "unchanged": digest(ROOT / rel) == digest(baseline / rel)}
        assert preserved[rel]["unchanged"], rel
    (OUT / "preserved_modules.json").write_text(json.dumps(preserved, indent=2) + "\n")
    (ROOT / "patches").mkdir(exist_ok=True)
    (ROOT / "patches/V35_to_V36.patch").write_text("".join(diffs))
    report["changed_files"] = len(changed)
    report["preserved_modules"] = len(preserved)
(OUT / "source_audit.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
