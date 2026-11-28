# HoloLab AR — thí nghiệm hóa học ảo & EGAD

Phòng thí nghiệm Hóa học 3D trên trình duyệt (10 bài lớp 10–12), điều khiển bằng **chuột** hoặc **bàn tay qua webcam**, kèm **EGAD**: công cụ phân tích câu trả lời của học sinh bằng mô hình ngôn ngữ chạy cục bộ (Ollama). Mọi thứ chạy trên máy chủ của bạn; hình ảnh webcam và câu trả lời không gửi ra dịch vụ bên ngoài.

## Trạng thái hiện tại

| Phần | Trạng thái |
|---|---|
| Phòng thí nghiệm 3D (chuột, bàn tay, 10 bài, vật lý, hóa học) | **Chạy được.** Có **Hỗ trợ tay** (vật nằm dưới tay, tự căn miệng bình, rót nhẹ từng lượng 2 mL) |
| EGAD qua Ollama (Qwen3) | Có API và trang thử nghiệm; mới kiểm thử với Ollama giả, **chưa đo chất lượng với Qwen3 thật** |
| Đăng nhập, phiên nhiều lượt, PostgreSQL, trang giáo viên (hợp đồng API v3.1) | **Chưa làm** (bản thiết kế) |
| Bài học và rubric | 5 bài có ghi "Phân lớp đề xuất" cần giáo viên xác nhận; rubric EGAD là bản minh họa |

Kết quả của EGAD là **dự đoán của AI, chưa được giáo viên xác nhận**, không dùng để chấm điểm.

## Chạy nhanh

Cần Python 3.10 trở lên và Chrome hoặc Edge. Không cần Node để chạy, vì giao diện và thư viện đã được đóng kèm.

```bash
cd backend
pip install -r requirements-core.txt
python server.py --browser-tracking
```

Trên Windows có thể dùng `py -3 server.py --browser-tracking` hoặc `backend/START_WINDOWS.bat`. Giữ cửa sổ terminal mở trong lúc dùng.

| Địa chỉ | Nội dung |
|---|---|
| http://127.0.0.1:8765/ | Trang giới thiệu; **Học tập** dẫn tới khu học tập (Tổng quan, Thư viện thí nghiệm, Lịch sử học) và bàn thí nghiệm 3D |
| http://127.0.0.1:8765/app/ | Ứng dụng EGAD (cần build một lần: `cd frontend && npm ci && npm run build`) |
| http://127.0.0.1:8765/egad-pilot.html | Bộ phân loại thống kê cũ (TF-IDF, chỉ để tham khảo) |

**Hướng dẫn làm thí nghiệm chi tiết** (chuột, cử chỉ tay, rót với Hỗ trợ tay, từng bài trong 10 bài, xử lý sự cố): [`docs/HUONG_DAN_THI_NGHIEM.md`](docs/HUONG_DAN_THI_NGHIEM.md).

## EGAD với Ollama (tùy chọn)

1. Cài [Ollama](https://ollama.com) trên máy chủ, rồi tải model: `ollama pull qwen3:8b` (cần khoảng 6 GB RAM/VRAM; máy yếu hơn thử `qwen3:4b`).
2. `cd backend`, sao chép `.env.example` thành `.env`, rồi kiểm tra bằng `python list_models.py`.
3. Trong lab bấm **EGAD · Giải thích**, hoặc mở `/app/`.

Ollama chỉ được lắng nghe `127.0.0.1`. **Không mở cổng Ollama ra Internet.** Nếu không có Ollama, lab vẫn chạy bình thường và EGAD báo rõ là chưa có mô hình. Hợp đồng API: [`docs/API.md`](docs/API.md).

## Cấu trúc

```
backend/    server.py (HTTP + API), EGAD (egad_llm.py, Ollama), lõi hóa học (chemlab/, lab3d/, data/),
            experiments/, training/ (pilot TF-IDF cũ), tests/ (Python), tools/ (đánh giá EGAD...)
frontend/   web/       ứng dụng lab tĩnh mà server phục vụ: index.html, src/ (Three.js, vật lý,
                       nhận diện tay, Hỗ trợ tay), data/ (bài học, rubric), vendor/ + models/ (chạy offline)
            ui/        khung thư viện bài (React) -> web/ui/
            src/       ứng dụng EGAD (React) -> web/app/
            tests_js/, tools/ (kiểm tra trình duyệt)
docs/       hướng dẫn thí nghiệm, báo cáo Hỗ trợ tay, API, CHANGELOG, lab/ (tài liệu kỹ thuật V3.x),
            archive/ (báo cáo và patch lịch sử)
licenses/   giấy phép thư viện bên thứ ba (xem docs/THIRD_PARTY.md)
```

## Phát triển và kiểm thử

```bash
cd frontend
npm ci
npm test          # 156 test JavaScript
npm run build     # build:shell (web/ui) + build:app (web/app)
npm run dev       # EGAD app ở http://localhost:5173, proxy sang backend :8765
```

```bash
cd backend
pip install -r requirements-dev.txt
python -m unittest discover -s tests -v    # 124 test Python
```

Kiểm tra trình duyệt (cần Playwright): `node frontend/tools/qa_mouse_v39.mjs` và `qa_egad_v39.mjs`. Đặt `PLAYWRIGHT_PACKAGE` tới module Playwright và `PYTHON` tới Python có `sympy`. GitHub Actions (`.github/workflows/checks.yml`) chạy test frontend và backend ở mỗi lần push.

## Tài liệu

- [`docs/HUONG_DAN_THI_NGHIEM.md`](docs/HUONG_DAN_THI_NGHIEM.md): hướng dẫn sử dụng và làm thí nghiệm
- [`docs/BAO_CAO_THAO_TAC_TAY.md`](docs/BAO_CAO_THAO_TAC_TAY.md): báo cáo cải thiện thao tác tay (nguyên nhân, thay đổi, số đo)
- [`docs/API.md`](docs/API.md): hợp đồng API hiện tại · [`docs/CHANGELOG.md`](docs/CHANGELOG.md)
- [`docs/lab/`](docs/lab/): tài liệu kỹ thuật các phiên bản V3.x của lab

Giấy phép: `LICENSE`. Thư viện bên thứ ba (Three.js, Rapier, MediaPipe và model nhận diện tay, React, SymPy) giữ giấy phép riêng: `docs/THIRD_PARTY.md`, `licenses/`.
