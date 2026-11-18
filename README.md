# HoloLab AR — thí nghiệm hóa học ảo & EGAD

Phòng thí nghiệm hóa học ảo (kéo thả bằng chuột, tùy chọn tracking bàn tay) kèm EGAD: công cụ đánh giá câu trả lời của học sinh.

## Trạng thái hiện tại (quan trọng)

Repo này mới chỉ có **phần vỏ backend và tài liệu**. **Chưa có** giao diện web (`web/`, `ui/`), lõi hóa học (`chemlab/`, `lab3d/`, `data/`), dữ liệu huấn luyện (`training/`) và bộ kiểm thử JS. `server.py` sẽ báo lỗi rõ ràng nếu thiếu các thư mục này. Các báo cáo cũ trong `docs/archive/` mô tả bản V3.9 đầy đủ nhưng **không phải kết quả chạy lại ở repo này**.

Đã có và kiểm thử được: lớp EGAD gọi Gemini (`egad_llm.py`) và `tests/test_egad_llm.py`.

## Chạy kiểm thử

```bash
python3 -m unittest discover -s tests -v
```

## EGAD với Gemini API

1. Vào https://aistudio.google.com, chọn **Get API key**, tạo key.
2. Sao chép `.env.example` thành `.env`, điền `GEMINI_API_KEY` (và `GEMINI_MODEL` nếu muốn đổi model).

Endpoint: `POST /api/egad/assess` (giữ `/api/egad/local` để tương thích). Body: `{lesson, answer, consent: true, consent_cloud: true}`.

Ghi chú an toàn:
- Key chỉ ở backend (`.env` đã được git bỏ qua). Không đặt trong JS trình duyệt. Nếu lỡ lộ key, hãy xóa và tạo lại trong AI Studio.
- Câu trả lời được gửi tới Google. Gói miễn phí có thể cho phép Google dùng dữ liệu để cải thiện sản phẩm: khi test chỉ dùng dữ liệu mô phỏng hoặc ẩn danh. Gói trả phí chỉ thay đổi điều khoản dữ liệu và giới hạn tốc độ; vẫn cần đọc điều khoản hiện hành và xin phép đúng quy định trước khi dùng dữ liệu học sinh thật.
- Gói miễn phí giới hạn tốc độ; lỗi 429 được báo rõ.
- Kết quả mô hình luôn được kiểm tra: bằng chứng phải trích nguyên văn câu trả lời, nhãn tổng hợp phải nhất quán. Kết quả là **dự đoán, chưa được giáo viên xác nhận**, không dùng để chấm điểm.

## Chạy server (khi đã có đủ thư mục)

```bash
python3 server.py        # Linux/macOS (Windows: py -3 server.py)
```
Mở http://127.0.0.1:8765. Cần Python 3.10 trở lên. Có thể dùng `START_WINDOWS.bat` / `bash START_LINUX.sh` (thêm `--browser-tracking` để dùng tracking trên trình duyệt). Model bàn tay: `python3 download_model.py` (lưu vào `web/models/`).

## Cấu trúc hiện có

| File | Vai trò |
|---|---|
| `server.py` | Server HTTP cục bộ (127.0.0.1) và API |
| `egad_llm.py` | EGAD: gọi Gemini + kiểm tra đầu ra |
| `native_tracking.py`, `download_model.py` | Tracking tùy chọn bằng MediaPipe |
| `app.py`, `app_2d.py` | Bản desktop OpenCV cũ (cần `lab3d/`) |
| `version.py` | Số phiên bản duy nhất |
| `docs/archive/` | Báo cáo và patch lịch sử |

Giấy phép: `LICENSE`; thư viện bên thứ ba: `THIRD_PARTY.md`.
