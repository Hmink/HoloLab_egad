# Kiểm tra bản mẫu 1.0

Thực hiện ngày 25/10/2026. Đây là ghi nhận kiểm tra phần mềm, không phải kết quả thực nghiệm trên học sinh.

## Môi trường đã dùng

- Python 3.12.14, Linux x86-64.
- MediaPipe 0.10.32.
- opencv-contrib-python 4.11.0.86 (`cv2.__version__ = 4.11.0`).
- NumPy 2.2.6, Pillow 12.3.0, SymPy 1.14.0.
- Model Hand Landmarker float16/1 từ Google.
- SHA256 model: `fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1`.

## Đã xác nhận

1. **32 kiểm thử tự động vượt qua** bằng `python -m unittest discover -s tests -v`: chuyển trạng thái pinch, chống rung ngưỡng, chuẩn hóa tọa độ, mất tracking, kéo thả/hoàn tác, hệ số phản ứng, chất giới hạn, nhiệt, khí lý tưởng và các rule khóa.
2. Python compile thành công; các module được định dạng bằng Black.
3. MediaPipe thực sự khởi tạo và xử lý ảnh trống: không trả tay.
4. MediaPipe thực sự xử lý ảnh `woman_hands.jpg` từ notebook mẫu của Google: trả 21 landmark cho một bàn tay trong cấu hình `num_hands=1`.
5. Kiểm tra một vòng `app.main()` với ảnh tham chiếu: đi qua tracker thật, input, scene, render và ghi JSONL. Nguồn camera và cửa sổ được thay bằng test double vì môi trường không có camera/display thực.
6. Dựng và kiểm tra trực quan UI tỉ lệ 3:7, 1:1; kích thước mặc định và cửa sổ nhỏ. Các ảnh `preview*.png` là giao diện minh họa được dựng bằng chính renderer, không phải ảnh webcam.
7. `chemistry_demo.py` trả ξ=0,005 mol; Q=286,5 J; nhiệt độ cuối xấp xỉ 298,8354 K trong các giả thiết đã khai báo.

## Cần kiểm tra trên máy đích

- Chạy cửa sổ OpenCV và cấp quyền webcam trên Windows.
- Đo FPS, độ trễ đầu-cuối, tỉ lệ tracking thành công khi có tay thật di chuyển.
- Thử nhiều người, ánh sáng, khoảng cách, kích thước bàn tay và che khuất.
- Thẩm định phản ứng, phạm vi mô hình và rubric với giáo viên hóa học.
- Thu dữ liệu thật để đánh giá đóng góp thuật toán và hiệu quả học tập.

Không suy ra từ 32 test rằng CV chính xác 100%, mô hình an toàn đầy đủ hoặc học sinh học tốt hơn. Mã sample chưa tích hợp rót/lắc và phản ứng vào giao diện; bảng trạng thái trong README là phạm vi nghiệm thu của gói.
