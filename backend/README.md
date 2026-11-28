# Backend

Server Python cục bộ (chỉ nghe `127.0.0.1`). Phục vụ ứng dụng lab tĩnh trong `../frontend/web/` (đường dẫn `/`), ứng dụng EGAD (`/app/`) và các API.

```bash
cd backend
pip install -r requirements-core.txt   # sympy, mpmath: lõi hóa học
python3 server.py --browser-tracking   # Windows: py -3 server.py --browser-tracking
```

EGAD (tùy chọn): cài Ollama, chạy `ollama pull qwen3:8b`, sao chép `.env.example` thành `.env`, rồi kiểm tra bằng `python3 list_models.py`.

```bash
pip install -r requirements-dev.txt    # thêm numpy, opencv-python-headless, Pillow cho test
python3 -m unittest discover -s tests -v
```

| File / thư mục | Vai trò |
|---|---|
| `server.py` | HTTP server và API: hóa học (`/api/catalog`, `/api/transfer`, `/api/session`, `/api/experiment/*`), EGAD (`/api/egad/assess`, `/api/egad/local`), tracking Python tùy chọn |
| `egad_llm.py` | EGAD: gọi Ollama (Qwen3), kiểm tra đầu ra (trích dẫn chuẩn hóa, nhãn nhất quán) |
| `chemlab/`, `lab3d/`, `data/` | Lõi hóa học: cơ sở dữ liệu chất và phản ứng, hỗn hợp, chuyển chất, độ an toàn |
| `experiments/` | Thí nghiệm mẫu dạng JSON |
| `training/` | Pilot TF-IDF cũ (45 câu mô phỏng): dữ liệu, mã huấn luyện, chỉ số |
| `tools/` | Công cụ Python, ví dụ `evaluate_egad.py` (accuracy/F1 so với nhãn giáo viên) |
| `list_models.py` | Liệt kê model đã cài trong Ollama |
| `paths.py`, `version.py`, `envfile.py` | Đường dẫn dùng chung, số phiên bản, đọc `.env` |
| `native_tracking.py`, `download_model.py`, `app.py`, `app_2d.py` | Tracking Python tùy chọn và bản desktop OpenCV cũ |

`python_vendor/` (SymPy đóng kèm của bản V3.9) **không** được đưa vào repo nữa; hãy cài bằng `pip`. Nếu thiếu lõi hóa học, server vẫn chạy và các API hóa học trả 503.
