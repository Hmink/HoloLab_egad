import io
import json
import sys
import unittest
from pathlib import Path
from urllib.error import HTTPError, URLError

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import egad_llm
from egad_llm import normalize, quote_in_answer

ANSWER = "AgCl là kết tủa trắng, tan trong amoniac NH₃"
REF = {"knowledge": {"title": "t"}, "rubric": {"concepts": [{"id": "a"}, {"id": "b"}]}, "questions": {"q1": "Câu hỏi một?"}}
ENV = {}


def good(label="correct", quote="kết tủa trắng"):
    rows = [{"id": i, "label": label, "reason": "ok", "evidence": [quote] if label != "insufficient" else []} for i in "ab"]
    return {"label": label, "concepts": rows, "feedback": "Vì sao?"}


def chat(content, **extra):
    return {"message": {"role": "assistant", "content": content if isinstance(content, str) else json.dumps(content, ensure_ascii=False)}, "done": True, "done_reason": "stop", **extra}


class FakeResponse:
    def __init__(self, data): self.data = json.dumps(data).encode()
    def __enter__(self): return self
    def __exit__(self, *a): return False
    def read(self, n=-1): return self.data[:n] if n > 0 else self.data


class FakeClient:
    """Plays a script: each item is a dict (response body) or an Exception to raise."""
    def __init__(self, *script): self.script, self.requests = list(script), []
    def open(self, request, timeout=0):
        self.requests.append((request, timeout))
        item = self.script.pop(0)
        if isinstance(item, Exception): raise item
        return FakeResponse(item)
    def bodies(self): return [json.loads(r.data) for r, _ in self.requests]


def payload(**extra): return {"consent": True, "answer": ANSWER, "lesson": "x", **extra}
def http(code, body=None): return HTTPError("u", code, "x", {}, io.BytesIO(json.dumps(body or {}).encode()))


class NormalizeTests(unittest.TestCase):
    def test_tolerated_differences(self):
        for quote in ("KẾT TỦA TRẮNG", "kết  tủa\ttrắng", "kết tủa trắng.", "“kết tủa trắng”", "amoniac NH3", "NH₃", "AgCl, là kết tủa"):
            self.assertTrue(quote_in_answer(quote, ANSWER), quote)

    def test_diacritics_are_kept(self):
        self.assertFalse(quote_in_answer("ket tua trang", ANSWER))
        self.assertFalse(quote_in_answer("kết tủa trăng", ANSWER))

    def test_invented_or_trivial_quotes_fail(self):
        for quote in ("kết tủa xanh", "AgNO3", "", "  ", "...", "a"):
            self.assertFalse(quote_in_answer(quote, ANSWER), repr(quote))

    def test_whole_words_only(self):
        self.assertFalse(quote_in_answer("kết tủ", ANSWER))
        self.assertFalse(quote_in_answer("trắn", ANSWER))

    def test_chemistry_symbols(self):
        ans = "Ag⁺ + Cl⁻ → AgCl↓"
        self.assertTrue(quote_in_answer("Ag+ + Cl-", ans))
        self.assertTrue(quote_in_answer("AgCl", ans))
        self.assertEqual(normalize("NH₃"), "nh3")


class ValidateTests(unittest.TestCase):
    def test_accepts_valid_and_normalized_quote(self):
        self.assertEqual(egad_llm.validate_result(good(quote="Kết tủa TRẮNG."), ANSWER, ["a", "b"])["label"], "correct")

    def test_rejects_invented_evidence(self):
        with self.assertRaises(ValueError): egad_llm.validate_result(good(quote="câu không có trong bài"), ANSWER, ["a", "b"])

    def test_rejects_inconsistent_aggregate(self):
        bad = good(); bad["label"] = "misconception"
        with self.assertRaises(ValueError): egad_llm.validate_result(bad, ANSWER, ["a", "b"])

    def test_rejects_wrong_concepts_and_non_dict_rows(self):
        with self.assertRaises(ValueError): egad_llm.validate_result(good(), ANSWER, ["a", "c"])
        bad = good(); bad["concepts"] = ["a", "b"]
        with self.assertRaises(ValueError): egad_llm.validate_result(bad, ANSWER, ["a", "b"])

    def test_label_needs_evidence(self):
        bad = good(); bad["concepts"][0]["evidence"] = []
        with self.assertRaises(ValueError): egad_llm.validate_result(bad, ANSWER, ["a", "b"])


class AssessTests(unittest.TestCase):
    def test_requires_consent_and_valid_answer(self):
        with self.assertRaises(egad_llm.InputError) as ctx: egad_llm.assess({"answer": "x"}, FakeClient(), ENV, REF)
        self.assertEqual(ctx.exception.code, "consent_required")
        with self.assertRaises(egad_llm.InputError): egad_llm.assess(payload(answer="  "), FakeClient(), ENV, REF)

    def test_request_shape_for_qwen3(self):
        client = FakeClient(chat(good()))
        out = egad_llm.assess(payload(question_id="q1", session_id="s-1", lab_actions=[{"step": "x"}]), client, ENV, REF)
        request, timeout = client.requests[0]
        body = client.bodies()[0]
        self.assertTrue(request.full_url.endswith(":11434/api/chat"))
        self.assertEqual((body["model"], body["think"], body["stream"]), ("qwen3:8b", False, False))
        self.assertEqual(body["options"]["temperature"], 0)
        self.assertEqual(body["options"]["num_ctx"], 8192)
        self.assertEqual(body["format"]["type"], "object")
        self.assertEqual(timeout, 120.0)
        user = json.loads(body["messages"][1]["content"])
        self.assertEqual(user["question"], "Câu hỏi một?")
        self.assertNotIn("lab_actions", json.dumps(body))
        self.assertEqual((out["source"], out["question_id"], out["session_id"]), ("ollama:qwen3:8b", "q1", "s-1"))

    def test_config_from_env(self):
        client = FakeClient(chat(good()))
        env = {"OLLAMA_MODEL": "qwen3:14b", "OLLAMA_NUM_CTX": "4096", "OLLAMA_TIMEOUT_SEC": "30"}
        egad_llm.assess(payload(), client, env, REF)
        self.assertEqual(client.bodies()[0]["model"], "qwen3:14b")
        self.assertEqual(client.requests[0][1], 30.0)

    def test_strips_think_block(self):
        out = egad_llm.assess(payload(), FakeClient(chat("<think>\nsuy nghĩ…\n</think>\n" + json.dumps(good(), ensure_ascii=False))), ENV, REF)
        self.assertEqual(out["label"], "correct")

    def test_falls_back_to_plain_json_format_on_400(self):
        client = FakeClient(http(400, {"error": "invalid format"}), chat(good()))
        egad_llm.assess(payload(), client, ENV, REF)
        self.assertEqual([b["format"] == "json" for b in client.bodies()], [False, True])

    def test_truncated_output_is_retryable_model_error(self):
        with self.assertRaises(egad_llm.ProviderError) as ctx:
            egad_llm.assess(payload(), FakeClient(chat(good(), done_reason="length")), ENV, REF)
        self.assertEqual(ctx.exception.code, "invalid_model_output")

    def test_unknown_question_and_bad_ids(self):
        for extra, code in (({"question_id": "zzz"}, "unknown_question"), ({"question_id": "bad id!"}, "invalid_question_id"), ({"session_id": "x" * 65}, "invalid_session_id")):
            with self.assertRaises(egad_llm.InputError) as ctx: egad_llm.assess(payload(**extra), FakeClient(chat(good())), ENV, REF)
            self.assertEqual(ctx.exception.code, code)

    def test_busy_lock_released_after_error(self):
        with self.assertRaises(egad_llm.ProviderError): egad_llm.assess(payload(), FakeClient(OSError("down")), ENV, REF)
        self.assertTrue(egad_llm.BUSY.acquire(blocking=False)); egad_llm.BUSY.release()


class ErrorContractTests(unittest.TestCase):
    def failure(self, *script, env=ENV):
        with self.assertRaises(egad_llm.ProviderError) as ctx: egad_llm.assess(payload(), FakeClient(*script), env, REF)
        return ctx.exception

    def check(self, error, code, status, retryable):
        self.assertEqual((error.code, error.status, error.retryable), (code, status, retryable))
        body = egad_llm.problem_body(error)
        self.assertEqual((body["error_code"], body["retryable"]), (code, retryable))
        self.assertTrue(body["error"])

    def test_ollama_not_running(self):
        self.check(self.failure(URLError("refused")), "llm_unavailable", 503, True)

    def test_timeout(self):
        self.check(self.failure(TimeoutError()), "llm_unavailable", 503, True)

    def test_model_not_installed(self):
        error = self.failure(http(404, {"error": 'model "qwen3:8b" not found'}))
        self.check(error, "model_not_found", 502, False)
        self.assertIn("ollama pull qwen3:8b", str(error))

    def test_server_error_is_retryable(self):
        self.check(self.failure(http(500)), "llm_unavailable", 503, True)

    def test_other_4xx_not_retryable(self):
        self.check(self.failure(http(422)), "llm_error", 502, False)

    def test_bad_json_is_retryable_model_error(self):
        self.check(self.failure(chat("không phải JSON")), "invalid_model_output", 502, True)

    def test_remote_ollama_refused_unless_allowed(self):
        error = self.failure(env={"OLLAMA_URL": "http://203.0.113.5:11434"})
        self.check(error, "not_configured", 503, False)
        out = egad_llm.assess(payload(), FakeClient(chat(good())), {"OLLAMA_URL": "http://10.0.0.5:11434", "OLLAMA_ALLOW_REMOTE": "1"}, REF)
        self.assertEqual(out["label"], "correct")

    def test_plain_errors_get_default_code(self):
        self.assertEqual(egad_llm.problem_body(ValueError("x")), {"error": "x", "error_code": "bad_request", "retryable": False})


if __name__ == "__main__":
    unittest.main()


class LessonDataFormatTests(unittest.TestCase):
    """The lab's real data files: multiple-choice lesson questions and egad-questions.json."""

    def test_real_lab_data_loads_with_both_question_formats(self):
        from paths import WEB_DIR
        if not (WEB_DIR / "data/lessons-thpt.json").exists():
            self.skipTest("lab data not present")
        ref = egad_llm.load_reference("chloride")
        self.assertTrue(ref["rubric"]["concepts"])
        self.assertIn("q1", ref["questions"])      # first multiple-choice prompt
        self.assertIn("CL01", ref["questions"])    # free-text EGAD question

    def test_question_formats(self):
        lesson = {"questions": [{"id": "a", "text": "A?"}, {"prompt": "B?", "options": []}, "bad", {"x": 1}]}
        from pathlib import Path
        qs = egad_llm.lesson_questions(lesson, Path("/nonexistent"))
        self.assertEqual(qs, {"a": "A?", "q2": "B?"})
