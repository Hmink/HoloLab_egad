import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from list_models import usable_models


class UsableModelsTests(unittest.TestCase):
    def test_filters_and_orders(self):
        data = {"models": [
            {"name": "models/gemini-pro-x", "supportedGenerationMethods": ["generateContent"]},
            {"name": "models/text-embedding", "supportedGenerationMethods": ["embedContent"]},
            {"name": "models/gemini-flash-y", "supportedGenerationMethods": ["generateContent", "countTokens"]},
        ]}
        self.assertEqual(usable_models(data), ["gemini-flash-y", "gemini-pro-x"])

    def test_empty(self):
        self.assertEqual(usable_models({}), [])


if __name__ == "__main__":
    unittest.main()
