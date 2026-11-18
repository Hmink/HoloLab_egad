# Kiểm chứng V3.9 — 05/11/2026

## Phạm vi bàn giao

Bản cập nhật V3.8, không viết lại toàn bộ dự án. Có kho trong phòng dạng lưới/tìm kiếm/nhóm; 10 bài thực hành; EGAD theo rubric chạy ngay; adapter mô hình llama.cpp cục bộ tùy chọn. Chưa đủ 20 dụng cụ hoạt động, chưa đạt mức tương đương toàn bộ NOBOOK. 5 bài mới có phân lớp đề xuất, cần giáo viên xác nhận trước khi công bố bám chuẩn đầy đủ.

## Đã chạy

| Nhóm | Kết quả và phạm vi |
|---|---|
| Vite production build | Thành công; UI đã build sẵn trong ZIP |
| JavaScript | 133/133 tests, gồm EGAD, định lượng mới, bảo toàn nguyên tố qua 100 lần chuyển chất |
| Python | 100/100 tests, gồm hợp đồng adapter mô hình và phép đo đánh giá |
| Browser core | 12 nhóm qua; Rapier thật, 20 lần thả/gắp, giới hạn bàn, hai tay tổng hợp, pipeline MediaPipe bằng camera giả lập |
| Browser liquid | 15 nhóm qua; xoay 6 góc, rót/vũng tràn/bảo toàn thể tích, 5 bài cũ, nhãn/bố cục 1920/1366/1024/640 px |
| Browser mouse | 12 nhóm qua; pointer thật, tạo vật/undo/redo/lưu mở, 20 chu kỳ gắp–thả, xoay/rót, giá ống ổn định 60 giây mô phỏng |
| Browser EGAD + bài mới | 12 nhóm qua; nhập câu trả lời/nhãn/lịch sử/quyền đồng ý/xóa; 10 bài tạo và mở phiên; 4 bài mới rót qua vòng lặp sản xuất |
| Mô hình ngôn ngữ thật | CHƯA chạy; adapter kiểm thử bằng mock và trường hợp không có model server |
| Webcam/bàn tay thật | CHƯA thử; không suy ra chất lượng tay thật từ ảnh camera giả lập |

Trung hòa mới được kiểm tra định lượng trước/tại/sau tương đương bằng unit test và tạo/mở phiên bằng trình duyệt. Chưa thực hiện chuỗi kéo chuột chuẩn độ tới điểm tương đương của bài mới trên thiết bị thật.

Đã thử ZIP giải nén sạch không có node_modules: server Python khởi động, React dựng 10 thẻ, vào bài chloride có 3 vật thể, không lỗi JavaScript hoặc yêu cầu runtime ra Internet.

Dữ liệu trong `validation_v39/`: log của từng suite, kết quả JSON và source-audit. Ảnh QA nội bộ không đưa vào ZIP. Một số tên script/file kết quả còn mang phiên bản lịch sử; đối chiếu thư mục validation_v39 và ngày chạy.

## Hiệu năng

Đo đơn lẻ trong 60,0162 giây, 2.042 frame: **34,02 FPS**, frame chậm nhất **333,4 ms**. Scene 3 dụng cụ nghỉ trên bàn, camera tắt; Chromium headless/SwiftShader (GPU phần mềm). Không đạt mục tiêu 45–50 FPS trong môi trường này. V3.8 có số đo lịch sử 31,96 FPS nhưng không phải cặp thử kiểm soát tải, KHÔNG dùng để tuyên bố tăng hiệu năng.

Chưa đo FPS khi chạy trọng số mô hình thật đồng thời webcam/Three/Rapier, độ trễ tay đầu–cuối, tài nguyên trên Windows/i5/RTX. Cần chạy các bài đó trên máy đích.

## Lỗi phát hiện và sửa

- Kho 310px làm canvas còn 296px ở viewport 640px: thêm breakpoint kho 215px, thẻ một cột. Chạy lại suite liquid qua mọi viewport.
- Bài test chuột thả fixture bình trước khi nhấn chuột phải khiến bình rơi và điểm nhấn cũ lệch: giữ fixture tới pointerdown capture rồi trao cho handler chuột sản xuất. Không sửa physics để làm test qua. Rerun mouse suite qua đủ nhóm. `mouse-failure.json` là bằng chứng lần thất bại đầu, không phải kết quả cuối.
- Gợi ý nước đối chứng dùng AgCl ngay cả trong biuret: giới hạn gợi ý đó cho bài chloride.
- pH cho carbonate/acetate chưa có cân bằng phụ: trả trạng thái chưa mô hình hóa, không hiển thị con số đoán.
- Restore trước đây chỉ chấp nhận NH₃: cho phép CO₂ riêng trong bài có phản ứng sinh CO₂, kiểm tra round-trip.
- Test cũ đòi đúng 5 bài: cập nhật kiểm tra 10 bài, giữ điều kiện nội dung/câu hỏi và phân biệt căn cứ lớp với trạng thái chờ xác minh.
- EGAD có nguy cơ nhận câu đủ từ khóa nhưng chưa chắc chắn là đúng: bổ sung abstention cho câu hỏi/diễn đạt phỏng đoán và test.
- Server health/catalog còn ghi version 3.7: đồng bộ 3.9.

## Không thay đổi

Source audit đối chiếu từng byte với V3.8: capture, hand-worker, interaction, tracks, filters, physics, mouse-motion, liquid-simulation và reaction-engine không thay đổi. Lõi hóa học bài học mở rộng có chủ đích; module rót/vật lý/cử chỉ cũ giữ nguyên.

## Giới hạn EGAD

- Quy tắc không hiểu ngôn ngữ tự do như LLM. Có thể bỏ sót hoặc đánh giá nhầm câu phức tạp. Không thay giáo viên hoặc dùng làm điểm chính thức.
- Một khái niệm trọng tâm/bài, chưa phủ mọi kiến thức. Thao tác được lưu làm bằng chứng ngữ cảnh, chưa có mô hình kết hợp đa nguồn đã huấn luyện.
- Llama.cpp không được đóng gói kèm trọng số, chưa thử suy luận thật. Kiểm tra cấu trúc/trích dẫn không bảo đảm mọi nhận xét hóa học của model đúng.
- Chưa có dữ liệu học sinh, giáo viên gán nhãn hay kết quả Macro-F1/hiệu quả giáo dục thực tế.
- Lịch sử chỉ trong phiên, xuất JSON để lưu. Thu hồi đồng ý không xóa file đã xuất.

## Kiểm tra thủ công trên máy đích

1. Giải nén thư mục mới, chạy START_WINDOWS.bat hoặc bash START_LINUX.sh; Ctrl+F5, xác nhận V3.9.
2. Chọn 10 bài lần lượt, kiểm tra đúng dụng cụ, thử rót đúng/lệch miệng/đóng nắp.
3. Gắp cao, thả sát bàn, thả khi di chuyển, va nhẹ, đẩy về bốn mép, gắp lại; lặp ít nhất 20 lần và để nghỉ 60 giây.
4. Trong chloride nhập “Tạo khí trắng.” rồi sửa “AgCl là kết tủa trắng. Ag và Cl tạo chất ít tan.”; xem nhãn và lịch sử. Thử lời giải thích ngoài mẫu để kiểm tra giới hạn.
5. Bỏ đồng ý, kiểm tra dữ liệu phiên đã xóa. Nếu có llama.cpp và GGUF: bật tùy chọn, thử phản hồi thật và đối chiếu giáo viên.
6. Bật camera, thử hai tay/che tay ngắn/thả, đo render FPS và tracking Hz riêng 60 giây. Không chỉ nhìn FPS trung bình; ghi độ trễ và giật.
7. Báo lỗi kèm tên bài, thao tác, ảnh hoặc video, cấu hình máy và lỗi Console nếu có.
