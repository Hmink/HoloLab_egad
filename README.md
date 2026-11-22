# HoloLab AR — thí nghiệm hóa học ảo & EGAD

Phòng thí nghiệm hóa học ảo (kéo thả bằng chuột, tùy chọn tracking bàn tay) kèm EGAD: công cụ đánh giá câu trả lời của học sinh.

## Trạng thái hiện tại (quan trọng)

Repo hiện có **backend (server + EGAD với Gemini)** và **frontend khung (trang EGAD thử nghiệm)**. **Chưa có** phòng thí nghiệm 3D, lõi hóa học (`backend/chemlab/`, `backend/lab3d/`, `backend/data/`) và dữ liệu huấn luyện; các API hóa học trả 503 cho đến khi có. Dữ liệu bài học/rubric trong `frontend/web/data/` là **bản nháp**, chưa được giáo viên xác nhận. Các báo cáo cũ trong `docs/archive/` mô tả bản V3.9 đầy đủ nhưng **không phải kết quả chạy lại ở repo này**.

Đã kiểm thử: lớp EGAD gọi Gemini (10 test Python) và hàm thuần của frontend (5 test JS). Luồng giao diện → backend → Gemini đã chạy thử end-to-end với Gemini giả; **chưa thử với Gemini thật**.

## Cấu trúc

```
backend/    Server Python, EGAD (Gemini), tracking, tests, script khởi động
frontend/   Vite + React (trang EGAD thử nghiệm), dữ liệu bài học nháp
docs/       API.md, CHANGELOG, THIRD_PARTY, hướng dẫn Base44, archive/ (báo cáo lịch sử)
LICENSE
```

## Chạy thử nhanh

```bash
cd backend
cp .env.example .env          # Windows: copy .env.example .env, rồi điền GEMINI_API_KEY
python3 -m unittest discover -s tests -v
```

```bash
cd frontend
npm install
npm run build
```

```bash
cd backend
python3 server.py             # mở http://127.0.0.1:8765/#/egad
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

Chi tiết: `backend/README.md`, `frontend/README.md`, `docs/API.md`. Giấy phép: `LICENSE`; thư viện bên thứ ba: `docs/THIRD_PARTY.md`.
