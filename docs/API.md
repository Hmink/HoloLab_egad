# Hợp đồng API (frontend ↔ backend)

Backend: `python server.py` (127.0.0.1:8765). Mọi POST là JSON và chỉ chấp nhận Origin của chính nó.
Khi phát triển giao diện (`npm run dev`, cổng 5173), Vite proxy `/api` và `/data` sang backend và đặt lại Origin.

## `GET /api/health`
`{"ok": true, "version": "3.9.0", "chemistry": false, "llm": {"provider": "ollama", "model": "qwen3:8b"}}` — `chemistry=false` nghĩa là chưa có lõi hóa học.

## `GET /data/lessons-thpt.json`, `GET /data/egad-rubrics.json`
File tĩnh trong `frontend/web/data/`. Bài học: `{id, title, equations[], explanation, phenomenon, conditions, questions[{id,text}]}`.
Rubric: `{<lessonId>: {concepts: [{id, name, description}]}}`. Backend dùng cả hai để dựng prompt.

## `POST /api/egad/assess`
Yêu cầu:
```json
{"lesson": "chloride", "answer": "…1–1000 ký tự…", "consent": true,
 "question_id": "q1", "session_id": "…", "lab_actions": []}
```
| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `lesson`, `answer`, `consent` | có | Câu trả lời chỉ được xử lý trên máy chủ (Ollama). `consent_cloud` không còn dùng; gửi kèm cũng bị bỏ qua |
| `question_id` | không | Phải thuộc bài học. Backend đưa **nội dung câu hỏi** vào prompt làm ngữ cảnh. Frontend luôn gửi |
| `session_id` | không | Chữ/số/`_`/`-`, tối đa 64 ký tự. Backend chỉ trả lại nguyên giá trị để nối với phiên thí nghiệm (GĐ3–4) |
| `lab_actions` | không | **Dành riêng cho GĐ4**, hiện bị bỏ qua và không đưa vào prompt. Hình dạng sẽ chốt khi có cảnh 3D |

Thành công (200):
```json
{"label": "incomplete",
 "concepts": [{"id": "precipitate", "label": "correct", "reason": "…", "evidence": ["trích nguyên văn"]}],
 "feedback": "Câu hỏi gợi mở",
 "predicted": true, "teacher_verified": false, "source": "ollama:qwen3:8b",
 "question_id": "q1", "session_id": "…"}
```
`label` ∈ `correct | incomplete | misconception | insufficient`.

### Lỗi
Mọi lỗi có dạng `{"error": "<tiếng Việt>", "error_code": "…", "retryable": true|false}`. Frontend hiện `error`, và chỉ hiện nút **Thử chấm lại** khi `retryable` là `true`.

| HTTP | `error_code` | `retryable` | Ý nghĩa |
|---|---|---|---|
| 400 | `consent_required`, `invalid_answer`, `unknown_lesson`, `unknown_question`, `invalid_question_id`, `invalid_session_id`, `bad_request` | không | Yêu cầu sai; gửi lại y nguyên cũng vô ích |
| 429 | `busy` | có | Backend đang xử lý một yêu cầu khác |
| 503 | `llm_unavailable` | có | Ollama chưa chạy, quá tải (5xx) hoặc quá thời gian |
| 502 | `invalid_model_output` | có | Kết quả của mô hình không qua kiểm tra (JSON hỏng, bị cắt, trích dẫn không khớp, nhãn mâu thuẫn) |
| 502 | `model_not_found` | không | Chưa cài model `OLLAMA_MODEL`. Chạy `ollama pull <model>` hoặc `python list_models.py` |
| 502 | `llm_error` | không | Ollama từ chối yêu cầu (các lỗi 4xx khác) |
| 503 | `not_configured` | không | Thiếu dữ liệu bài học, hoặc `OLLAMA_URL` trỏ ra ngoài máy chủ |

Quy ước: khi mô hình lỗi, backend **không** trả kết quả "dự phòng" giả danh AI. Người dùng thấy lỗi và thử lại.

## `/api/v1/auth/*` (API v3.1 mục 2)
Đăng ký, đăng nhập, đăng xuất, `me`: theo `API_v3.1.md` mục 2. Chỉ bật khi có `HOLOLAB_DATABASE_URL`, xem `docs/BACKEND_XAC_THUC.md`. Khi tắt, `/api/v1/*` trả 404 không có `error_code`.

## Chưa khả dụng
`/api/catalog`, `/api/transfer`, `/api/session`, `/api/experiment/*` trả 503 cho đến khi có `backend/chemlab`, `backend/lab3d`, `backend/data`.
