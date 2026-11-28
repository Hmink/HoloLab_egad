import json
from pathlib import Path
import tempfile
import unittest

from chemlab.chemistry import load_database
from chemlab.config import Config
from lab3d.scene import LabScene


class SavedInputTests(unittest.TestCase):
    def test_malformed_nested_mixture_does_not_replace_current_scene(self):
        db = load_database(Path(__file__).resolve().parents[1] / "data/chemistry.json")
        scene = LabScene(Config(width=1440, height=900, footer=130), db)
        existing = scene.spawn("beaker", 700, 350)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad.json"
            for mixture in (
                {"mol": []},
                {"temperature_K": "hot"},
                {"volume_ml": -3},
                {"volume_ml": float("nan")},
                {"origins": {"unknown": 1}},
                {"escaped_mol": {"unknown": 1}},
            ):
                data = {
                    "schema": "chemlab3d-session-1",
                    "objects": [{"stock": "beaker", "mixture": mixture}],
                }
                path.write_text(json.dumps(data), encoding="utf-8")
                with self.assertRaises((ValueError, TypeError)):
                    scene.load(path)
                self.assertEqual(scene.objects, [existing])

    def test_all_stock_geometry_has_finite_vertices(self):
        import numpy as np
        from lab3d.geometry import PROFILES, lathe, liquid_mesh

        for kind, profile in PROFILES.items():
            glass = lathe(profile)
            self.assertEqual(glass.shape[1], 6)
            self.assertTrue(np.isfinite(glass).all())
            for fill in (1, 30, 97):
                self.assertTrue(np.isfinite(liquid_mesh(kind, fill)).all())


if __name__ == "__main__":
    unittest.main()
