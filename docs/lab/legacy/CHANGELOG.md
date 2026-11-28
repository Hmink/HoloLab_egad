# 2.1 — 26/10/2026

Sửa từ phản hồi kiểm tra v2.0: tay phải ở xa hơn tay trái, mất bình khi kéo khỏi vùng nhận diện, chuyển động chưa mượt, cần thêm tình huống axit đậm đặc.

- Nhận tối đa hai tay, chọn tay phải/trái/tự động; khi đang cầm không tự chuyển sang tay đối diện chỉ vì tay đó gần camera hơn.
- Tỉ lệ chụm dùng tọa độ bàn tay 3D do MediaPipe ước lượng, có dự phòng 2D theo chiều dài/rộng lòng bàn tay. Không dùng một ngưỡng pixel cố định làm mặc định.
- Mất dấu: dừng thao tác và rót, giữ nguyên bình. Bắt lại ổn định trong 2 giây thì tiếp tục bằng điểm neo mới; lâu hơn thì đặt bình lên bàn. Không xóa/nhân đôi bình hoặc đổ chất trong thời gian mất dấu.
- Vùng tay Dễ với/Chuẩn/Toàn ảnh và hiệu chỉnh hai góc. Đây là ánh xạ điều khiển, không phải mở rộng góc quang học của camera.
- Lọc One Euro tăng độ đáp ứng khi di chuyển; vị trí được giữ khi mất dấu, không ngoại suy tay vô hình.
- Luồng camera và nhận diện riêng, bộ đệm khung mới nhất; cache chữ và chuyển alpha bằng mã native của Pillow để giảm chi phí mỗi khung.
- Thêm HNO₃, HCl đậm đặc; đổi tên rõ H₂SO₄ đặc. Quy tắc nguy cơ có nguồn trong JSON, phân biệt nhiệt/bắn tóe/hơi/cháy, không cho mọi axit cùng hiệu ứng nổ.
- Hoạt họa nguy cơ có lớp trong suốt, tia bắn, vệt nhiệt, khói/lửa và ký hiệu vỡ do áp suất; giới hạn số hiệu ứng lặp để tránh giảm tốc.

Chưa có mô phỏng cháy nổ vật lý, động học, nhiệt độ axit đặc hoặc quan hệ nồng độ–mức nguy hiểm. Cần tiếp tục thử trên webcam/Windows thật của người dùng. Chưa viết báo cáo kết quả thực nghiệm học sinh.

Mã nguồn bản mẫu và sửa đổi có hỗ trợ AI. Khi dùng cho hồ sơ KHKT cần khai báo đúng đóng góp, nguồn tham khảo và phần việc do học sinh thực hiện.
