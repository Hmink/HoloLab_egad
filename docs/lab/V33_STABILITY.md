# V3.3 — Chống văng vật thể, giới hạn bàn và hoàn thiện hiển thị

## 1. Phạm vi và bằng chứng nguyên nhân

Đối chiếu trực tiếp ZIP V3.2 đã bàn giao (SHA256 `054ee59eaa14dd8571f0e87112ff86619ac6bc09f9c6009af028f8470d124e77`). Các số dòng V3.2 sau đây thuộc nguồn gốc đó, không phải nguồn V3.3 đã định dạng lại.

| Vấn đề | Bằng chứng V3.2 | Cách xử lý V3.3 |
|---|---|---|
| Bình bị ném xa | `web/src/physics.js:209` release lấy quãng đường / thời gian mô phỏng, clamp 12 scene unit/s rồi đổi sang 1,2 m/s. Không có gain để điều chỉnh mức ném theo bàn nhỏ. | Lấy vận tốc từ body thực sau bước mô phỏng theo thời gian frame thực; EMA 40 ms, gain 0,55, cap 0,40 m/s. Không áp thêm impulse. |
| Lỗi sau FPS thấp/treo frame | `main.js:607` giới hạn dt 0,1 s; `physics.js:400` cũng giới hạn dt, nhưng lịch sử dùng `this.time` mô phỏng. | Truyền realDt riêng vào vật lý. Thời gian tích phân vẫn cap; thời gian ước lượng vận tốc không bị cap. Khoảng frame >150 ms hoặc tracking freeze xóa vận tốc ném. Các frame render không có substep được cộng dồn thời gian. |
| Bình khác bị bắn khi chạm | `physics.js:410`–417 lerp mục tiêu với tau 25 ms rồi gọi `setNextKinematicTranslation`, không cap tốc độ góc/tịnh tiến. Kinematic không có khối lượng hữu hạn để giảm lực khi người điều khiển kéo xuyên vật khác. | Giữ tau cũ; cap tốc độ, giảm tốc khi gần bình khác, `castShape` chặn dịch chuyển xuyên vào collider và `contactShape` kiểm tra góc xoay. Cho phép tiếp xúc nhẹ để bình kia vẫn có thể nhích/nghiêng. |
| Trượt/nảy | `physics.js:71`, `:134`, `:172`: friction bàn 0,65/dụng cụ 0,60; restitution 0,08; damping 0,15/0,55. | Điều chỉnh vừa phải; không tắt va chạm và không tăng friction cực đoan. |
| Ra khỏi khung | `physics.js:65` chỉ tạo bàn cố định; `constrain():263` chỉ chặn đáy khi còn chồng mặt bàn. `render3d.js:96` clamp mục tiêu theo tâm màn hình, không áp dụng cho vật dynamic. | Bốn thành chắn và trần thấp vừa trong frustum camera thao tác, hạn chế vận tốc hướng ra biên, constrain full collider khi cầm, phục hồi lỗi hiếm trước/sau tích phân. |

Bộ tái hiện cùng đầu vào ở `tools/physics_scenarios_v33.mjs` được chạy cả V3.2 và V3.3. Log trước/sau nằm trong `validation_v33/physics_baseline_v32.json` và `physics_p0.json`. Trong log V3.2, độ sâu dưới mặt phẳng bàn sau khi ra ngoài bàn không được diễn giải là bằng chứng xuyên qua bàn; vật có thể đã rơi khỏi mép bàn hữu hạn.

## 2. Kiến trúc sửa có kiểm soát

- `web/src/physics.js`: thông số tập trung trong PHYSICS_TUNING; bộ ước lượng vận tốc thả, giới hạn kinematic, cast/contact, thành chắn, safety recovery, sleeping, cache bounds.
- `web/src/render3d.js`: tính vùng từ camera thao tác, mesh beaker có miệng rót, PBR glass/liquid, bóng tiếp xúc và chi tiết dụng cụ. Collider vẫn được dựng từ hình học thực và scale/pivot hiện tại; nhãn/vạch chia/bóng không là collider.
- `web/src/vessel-details.js` mới: rim, vạch chia, nhãn chai, texture/bóng tiếp xúc sinh một lần. Không tải asset 3D bên ngoài.
- `web/src/environment.js`: cập nhật vật liệu/chi tiết giá ống nghiệm và thiết bị trang trí; giữ kích thước/vị trí bàn.
- `web/src/main.js`: truyền realDt; thay đổi văn bản, nhãn và bố trí thông tin hiển thị. Luồng acquire/release/owners không bị viết lại.
- `web/index.html`, `web/styles.css`, `web/vendor/fonts/`: UI, font local có giấy phép. `START_WINDOWS.bat`, `server.py`, `package.json`: cập nhật số phiên bản.
- `tests_js/physics*.test.mjs`, `tools/*v33*`, tài liệu và log: kiểm chứng/bàn giao.

33 file nhận diện, cử chỉ, lọc, camera, chuẩn độ và hóa học được so SHA256 với V3.2 và giữ nguyên byte: xem `validation_v33/preserved_modules.json`. Không huấn luyện/thay MediaPipe, không sửa bộ lọc One Euro/pinch/ID tay hoặc bản thư viện minified. Rapier/Three.js/MediaPipe giữ phiên bản cũ.

## 3. Thông số và đơn vị

1 scene unit = 0,1 m; Rapier dùng SI. Bàn 30×0,14×9 scene unit, tâm (0;−1,7;−1,5), mặt trên y=−1,63. Scale dụng cụ 0,67 giữ nguyên. Fixed dt=1/120 s, tối đa 12 substep/frame; gravity −9,81 m/s², CCD vẫn bật.

| Thông số | V3.2 | V3.3 | Mục đích |
|---|---:|---:|---|
| Cap tốc độ vật đang gắp | Chưa có | 0,75 m/s | Chặn bước nhảy tracking, không ảnh hưởng chuyển động thông thường dưới cap |
| Khi gần bình khác | Chưa có | ≤0,14 m/s | Tránh kinematic truyền năng lượng quá mạnh |
| Tốc độ góc đang cầm | Chưa có | 4 rad/s | Hạn chế xoay xuyên collider |
| EMA vận tốc thả | Đường cơ sở trong 75 ms | tau 40 ms theo frame thực | Lọc vận tốc và tránh sai do catch-up dt |
| Gain / cap ném | 1 / 1,2 m/s | 0,55 / 0,40 m/s | Vẫn ném nhẹ, giảm quãng đường trên bàn nhỏ |
| Cap ngang dynamic bất thường | Chưa có | 0,65 m/s | Hàng rào năng lượng khi có xung lực bất thường; không cap tốc độ rơi tự do bằng mức này |
| Cap quay dynamic | Chưa có | 8 rad/s | Tránh quay mất kiểm soát |
| Friction bàn / dụng cụ | 0,65 / 0,60 | 0,82 / 0,75 | Giảm trượt, không dính cứng |
| Restitution | 0,08 | 0,02; biên 0 | Hạn chế nảy |
| Linear / angular damping | 0,15 / 0,55 | 1,1 / 2,4 | Chuyển động giảm dần |
| Lerp tư thế đang giữ | tau 25 ms | Giữ 25 ms; bổ sung cap khi cần | Giữ nền chuyển động cũ |

Ngủ bổ sung khi ở sát bàn, tốc độ ngang <0,012 m/s, tốc độ góc <0,25 rad/s và khoảng hở đáy thay đổi <0,05 mm/substep liên tục 0,65 s. Dùng dịch chuyển đáy thực để tránh vận tốc bù trọng lực của bộ chống xuyên ngăn body ngủ. Có thể thức lại khi gắp/va chạm. Cache bounds theo đúng pose, vô hiệu khi đổi collider; không bỏ kiểm tra collider của vật đang chuyển động.

Vùng x tính bảo thủ từ aspect/FOV của camera thao tác (FOV 48°, camera z=7), z∈[−1,8;1,5], trần nằm trong frustum. Khi resize trong lúc cầm, cập nhật thành chắn được hoãn đến khi buông để tránh đẩy/teleport vật đang giữ. Không tự đưa về giữa bàn. Chỉ lỗi numerical/ra ngoài vùng dung sai mới kích hoạt recover; các thử nghiệm thường phải có recoveryCount=0.

## 4. UI và đồ họa

Be Vietnam Pro 400/500/600/700, các subset WOFF2 cần thiết được đóng gói với OFL. Chữ chính 14 px, phụ 12–13 px, nhãn phụ 11 px. Không tải font từ CDN. Màu trung tính sáng, nút hành động xanh đậm, hướng dẫn và tên dụng cụ rõ. FPS/Hz/độ tuổi mẫu/pinch/FSM nằm trong details kỹ thuật. Tên thao tác tay hiển thị tiếng Việt, state thực không đổi.

Vẫn dùng biên dạng lòng bình cũ để tính mức chất lỏng; thêm miệng rót beaker, mép rim, graduations theo cùng bộ tích phân mức chất lỏng, nhãn chai. Không thay ID, stock, pivot/mouth hay liên kết owners. Collider phần thân dựng từ mesh thực đã scale; phần trang trí được đánh dấu noPhysics. Thủy tinh PBR dùng alpha, ior và roughness với hình học có cả thành ngoài/thành trong; culling mặt khuất và tắt clearcoat tránh vẽ trùng, chưa phải khúc xạ/thủy động lực chính xác. Không bật transmission render target, shadow map hay postprocessing. Bóng tiếp xúc là texture mềm, cập nhật theo khoảng hở đáy để nhận biết nằm trên bàn.

Các thiết bị trang trí/rack không có chức năng mới. Máy pH tương tác vẫn là trạm chuẩn độ cũ. Không nhận các mesh thủ tục này là mô hình GLB photorealistic.

## 5. Camera P3

`capture.js`, `hand-worker.js`, `camera-quality.js` giữ nguyên. HD yêu cầu 1280×720, ảnh model mặc định tối đa 640 px giữ tỷ lệ; Worker resize cả đường VideoFrame và ImageBitmap trước infer. Chỉ số getSettings/video intrinsic được so với kết quả kích thước Worker trong QA. CSS object-fit:contain và lật gương giữ nguyên, không kéo giãn nguồn để giả độ nét.

Đầu vào giả lập HD: track/video 1280×720@30; Worker 640×360. Low được trình duyệt cấp 640×480, có crop-and-scale do tỷ lệ 4:3; FHD trên nguồn fixture này không hỗ trợ nên fallback HD có thông báo. Đây không phải xác nhận webcam vật lý hỗ trợ FHD. Chưa đo autofocus/ánh sáng hoặc tay di chuyển nhanh/chậm ngoài đời. Chưa chỉnh tăng độ phân giải model, sáng/contrast/sharpen.

## 6. Cách tái kiểm chứng

Chạy test JS và Python theo README. Với QA trình duyệt, cài Playwright phát triển (`npm install --no-save playwright@1.51.1`, `npx playwright install chromium` nếu chưa có), dùng Chromium headless. Không cần các gói này để sử dụng ứng dụng.

Ví dụ Linux/macOS:

```bash
export PLAYWRIGHT_PACKAGE=/duong/dan/node_modules/playwright/index.mjs
export CAMERA_FIXTURE=/duong/dan/camera.y4m
BENCHMARK=0 node tools/qa_v33.mjs
node tools/qa_regression_physics_v33.mjs
node tools/physics_scenarios_v33.mjs . validation_v33/physics_p0.json
BENCH_PROJECT="$PWD" BENCH_OUTPUT="$PWD/validation_v33/benchmark_v33.json" node tools/benchmark_v33.mjs
```

PowerShell đặt các biến tương ứng bằng `$env:PLAYWRIGHT_PACKAGE`, `$env:CAMERA_FIXTURE`, `$env:BENCH_PROJECT`, `$env:BENCH_OUTPUT` rồi chạy node. QA tự mở/dừng server riêng, không dùng camera vật lý. Fixture không đóng ZIP: tái tạo bằng ảnh `https://storage.googleapis.com/mediapipe-assets/woman_hands.jpg` thành video Y4M 1280×720@30 (2 giây, loop; xem ghi chú nguồn ở THIRD_PARTY). Dữ liệu đầu vào ảnh tĩnh không đánh giá được độ chính xác pinch khi tay chuyển động.

Benchmark luôn cố định viewport 1366×900, hộp workspace 1024×420 (canvas bên trong 1022×418 do border), DPR1, 5 công cụ cùng stock, HD/CV640, 4 bình đứng yên + 1 mục tiêu di chuyển bằng code. Cảnh V3.3 có vật liệu/chi tiết mới nên so sánh là toàn bản vá, không phải thí nghiệm tách riêng chi phí từng thuật toán. Mỗi bản một lượt 60 giây nối tiếp cùng host; chưa phải khảo sát thống kê nhiều lần hoặc số đo RTX.

Xem VALIDATION_V33.md cho số đo cuối cùng và giới hạn. Thử tay thật cần thực hiện thêm trên máy mục tiêu và xuất JSON từ ứng dụng, không dùng test synthetic để công bố tỷ lệ gắp 9/10 của người dùng.
