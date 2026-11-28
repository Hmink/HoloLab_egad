# Kiểm tra bản 2.1 — 26/10/2026

## Những gì đã chạy

- **85 kiểm thử tự động đạt** qua `python -m unittest discover -s tests -q`. Bao gồm 57 kiểm thử cũ và 28 kiểm thử bổ sung.
- Các trace tổng hợp mới kiểm tra: tay phải nhỏ hơn tay trái, đảo thứ tự kết quả nhận diện, mất dấu ngắn/dài, trở lại ở tọa độ khác không làm bình nhảy, mở tay nhiễu một khung, lặp cùng mẫu không hoàn tất debounce, tay rất nhỏ, thay đổi tỉ lệ khoảng cách, điều khiển toàn màn hình từ vùng giữa camera, hiệu chỉnh, bảo toàn vật thể mới/cũ và dừng rót khi mất tọa độ hợp lệ.
- Kiểm tra cả chuỗi HandInput → Scene bằng điểm tay tổng hợp ở tỉ lệ nhỏ: gắp từ kho, kéo qua bàn, mất dấu ngắn và hết thời gian giữ. Vật thể không mất.
- Quy tắc nguy cơ: chiều thêm nước/axit, HNO₃ và HCl riêng, không tự kích hoạt sự cố với bình rỗng/cùng loại axit, không bịa lượng sản phẩm hay nhiệt độ; chặn nguyên tử trong chế độ hướng dẫn.
- Bộ đệm chữ tiếng Việt so với Pillow trước tối ưu trùng pixel ở mẫu kiểm tra. Chuyển premultiplied alpha bằng Pillow so với đường NumPy cũ sai khác tối đa 1/255 trong kiểm tra ngẫu nhiên.
- Đã chạy `app.main` **70 khung** với MediaPipe thật, model thật, OpenGL thật và ảnh hai bàn tay của ví dụ Google. Camera và cửa sổ được giả lập. Chọn tay phải/trái, đổi vùng điều khiển, dọn bàn và ghi JSONL được thực thi. Lần chạy sau tối ưu có 59/70 khung điều khiển hợp lệ; phần còn lại gồm khởi tạo/đổi tay. Đây không phải độ chính xác nhận diện hay kết quả người dùng.
- Dựng và xem ảnh 1280×800 ở split 3:7 và 1:1, kiểm tra chữ Việt, menu axit, khung điều khiển và thông báo. Sáu loại hiệu ứng đều chạy qua renderer. Ảnh `preview_21.png`, `preview_acid21.png`, `preview_fire21.png`, `preview_split21.png` được dựng từ mã.

## Kiểm tra chi phí vẽ riêng

Cùng Linux / Mesa llvmpipe, cửa sổ 1280×800, bàn 5 vật thể (có kết tủa), video đầu vào đen 1280×720, một vật thể di chuyển mỗi khung. Mỗi bản khởi động 5 khung rồi đo 60 khung liên tiếp, chạy lần lượt. Không chạy MediaPipe trong phép đo này.

| Chỉ số | Mã v2.0 trong ZIP gốc | Mã v2.1 |
|---|---:|---:|
| Trung vị thời gian vẽ | 78.08 ms | 39.73 ms |
| Phân vị 95 theo mẫu đo | 89.65 ms | 48.56 ms |

Kết quả mô tả một lần đo kỹ thuật trong môi trường kiểm tra. Không phải FPS webcam thật, độ trễ đầu-cuối, kiểm định thống kê hay bằng chứng hiệu quả học tập; không cam kết tốc độ Windows.

## Môi trường và giới hạn

Python 3.12.14, NumPy 2.2.6, OpenCV contrib 4.11.0.86, MediaPipe 0.10.32, Pillow 12.3.0, ModernGL 5.12.0, SymPy 1.14.0. OpenGL: llvmpipe (LLVM 20.1.2, 256 bits).

Model SHA-256: `fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1`. Ảnh QA của Google không đóng gói vào sản phẩm.

Chưa chạy webcam vật lý, Windows cmd.exe/BAT, GPU Windows, các điều kiện ánh sáng thật hay nhiều học sinh. Bàn tay bị cắt khỏi ảnh không thể được theo dõi thật; cơ chế phục hồi chỉ giữ vật thể và bắt lại khi tay xuất hiện. Nhãn trái/phải có thể sai hoặc không chắc khi tay chồng lên nhau; chương trình ưu tiên tạm dừng.

Mô hình nguy hiểm không tính động học, áp suất hay sức nổ. Tình huống bình kín là sơ đồ nguy cơ, không mô phỏng đường dẫn rót qua một nắp kín. Thể tích và lượng chất của các phản ứng loãng không được áp dụng cho axit đặc.

`VALIDATION_v2_0.md` và `VALIDATION_v1.md` là lịch sử của các bản trước, không phải kết quả mới. Cần phản hồi kiểm tra thật của người dùng trước khi coi bản này là hoàn thiện hoặc đưa số liệu vào báo cáo KHKT.
