# Backend

Server Python cục bộ (chỉ nghe `127.0.0.1`) phục vụ `frontend/web/` và API.

```bash
cd backend
cp .env.example .env        # điền GEMINI_API_KEY (không commit)
python3 server.py           # Windows: py -3 server.py, hoặc START_WINDOWS.bat
python3 -m unittest discover -s tests -v
```

| File | Vai trò |
|---|---|
| `server.py` | HTTP server và API (`/api/egad/assess`, `/api/transfer`, `/api/session`...) |
| `egad_llm.py` | EGAD: gọi Gemini và kiểm tra đầu ra |
| `list_models.py` | Liệt kê model Gemini dùng được với key của bạn (khi gặp lỗi 404) |
| `paths.py`, `version.py` | Đường dẫn dùng chung, số phiên bản duy nhất |
| `native_tracking.py`, `download_model.py` | Tracking bàn tay tùy chọn (MediaPipe) |
| `app.py`, `app_2d.py` | Bản desktop OpenCV cũ |

Còn thiếu (chưa có trong repo): `chemlab/`, `lab3d/`, `data/`, `python_vendor/`. Khi thiếu, `server.py` vẫn chạy (phục vụ web và EGAD) và các API hóa học trả 503.
