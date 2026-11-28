"""Package V3.5 with offline runtimes; flat ZIP root for Windows extraction."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
dest = root.parent / 'HoloLab_AR_V3_5.zip'
exclude = {'node_modules', '.venv', '__pycache__', '.git', '.pytest_cache'}
exclude_files = {'browser_failure.json', 'physics_trials.tap', 'p0_trials.tap', 'unit_tests_p0.tap', 'browser_legacy_regression.json'}
manifest = json.loads((root / 'validation_v35/SOURCE_SHA256.json').read_text())
for name, expected in manifest.items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, name
with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for file in sorted(root.rglob('*')):
        rel = file.relative_to(root)
        if (not file.is_file() or exclude.intersection(rel.parts)
            or file.suffix.lower() in {'.pyc', '.pyo', '.png', '.jpg', '.jpeg', '.y4m', '.webm'}
            or file.name.startswith('internal_') or file.name in exclude_files):
            continue
        z.write(file, rel.as_posix())
with zipfile.ZipFile(dest) as z:
    assert z.testzip() is None
    for name, expected in manifest.items():
        assert hashlib.sha256(z.read(name)).hexdigest() == expected, name
    required=['server.py','START_WINDOWS.bat','START_LINUX.sh','web/vendor/rapier/rapier.mjs',
              'web/vendor/fonts/LICENSE','web/src/vessel-details.js','VALIDATION_V35.md',
              'web/src/lessons.js','web/src/lesson-chemistry.js','web/src/lesson-visuals.js',
              'web/src/lesson-geometry.js','web/data/lessons-thpt.json',
              'docs/CURRICULUM_THPT.md','docs/V35_IMPLEMENTATION.md','docs/MANUAL_CHECK_V35.md',
              'web/src/pourable.js','web/src/liquid-simulation.js','web/src/liquid-visual.js',
              'web/src/student-logger.js','web/src/ai-tutor.js','web/src/spill-ledger.js',
              'web/src/reaction-visuals.js','validation_v35/SOURCE_SHA256.json',
              'web/models/hand_landmarker.task']
    assert all(name in z.namelist() for name in required)
print(json.dumps({'path':str(dest),'bytes':dest.stat().st_size,
                  'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()}))
