# V3.1 — kiểm thử ngày 27/10/2026

## Kết quả thực hiện
- **37/37 JavaScript tests pass**: controller hai tay cũ, scheduler không trùng frame/không queue, 100 phương trình cân bằng, bảo toàn nguyên tố khi chất giới hạn khác nhau, các ví dụ pH chuẩn độ OpenStax, tham số sai và dung tích buret.
- **90/90 Python tests pass**: lõi hóa học/API và regression desktop cũ. Đã cài OpenCV để chạy test desktop; SymPy dùng bản đi kèm.
- **14 kiểm tra browser V3.1 pass**, không lỗi JavaScript: sidebar, kéo bình, chuẩn độ, van từ pose giả lập, mất tracking, pH, chỉ thị, mẫu axit yếu, thư viện, trở lại bàn cũ, bố cục camera trên, model MediaPipe thật trên ảnh lặp, benchmark, dừng camera.
- **9 kiểm tra hồi quy browser pass**: raycast/gắp hai tay độc lập, giữ qua dropout, góc xoay/nắp, lưu/mở atomic, trung hòa HTTP, chặn nguy cơ, hiệu ứng tự do, OrbitControls và resize. Xem `regression_checks.json`.
- So sánh byte với ZIP V3.0: **20/20 tệp lõi chemlab/lab3d/data giữ nguyên**.
- Xem `validation_v31/` để lấy log, JSON đo và SHA256 của mã đã đo. Ảnh chụp kiểm tra UI không đóng gói.

## Benchmark cuối — 60 giây
Môi trường: Linux, Chromium headless 134, WebGL SwiftShader (GPU phần mềm), MediaPipe Web CPU. Cảnh chuẩn độ mở, cửa sổ 1280×720, camera giả lập bằng ảnh hai bàn tay lặp ở 30 FPS. Đây không phải video cử chỉ thật và không phải Dell i5-5200U/HD5500.

| Chỉ số | Đo được |
|---|---:|
| Thời gian | 60.011 s |
| FPS render trung bình | 53.67 |
| Tracking | 5.43 Hz |
| Inference trung bình | 128.30 ms |
| Tuổi mẫu p95 | 232.50 ms |
| Khoảng cách frame render p95 | 33.30 ms |
| Mẫu có bàn tay | 326/326 |

**Render trung bình ≥50 FPS trong lần đo này. Tracking 50 Hz: KHÔNG ĐẠT. “Gần như không trễ”: CHƯA ĐẠT/CHƯA ĐƯỢC CHỨNG MINH.** Khoảng frame p95 cho thấy vẫn có frame chậm. Không dùng FPS render để che tốc độ nhận diện thấp.

Nguyên nhân quan sát: inference CPU trung bình khoảng 128 ms, môi trường không có GPU phần cứng. Worker giữ giao diện phản hồi nhưng không giảm thời gian chạy model xuống 20 ms. Camera fixture 30 FPS cũng không thể cung cấp 50 ảnh độc lập mỗi giây.

Lần đo trước khi hoàn tất điều chỉnh hình học/UI đạt khoảng 59,69 FPS / 6,62 Hz; không dùng số đó làm kết quả cuối. Không so trực tiếp V3.0 và V3.1 để tuyên bố cải thiện tracking vì cảnh và cấu hình ảnh khác nhau.

## Chưa nghiệm thu
- Webcam thật, Windows, Intel HD5500 và GPU delegate trên thiết bị người dùng.
- Độ chính xác gắp 9/10 mỗi tay, che khuất/giao tay trong video chuyển động thật.
- Độ trễ đầu-cuối từ bàn tay thật đến vật thể; tuổi mẫu không thay thế phép đo này.
- Độ chân thực như Labster: cảnh hiện là low-poly, không CFD/phản xạ vật lý.
- Buret/bình trạm là thiết bị cố định; chưa nạp thuốc thử từ kho bằng kéo/rót tự do.
- 100 phương trình dùng tính tỉ lượng ở thư viện; không phải 100 phản ứng rót 3D đầy đủ. Không có cân bằng Ksp/động học/phản ứng cạnh tranh.
- Lượng phản ứng từ 100 phương trình là giới hạn lý thuyết theo điều kiện; cân bằng nguyên tố không đủ xác nhận mọi điều kiện thực nghiệm. Cần giáo viên duyệt dữ liệu trước đánh giá chính thức.

## Hướng nghiệm thu tiếp theo
Dùng benchmark 60 giây trên máy đích với Web GPU và Web CPU, ảnh 640 và 960, một tay và hai tay. Lưu thông số camera thực tế. Chỉ khi tracking thực ≥50 Hz, độ trễ và độ chính xác đạt mới được công bố đáp ứng yêu cầu đó. Giữ bản V3.0 riêng để đối chiếu cùng thiết bị, ánh sáng, cảnh và chuỗi thao tác.
