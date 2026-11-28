# HoloLab AR V3.1 — kiến trúc và giới hạn nghiệm thu

## Phạm vi cập nhật
Giữ lõi hóa học Python, kho/mẫu thí nghiệm và controller hai tay V3.0. Thay bố cục video nền bằng camera gương nhỏ ở trên; phía dưới là phòng 3D. Môi trường hình học do dự án tạo, chỉ tham khảo bố cục ảnh người dùng; không sử dụng texture, logo hay tài sản Labster.

Ba miền mô phỏng được phân biệt rõ:
1. Bàn tự do: cơ chế gắp/kéo/rót và hóa học V3.0 giữ nguyên.
2. Trạm chuẩn độ: thiết bị cố định, van điều khiển bằng chụm + xoay cổ tay; có thanh Van và liều 0,05 mL bằng chuột. Buret, bình nhận và pH meter nằm trong cảnh 3D. Không hỗ trợ tháo/rót tự do từ kho vào trạm trong bản này. Trở về bàn tự do sẽ thấy nguyên các bình trước đó.
3. Thư viện 100 phương trình: chọn phương trình, nhập số mol, xác nhận điều kiện, tính chất giới hạn/sản phẩm/lượng dư. Không phải 100 thí nghiệm 3D tự do hay 100 cơ chế động học. Không tự nhận biết mọi phản ứng có thể xảy ra giữa các hóa chất bất kỳ.

## Module
| Tệp | Trách nhiệm |
|---|---|
| `web/index.html`, `styles.css` | Camera trên, phòng 3D dưới, sidebar thu gọn, bảng pH và thư viện |
| `capture.js` | requestVideoFrameCallback, loại frame trùng, một inference đang chạy, chuyển frame sang Worker |
| `hand-worker.js` | MediaPipe HandLandmarker VIDEO, hai tay, WebGL GPU nếu dùng được, CPU dự phòng |
| `tracks.js`, `filters.js`, `interaction.js` | ID ổn định, chuẩn hóa pinch, hysteresis, One Euro, giữ quyền điều khiển |
| `render3d.js`, `environment.js` | Three.js, vật liệu và hình học tái sử dụng; phòng, buret, van, pH meter |
| `bench.js` | Controller trạm, quyền giữ van độc lập, đóng khi mất dấu/ẩn tab, giao diện đo |
| `titration.js` | pH axit mạnh/axit yếu, dung tích buret, thể tích và lịch sử |
| `reaction-engine.js`, `reaction-ui.js` | Kiểm tra nguyên tố, tính tỉ lượng, UI thư viện |
| `web/data/reactions100.json` | 100 phương trình phân tử, hệ số, điều kiện, hiện tượng, nguy cơ, giới hạn |
| `server.py`, `lab3d/*`, `chemlab/*` | HTTP local và hóa học bàn tự do; desktop `app.py` vẫn là phiên bản cũ |
| `metrics.js` | Render FPS, tracking Hz, tuổi mẫu và benchmark 60 giây |

## Vòng lặp và hiệu năng
- Render vẫn chạy bằng requestAnimationFrame. Không gọi inference trên main thread.
- Worker có một yêu cầu đang xử lý, không xếp hàng ảnh camera. Bỏ frame trung gian để không tích lũy trễ.
- Media timestamp ngăn suy luận nhiều lần trên cùng frame. Epoch loại kết quả từ lần bật camera trước.
- Giới hạn gửi tăng từ 30 lên 60 Hz. Webcam được yêu cầu 640×480, 60 FPS ở mức `ideal`, không ép camera phải hỗ trợ. Video thực tế 30 FPS không thể tạo 50 lần nhận diện độc lập mỗi giây.
- Mặc định giảm chiều rộng inference 960→640, giữ đúng tỷ lệ và toàn bộ FOV. Có chọn 960 cho tay xa/nhỏ; thay đổi này cần đo độ chính xác thực tế, không coi là tối ưu miễn phí.
- GPU vẫn là MediaPipe WebGL, không phải yêu cầu card NVIDIA/CUDA. GPU quá chậm trong AUTO có đường CPU dự phòng. Web Worker tăng khả năng phản hồi của giao diện, không tự làm model nhanh hơn.
- Cảnh phòng dùng mesh tĩnh, không shadow map, không phản xạ động, không hậu kỳ. Hình học và texture chữ được tạo khi khởi tạo. Mức chất lỏng buret cập nhật scale, không tái tạo geometry từng frame.
- pH meter chỉ tải lại texture khi chữ thay đổi. DOM và đồ thị chuẩn độ cập nhật tối đa 10 Hz, tính toán trạng thái và màu theo vòng render.
- DPR tự giảm khi FPS dưới 50; không hạ ngưỡng confidence để làm đẹp số FPS.
- Mục tiêu `target_render_50` và `target_tracking_50` độc lập trong JSON đo. Tuổi mẫu không phải độ trễ chuyển động đầu-cuối.

## Phương trình pH
Thể tích cộng được, dung dịch lý tưởng, 25 °C, Kw = 10^-14; không tính hệ số hoạt độ, nhiệt, mất CO₂ hay trễ trộn.

Axit mạnh đơn nấc (HCl/HNO3), bazơ mạnh (NaOH/KOH):
D = (n_acid - n_base) / V_total; [H+] - Kw/[H+] = D.
Giải bậc hai, dùng dạng tránh triệt tiêu số học khi bazơ dư. Vì có Kw, pH không phân kỳ ở điểm tương đương.

CH3COOH (Ka = 1,8×10^-5): giải cân bằng điện tích
[H+] + C_base - Kw/[H+] - C_acid Ka/(Ka+[H+]) = 0
bằng chia đôi theo pH trong [-1,15]. Một mô hình liên tục cho trước, tại và sau điểm tương đương; không dùng Henderson–Hasselbalch sai tại điểm đầu/cuối.

Phenolphthalein đổi màu bằng nội suy hiển thị ở pH 8,2–10. Đây là ánh xạ trực quan, không phải phổ hấp thụ định lượng. Điểm kết thúc màu không được đánh đồng với điểm tương đương.

## Cơ sở 100 phản ứng
20 axit–bazơ, 25 kết tủa, 15 thế kim loại, 15 oxit bazơ, 10 phân hủy, 10 axit–cacbonat, 5 oxit axit.
Có những phương trình phân tử khác nhau dùng chung một phản ứng ion rút gọn; **không tuyên bố 100 cơ chế hóa học độc lập**.

Extent = min(n_i / coefficient_i). Sản phẩm lý thuyết = extent × hệ số. Lượng dư luôn không âm. Thiếu chất → không có phản ứng theo phương trình; sai tỉ lệ → chất dư. Chất ngoài phương trình → không hỗ trợ, không tự gán an toàn. Cần nhiệt nhưng chưa xác nhận → không tính sản phẩm.

Kiểm tra nguyên tố là điều kiện cần, không chứng minh phản ứng thực xảy ra. Dữ liệu có điều kiện và cảnh báo riêng với kết tủa lưỡng tính, trung hòa nhiều nấc, CO₂ dư. Nguồn OpenStax dùng cho nguyên tắc và các ví dụ, không phải nguồn xác nhận riêng từng dòng. Bộ dữ liệu cần giáo viên hóa học rà soát trước sử dụng đánh giá chính thức. Không có Ksp/kinetics/yield đo thực nghiệm cho 100 dòng.

## Kiểm thử và nghiệm thu trên thiết bị người dùng
- Unit: `npm test` (chỉ cần Node nếu chạy test, không cần cho người dùng chạy app).
- Python: `PYTHONPATH=python_vendor python3 -m unittest discover -s tests` trên Linux; test desktop cần OpenCV/Pillow, Web server không cần.
- Trình duyệt: `tools/qa_v31.mjs`, dùng Playwright 1.51.1 và biến `PLAYWRIGHT_PACKAGE`, `CAMERA_FIXTURE` (Y4M). Chạy model thật trên ảnh tham khảo lặp; thao tác van dùng landmarks giả lập.
- Đo 60 giây trong UI trên máy i5-5200U/HD5500: ghi camera settings, backend, inference size, render FPS và tracking Hz. Thử cả Web GPU và Web CPU. Không suy diễn hiệu suất máy người dùng từ máy kiểm thử.
- Thử 10 lần gắp mỗi tay, giao nhau, một tay gần/một tay xa, mép khung, mất dấu, mở/đóng van. Đo latency đầu-cuối bằng video tốc độ cao nếu cần tuyên bố “không trễ”.

## Tài liệu nền
- Google MediaPipe Hand Landmarker Web: https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js
- OpenStax Chemistry 2e 14.7: https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations
- OpenStax Chemistry 2e 4.2: https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions
- One Euro filter: https://gery.casiez.net/1euro/
