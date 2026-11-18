# Kiểm chứng HoloLab AR V3.3 — 27/10/2026

## Kết luận

P0 đạt các kịch bản tự động đã chạy: thả/rơi/gắp lại, ném nhanh được giới hạn, chạm giữa hai bình, bốn mép, đáy collider đã xoay, mất tracking tạm thời, frame treo và phục hồi lỗi. Không sử dụng CSS để che lỗi vật lý, không vô hiệu hóa va chạm.

**Chưa nghiệm thu bằng webcam vật lý và người thật. Không xác nhận 50 FPS/50 Hz hoặc tỷ lệ gắp 9/10 trên máy RTX 2070/i5 của người dùng.** Các số sau là đo trực tiếp trên môi trường kiểm thử được mô tả, không suy rộng thành kết quả phần cứng thật.

## Nguyên nhân / file sửa

| Lỗi | Nguyên nhân có bằng chứng trong V3.2 | Bản sửa |
|---|---|---|
| Bình văng xa khi thả | Vận tốc theo thời gian mô phỏng bị cap dt, cap ném 1,2 m/s lớn với bàn nhỏ | `physics.js:release`, `step`; `main.js:tick`: realDt, EMA 40 ms, gain 0,55, cap 0,40 m/s; xóa quán tính khi freeze/frame >150 ms |
| Bình bị chạm bắn mạnh | Kinematic lerp mục tiêu không cap tịnh tiến/góc, có thể đi sâu vào vật khác | `physics.js:safeHeldMotion`: cap 0,75 m/s, gần vật khác 0,14 m/s, cast/contact Rapier và cap góc |
| Trượt/nảy/khó nghỉ | Ma sát/damping thấp, đàn hồi hơi lớn; điều kiện ngủ cần tách vận tốc bù gravity | `physics.js`: bàn/dụng cụ friction 0,82/0,75; restitution 0,02; damping 1,1/2,4; ngủ theo chuyển động thực và cache bounds |
| Biến mất ngoài khung | Chỉ có bàn hữu hạn, không thành chắn; clamp màn hình không kiểm soát dynamic | `physics.js:setWorkspace`, `guardWorkspace`, `recover`; `render3d.js:updateWorkspace`: bốn biên + trần, full collider, phục hồi khi lỗi |

Vị trí dòng nguồn V3.2, đơn vị SI, thông số và giải thích đầy đủ: `docs/V33_STABILITY.md`. Diff: `PATCH_V32_TO_V33.diff`.

File UI/3D: `web/index.html`, `web/styles.css`, `web/src/main.js`, `render3d.js`, `environment.js`, `vessel-details.js` (mới), font WOFF2 local có OFL. Cập nhật nhãn phiên bản trong `server.py`, `START_WINDOWS.bat`, `package.json`/lock; thêm test/QA/tài liệu. **33 file CV/cử chỉ/camera/chuẩn độ/hóa học giữ nguyên byte**, danh sách và SHA256 trong `preserved_modules.json`. Model/WASM/vendor cũ không sửa.

## Trước và sau

| Hạng mục | V3.2 | V3.3 |
|---|---|---|
| Gắp/giữ/hai tay | Hoạt động, giữ nguyên nhận diện | Giữ FSM/threshold/bộ lọc/ownership; chỉ hạn chế tốc độ nguy hiểm |
| Release | Có gravity nhưng ném tối đa 1,2 m/s | Dynamic gravity và quán tính nhẹ tối đa 0,40 m/s |
| Va chạm kinematic | Không giới hạn tốc độ mục tiêu | Giới hạn tịnh tiến/góc + sweep/contact, vẫn có đẩy/nhích |
| Biên bàn | Có thể rơi khỏi mép rồi ra ngoài hình | Bốn thành + trần theo góc thao tác, cả held/dynamic |
| Typography | Chữ nhỏ, nhiều thông số lộ ra | Be Vietnam Pro, chữ chính 14 px, phụ 12–13 px, thu gọn debug |
| Dụng cụ | Biên dạng cơ bản | PBR, miệng rót/rim, nhãn, vạch thể tích theo tích phân mức cũ, bóng tiếp xúc, chi tiết rack/thiết bị |
| Camera/model | HD mặc định, CV640 | Giữ nguyên; đã kiểm tra intrinsic stream và đầu vào Worker |
| Hóa học/chuẩn độ | Chức năng cũ | Hồi quy đạt, không mở rộng logic |

## Kết quả kiểm thử

- **63/63 JS**: `unit_tests.tap`. Trong đó giữ 60 lần thả (20 mỗi beaker/flask/tube), kiểm tra rate 30/60/144 Hz, tracking freeze/frame stall, fault recovery và 9 kịch bản P0.
- **90/90 Python**: `python_tests.txt`, lõi hóa học/mixture/hazard/session và các kiểm tra desktop lịch sử.
- **12/12 kiểm tra trình duyệt**: `browser_checks.json`. Chạy app thật với Rapier/WASM local; có 20 chu kỳ gắp–thả/gắp lại mesh thật, chuột release handler; hai tay/FSM bằng landmarks synthetic; kiểm tra chất lượng camera, mirror/aspect, font, PBR, giữ pivot/ID/collider, vạch chia khớp bộ tính mức chất lỏng; không page error, không tải dependency ngoài.
- **5/5 hồi quy trình duyệt**: `regression_checks.json`: lưu/mở và input lỗi, guided safety lockout không đổi lượng, free hazard qualitative effects, OrbitControls tách chế độ, thư viện 100 phản ứng.
- **9/9 P0 trước/sau**: `physics_p0.json`; đối chiếu cùng chương trình với `physics_baseline_v32.json` (V3.2 đạt 4/9 tiêu chí mới). Đây là chương trình điều khiển body/mục tiêu, không phải thử tay thật.
- **60 giây thời gian thực không tương tác**: 4 bình trong benchmark sau warmup có drift=0 scene unit và đều sleeping; bình thứ năm nhận mục tiêu điều khiển bằng code.

| Đại lượng trong test | V3.2 | V3.3 |
|---|---:|---:|
| Bước nhảy mục tiêu, tốc độ body held (fixture) | 17,008 m/s | 0,750 m/s |
| Release nhanh (fixture) | 1,200 m/s | 0,400 m/s |
| Đỉnh ngang của bình bị chạm nhanh (fixture) | 5,398 m/s | 0,087 m/s |
| Đỉnh ngang khi chạm nhanh trên mesh sản phẩm | Chưa đo kịch bản mesh cũ riêng | 0.145 m/s |
| Vượt bốn biên trong kịch bản mesh sản phẩm | Chưa có biên | 0.000 scene unit |
| Vượt khung hình từ 8 góc AABB collider | Chưa đo | 0.000 px |
| Safety recovery trong kịch bản thường | Chưa có | 0 lần |
| Fault injection riêng | Chưa có | Phục hồi đúng; không tính vào kịch bản thường |

Dung sai kiểm tra xuyên là 0,005 scene unit = 0,5 mm; 60 lần thả và 20 lần trên mesh sản phẩm ghi nhận penetration=0 theo support đã đo. Test chạm nhanh fixture ghi nhận lớn nhất khoảng 0,000896 scene unit ≈0,090 mm, dưới dung sai. Đây là mô phỏng số, không khẳng định collider có sai số tuyệt đối bằng 0 trong mọi tình huống. Độ sâu dưới mặt phẳng bàn khi V3.2 bay ra ngoài bàn không được gọi là xuyên mặt bàn.

## Benchmark 60 giây: cùng host, chạy nối tiếp

Chromium 134 headless, **SwiftShader GPU phần mềm + WebCPU MediaPipe**. Camera giả lập Y4M từ một ảnh bàn tay tĩnh 1280×720@30; không phải webcam hay chuỗi chuyển động thật. Viewport 1366×900; hộp workspace 1024×420, canvas 1022×418; DPR1 cố định; 5 stock giống nhau, 4 dynamic yên và 1 held di chuyển bằng code. Tắt auto camera và cố định chất lượng render chuẩn để so sánh.

| Chỉ số | V3.2 | V3.3 |
|---|---:|---:|
| Thời gian | 60.02 s | 60.00 s |
| Render FPS | 32.84 | 30.98 |
| Tracking Hz | 2.95 | 3.00 |
| CPU tổng vòng render trung bình | 1.36 ms | 2.56 ms |
| CPU vật lý trung bình | 0.45 ms | 1.18 ms |
| Inference trung bình | 145.84 ms | 137.36 ms |
| Độ tuổi mẫu p95 | 394.40 ms | 378.80 ms |
| Mẫu có tay / mẫu xử lý | 177/177 | 180/180 |

**Render FPS giảm khoảng 5.7% trong lượt đo này. Không đạt 45/50 FPS hoặc 50 Hz tracking trong môi trường này.** Cảnh có thêm vật lý/đồ họa nên có chi phí. Một cặp phép đo không chứng minh ý nghĩa thống kê hoặc dự đoán phần cứng người dùng. Không công bố phát hiện tay 100% ảnh tĩnh thành độ chính xác cử chỉ 100%. Độ tuổi mẫu không phải độ trễ chuyển động đầu-cuối.

Đã tối ưu sau khi đo phát hiện CPU vật lý cao: cache bounds và điều kiện sleeping, giảm CPU từ 11 ms về khoảng 1,18 ms/frame ở cấu hình cuối. Thủy tinh culling mặt khuất, clearcoat=0, không có transmission/shadow-map/postprocess. Có chất lượng tự động từ bản cũ, nhưng benchmark cố định DPR1 để không che chi phí bằng cách hạ resolution. Cần đo lại 60 giây trên RTX 2070; máy yếu dùng chất lượng tự động, ảnh CV640 và HD trước.

## Camera

QA xác nhận HD track/video=1280×720@30, **kết quả Worker báo input=640×360**, preview contain/mirror. Low cấp 640×480; Full HD không được fixture này hỗ trợ nên fallback HD có thông báo. Chưa đánh giá cải thiện quang học hoặc độ chính xác khi tay thật nhanh/chậm. Không thay code camera/CV ở V3.3, không tăng model input mù quáng.

## Hạn chế / hướng kiểm tra tiếp

1. Chưa có webcam vật lý/người thử trong môi trường này: cần 20 lần gắp–thả mỗi tay, tay giao nhau và camera mất dấu trên máy mục tiêu; xuất benchmark JSON.
2. Chưa đạt 50 FPS/50 Hz trong GPU phần mềm. Chi phí vật lý tăng tuyệt đối khoảng 0,73 ms/frame; cần đo GPU thật để quyết định có giảm DPR/chi tiết thêm. Không thay model/thuật toán nhận diện chỉ để tăng số FPS.
3. Glass là PBR alpha, không khúc xạ chất lỏng chính xác. Collider convex đặc chưa hỗ trợ lồng vật vào lòng bình; shadow là contact cue mềm.
4. Biên bảo đảm ở góc camera thao tác mặc định. Người dùng có thể tự xoay/zoom Orbit để vật ra khỏi khung quan sát; khi đó vật vẫn nằm trong vùng vật lý. Resize khi cầm hoãn cập nhật vùng để tránh teleport.
5. Rack/pH/stirrer/hộp trang trí không có collider/chức năng mới. Trạm pH chuẩn độ cũ hoạt động; chưa thêm khuấy thật hay vỡ bình/tràn chất lỏng.
6. Giới hạn tốc độ sẽ hạn chế cử chỉ rất nhanh, đặc biệt khi chạm vật khác. Cần đánh giá cảm giác thao tác thật, không suy ra độ mượt từ test synthetic.

## Mở gói và xem mã

Đọc README.md để chạy Windows/Linux. ZIP chứa source, dependency/model offline, giấy phép, diff, hướng dẫn và log ở validation_v33. Script package kiểm tra manifest/CRC và root server.py; kết quả kiểm tra gói giải nén nằm ở package_check.json khi bàn giao. Không có ảnh người dùng, video fixture, node_modules hay screenshot nội bộ trong ZIP.
