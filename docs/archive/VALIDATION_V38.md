# Kiểm thử V3.8 — Mouse First

Ngày: 05/11/2026. Phạm vi: nhánh chuột, thư viện React, giá đỡ ống nghiệm và hồi quy các module cũ. Không tuyên bố hoàn thành toàn bộ master prompt.

## Kết quả đã chạy

| Kiểm tra | Kết quả |
|---|---|
| Giải nén ZIP sạch, không node_modules | Server Python chạy; thư viện 5 bài, mở chloride có 3 bình; không lỗi JS hoặc request runtime ra ngoài |
| Build React/Vite production | Thành công; bundle JS 326.14 kB, gzip 75.34 kB; không cần React CDN |
| Node tests | 118/118 đạt, bao gồm 3 test ánh xạ chuột mới |
| Python tests | 91/91 đạt sau khi bổ sung dependency QA OpenCV/numpy/SymPy vào môi trường kiểm thử |
| Browser core hồi quy | 12 nhóm đạt: Rapier thật, 20 drop/regrab, giới hạn, va chạm, hai tay tổng hợp, chuẩn độ, camera giả lập |
| Browser hóa học/chất lỏng | 15 nhóm đạt: 5 loại bình xoay toàn góc, rót rAF, AgCl, đối chứng, bảo toàn thể tích, 5 bài học, quiz, logger |
| Browser chuột mới | 12 nhóm đạt: thư viện/lọc/xem trước, lưu/mở, kéo thẻ, undo/redo, 20 lượt pointer grab/drop, xoay chuột phải, chiều sâu, mất focus, rack, phản ứng, đo FPS, không lỗi JS |
| Giá đỡ | Khớp Rapier thật; giữ 60 giây **thời gian mô phỏng**, lưu/mở và nhấc lại tháo khớp |
| Thực nghiệm chuột tạo AgCl | Test đặt sẵn hình học miệng bình; xoay bằng pointer thật, vòng lặp sản phẩm tự rót/tạo AgCl; không dùng nút tạo kết tủa |
| 60 giây render trực tiếp | 1918 frame / 60.0048 s = **31.96 FPS**, frame dài nhất 466.6 ms; 3 vật trên bàn, camera tắt, GPU phần mềm |

Log/JSON: `validation_v38/`. Test không thay thế quan sát bàn tay thật. Core sử dụng MediaPipe thật với camera giả lập không có người; điều này chỉ kiểm tra pipeline và vòng đời camera.

## Lỗi phát hiện và sửa trong lượt này

1. Thanh chọn bài cũ mở lại khi clearDesk, làm canvas đổi kích thước và điểm gắp bị lệch. Chế độ chuột dùng Thư viện riêng, giữ cột selector cũ đóng; kiểm thử pointer chạy lại đạt.
2. Vite library build ban đầu để lại điều kiện `process.env.NODE_ENV`. Đặt rõ production trong cấu hình build; kiểm tra startup không còn lỗi runtime và bundle giảm kích thước.
3. Lịch sử ban đầu chụp sau khi tạo vật, nên undo không xóa lần tạo. Đưa checkpoint trước spawn; bài kéo thẻ → undo bàn trống → redo phục hồi đã đạt.
4. Wheel thay đổi z trong lúc đang kéo có thể bị vị trí bắt đầu cũ ghi đè. Đồng bộ z của mốc chuột khi wheel thay đổi chiều sâu.
5. Giá chỉ trang trí: thêm giá có static colliders/khớp; tháo khớp trước gắp hoặc xóa; lưu rack_ids và phục hồi vị trí gắn.
6. Hướng dẫn ban đầu ghi sai số pixel để dốc ngược; đã đổi 350 px ≈180°, 175 px ≈90°.

## Những lần chạy không đạt / hạn chế môi trường

- Lần core đầu thất bại ở kiểm tra kinematic do lỗi reflow selector nêu trên; sửa và chạy lại toàn bộ core đạt. `browser_failure.json` là dấu vết lần đầu, không phải kết quả cuối.
- Script hóa học cũ bấm `#lesson-start` nằm trong selector bị ẩn. Bản `qa_liquids_v38.mjs` gọi khởi tạo bài để kiểm tra hóa học; giao diện thư viện mới được kiểm tra riêng bằng click thật trong `qa_mouse_v38.mjs`.
- Cài Chromium từ CDN Playwright không nhận được ZIP hợp lệ. Dùng Chromium 133 từ gói npm @sparticuz/chromium trong môi trường QA; không đưa binary QA vào sản phẩm. Chưa kiểm thử mọi phiên bản Chrome/Edge trên Windows.
- Lần Python đầu thiếu thư viện QA; sau khi cung cấp môi trường dependency, 91 test chạy đạt.

## Chưa được xác minh / chưa hoàn thiện

- Chưa đo trên máy vật lý người dùng; **chưa đạt bằng chứng ≥45/50 FPS**, không có số đo trước–sau cùng máy cho V3.8.
- Chưa đo độ trễ đầu-cuối, thử webcam thật, bàn tay thật hoặc độ chính xác gắp 9/10.
- Không có soak 30 phút mới cho V3.8; soak V3.7 là hồ sơ lịch sử.
- Chưa đủ 20 dụng cụ/10 bài mới hoặc hình ảnh tương đồng rất cao với NOBOOK. Có 5 bài cũ, giá cố định và hình học ống cải tiến.
- Giá hiện đặt cố định phía trái sau; trên viewport rất hẹp có thể khó thao tác. Nên dùng máy tính ở độ rộng >=1100 px.
- Undo/redo áp dụng thao tác chuột qua nhánh mới; chưa bao quát mọi lệnh bàn phím/camera và các nút cũ.
- Camera đang giữ module hai tay cũ, chưa chuyển sang một tay chủ động; giữ nguyên các bộ lọc và FSM.

## Kiểm tra thủ công trên máy của bạn

1. Mở bản V3.8, chưa bật camera. Chọn chloride, kéo AgNO₃ lên, chuyển vị trí bằng chuột trái, nghiêng bằng chuột phải.
2. Căn miệng trên mẫu: mẫu phải tăng thể tích và có AgCl; thử mẫu nước không có AgCl.
3. Nhả chuột: bình rơi/va chạm. Thử 20 lượt và kéo về bốn mép bàn.
4. Bàn mới: kéo ống nghiệm vào, dựng thẳng, chỉnh chiều sâu về giá và đặt vào lỗ trống. Nhấc lại, lưu và mở phiên.
5. Thử mất focus bằng Alt+Tab khi đang kéo: bình không bị giữ vĩnh viễn.
6. Thử tìm/lọc bài, reset, xóa, undo/redo và mở phiên đã lưu. Ghi lại lỗi Console nếu có.
7. Sau khi nhánh chuột ổn định mới bật camera và đánh giá lại module cử chỉ trên máy thật. Ghi cấu hình, phiên bản trình duyệt, FPS render và tracking Hz riêng.
