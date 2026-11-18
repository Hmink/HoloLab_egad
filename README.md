# HoloLab AR — thí nghiệm hóa học ảo & EGAD

Phòng thí nghiệm hóa học ảo (kéo thả bằng chuột, tùy chọn tracking bàn tay) kèm EGAD: công cụ đánh giá câu trả lời của học sinh.

## Trạng thái hiện tại (quan trọng)

Repo này mới chỉ có **phần vỏ backend và tài liệu**. **Chưa có** giao diện web (`frontend/web/`, `frontend/ui/`), lõi hóa học (`backend/chemlab/`, `backend/lab3d/`, `backend/data/`), dữ liệu huấn luyện và bộ kiểm thử JS. `server.py` sẽ báo lỗi rõ ràng nếu thiếu các thư mục này. Các báo cáo cũ trong `docs/archive/` mô tả bản V3.9 đầy đủ nhưng **không phải kết quả chạy lại ở repo này**.

Đã có và kiểm thử được: lớp EGAD gọi Gemini (`egad_llm.py`) và `tests/test_egad_llm.py`.

## Cấu trúc

```
backend/    Server Python, EGAD (Gemini), tracking, tests, script khởi động
frontend/   Giao diện web (chưa có mã nguồn), package.json, vite.config.js
docs/       CHANGELOG, THIRD_PARTY, hướng dẫn Base44, archive/ (báo cáo lịch sử)
LICENSE
```

## Bắt đầu

```bash
cd backend
cp .env.example .env     # Windows: copy .env.example .env, rồi điền GEMINI_API_KEY
python3 -m unittest discover -s tests -v
```

## EGAD với Gemini API

1. Vào https://aistudio.google.com, chọn **Get API key**, tạo key.
2. Điền `GEMINI_API_KEY` (và `GEMINI_MODEL` nếu muốn đổi) trong `backend/.env`.

Endpoint: `POST /api/egad/assess` (giữ `/api/egad/local` để tương thích). Body: `{lesson, answer, consent: true, consent_cloud: true}`.

Ghi chú an toàn:
- Key chỉ ở backend (`.env` được git bỏ qua). Không đặt trong JS trình duyệt, không chụp màn hình hay dán vào chat. Nếu lỡ lộ, xóa và tạo lại trong AI Studio.
- Câu trả lời được gửi tới Google. Gói miễn phí có thể cho phép Google dùng dữ liệu để cải thiện sản phẩm: khi test chỉ dùng dữ liệu mô phỏng hoặc ẩn danh. Gói trả phí thay đổi điều khoản dữ liệu và giới hạn tốc độ nhưng không có gì là "tuyệt đối"; vẫn cần đọc điều khoản hiện hành và xin phép đúng quy định trước khi dùng dữ liệu học sinh thật.
- Gói miễn phí giới hạn tốc độ; lỗi 429 được báo rõ.
- Kết quả mô hình luôn được kiểm tra: bằng chứng phải trích nguyên văn câu trả lời, nhãn tổng hợp phải nhất quán. Kết quả là **dự đoán, chưa được giáo viên xác nhận**, không dùng để chấm điểm.

Chi tiết: `backend/README.md`, `frontend/README.md`. Giấy phép: `LICENSE`; thư viện bên thứ ba: `docs/THIRD_PARTY.md`.
