# Hợp đồng API (frontend ↔ backend)

Backend: `python server.py` (127.0.0.1:8765). Mọi POST là JSON và chỉ chấp nhận Origin của chính nó.
Khi phát triển giao diện (`npm run dev`, cổng 5173), Vite proxy `/api` và `/data` sang backend và đặt lại Origin.

## `GET /api/health`
`{"ok": true, "version": "3.9.0", "chemistry": false}` — `chemistry=false` nghĩa là chưa có lõi hóa học.

## `GET /data/lessons-thpt.json`, `GET /data/egad-rubrics.json`
File tĩnh trong `frontend/web/data/`. Bài học: `{id, title, equations[], explanation, phenomenon, conditions, questions[{id,text}]}`.
Rubric: `{<lessonId>: {concepts: [{id, name, description}]}}`. Backend dùng cả hai để dựng prompt.

## `POST /api/egad/assess`
Yêu cầu:
```json
{"lesson": "chloride", "answer": "…1–1000 ký tự…", "consent": true, "consent_cloud": true,
 "question_id": "q1", "session_id": "…", "lab_actions": []}
```
| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `lesson`, `answer`, `consent`, `consent_cloud` | có | `consent_cloud` vì câu trả lời được gửi tới Google |
| `question_id` | không | Phải thuộc bài học. Backend đưa **nội dung câu hỏi** vào prompt làm ngữ cảnh. Frontend luôn gửi |
| `session_id` | không | Chữ/số/`_`/`-`, tối đa 64 ký tự. Backend chỉ trả lại nguyên giá trị để nối với phiên thí nghiệm (GĐ3–4) |
| `lab_actions` | không | **Dành riêng cho GĐ4**, hiện bị bỏ qua và không đưa vào prompt. Hình dạng sẽ chốt khi có cảnh 3D |

Thành công (200):
```json
{"label": "incomplete",
 "concepts": [{"id": "precipitate", "label": "correct", "reason": "…", "evidence": ["trích nguyên văn"]}],
 "feedback": "Câu hỏi gợi mở",
 "predicted": true, "teacher_verified": false, "source": "gemini",
 "question_id": "q1", "session_id": "…"}
```
`label` ∈ `correct | incomplete | misconception | insufficient`.

### Lỗi
Mọi lỗi có dạng `{"error": "<tiếng Việt>", "error_code": "…", "retryable": true|false}`. Frontend hiện `error`, và chỉ hiện nút **Thử chấm lại** khi `retryable` là `true`.

| HTTP | `error_code` | `retryable` | Ý nghĩa |
|---|---|---|---|
| 400 | `consent_required`, `invalid_answer`, `unknown_lesson`, `unknown_question`, `invalid_question_id`, `invalid_session_id`, `bad_request` | không | Yêu cầu sai; gửi lại y nguyên cũng vô ích |
| 429 | `rate_limited` | có | Gemini giới hạn tốc độ (gói miễn phí) |
| 429 | `busy` | có | Backend đang xử lý một yêu cầu khác |
| 503 | `provider_unavailable` | có | Gemini lỗi 5xx, mất mạng hoặc quá thời gian |
| 502 | `invalid_model_output` | có | Gemini trả kết quả không qua kiểm tra (JSON hỏng, trích dẫn bịa, nhãn mâu thuẫn) |
| 502 | `model_not_found` | không | Gemini trả 404: tên `GEMINI_MODEL` không tồn tại hoặc đã ngừng. Chạy `python list_models.py` |
| 502 | `provider_rejected` | không | Gemini từ chối (key sai, các lỗi 4xx khác); thông báo kèm lời giải thích của Google |
| 503 | `not_configured` | không | Chưa có `GEMINI_API_KEY` hoặc thiếu dữ liệu bài học |

Quy ước: khi Gemini lỗi, backend **không** trả kết quả "dự phòng" giả danh AI. Người dùng thấy lỗi và thử lại.

## Chưa khả dụng
`/api/catalog`, `/api/transfer`, `/api/session`, `/api/experiment/*` trả 503 cho đến khi có `backend/chemlab`, `backend/lab3d`, `backend/data`.
