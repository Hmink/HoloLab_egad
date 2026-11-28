# Kiểm tra V3.7 trên máy thật

Đây là phần chưa được thay thế bằng camera giả lập. Ghi CPU/GPU, trình duyệt,
webcam và cấu hình. Giải nén vào thư mục mới, dừng server cũ, Ctrl+F5, kiểm tra
tab **V3.7**. Các ô bên dưới là việc cần thử, không phải kết quả đã đạt.

## Thử nhanh trước buổi trình diễn

1. Mở `http://127.0.0.1:8765`, bấm **Bật camera**, cấp quyền. Nếu ứng dụng Camera
   Windows cũng tối, kiểm tra nắp che/phím khóa, ánh sáng, quyền và driver trước.
2. Để webcam **HD**, ảnh CV **640**, backend **Tự động**. Mở **Thông số kỹ thuật**:
   kiểm tra độ phân giải stream thực tế và ảnh CV. HD preview không đồng nghĩa
   MediaPipe nhận HD. Ghi transport **VideoFrame** hay **ImageBitmap**.
3. Mỗi tay gắp và thả 10 lần. Thử mở cái–trỏ nhưng gập ba ngón còn lại trong chế độ
   xoay; bình phải rơi. Số lần thành công mong muốn ít nhất 9/10 mỗi tay.
4. Giữ bình 30 giây, di chuyển chậm rồi nhanh trong vùng camera. Thử hai tay riêng
   và hai tay cùng bình; tay cuối thả mới làm bình rơi.
5. Che tay khoảng 0,2 giây rồi đưa lại: giữ tạm, không văng. Đưa tay ra khỏi ảnh hơn
   1 giây: timeout khoảng 0,7 giây phải thả; không coi là nhận diện được ngoài camera.
6. Lặp gắp–thả ít nhất 20 lần; kéo sát bốn mép, chạm nhẹ bình khác, đặt yên 60 giây.
   Ghi lại nếu treo, xuyên bàn, tự trượt hoặc văng khỏi vùng thực hành.
7. Bài chloride: AgNO₃ vào mẫu NaCl → đục/kết tủa trắng; nước đối chứng sạch không
   tạo AgCl. Dựng nguồn dừng rót, úp để hết, rót lệch có tràn và giảm đúng lượng.
8. Tắt/bật camera hai lần; thử Low/HD/FHD nếu hỗ trợ, thử CPU/GPU. Thay camera/CV/
   mirror khi đang giữ phải chờ thả. Không dùng cấu hình GPU nếu driver báo lỗi.

## So sánh hiệu năng

- Dừng bản kia khi đo; cùng máy, ánh sáng, trình duyệt, camera, bài học, 5 dụng cụ,
  kích thước cửa sổ, DPR, độ phân giải CV và backend. Không mở game/quay màn hình
  trong một bản rồi so với bản không quay.
- Chạy **Đo 60 giây**, thao tác bình thường, xuất JSON. Đo ba lượt V3.6 và ba lượt
  V3.7 xen kẽ. Đối chiếu trung vị render FPS, tracking Hz, min FPS, tuổi mẫu và
  thời gian các công đoạn. Phân biệt 50 FPS render và 50 mẫu nhận diện/giây.
- Chạy 30 phút trên máy thật; ghi tình trạng mỗi 5 phút. Kết quả cần đủ mẫu có tay,
  không chỉ camera bật nhưng không có người thao tác.
- Muốn đo độ trễ đầu–cuối: quay đồng thời tay và màn hình bằng camera tốc độ cao,
  đếm chênh lệch frame. Không lấy debounce hoặc thời gian MediaPipe làm số thay thế.

| Chỉ tiêu | Kết quả cần tự ghi |
|---|---|
| Gắp trái / phải | …/10 · …/10 |
| 20 lần thả | …/20 rơi đúng; … lần xuyên/văng/treo |
| Hai tay / mất dấu ngắn / mất dấu lâu | Đạt / lỗi / chưa thử |
| Rót + AgCl + nước đối chứng | Đạt / lỗi / chưa thử |
| 60 giây × 3: render FPS / tracking Hz | Ba báo cáo JSON |
| Độ phân giải thực / CV / backend / transport | … |
| Chạy 30 phút | Thời gian thực, lỗi, trạng thái cuối |

Nếu lỗi, gửi **tên bài, loại bình, tay A/B, chế độ, thời điểm, trạng thái hiển thị,
tracking Hz, JSON đo và lỗi đầu tiên trong F12 Console**. Video tay chỉ gửi nếu
bạn muốn; không đưa thông tin học sinh vào nhật ký. Không ghi “đạt” cho mục chưa thử.
