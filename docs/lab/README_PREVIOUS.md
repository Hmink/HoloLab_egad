# HoloLab ChemLab — V3.9 — Thư viện & EGAD

Bản cập nhật trên V3.8: kho trong phòng có tìm kiếm/lọc, 10 bài thực hành, EGAD rubric cục bộ và adapter llama.cpp tùy chọn. Giữ nguyên lõi thao tác chuột, MediaPipe, Rapier và chất lỏng. **Chưa phải bản sao đầy đủ NOBOOK hoặc nghiệm thu 20 dụng cụ.**

## Chạy ngay

1. Giải nén toàn bộ ZIP vào thư mục mới. `server.py` phải ở cùng thư mục với `START_WINDOWS.bat`.
2. Dừng server bản cũ bằng Ctrl+C.
3. Windows: nhấp `START_WINDOWS.bat`, hoặc chạy `py -3.13 server.py --browser-tracking`. Có thể dùng `python server.py --browser-tracking` với Python >=3.10.
4. Linux: `bash START_LINUX.sh`, hoặc `python3 server.py --browser-tracking`.
5. Mở http://127.0.0.1:8765, nhấn Ctrl+F5. Tab hiển thị V3.9.
6. Chọn bài trong Thư viện → xem hướng dẫn → Bắt đầu thực hành. Không cần bật camera.

Bản ZIP có giao diện đã build, Three/Rapier/MediaPipe và font cục bộ. Người dùng không cần cài Node/npm hoặc OpenCV để chạy đường web. Giữ terminal mở trong lúc thực hành.

## Điều khiển chuột

| Thao tác | Cách dùng |
|---|---|
| Lấy dụng cụ | Kéo thẻ từ kho bên phải vào bàn; trong bài học kéo thẻ sẽ lấy bình đã bố trí |
| Nhấc / di chuyển | Chọn Di chuyển; giữ chuột trái trên bình và kéo |
| Nghiêng / rót | Chọn Nghiêng / rót; giữ chuột trái và kéo ngang; kéo dọc xoay trước/sau |
| Nghiêng nhanh | Giữ chuột phải trên bình và kéo ngang |
| Đổi chiều sâu | Chọn Gần / xa, giữ chuột trên bình và kéo dọc |
| Thả | Nhả nút chuột; rigid body trở về dynamic và chịu trọng lực |
| Dựng thẳng | Chọn bình, bấm Dựng thẳng |
| Đặt ống vào giá | Dựng ống thẳng, đưa gần tâm một lỗ trống, đúng chiều sâu, rồi nhả chuột; nhấc lại sẽ tháo khớp |
| Lưu / mở | Lưu trên thanh mới lưu cục bộ vào trình duyệt; mở từ Phiên đã lưu trong Thư viện |
| Chuyển máy | Dùng Lưu phiên / Mở JSON trong kho dụng cụ |
| Hoàn tác / làm lại | Hỗ trợ thao tác chuột, tạo/xóa/reset/chọn bài/lưu mở qua thanh mới, tối đa 30 mốc; không phải lịch sử liên tục mọi sự kiện camera |

Để rót: đưa miệng bình nguồn cao hơn miệng bình nhận, căn đúng chiều sâu, giữ bình và nghiêng. Dòng chảy lệch miệng sẽ đổ ra bàn, không tự hút vào bình nhận. Kéo ngang khoảng 175 px tương ứng 90 độ; 350 px tương ứng 180 độ. Khi cần giữ nghiêng lâu, tiếp tục giữ nút chuột.

Camera là tùy chọn: bật camera để dùng module hai tay cũ. Chưa triển khai thiết kế một tay chủ động mới trong master prompt. Không cần dùng camera khi thử bản chuột.

## Dành cho lập trình viên

- `ui/shell.jsx`, `ui/shell.css`: thư viện React, lọc lớp/tìm kiếm/xem trước, phiên đã lưu, thanh điều khiển.
- `vite.config.js`: build UI thành `web/ui/`; không thay server Python.
- `web/src/mouse-motion.js`: ánh xạ con trỏ → mục tiêu vị trí/hướng, tách riêng để test.
- `web/src/main.js`: tích hợp chuột, quyền sở hữu, lịch sử phiên, xử lý mất focus.
- `web/src/tube-rack.js`: giá đỡ static, collider và khớp tháo được cho ống nghiệm.
- `web/src/physics.js`: Rapier; chỉ thêm hook tháo khớp khi nhấc/xóa.
- `web/profiles.json`: profile ống nghiệm có đáy tròn, thành trong/ngoài.
- `web/src/lesson-chemistry.js`, `reaction-engine.js`, `liquid-simulation.js`: hóa học bài học được mở rộng; engine rót được giữ nguyên.

Build lại UI: Node >=20.19, `npm ci` rồi `npm run build`. Chạy bằng server Python như trên. React không quản lý vòng lặp physics/render nên không gây re-render toàn bộ scene mỗi frame.

Kiểm thử: `npm test`; Python `PYTHONPATH=python_vendor python3 -m unittest discover -s tests` (test đường 2D cần numpy/OpenCV). Browser QA dùng Playwright và Chromium: `node tools/qa_mouse_v38.mjs`, `node tools/qa_liquids_v38.mjs`. Có thể đặt `PLAYWRIGHT_PACKAGE` đến adapter Chromium trong môi trường đặc biệt.

## Phạm vi và bằng chứng

Xem `VALIDATION_V39.md` và `docs/EGAD_V39.md`. Báo cáo V3.8 trở về trước chỉ là lịch sử. Có 10 bài hoạt động; 5 bài bổ sung ghi rõ phân lớp đề xuất, chưa được giáo viên xác nhận theo kế hoạch dạy học. Chưa đủ 20 dụng cụ, chưa sao chép giao diện/tài sản NOBOOK, chưa chứng minh đạt 45/50 FPS trên máy thật.

## EGAD

Bấm **EGAD · Giải thích**, đồng ý ghi nhật ký phiên, nhập câu trả lời rồi bấm Phân tích. Không cần API key. Nhãn dự đoán, bằng chứng và lịch sử sửa câu trả lời hiển thị ngay. Rubric là bộ quy tắc, không phải AI đã huấn luyện. Tùy chọn llama.cpp cần runtime và mô hình riêng; chưa kiểm thử mô hình thật trong lượt này. Xem `docs/EGAD_V39.md`.

## 10 bài trong thư viện

1. Nhận biết chloride (AgCl trắng).
2. Chỉ thị acid–base.
3. Nhận biết ammonium qua NH₃ và quỳ đỏ ẩm.
4. Fe đẩy Cu khỏi dung dịch muối.
5. Phản ứng màu biuret.
6. Trung hòa HCl–NaOH.
7. Kết tủa Cu(OH)₂ xanh.
8. Kết tủa CaCO₃ trắng.
9. CH₃COOH–NaHCO₃ tạo CO₂.
10. Pha loãng CuSO₄: bảo toàn chất tan, không phải phản ứng.

## Giới hạn mô hình

Chất lỏng dùng hình học và bảo toàn lượng chất, không CFD. Kết tủa/hạt được phóng đại để dễ quan sát; thời gian lắng không đại diện dữ liệu động học thực nghiệm. Chưa mô phỏng vỡ thủy tinh, độ nhớt, gạn tách lớp hoặc phản ứng giữa các vũng tràn. Khi mở phiên, lượng tràn được giữ nhưng hình vũng trang trí chưa tái dựng. Cần thử thủ công máy thật theo VALIDATION_V39.md.
