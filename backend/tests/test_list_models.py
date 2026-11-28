import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from list_models import installed_models


class InstalledModelsTests(unittest.TestCase):
    def test_sorted_names(self):
        data = {"models": [{"name": "qwen3:8b"}, {"name": "llama3:8b"}, {"bad": 1}]}
        self.assertEqual(installed_models(data), ["llama3:8b", "qwen3:8b"])

    def test_empty(self):
        self.assertEqual(installed_models({}), [])


if __name__ == "__main__":
    unittest.main()
