# HoloLab AR V3.6 — Kết quả kiểm chứng

Ngày kiểm tra: 29/10/2026. Nguồn đối chiếu: V3.5 đã bàn giao, không phải dự án dựng lại.
**Đã sửa và kiểm chứng lỗi release bằng dữ liệu cử chỉ tổng hợp và Rapier thật.
Chưa nghiệm thu webcam/bàn tay người thật hoặc mục tiêu 50 FPS trên thiết bị đích.**

## Môi trường và ý nghĩa của bằng chứng

- Linux trong môi trường chạy mã; Chromium 133 headless, SwiftShader (GPU phần mềm).
- Three.js/Rapier/MediaPipe và model dùng đúng bản offline trong dự án.
- Camera giả Chromium có stream thực trong trình duyệt, nhưng nội dung là test
  pattern **không có bàn tay**. Nó kiểm tra tải/đổi stream và vòng đời worker.
- Mẫu pinch/hai tay đưa qua HandTracks → Interaction; kiểm tra sau đó dùng body,
  mesh, raycast và vòng lặp ứng dụng thật. Không gọi đó là nhận diện tay người thật.
- Không có bước bundler: ứng dụng ES modules chạy trực tiếp. Đã kiểm tra syntax,
  import/runtime, JSON, Python AST và tải WASM/model/API; không dùng syntax pass để
  thay bằng chứng thao tác đúng.

## Bộ kiểm tra đã chạy

| Bộ thử | Kết quả | Bằng chứng |
|---|---|---|
| V3.5 nguyên bản, JS hiện có | 97/97 đạt | `validation_v36/baseline-tests.log` |
| Sáu hồi quy release mới chạy trên runtime V3.5 | 6/6 thất bại theo tiêu chí mới | `reproduce-before.log` |
| V3.6 JavaScript | 111/111 đạt, không bỏ qua test | `unit.log` |
| Python chemistry/legacy | 91/91 đạt | `python.log` |
| Chấp nhận physics Rapier | 7/7 nhóm đạt | `physics.json` |
| Browser core/camera/two-hand/physics | 12/12 nhóm đạt | `browser_checks.json` |
| Browser chất lỏng/5 bài/UI/logger | 15/15 nhóm đạt | `browser.json` |
| Browser hồi quy phiên/chuẩn độ/khóa nguy cơ/đồng rắn | 7/7 nhóm đạt | `regression_checks.json` |
| Browser lỗi release/cấu hình/kho/hiệu ứng mới | 8/8 nhóm đạt | `new_regressions.json` |
| Kiểm tra syntax/AST/JSON, hash module giữ nguyên | Đạt; số tệp trong báo cáo audit | `source_audit.json`, `preserved_modules.json` |

Số “nhóm” không phải số lượt người dùng thử. Các bài có liên quan nhau được gộp
trong từng nhóm. Log đầy đủ và script đi kèm, không chỉ có ảnh minh họa.

## Release, mất dấu và va chạm

- 25 vòng pinch → mở tay khi còn gập các ngón khác → dynamic → rơi → đứng trên bàn
  → gắp lại; 5 kiểu mesh ở 5 góc khác nhau. Không có lượt vẫn bị giữ sau mở tay.
- Penetration lớn nhất đo được: 0 scene unit; khoảng hở tiếp xúc lớn nhất
  `0,00312254` scene unit, tương đương khoảng `0,3123 mm` theo tỷ lệ 0,1 m/unit.
  Đây là khoảng hở solver, không phải bình lơ lửng hàng centimet.
- Mất 238 ms vẫn giữ; mất lâu qua 700 ms, mẫu nhận lại lẻ hoặc ngừng callback đều
  thả qua đường `park` của sản phẩm. Không teleport về vị trí đầu.
- Core browser thêm 20 vòng thả/gắp thật qua mouse events; module physics thêm 30
  vòng thả, 20 ném nhẹ và 30 chạm bình. Tất cả nằm trong biên, không xuyên bàn trong
  các tình huống đã chạy. Không cộng các lượt này thành thử nghiệm người thật.
- Vận tốc ném lớn nhất trong bộ physics độc lập khoảng `0,2308 m/s`; chạm nhẹ lớn
  nhất khoảng `0,0801 m/s`. Bộ browser kiểm tra cap ném khoảng `0,4 m/s`.
- Sáu dụng cụ nghỉ 60 **giây mô phỏng**: drift 0, sleeping. Từng benchmark 60 **giây
  thời gian thực** cũng kiểm tra 4 dụng cụ không tương tác: drift 0, sleeping.
- Input hợp lệ 6,67 Hz không còn bị rebase ở mọi mẫu; tests hai tay/trao quyền cũ
  tiếp tục đạt. Chưa kiểm tra chồng/che tay thật ở nhiều điều kiện ánh sáng.

## Thời gian xác nhận mở tay

| Tần số mẫu tổng hợp | V3.5 | V3.6 |
|---|---:|---:|
| 30 Hz | 133,3 ms | 33,3 ms |
| 60 Hz | 116,7 ms | 33,3 ms |

Đo từ **mẫu mở rõ đầu tiên** đến quyết định release của gate. Không gồm camera,
truyền ảnh, inference, màn hình hay chuyển động thực. Bằng chứng:
`validation_v36/gesture_latency.json`. Với ratio gần ngưỡng, vẫn dùng xác nhận dài
hơn để tránh tự nhả. Không tuyên bố độ trễ đầu–cuối chỉ 33 ms.

## Benchmark cùng môi trường

Mỗi lượt 60 giây thực; camera HD thực 1280×720, 20 FPS do camera giả cung cấp; ảnh
CV V3.6 đo được 640×360. Viewport 1366×900, canvas 1022×418, DPR 1, 5 dụng cụ, một
vật thể có mục tiêu chuyển động theo script. Không chạy hai phiên cùng lúc.
V3.5 cũng giới hạn CV 640 nhưng chưa báo chiều cao ảnh input riêng.

| Lượt | Render V3.5 | Render V3.6 | Tracking V3.5 | Tracking V3.6 |
|---|---:|---:|---:|---:|
| 1 | 13,68 FPS | 9,60 FPS | 1,47 Hz | 0,93 Hz |
| 2 | 21,95 FPS | 19,07 FPS | 2,32 Hz | 2,08 Hz |
| 3 | 20,90 FPS | 15,96 FPS | 2,21 Hz | 1,62 Hz |
| Trung vị | 20,90 FPS | 15,96 FPS | 2,21 Hz | 1,62 Hz |

**Không đạt 50 FPS trong phép đo này.** Trung vị render giảm khoảng 23,6%, tracking
giảm khoảng 27,0%. Kết quả dao động giữa các lượt; không bỏ lượt thấp để báo cáo đẹp.
Nguồn số: `benchmark-before*.json`, `benchmark-after*.json`, `benchmark-comparison.json`.

CPU physics trung vị/frame: 1,83 → 2,14 ms; thời gian inference trung vị theo lượt:
123,50 → 138,65 ms. FPS thấp làm mỗi frame phải bù nhiều bước physics; đây không phải
đo tổng CPU/GPU % của máy. Chưa xác định đầy đủ phần giảm do bố cục/compositor và
biến động tài nguyên host. Engine physics, worker inference và model không thay;
không được vì thế kết luận toàn bộ suy giảm là lỗi máy người dùng.

Hướng xử lý tiếp: so sánh trên GPU thật với cùng camera/cấu hình; profile
compositor/capture trước khi đổi solver hoặc model. Có thể dùng chất lượng render
Tự động/0,75 và thu kho khi thao tác. Những tùy chọn này đã có; chưa dùng chúng để
đổi điều kiện giữa hai bản rồi tuyên bố đã tăng FPS. Tuổi mẫu P95 là tuổi dữ liệu,
không phải độ trễ tay–bình. Độ trễ đầu–cuối, tổng CPU/GPU % và chất lượng ảnh webcam
thật chưa được đo trong môi trường này.

## Chạy liên tục

Kết quả thử 30 phút được ghi sau khi lượt chạy kết thúc trong
`validation_v36/soak.json`. Không dùng `soak-progress.json` hoặc một lượt rút ngắn
làm bằng chứng đã đủ 30 phút. Kịch bản: camera giả + MediaPipe thật + render/physics;
mỗi phút tạo hiệu ứng fire theo engine, dọn bàn, tạo 5 dụng cụ, di chuyển/thả một
vật thể. Không có người thực hành hoặc bàn tay trong ảnh camera.

<!-- SOAK_RESULT -->
Lượt chạy đã đủ **30.13 phút thực**, 30 chu kỳ tạo–dọn–di chuyển–thả.
Không có lỗi JavaScript được ghi nhận, camera không fault/dừng, penetration lớn nhất
0.000000 scene unit; số recovery lỗi kỹ thuật 0.
Tài nguyên đồ họa dao động 70–74 geometry,
7 texture, 12 chương trình shader. JS heap renderer 10.93–22.23 MB,
có tăng/giảm do GC; không thấy số tài nguyên tăng dần theo các lần reset. Đây không
phải phép đo tổng RAM/VRAM của máy.

Render trung bình 30.88 FPS, trung bình từng phút nằm trong
12.88–41.57 FPS; tracking trung bình 3.32 Hz.
Cấu hình endurance là DPR 0,75, khác benchmark DPR 1, không so hai phép đo như cùng
điều kiện. Phút cuối giảm còn 12.88 FPS: **chưa đạt tiêu chí hiệu năng
ổn định/50 FPS**, dù các kiểm tra chức năng và tài nguyên trên vượt qua. Cần profile
trên thiết bị đích; chưa xác định đầy đủ nguyên nhân dao động/giảm tốc trong host này.
Bằng chứng tổng hợp: `soak-summary.json`; các mẫu mỗi phút: `soak.json`.
<!-- /SOAK_RESULT -->

## Hồi quy và giới hạn

Đã kiểm tra rót đúng miệng, úp hết, lưu lượng/volume và sổ lượng tràn; AgCl, nước
đối chứng, màu chỉ thị/biuret, ammonium, Fe–CuSO₄; câu hỏi, nhật ký đồng ý mới ghi,
import phiên không hợp lệ không phá phiên cũ. Kho phải không đè canvas tại 4 độ
rộng; gợi ý AgCl hiển thị đúng; fire thêm sparks/flash/smoke và dispose buffers.
Cu(OH)₂ không nhận hiệu ứng lửa. Reset xóa banner cảnh báo của bàn cũ.

Những phần **chưa nghiệm thu**: webcam laptop thật, gắp ≥9/10 mỗi tay trên người,
giữ 30 giây với tay thật, khả năng ID khi che khuất phức tạp, cảm giác trễ chủ quan,
camera quang học/driver, 50 FPS và độ trễ đầu–cuối trên thiết bị đích. Hướng dẫn
điền kết quả thật: `docs/MANUAL_CHECK_V36.md`.

Chưa có engine dự đoán nổ định lượng, nên không thêm vụ nổ giả cho các phản ứng
không xác nhận điều kiện. Chất lỏng là mô hình hình học/bảo toàn lượng, không CFD;
thủy tinh không vỡ. Gợi ý an toàn là thông tin giáo dục cho mẫu/điều kiện cụ thể,
không phải SDS hoặc đánh giá hỗn hợp bất kỳ. Phần AI đánh giá kiến thức chưa được
huấn luyện/kiểm chứng; tutor quy tắc hiện có được giữ nguyên.

## Kiểm tra gói giải nén

Đã giải nén ZIP ứng viên sang thư mục sạch và đối chiếu 1.773 hash runtime; chạy lại
111/111 JS và 91/91 Python. Browser regression cuối chạy trên bản giải nén, gồm
kiểm tra mở/đóng bộ chọn bài ở cửa sổ nhỏ. Lượt endurance 30 phút nạp core trước
bản chỉnh thuộc tính trợ năng của nút Chọn bài; thay đổi UI nhỏ này được kiểm tra
riêng sau đó. Mã camera/gesture/physics/liquid trong lượt endurance không đổi.
Bản ZIP cuối chỉ bổ sung báo cáo sau chạy; runtime phải khớp manifest đã kiểm tra.

## Tái lập

Chạy trong thư mục gốc đã giải nén; Node.js có sẵn để chạy test JS. Chạy sản phẩm
thì chỉ cần Python 3.10+ và trình duyệt, không cần npm install.

```bash
npm test
python3 tools/audit_v36.py /duong/dan/ban-V3.5
node tools/physics_acceptance_v34.mjs . validation_v36/physics.json
```

Python tests cần NumPy/OpenCV và SymPy theo môi trường phát triển; có SymPy/mpmath
trong `python_vendor`. Lượt kiểm tra này dùng OpenCV headless 4.11.0.86/NumPy 2.2.6
ngoài thư mục sản phẩm. Đặt `PYTHONPATH` gồm `python_vendor`, rồi:

```bash
python3 -m unittest discover -s tests
```

Browser QA cần Playwright và Chromium cho máy kiểm thử, không thêm vào dependency
chạy HoloLab. Dùng `PLAYWRIGHT_PACKAGE` nếu module Playwright đặt ngoài dự án.
Các script tự khởi động/dừng server thử trên cổng riêng:

```bash
node tools/qa_core_v36.mjs
node tools/qa_liquids_v36.mjs
node tools/qa_regression_v36.mjs
node tools/qa_v36.mjs
node tools/soak_v36.mjs
```

`soak_v36.mjs` mặc định 30 phút thực; nếu dùng `SOAK_MINUTES` ngắn hơn thì báo cáo
`meets30Minutes` là false. Các script có thể tạo ảnh nội bộ để kiểm tra bố cục;
ảnh camera/ảnh người dùng không được đưa vào ZIP bàn giao.

Benchmark có script `tools/benchmark_v35.mjs` dùng chung cho hai thư mục:
đặt `BENCH_PROJECT`, `BENCH_OUTPUT`, `PLAYWRIGHT_PACKAGE`. Script thêm callback
chuyển mục tiêu cho bài thử; đó không phải vòng render thứ hai trong sản phẩm.

Chi tiết sửa: `docs/V36_FIXES.md`; diff: `patches/V35_to_V36.patch`;
hash runtime: `validation_v36/SOURCE_SHA256.json`.
