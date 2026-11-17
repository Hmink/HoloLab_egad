# V3.2 — kết quả kiểm tra ngày 27/10/2026

## Đã kiểm tra
- **51/51 JavaScript tests pass**, gồm các test cũ, physics engine Rapier thật, chuẩn độ/100 phương trình, camera constraints/epoch, và gắp lại bình có hướng ngoài giới hạn góc cũ.
- **90/90 Python tests pass**; hóa học và API cũ giữ nguyên.
- **11 kiểm tra trình duyệt pass**; không lỗi JavaScript, không có dependency runtime từ CDN.
- **5 kiểm tra hồi quy trình duyệt pass**: lưu/mở và chặn JSON sai, khóa nguy cơ, hiệu ứng định tính, OrbitControls, thư viện 100 phương trình.
- **25 tệp được đối chiếu byte giữ nguyên**: bộ lọc, quản lý track, trạm chuẩn độ/mô hình pH, biên dạng và 20 tệp lõi hóa học/dụng cụ/dữ liệu. `interaction.js` chỉ bổ sung hook physics và giữ hướng của bình đã đổ ngoài giới hạn cũ; không thay nhận diện pinch, debounce hoặc bộ lọc.

## Các phép thử vật lý
| Yêu cầu | Cách thử | Kết quả |
|---|---|---|
| Gắp cao rồi thả | Mouse event thật trong browser; body kinematic→dynamic | Rơi; không giữ target cũ |
| Đặt sát bàn | Rapier fixed-step; kiểm tra khoảng đáy collider tới mặt trên | Ổn định, sleep; có thể gắp lại |
| Kéo xuyên bàn khi cầm | Target y rất thấp; nhiều góc quay và scale | Bị chặn theo đáy collider |
| Quán tính lúc thả | Chuỗi di chuyển ngang rồi release | Vận tốc dương, bị chặn ở 1,2 m/s |
| Mất dấu ngắn | Pose hai tay giả lập, frame thiếu landmarks | Giữ kinematic tại chỗ, không thả nhầm |
| Gắp lại bình đã đổ | Giữ roll/pitch ngoài giới hạn cũ, gắp cùng pose | Không tự xoay vào giới hạn cũ |
| Lặp lại ≥20 lần | **60 lượt trong unit**: 20 mỗi loại cốc/bình tam giác/ống nghiệm; **20 lượt trên mesh thật trong browser** | Không phát hiện xuyên bàn theo phép đo collider |
| Rơi nhanh | Tốc độ xuống 15 m/s ở test stress, bàn dày 1,4 cm | Không xuyên bàn với CCD và ràng buộc vận tốc bổ sung |

Unit đo điểm thấp nhất của toàn bộ collider gồm border lồi. Kết quả test lặp: maximum penetration được ghi bằng 0 trong log (không có độ sâu âm được đo ở các bước lấy mẫu); không có nghĩa mọi cấu hình, mọi vật thể hoặc mọi tốc độ đều đã được chứng minh tuyệt đối. Đây là kiểm thử mô phỏng, không phải 20 lượt tay người trước webcam.

## Camera
- Profile Low/HD/Full HD được thử trên **camera giả lập**; getSettings và videoWidth/videoHeight xác nhận kích thước stream được đàm phán. Dữ liệu chi tiết ở `browser_checks.json`.
- Full HD không hỗ trợ có unit test fallback HD; continuous focus chỉ được yêu cầu nếu capability công bố hỗ trợ, giữ nguyên độ phân giải khi chỉnh focus.
- Đã kiểm tra mirror, object-fit contain, truyền đúng aspect của frame, không suy luận frame trùng/không queue; đổi profile loại ảnh epoch cũ. Giữ chính sách resize CV của bản đã hoạt động, không thêm sharpen hoặc đổi màu.
- **Chưa kiểm tra webcam vật lý, chưa có ảnh/video trước–sau trên cùng webcam**, chưa xác nhận chất lượng quang học, motion blur hoặc độ chính xác pinch của người dùng. Ảnh tham khảo lặp không kiểm chứng nhận diện tay chuyển động nhanh/chậm.

## Benchmark 60 giây, cùng đầu vào HD
Linux / Chromium headless 134 / WebGL SwiftShader, MediaPipe Web CPU. Fixture Y4M 1280×720, 30 FPS, ảnh bàn tay tham khảo tĩnh lặp; input CV 640 px; viewport 1366×900; DPR 1; 5 dụng cụ, một mục tiêu được di chuyển bằng mã. V3.1 được yêu cầu HD bằng applyConstraints để đối chiếu. V3.2 có 4 body dynamic và 1 body kinematic; đây không phải camera hay cử chỉ người thật.

| Chỉ số | V3.1 đối chiếu | V3.2 bản vá |
|---|---:|---:|
| Thời gian đo | 60.023 s | 60.013 s |
| Render FPS trung bình | 29.37 | 29.94 |
| Khoảng render p95 | 216.60 ms | 200.00 ms |
| Tracking Hz | 2.27 | 2.48 |
| Inference trung bình | 179.27 ms | 170.85 ms |
| Tuổi mẫu p95 | 553.10 ms | 485.60 ms |
| Mẫu có tay / tổng mẫu | 136 / 136 | 149 / 149 |
| CPU physics trung bình / frame | — | 0.434 ms |
| CPU physics p95 / frame | — | 1.200 ms |

Hai lần đo tuần tự là đối chiếu sơ bộ, không phải kết luận thống kê hay cam kết cho máy người dùng. Hình học bàn giống nhau; vị trí vật thể trên V3.2 thay đổi bởi physics. Không lấy số này để so trực tiếp với lần đo V3.1 cũ 53,67 FPS vốn dùng cảnh/fixture khác.

Trong lần đo này không thấy FPS trung bình giảm so với V3.1 cùng HD, nhưng **chưa đạt 50 FPS hoặc tracking 50 Hz ở môi trường CPU giả lập**. Camera giả lập 30 FPS không cung cấp 50 ảnh mới/giây. Tuổi mẫu không phải độ trễ đầu-cuối của tay thật.

## Chưa nghiệm thu trên máy người dùng
- Windows, webcam thật, GPU delegate trên RTX 2070/HD5500; FPS/latency thực và tốc độ nhận diện nhanh/chậm.
- 20 lượt thao tác tay thật (bản đã làm kiểm thử tự động tương ứng, cần người dùng xác nhận cảm giác thực tế).
- Collider rỗng, vỡ kính, đổ tràn do bình ngã, va chạm với vật trang trí, kiểm định khối lượng/thể tích cơ học: ngoài phạm vi bản vá.
- Nếu kéo/ném ra ngoài mép bàn hữu hạn, vật thể có thể rơi khỏi bàn; không có cơ chế tự đưa về chỗ cũ.

## Kiểm tra trên máy đích
1. Giải nén bản mới vào thư mục mới, chạy `START_WINDOWS.bat`. Bật camera, kiểm tra dòng kích thước thực bên cạnh menu.
2. Thử HD với Tự giảm khi tải cao bật. Đối chiếu Low/HD/FHD với tự giảm tắt, cùng ánh sáng và khoảng cách tay. Nếu FHD không được cấp, đọc thông báo fallback thay vì tin vào tên menu.
3. Gắp cao/thấp, thả, kéo xuống bàn, thả khi đang di chuyển, gắp lại, mất dấu ngắn. Lặp 20 lần; thử cả hai tay.
4. Với mỗi profile, **Đo 60 giây → Xuất kết quả**. File ghi thông số stream, render FPS, tracking Hz, CPU physics và tuổi mẫu. Nên đo 3 lần cho mỗi cấu hình.
5. Nếu vẫn mờ, kiểm tra lấy nét, ánh sáng trước mặt, độ sạch kính; phần mềm không sửa hoàn toàn webcam mất nét quang học.

## Tái lập kiểm thử tự động
- `npm test` dùng Node, Rapier và Three đã bundle; không cần webcam.
- Python regression: `PYTHONPATH=python_vendor python3 -m unittest discover -s tests`; test desktop cần OpenCV/Pillow trong môi trường phát triển.
- Browser QA cần Playwright 1.51.1 và Chromium, không đi kèm trình duyệt trong ZIP. Dùng `tools/qa_v32.mjs`, `CAMERA_FIXTURE` trỏ tới Y4M, `PLAYWRIGHT_PACKAGE` nếu cài ở ngoài dự án. `BENCHMARK=0` bỏ phần đo 60 s. Các script dùng Python 3 theo máy host, có thể chọn bằng biến `PYTHON`.
- Fixture tạo từ https://storage.googleapis.com/mediapipe-assets/woman_hands.jpg với ffmpeg: scale 1280:720, pix_fmt yuv420p, 30 FPS. Dữ liệu này không phải video chuyển động và không được đóng gói thành dữ liệu thực nghiệm người dùng.
- `tools/benchmark_baseline_v32.mjs` nhận `BASELINE_PROJECT` là thư mục V3.1 cũ, `BASELINE_OUTPUT` là file JSON đích; chạy tuần tự sau/before V3.2, không chạy song song khi so FPS.
