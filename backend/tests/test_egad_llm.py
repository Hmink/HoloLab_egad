import json
import sys
import unittest
from pathlib import Path
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import egad_llm

ANSWER = "AgCl là kết tủa trắng, tan trong amoniac"
REF = {"knowledge": {"title": "t"}, "rubric": {"concepts": [{"id": "a"}, {"id": "b"}]}}


def good(label="correct"):
    rows = [{"id": i, "label": label, "reason": "ok", "evidence": ["kết tủa trắng"] if label != "insufficient" else []} for i in "ab"]
    return {"label": label, "concepts": rows, "feedback": "Vì sao?"}


class FakeResponse:
    def __init__(self, data): self.data = json.dumps(data).encode()
    def __enter__(self): return self
    def __exit__(self, *a): return False
    def read(self, n=-1): return self.data[:n] if n > 0 else self.data


class FakeClient:
    def __init__(self, data=None, error=None): self.data, self.error, self.requests = data, error, []
    def open(self, request, timeout=0):
        self.requests.append(request)
        if self.error: raise self.error
        return FakeResponse(self.data)


def payload(**extra): return {"consent": True, "answer": ANSWER, "lesson": "x", **extra}


class ValidateTests(unittest.TestCase):
    def test_accepts_valid(self):
        self.assertEqual(egad_llm.validate_result(good(), ANSWER, ["a", "b"])["label"], "correct")

    def test_rejects_invented_evidence(self):
        bad = good(); bad["concepts"][0]["evidence"] = ["câu không có trong bài"]
        with self.assertRaises(ValueError): egad_llm.validate_result(bad, ANSWER, ["a", "b"])

    def test_rejects_inconsistent_aggregate(self):
        bad = good(); bad["label"] = "misconception"
        with self.assertRaises(ValueError): egad_llm.validate_result(bad, ANSWER, ["a", "b"])

    def test_rejects_wrong_concepts(self):
        with self.assertRaises(ValueError): egad_llm.validate_result(good(), ANSWER, ["a", "c"])


ENV = {"GEMINI_API_KEY": "secret"}


def gemini_ok(): return {"candidates": [{"content": {"parts": [{"text": json.dumps(good())}]}}]}


class AssessTests(unittest.TestCase):
    def test_requires_consents(self):
        with self.assertRaises(ValueError): egad_llm.assess({"answer": "x", "consent_cloud": True}, FakeClient(), ENV, REF)
        with self.assertRaises(ValueError): egad_llm.assess(payload(), FakeClient(), ENV, REF)

    def test_requires_key(self):
        with self.assertRaises(egad_llm.ProviderError): egad_llm.assess(payload(consent_cloud=True), FakeClient(), {}, REF)

    def test_request_and_parse(self):
        client = FakeClient(gemini_ok())
        out = egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        request = client.requests[0]
        self.assertEqual(out["source"], "gemini")
        self.assertTrue(request.full_url.startswith("https://generativelanguage.googleapis.com/"))
        self.assertEqual(request.get_header("X-goog-api-key"), "secret")
        self.assertNotIn("secret", request.full_url)

    def test_blocked_response(self):
        with self.assertRaises(ValueError): egad_llm.assess(payload(consent_cloud=True), FakeClient({"candidates": []}), ENV, REF)

    def test_rate_limit_message_hides_key(self):
        client = FakeClient(error=HTTPError("u", 429, "x", {}, None))
        with self.assertRaises(egad_llm.ProviderError) as ctx: egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        self.assertIn("429", str(ctx.exception)); self.assertNotIn("secret", str(ctx.exception))

    def test_busy_lock_released_after_error(self):
        client = FakeClient(error=OSError("down"))
        with self.assertRaises(egad_llm.ProviderError): egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        self.assertTrue(egad_llm.BUSY.acquire(blocking=False)); egad_llm.BUSY.release()


if __name__ == "__main__":
    unittest.main()
