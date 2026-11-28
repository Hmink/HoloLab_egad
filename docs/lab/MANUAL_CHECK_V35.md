# Kiểm tra tại máy sử dụng — V3.5

Chưa được thực hiện với webcam thật trong lượt sửa này. Điền số đo thật, không dùng kết quả camera giả lập để thay thế.

## Chuẩn bị

1. Ghi CPU/GPU/RAM, hệ điều hành, phiên bản trình duyệt; cắm nguồn máy, đóng tác vụ nặng. Chọn V3.5, Ctrl+F5.
2. Bật camera; mở Thông tin bình & tùy chọn điều khiển, xác nhận độ phân giải thật. HD mặc định. Thử Low và Full HD nếu thiết bị hỗ trợ; ảnh CV mặc định 640 px độc lập.
3. Ánh sáng đều, cả bàn tay trong ảnh, tránh ngược sáng. Camera mờ quang học cần chỉnh lấy nét/vệ sinh lens; tăng độ phân giải không sửa được mất nét.

## Mẫu ghi kết quả

| Tình huống | Số lần / chỉ số | Kết quả thực tế |
|---|---|---|
|Gắp/thả mỗi tay|10 lần/tay; mục tiêu ≥9/10|Chưa đo|
|Hai tay gần/xa, giao nhau|Mỗi tình huống 10 lượt; ghi đổi chủ vật nếu có|Chưa đo|
|Xoay 45/90/135/180/360°|Cốc, bình tam giác, chai, ống nghiệm; kiểm tra cả hai tay|Chưa đo|
|Giữ/rót/dựng lại|Nguồn giảm, đích tăng, dựng dừng|Chưa đo|
|Úp ngược không có bình nhận|Nguồn hết, có vũng; không sinh thêm chất|Chưa đo|
|Rót vào bình đã đầy|Đích không vượt dung tích; phần dư vào sổ tràn|Chưa đo|
|Mất dấu ngắn|Che tay <0,5 s: bình không tự nhả; không rót khi mất dấu|Chưa đo|
|Thả/ném nhẹ/chạm bình khác|20 lượt; không phóng ra ngoài hay xuyên bàn|Chưa đo|
|Không tương tác|60 s; ghi trượt/rung nếu có|Chưa đo|
|AgCl so với nước|Mẫu trắng đục/lắng; đối chứng không kết tủa|Chưa đo|
|Các bài còn lại|Chỉ thị, NH₄⁺/quỳ, Fe/CuSO₄, biuret|Chưa đo|
|Hiệu năng|Thông số kỹ thuật → Đo 60 giây → Xuất kết quả|Chưa đo|

Ghi riêng FPS render, Hz tracking, inference ms, độ tuổi mẫu p95. Nếu cần đo độ trễ đầu–cuối, quay đồng thời tay và màn hình bằng camera ngoài rồi đếm chênh lệch khung hình; số `ageMs` không thay thế phép đo đó. Mục tiêu 50 FPS là điều kiện cần kiểm chứng trên thiết bị mục tiêu.

Nếu lỗi: ghi bài học, loại bình, thao tác trước lỗi, lượng chất, chế độ camera, kết quả JSON benchmark, thông báo Console. Không cần gửi hình mặt hoặc video học sinh để báo lỗi mã nguồn.
