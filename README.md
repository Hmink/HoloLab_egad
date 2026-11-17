# HoloLab AR — thí nghiệm bằng chuột & EGAD demo

Bản đóng gói GitHub ngày 17/11/2026, dựa trên HoloLab V3.9. Giữ nguyên lõi điều khiển, vật lý và hóa học. Chưa tích hợp agent gọi API.

## Chạy nhanh

Giải nén, mở terminal tại thư mục có `server.py`.

Windows:
```powershell
py -3 server.py
```
Linux/macOS:
```bash
python3 server.py
```
Hoặc chạy `START_WINDOWS.bat` / `bash START_LINUX.sh`. Cần Python 3.10 trở lên. Mở http://127.0.0.1:8765 và giữ terminal đang chạy. Không mở index.html bằng file://. Không cần bật webcam để dùng chuột. Bản web và tài nguyên đã đóng sẵn; không bắt buộc cài Node để chạy.

## Thao tác chuột

- Mở Thư viện, chọn bài và Bắt đầu thực hành, hoặc mở bàn tự do.
- Kéo thẻ dụng cụ từ kho vào bàn. Kéo chuột trái để di chuyển bình.
- Chuột phải kéo để nghiêng; hoặc chọn chế độ Nghiêng / rót.
- Chế độ Gần / xa hoặc con lăn điều chỉnh chiều sâu.
- Đặt miệng bình nguồn phía trên miệng bình nhận, cùng chiều sâu, rồi nghiêng để rót.
- Thả nút chuột để trả vật về mô phỏng vật lý. Dùng Dựng thẳng khi cần.
- Có lưu/khôi phục phiên, hoàn tác/làm lại và thư viện 10 bài theo dữ liệu hiện có.

## Hai ví dụ đánh giá học tập

1. Trong bài học: nút **EGAD · Giải thích** sử dụng bộ quy tắc/rubric minh họa. Đây không phải LLM đã huấn luyện.
2. Mở http://127.0.0.1:8765/egad-pilot.html để thử bộ phân loại thống kê. Chọn câu hỏi, chọn câu mẫu hoặc nhập câu mới, bấm Phân tích thử, xuất nhật ký JSON.

Mô hình pilot: TF-IDF ký tự + Logistic Regression, huấn luyện trên 45 câu **AI mô phỏng**, nhãn tạm do trợ lý đề xuất. Chưa có nhãn từng câu do giáo viên xác nhận. Model này chỉ đọc văn bản câu trả lời; câu hỏi được lưu vào nhật ký nhưng chưa tham gia phân loại. Không dùng để chấm điểm hay kết luận mức hiểu thật. Các ví dụ nạp sẵn lấy từ dữ liệu huấn luyện, không phải tập kiểm thử độc lập. Chi tiết: `training/metrics.json`, `docs/EGAD_DEMO.md`.

## Phát triển và kiểm thử

```bash
npm ci
npm test
npm run build
```

Node 22.12+ hoặc phiên bản tương thích Vite trong package-lock. Build tạo lại `web/ui/`. Python web test: `python3 -m unittest discover -s tests -v`; một số test desktop cần OpenCV. Kiểm tra trình duyệt: cài Playwright vào môi trường kiểm thử riêng và chạy các script `tools/qa_mouse_v39.mjs`, `tools/qa_egad_v39.mjs`. Có thể đặt CHROMIUM_EXECUTABLE tới Chromium đã cài và PLAYWRIGHT_PACKAGE tới module Playwright.

Kết quả của lượt đóng gói này: `validation_github/REPORT.md`. Các báo cáo VALIDATION_V* cũ là lịch sử, không phải bằng chứng chạy lại hôm nay.

## Cấu trúc

| Thư mục | Vai trò |
|---|---|
| web/src | Three.js, chuột, tracking, vật lý, hóa học và EGAD |
| web/data | Bài học, rubric, model pilot, câu mẫu |
| web/vendor, web/models | Thư viện và tài nguyên chạy cục bộ |
| ui | Mã nguồn giao diện React |
| server.py, lab3d, chemlab | Server và lõi Python |
| training | Dữ liệu mô phỏng, mã huấn luyện, chỉ số pilot |
| tests_js, tests, tools | Kiểm thử và công cụ |
| base44 | Ví dụ nhúng, không phải agent API đã triển khai |

Giấy phép của mã dự án: LICENSE; thư viện đi kèm giữ giấy phép riêng trong THIRD_PARTY.md và licenses/. Không có API key trong cấu hình mẫu. Khi thêm API, giữ key ở backend; không nhúng vào JS trình duyệt.
