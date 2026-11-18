# Kiểm chứng HoloLab AR V3.7 — 30/10/2026

**Bản sửa và các kiểm tra tự động bên dưới đã chạy. Chưa nghiệm thu bàn tay,
webcam thật hoặc mục tiêu 50 FPS trên máy người dùng.** Không coi build/syntax
thành công là đủ; đã chạy server, trình duyệt, Rapier, MediaPipe và phản ứng.

## Môi trường và phạm vi

- Python 3.12.14; Node 24.22.1; Chromium 133 headless; WebGL SwiftShader (GPU phần
  mềm), CPU MediaPipe. Không phải i5/HD5500 hay máy có GPU NVIDIA của người dùng.
- Nguồn camera giả lập Chromium: stream thực 1280×720, 20 FPS, ảnh CV 640×360.
  Không có bàn tay người trong nguồn này. Cử chỉ dùng quan sát tổng hợp để kiểm
  tra FSM/ownership/physics; không dùng để báo tỉ lệ gắp thành công bằng tay thật.
- Không đổi model, confidence, hai tay, bộ lọc, vật lý, hình học bình, chất lỏng,
  bài học, dữ liệu hoặc dependency. Đối chiếu 22 module lõi và hash runtime trong
  `validation_v37/preserved_modules.json` / `SOURCE_SHA256.json`.
- Chỉ 4 tệp JavaScript sản phẩm thay đổi: capture, hand-worker, metrics, main;
  các tệp khác là nhãn phiên bản, công cụ kiểm tra và tài liệu. Xem danh sách đầy
  đủ trong `changed_files.json`, bản vá `patches/V36_to_V37.patch`.

## Nguyên nhân và sửa chữa

V3.6 chỉ dùng VideoFrame cho delegate GPU; CPU/native thu nhỏ ImageBitmap trên
luồng giao diện. Profile trước sửa ghi khoảng 16,90 giây tại createImageBitmap
trong khoảng đo 19,42 giây. Đây là điểm nghẽn đã quan sát được trên môi trường này.

V3.7 chuyển VideoFrame sang Worker khi hỗ trợ; xử lý kích thước/chiều gương trong
Worker, giữ ImageBitmap dự phòng. Có đóng tài nguyên khi gửi lỗi hoặc phiên cũ;
thất bại tạo/transfer VideoFrame không bị thử lại ở mọi frame. CPU canvas dùng
willReadFrequently; GPU giữ canvas tương ứng. Không sửa thuật toán nhận diện.

Thời gian lấy ảnh phía giao diện trong ba lượt V3.7 có trung vị **0.074 ms**.
Chi phí tiền xử lý/model vẫn tồn tại trên Worker; không coi là đã loại bỏ toàn bộ
độ trễ. Bảng kỹ thuật/JSON giờ tách từng công đoạn. `docs/V37_FIXES.md` có vị trí,
định nghĩa chỉ số và nguồn API.

## Kiểm tra đã đạt

| Nhóm | Kết quả | Bằng chứng |
|---|---|---|
| JavaScript | 115/115 | `js-tests.log` |
| Python | 91/91 | `python-tests.log` |
| Rapier acceptance | 7/7 nhóm | `physics.json` |
| Core browser | 12/12 | `browser_checks.json` |
| Chất lỏng, bài học, UI, nhật ký | 15/15 | `browser.json` |
| Hồi quy chức năng cũ | 7/7 | `regression_checks.json` |
| Bản sửa release/config/UI V3.6 | 8/8 | `new_regressions.json` |
| Chuyển ảnh V3.7 | 7/7 | `frame_transport.json` |

Tất cả tệp bằng chứng trong `validation_v37/`.

- 30 lượt thả–gắp lại trong acceptance; 20 lượt ném nhẹ; 30 va chạm nhẹ; bốn mép
  và trần; 60 giây mô phỏng để bình nghỉ. Không xuyên/thoát biên, không recovery.
- Trình duyệt kiểm tra 25 lượt pinch-release với 5 kiểu bình ở nhiều góc, mở
  cái–trỏ trong rotate, mất dấu ngắn, mất dấu lâu, nhận lại lẻ và camera stall.
  Rigid body chuyển dynamic, rơi, nằm trên bàn và gắp lại được.
- Nghiêng 45/90/135/180/270/360 độ; rót tự động, úp hết 30 mL, vũng tràn, bảo toàn
  nguồn + nhận + tràn, lưu/mở phiên. Năm bài THPT đi qua điều kiện và thao tác
  tương ứng; AgCl xuất hiện trong mẫu chloride, nước đối chứng không tạo AgCl.
- Bốn kích thước cửa sổ, kho phải/selector thu gọn, nhãn không chồng; câu hỏi,
  lời giải thích và nhật ký opt-in. Không phát hiện lỗi JS/WebGL trong các ca này.
- MediaPipe CPU thật nhận ảnh qua VideoFrame và ImageBitmap. Bốn ô màu cho pixel
  gương giống nhau, đúng 640×360; Low 640×480 giữ 4:3. Không gửi hai inference
  đồng thời. Stop/restart và đổi backend trên cùng video stream hoạt động.
- Yêu cầu GPU được xử lý bởi delegate **GPU** trong lượt thử
  SwiftShader, model mất **7152.2 ms** ở mẫu ghi nhận.
  Chỉ xác minh đường API hoạt động; không chứng minh GPU phần mềm nhanh. AUTO
  nhận diện software GL và chọn CPU như trước.

## Ba cặp đo 60 giây

Cùng máy, Chromium, viewport 1366×900; bề mặt render 1022×418; DPR 1; camera/CV
như trên; 5 bình, một bình di chuyển bằng mã. Tự điều chỉnh chất lượng tắt để
giữ điều kiện. Thứ tự cặp 1 trước/sau, cặp 2 sau/trước, cặp 3 trước/sau.

| Cặp | Render V3.6 FPS | Render V3.7 FPS | Tracking V3.6 Hz | Tracking V3.7 Hz |
|---|---:|---:|---:|---:|
| 1 | 15.18 | 21.27 | 1.67 | 1.78 |
| 2 | 15.20 | 18.50 | 1.59 | 1.55 |
| 3 | 21.18 | 24.48 | 2.22 | 1.96 |
| Trung vị | 15.20 | 21.27 | 1.67 | 1.78 |

Trung vị render tăng **39.9%**. Trung vị
khoảng cách frame P95: **316.6 → 233.4 ms**;
tuổi mẫu P95: **1060.2 → 811.9 ms**.
CPU physics/frame trung vị **1.91 → 2.20 ms**,
không cải thiện tất cả chỉ số. Tracking từng cặp có cả tăng và giảm; không suy
ra độ chính xác nhận diện hay tốc độ trên máy thật từ thay đổi trung vị nhỏ này.

**Có một lượt V3.7 bị timeout 70 giây chờ phép đo hoàn tất.** Harness ban đầu
chưa lưu runtime state nên chưa xác định nguyên nhân; không tuyên bố đã sửa.
Đã bổ sung chẩn đoán, chạy lại toàn bộ cặp thứ ba; cặp chạy lại hoàn tất và được
dùng trong bảng. Nhật ký lỗi và lượt V3.6 ban đầu được giữ tại
`benchmark-after-3-first-failure.log`, `benchmark-before-3-first.json`.
Không tính lượt timeout là đạt. `benchmark-comparison.json` ghi rõ các lượt.

Mục tiêu **50 FPS chưa đạt** trong các lượt này. Host dùng chung và GPU phần mềm
có tải biến động. So sánh hiện tại hỗ trợ kết luận giảm chặn luồng giao diện,
không phải bảo đảm hiệu năng trên mọi cấu hình. Các profile thử từng bước được
giữ riêng; chúng không thay thế ba cặp đo cuối.

## Chạy liên tục 30 phút thực

`soak.json`: **1815.10 giây thực**, 30 lần ghi trạng
thái. MediaPipe thật, camera giả lập, render và Rapier chạy cùng nhau. Mỗi phút
tạo hiệu ứng có điều kiện → dọn bàn → tạo 5 bình → di chuyển/thả một bình.
Không phải 30 phút thao tác tay người.

- Không JS error, camera fault, body NaN, liquid error hoặc xuyên mặt bàn ở các
  mốc kiểm tra; độ xuyên lớn nhất ghi nhận 0.000000 đơn vị scene.
- Render và inference tiếp tục tạo mẫu ở từng phút; số lần recovery lớn nhất
  0. Luôn có 5 bình sau mỗi chu kỳ.
- Tập số geometry/texture/program ghi nhận: **[(70, 7, 12), (74, 7, 12)]**.
- JS heap luồng giao diện: **9.09–18.25 MB**, mẫu cuối
  **16.11 MB**. Có GC; số đo này không bao gồm mọi vùng nhớ của GPU/Worker
  và không chứng minh tuyệt đối không rò rỉ bộ nhớ.
- Trung bình cả lượt: **32.23 FPS render**, **2.72 Hz tracking**.
  Từng phút render 3.93–46.75 FPS.
  Lượt dài dùng DPR 0,75 và kích thước UI tự nhiên, nên không so trực tiếp FPS với
  bảng DPR 1 ở trên.
- Khi kết thúc: đóng Worker, dừng mọi video track, running=false; kiểm tra đạt.

## Lỗi phát hiện khi kiểm tra

1. Nút thắt capture CPU trên UI: sửa bằng chuyển VideoFrame; đã đo và kiểm tra
   pixel/luồng xử lý, có fallback.
2. Tài nguyên ảnh chưa được đóng khi postMessage thất bại trong mã cũ: bổ sung
   close/guard, kiểm tra lỗi truyền được tiêm vào. Chưa quan sát lỗi này trên
   webcam người dùng.
3. Công cụ test gọi getContextAttributes trên OffscreenCanvas context không có
   API đó ở Chromium thử nghiệm: sửa harness, kiểm tra pixel trực tiếp; giữ hồ
   sơ lỗi ở `frame_transport-harness-failure.json`. Không sửa sản phẩm để né test.
4. Timeout benchmark một lần: chưa tái hiện trong cặp chạy lại; nguyên nhân chưa
   đủ bằng chứng. Giữ như giới hạn còn tồn tại, không xóa nhật ký lỗi.

## Kiểm tra gói giải nén sạch

Đã giải nén ZIP ứng viên vào thư mục mới và đối chiếu hash các tệp chạy với nguồn
đã thử. Chạy server và Chromium từ thư mục đó: **12/12 ca core** và **7/7 ca
chuyển ảnh** đạt, không page error và không dependency runtime tải từ bên ngoài.
Bằng chứng: `clean-extract/browser_checks.json`, `clean-extract/frame_transport.json`.
ZIP cuối được kiểm CRC và so khớp lại mã chạy; phần báo cáo/nhật ký được bổ sung
sau lượt thử, không thay mã sản phẩm.

Lần điều phối đầu tiên của kiểm tra giải nén bị mất phiên thực thi, chưa xuất
được kết quả đầy đủ. Đã giữ log `clean-core-incomplete-first.log` và chạy lại cả
hai nhóm; chỉ các lượt hoàn tất được ghi đạt ở trên. Không gán sự gián đoạn công
cụ này thành một lỗi ứng dụng đã được xác định.

## Chưa kiểm chứng và giới hạn

- Webcam quang học, driver/quyền Windows, tay người, L/R khi giao nhau, độ chính
  xác gắp ≥9/10 mỗi tay, cảm giác chuyển động và latency đầu–cuối trên máy thật.
- Tăng tốc GPU phần cứng, native MediaPipe Python ở bản này, trình duyệt khác
  Chromium đã thử; hỗ trợ VideoFrame không đồng nghĩa mọi thiết bị đều nhanh.
- Không cam kết 45/50 FPS trên i5-5200U/HD5500. Camera 20/30 FPS không thể cung
  cấp 50 frame hình mới/giây dù render đạt 50; không nhận diện lặp frame để bù số.
- Mô hình chất lỏng hình học/bảo toàn, chưa CFD; hiện tượng/hạt phóng đại; tutor
  quy tắc, chưa mô hình AI huấn luyện hoặc nghiên cứu học sinh có dữ liệu thật.

Làm theo **docs/MANUAL_CHECK_V37.md** để nghiệm thu trên máy đích; ghi rõ những mục
chưa thử. Dùng JSON đo 60 giây và lỗi đầu tiên trong Console để điều tra tiếp.

## Chạy lại

Chạy sản phẩm: Windows `START_WINDOWS.bat` hoặc
`py -3.13 server.py --browser-tracking`; Linux `bash START_LINUX.sh`.
Mở `http://127.0.0.1:8765`, Ctrl+F5, tab phải là V3.7. Không cần npm để sử dụng.

Kiểm tra phát triển: có Node, Python, Playwright/Chromium; NumPy/OpenCV cho các
test desktop Python. `PLAYWRIGHT_PACKAGE` có thể trỏ tới module Playwright đã cài.
Ứng dụng không thêm Playwright làm dependency sản phẩm.

```sh
npm test
python3 -m unittest discover -s tests
node tools/physics_acceptance_v34.mjs . validation_v37/physics.json
node tools/verify_v37.mjs
BENCH_BASELINE=/duong/dan/V3_6 node tools/compare_v37.mjs
QA_OUTPUT=validation_v37 SOAK_MINUTES=30 node tools/soak_v36.mjs
python3 tools/audit_v37.py /duong/dan/V3_6
python3 tools/report_v37.py
python3 tools/package_v37.py
```

QA_OUTPUT cho phép tái sử dụng ca hồi quy V3.6 trên V3.7 mà không chép đè bằng
chứng cũ. Các thư mục validation phiên bản trước chỉ là lịch sử. Không chạy các
benchmark trình duyệt đồng thời. ZIP có source, model, thư viện, hướng dẫn,
patch và kết quả; ảnh QA nội bộ/ảnh người dùng không đóng trong ZIP.
