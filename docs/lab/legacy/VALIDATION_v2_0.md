# Kiểm tra bản 3D 2.0 — 25/10/2026

## Kết quả thực hiện

- **57 kiểm thử tự động đạt**, gồm các kiểm thử cũ và phần 3D: bảo toàn nguyên tố/điện tích khi chuyển và phản ứng; khí thoát được giữ trong sổ lượng chất; chất giới hạn; lượng còn trong nguồn; bình đầy; hỗn hợp chưa biết; chặn/thực hiện tình huống nguy hiểm ảo; ảnh hưởng mất dấu tay; vùng miệng bình; thời gian giữ trước rót; lưu/mở phiên; từ chối dữ liệu không hợp lệ mà không thay phiên đang mở.
- Đã dựng ảnh bằng **OpenGL thật** ở 1440×900, 1280×800 và chia 1:1. Đã xem ảnh để kiểm tra bố cục; đã dựng tất cả loại dụng cụ/chất ở trạng thái xoay, nghiêng và mở/đóng nắp.
- Đã dựng và kiểm tra ảnh rót chất cùng tình huống cháy định tính. `preview_*.png` được tạo từ chính chương trình, không phải ảnh thiết kế hứa hẹn.
- Đã chạy vòng lặp `app.main` 6 khung với MediaPipe thật + mô hình thật + OpenGL thật + ảnh bàn tay tham chiếu. Cả 6 khung nhận được bàn tay và tạo được khung giao diện; nhấn R giả lập dọn bàn đúng; JSONL có bản ghi phiên và 6 bản ghi khung hình.
- Ở kiểm tra trên, **camera và cửa sổ được giả lập**; không có webcam vật lý hoặc phiên GUI Windows.
- Đã kiểm tra trình giải phụ thuộc với `pip --dry-run --ignore-installed --only-binary=:all: --platform win_amd64 --python-version 3.13`. Tìm được wheel cho toàn bộ 23 phân phối cần thiết, bao gồm NumPy 2.2.6, MediaPipe 0.10.32, OpenCV contrib 4.11.0.86, ModernGL 5.12.0 và glcontext 3.0.0. Đây là kiểm tra gói cài đặt, không phải chứng nhận chương trình đã chạy trên Windows.
- Mã Python được định dạng bằng Black. ZIP được kiểm tra CRC, loại bỏ môi trường ảo, cache, mô hình tải về và các tệp QA riêng.

## Môi trường chạy kiểm tra

- Linux, Python 3.12.14.
- NumPy 2.2.6; OpenCV contrib 4.11.0; MediaPipe 0.10.32; Pillow 12.3.0; SymPy 1.14.0.
- ModernGL 5.12.0; glcontext 3.0.0; EGL / Mesa llvmpipe (LLVM 20.1.2, 256 bits).
- Mô hình Hand Landmarker: SHA-256 `fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1`.
- Ảnh kiểm tra bàn tay từ ví dụ chính thức Google: https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/woman_hands.jpg ; không đóng gói ảnh này vào sản phẩm.

## Chưa xác nhận

- Chưa thử webcam thật, driver GPU Windows của người dùng, file BAT qua cmd.exe hoặc chất lượng tương tác nhiều người.
- Không công bố FPS/độ trễ bảo đảm. Có bộ đếm FPS trực tiếp và `--log` để đo trên máy đích.
- Chưa có đánh giá của giáo viên, nghiên cứu hiệu quả học tập hoặc xác minh độ chính xác thực nghiệm toàn bộ dữ liệu.
- Không mô phỏng thủy động học, khúc xạ kính, cân bằng đa phản ứng, động học cháy/nổ, áp suất bình kín hoặc che khuất AR trong không gian thật.
- Đèn cồn và cân mới có hình học 3D; chưa có gia nhiệt và cân bằng dụng cụ.

Chạy lại unit tests: `python -m unittest discover -s tests -v`.
Kiểm tra renderer không mở cửa sổ: `python app.py --snapshot preview_local.png`.
