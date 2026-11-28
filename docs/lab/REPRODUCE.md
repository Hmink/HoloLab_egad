# Tái lập kết quả kiểm thử

Các kết quả kèm gói là đo phần mềm, không có webcam vật lý hay người thử trong môi trường chạy. Không thay nhãn này khi trích số liệu vào báo cáo.

## Unit và hồi quy

```text
node --test tests_js/*.test.mjs
python -m unittest discover -s tests -q
python tools/compare_controller.py
```

Node test không cần cài npm dependencies vì các module controller là JS thuần. Toàn bộ test Python cần `requirements.txt` (bao gồm bộ test renderer desktop cũ). Lõi API riêng có thể kiểm tra bằng `python -S -m unittest discover -s tests -p test_web_api.py` nhờ SymPy được đóng kèm.

`compare_controller.py` tạo 120 mẫu landmarks tổng hợp, nhãn Left/Right score 0,99 luân phiên, đầu ngón mở rồi chụm; đưa cùng chuỗi vào selector/input V2.1 được giữ và controller V3. Kết quả trong `validation/controller_comparison.json`. Đây là tái hiện lỗi logic, không đo độ chính xác MediaPipe.

## Browser và video đầu vào

Công cụ `tools/browser_qa.mjs` dùng Playwright. Phiên kiểm tra dùng Playwright 1.51.1 / Chromium 134.0.6998.35 headless trên Linux, SwiftShader, CPU AMD EPYC 9V74, hạn mức CPU container 8 core. Ghi rõ phiên bản này khi so sánh; không coi là benchmark laptop Windows hay GPU phần cứng.

Cài Playwright trong môi trường phát triển riêng, trỏ `PLAYWRIGHT_PACKAGE` tới module đã cài; `CHROMIUM_PATH` tùy chọn. Trình duyệt cần có sẵn; không đóng browser executable vào gói sản phẩm.

Lấy ảnh tham chiếu từ URL Google ở `THIRD_PARTY.md` để tạo fixture bằng FFmpeg:

```text
ffmpeg -loop 1 -i woman_hands.jpg -t 1 -r 30 -pix_fmt yuv420p fixture.y4m
ffmpeg -loop 1 -i woman_hands.jpg -t 1 -r 30 -c:v libvpx-vp9 -pix_fmt yuv420p fixture.webm
```

Fixture là **ảnh tĩnh có hai tay được lặp thành video**, không phải video cử chỉ thực. Kiểm thử đầu vào camera giả của Chromium, hai tay do model thật phát hiện, sau đó đổi sang video WebM cục bộ để kiểm tra loop timestamp. Ảnh/video fixture không đi kèm ZIP. MP4/H.264 không mở được trong Chromium headless đã dùng; tùy codec của trình duyệt, nên ưu tiên WebM cho tái lập.

Ví dụ môi trường Bash:

```sh
export PLAYWRIGHT_PACKAGE=/duong-dan/node_modules/playwright/index.mjs
export CAMERA_FIXTURE=/duong-dan/fixture.y4m
export VIDEO_FIXTURE=/duong-dan/fixture.webm
NATIVE_TRACKING=1 node tools/browser_qa.mjs
NATIVE_TRACKING=0 node tools/browser_qa.mjs
```

Biến NATIVE_TRACKING=0 chạy Python `-S`, không dùng thư viện native cài ngoài. =1 cho phép dùng MediaPipe/OpenCV Python đã cài. Hai lượt phải chạy tuần tự. Bộ test vẫn dùng code production cho raycaster, controller, API và đo FPS; chỉ bật hook `?test` để đọc trạng thái/chạy replay tự động.

Mỗi lượt: test chuột, API hóa học, phiên, nguy cơ, replay hai tay, viewport và OrbitControls; chạy model thật từ camera giả; stop/restart; video loop; warm-up; 5 vật thể với một vật thể được di chuyển bằng kịch bản; đo 60 giây. Renders được đếm từ RAF, inference từ kết quả mới. Tracking không được tạo giả để làm đẹp benchmark.

## V2.1 đối chiếu

```text
python tools/benchmark_legacy.py /duong-dan/woman_hands.jpg
```

Đường native cũ dùng model thật, nguồn ảnh lặp giả lập 30 Hz, 5 vật thể cùng loại, một vật thể chuyển động, viewport 1280×800, warm-up 5 s và đo 60 s. Gọi render thật; chỉ giả lập cửa sổ GUI và nguồn camera để chạy headless. Bản V3 cũng dùng 1280×800 và cùng ảnh, nhưng runtime/render backend khác, độ lớn workspace khác và V3 có DPR động. Đây là **so sánh toàn hệ thống**, không phải phép đo cô lập một thuật toán hay mức tăng tốc GPU phổ quát.

Kết quả: `benchmark_v21.json`, `benchmark_v3_native.json`, `benchmark_v3_wasm.json`, `browser_checks_*.json`, cùng trace controller trong `validation/`. Tệp `legacy_frames.jsonl` giữ log vòng lặp V2.1 để kiểm tra lại thống kê.

## Đóng gói

`package-lock.json` khóa Three/MediaPipe Web; `npm ci` và `npm run vendor` tái tạo `web/vendor`. Model khóa bằng SHA256 trong `THIRD_PARTY.md`; pure Python được đóng trong `python_vendor`. Loại khỏi ZIP: node_modules, .venv, cache Python, browser executable, ảnh/video fixture và ảnh riêng của người dùng.

Đối chiếu `validation/SOURCE_SHA256.json` khi kiểm tra lại: thay source sau khi đo làm mất tính tương đương của benchmark. Giao diện có nút đo 60 s để thực hiện nghiệm thu trên máy thật; dùng phiếu `ACCEPTANCE.md`.
