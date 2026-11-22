import json
import sys
import unittest
from pathlib import Path
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import egad_llm

ANSWER = "AgCl là kết tủa trắng, tan trong amoniac"
REF = {"knowledge": {"title": "t"}, "rubric": {"concepts": [{"id": "a"}, {"id": "b"}]}, "questions": {"q1": "Câu hỏi một?"}}


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

    def test_blocked_response_is_retryable_model_error(self):
        with self.assertRaises(egad_llm.ProviderError) as ctx: egad_llm.assess(payload(consent_cloud=True), FakeClient({"candidates": []}), ENV, REF)
        self.assertEqual((ctx.exception.code, ctx.exception.status, ctx.exception.retryable), ("invalid_model_output", 502, True))

    def test_rate_limit_message_hides_key(self):
        client = FakeClient(error=HTTPError("u", 429, "x", {}, None))
        with self.assertRaises(egad_llm.ProviderError) as ctx: egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        self.assertIn("429", str(ctx.exception)); self.assertNotIn("secret", str(ctx.exception))

    def test_busy_lock_released_after_error(self):
        client = FakeClient(error=OSError("down"))
        with self.assertRaises(egad_llm.ProviderError): egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        self.assertTrue(egad_llm.BUSY.acquire(blocking=False)); egad_llm.BUSY.release()


def failure(**kw):
    with unittest.TestCase().assertRaises(Exception) as ctx:
        egad_llm.assess(payload(consent_cloud=True, **kw.pop("extra", {})), kw["client"], kw.get("env", ENV), REF)
    return ctx.exception


class ErrorContractTests(unittest.TestCase):
    def check(self, error, code, status, retryable):
        self.assertEqual((error.code, error.status, error.retryable), (code, status, retryable))
        body = egad_llm.problem_body(error)
        self.assertEqual((body["error_code"], body["retryable"]), (code, retryable))
        self.assertTrue(body["error"])

    def test_rate_limit(self):
        self.check(failure(client=FakeClient(error=HTTPError("u", 429, "x", {}, None))), "rate_limited", 429, True)

    def test_server_error_is_retryable(self):
        self.check(failure(client=FakeClient(error=HTTPError("u", 503, "x", {}, None))), "provider_unavailable", 503, True)

    def test_rejected_key_is_not_retryable(self):
        self.check(failure(client=FakeClient(error=HTTPError("u", 403, "x", {}, None))), "provider_rejected", 502, False)

    def test_network_down(self):
        self.check(failure(client=FakeClient(error=OSError("down"))), "provider_unavailable", 503, True)

    def test_404_is_model_not_found_not_retryable_and_shows_google_message(self):
        import io
        body = io.BytesIO(json.dumps({"error": {"message": "models/zzz is not found"}}).encode())
        error = failure(client=FakeClient(error=HTTPError("u", 404, "x", {}, body)), env={**ENV, "GEMINI_MODEL": "zzz"})
        self.check(error, "model_not_found", 502, False)
        self.assertIn("zzz", str(error)); self.assertIn("list_models.py", str(error)); self.assertNotIn("secret", str(error))

    def test_other_4xx_are_not_retryable(self):
        self.check(failure(client=FakeClient(error=HTTPError("u", 422, "x", {}, None))), "provider_rejected", 502, False)

    def test_missing_key(self):
        self.check(failure(client=FakeClient(), env={}), "not_configured", 503, False)

    def test_consent_codes(self):
        with self.assertRaises(egad_llm.InputError) as ctx: egad_llm.assess({"answer": "x"}, FakeClient(), ENV, REF)
        self.check(ctx.exception, "consent_required", 400, False)

    def test_plain_errors_get_default_code(self):
        self.assertEqual(egad_llm.problem_body(ValueError("x")), {"error": "x", "error_code": "bad_request", "retryable": False})


class QuestionSessionTests(unittest.TestCase):
    def test_question_goes_into_prompt_and_ids_are_echoed(self):
        client = FakeClient(gemini_ok())
        out = egad_llm.assess(payload(consent_cloud=True, question_id="q1", session_id="s-1", lab_actions=[{"step": "x"}]), client, ENV, REF)
        sent = json.loads(client.requests[0].data)
        user = json.loads(sent["contents"][0]["parts"][0]["text"])
        self.assertEqual(user["question"], "Câu hỏi một?")
        self.assertEqual((out["question_id"], out["session_id"]), ("q1", "s-1"))
        self.assertNotIn("lab_actions", json.dumps(sent))  # reserved, never forwarded to the model

    def test_without_question_prompt_has_only_answer(self):
        client = FakeClient(gemini_ok())
        egad_llm.assess(payload(consent_cloud=True), client, ENV, REF)
        user = json.loads(json.loads(client.requests[0].data)["contents"][0]["parts"][0]["text"])
        self.assertEqual(list(user), ["student_answer"])

    def test_unknown_question_and_bad_ids(self):
        for extra, code in (({"question_id": "zzz"}, "unknown_question"), ({"question_id": "bad id!"}, "invalid_question_id"), ({"session_id": "x" * 65}, "invalid_session_id")):
            with self.assertRaises(egad_llm.InputError) as ctx: egad_llm.assess(payload(consent_cloud=True, **extra), FakeClient(gemini_ok()), ENV, REF)
            self.assertEqual(ctx.exception.code, code)


if __name__ == "__main__":
    unittest.main()
