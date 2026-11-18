# HoloLab AR V3.5 — Kết quả kiểm chứng, 28/10/2026

**Đã chạy kiểm thử tự động với ứng dụng, Rapier, Three.js và MediaPipe thật. Chưa thử webcam/bàn tay người thật; chưa đạt mục tiêu 50 FPS trong môi trường đo này.** Không coi kết quả build hoặc camera giả lập là nghiệm thu tương tác thực tế.

Nguồn gốc: sửa trực tiếp trên ZIP V3.4, SHA256 `81229b201fc9ad5c76ef837a789422d11e1c044b3e77c0d3c5b8c69c39d773e7`. Không viết lại kiến trúc. Hồ sơ `VALIDATION_V34.md` và các thư mục validation cũ chỉ có giá trị lịch sử.

## Kết quả đã chạy

| Phép kiểm tra | Kết quả | Bằng chứng trong ZIP |
|---|---|---|
|JavaScript unit/integration|97/97 đạt; gồm Rapier thật, hình học rót, lượng chất, góc nối liên tục, logger/tutor, hồi quy cũ|`validation_v35/unit.log`|
|Python unit/API|91/91 đạt; lượng rót tùy biến, lượng rất nhỏ, input sai, khóa nguy cơ, hóa học cũ|`validation_v35/python.log`|
|Trình duyệt: tính năng V3.5|15/15 nhóm đạt; vòng animation thật, shader, 5 bài học, UI, lưu/mở lượng tràn, giải phóng buffer hiệu ứng|`validation_v35/browser.json`|
|Trình duyệt: điều khiển/vật lý/camera|12/12 nhóm đạt; chuột thật qua Playwright, trạng thái hai tay giả lập, pipeline MediaPipe thật|`validation_v35/browser_checks.json`|
|Trình duyệt: hồi quy ứng dụng|7/7 nhóm đạt; phiên làm việc, nguy cơ, OrbitControls, 100 phương trình, đồng rắn, nhật ký rót tự do|`validation_v35/regression_checks.json`|
|Vật lý chấp nhận|7/7 nhóm đạt: 30 lần thả, 20 lần ném nhẹ, 30 va chạm nhẹ, bốn biên/trần, 60 giây mô phỏng nghỉ, mất tracking, spawn|`validation_v35/physics_phase1.json`|
|Cú pháp/import/runtime|Node kiểm tra cú pháp, Python AST, JSON; trình duyệt tải dependency nội bộ và chạy không có lỗi JS/WebGL trong các kịch bản đã thử|`validation_v35/source_audit.json`, các báo cáo browser|
|Gói nguồn|Hash từng tệp runtime; kiểm tra CRC ZIP và chạy lại từ thư mục giải nén sạch|`validation_v35/SOURCE_SHA256.json`, `package_smoke.json`|

Ứng dụng dùng ES modules trực tiếp, không có bước bundler/build. Kiểm tra cú pháp không thay thế các bài browser/runtime bên trên. Python chạy trên Linux/Python 3.12; chưa chạy trực tiếp Windows, macOS hoặc Python 3.14/3.15 trong lượt này.

## Xoay, chất lỏng và vật lý

| Vật chứa | Góc 45/90/135/180/270/360° với mesh + Rapier | Úp ngược có thể rót hết / dựng dừng / đóng nắp chặn | Thả, gắp lại, không xuyên bàn |
|---|---|---|---|
|Cốc beaker|Đạt tự động|Đạt mô hình|Đạt tự động|
|Bình tam giác|Đạt tự động|Đạt mô hình|Đạt tự động|
|Ống nghiệm|Đạt tự động|Đạt mô hình|Đạt tự động|
|Chai dung dịch|Đạt tự động|Đạt mô hình; thêm thử 30 mL chảy hết trong vòng lặp trình duyệt|Đạt tự động|
|Ống nhỏ giọt|Đạt tự động|Đạt mô hình rót đơn giản, chưa có bóp/hút|Đạt tự động|

- Thử tay giả lập quay hai vòng qua ±180°: không snap góc, quyền giữ/thả còn đúng. Đây không phải người thật xoay cổ tay 720°.
- Nguồn + đích + tràn trong bài chloride giữ tổng 46 mL với sai số dưới 10⁻⁶ mL. Unit test kiểm tra cả lượng chất hòa tan đi theo dòng; bình đầy không vượt dung tích.
- Rót sai vị trí tạo vũng và trừ nguồn; rót bị khóa nguy cơ không bị chuyển thành tràn. Mở phiên giữ lại sổ lượng tràn. 300 đường tràn được gộp thành tối đa 128 dòng, vẫn giữ tổng thể tích/mol/khối lượng.
- Trong 20 chu kỳ gắp–thả–gắp lại bằng mesh thật: độ xuyên bàn đo được 0. Vận tốc ngang đỉnh của bài chạm nhẹ ~0,1385 m/s; cap vận tốc thả 0,40 m/s. Bốn biên không có vật ra ngoài, không cần recovery trong thao tác bình thường của phép thử.
- Sáu vật nghỉ 60 giây thời gian mô phỏng: drift 0, sleeping. Trong hai benchmark 60 giây thời gian thực, bốn vật không tương tác cũng có drift 0. Đây không phải bằng chứng cho mọi tải CPU hoặc mọi thao tác.

## Hóa học và giao diện

Đã thao tác qua vật thể dựng trong trình duyệt: AgNO₃ → NaCl tạo AgCl; nước đối chứng không tự kết tủa; NaOH/HCl làm chỉ thị hồng rồi mất màu; thuốc thử biuret + protein tạo tím; NaOH + NH₄Cl sinh NH₃ và quỳ ẩm đúng vị trí hóa xanh; nhúng Fe tạo lớp Cu, nhấc ra dừng. Khối lượng, thể tích và điều kiện vẫn do engine bài học quyết định. 100 phương trình cũ vượt kiểm tra cân bằng nguyên tố/tỉ lượng tự động.

AgCl được thể hiện bằng vẩn đục và hạt trắng phụ thuộc lượng chất; các hạt lắng theo mô hình minh họa. Cu(OH)₂ xanh và CaCO₃ trắng dùng cùng renderer, có unit kiểm tra nhận diện sản phẩm; chưa quay video người dùng thực hiện hai phản ứng đó trong V3.5. Bọt NH₃ chỉ là ký hiệu khí không màu. Không bổ sung kịch bản cháy nổ mới; kiểm thử khóa nguy cơ/hiệu ứng định tính cũ vẫn qua.

Đã kiểm tra bố cục ở 1920×1080, 1366×768, 1024×768, 640×800: bộ chọn thu gọn, canvas có kích thước hữu hạn, nhãn bài chloride không chồng nhau, không tràn ngang trang. Chưa nghiệm thu toàn bộ mobile/touch, tất cả mức zoom trình duyệt hoặc việc có 16 nhãn tự do cùng lúc.

## So sánh hiệu năng có kiểm soát

Mỗi phiên đo 60 giây, cùng máy, Chromium 133 headless, **SwiftShader (GPU phần mềm), MediaPipe CPU**, canvas 1022×418, DPR 1, 5 vật thể, một vật di chuyển theo chương trình. Camera giả lập 1280×720 @20 Hz; ảnh đưa vào MediaPipe 640×360. Không có bàn tay trong ảnh, `detected_samples = 0`. Đây là phép đo tải pipeline, không đo độ chính xác nhận diện hay độ mượt cử chỉ người thật. Không chạy đồng thời các bài kiểm thử khác trong lúc đo.

| Chỉ số | V3.4 trước | V3.5 sau |
|---|---:|---:|
|FPS render trung bình|40,30|40,16|
|Tracking Hz|5,62|5,66|
|Inference trung bình|75,08 ms|71,99 ms|
|Tuổi mẫu p95|199,30 ms|192,30 ms|
|CPU physics trung bình|0,930 ms|0,919 ms|
|CPU physics p95|3,20 ms|2,80 ms|
|CPU vòng render trung bình|2,11 ms|2,29 ms|

Dữ liệu gốc: `benchmark_before.json`, `benchmark_after.json`. FPS V3.5 gần mức V3.4 trong cặp chạy này; không tuyên bố đã tối ưu nhanh hơn. Một lần chạy so sánh mỗi bản chưa đủ suy luận ý nghĩa thống kê. Có lần đo phát triển trước đó đạt 39,29 FPS, lưu riêng trong `development/benchmark_after_initial.json`. Phép đo cuối đã gồm cache mặt thoáng, sổ tràn và đường đồng rắn; sửa cleanup instance sau đó không tác động cảnh benchmark (cảnh đó không sinh hiệu ứng). Các phép kiểm tra chức năng được chạy lại sau cleanup. Chưa đo phần trăm CPU/GPU và RAM đỉnh.

**Tiêu chí 50 FPS và độ trễ thấp: chưa đạt/chưa nghiệm thu.** Chi phí inference lớn hơn nhiều chi phí physics trong phép đo, nên chưa có cơ sở quy mọi độ trễ cho cơ chế biên. Cần đo trên máy có GPU thật, có cả một/hai bàn tay, đủ ánh sáng. Không thay bộ lọc hoặc tăng resolution CV để làm đẹp số liệu. Tuổi mẫu không phải độ trễ đầu–cuối giữa tay và màn hình.

## Lỗi phát hiện trong quá trình tự kiểm thử

1. Thu gọn sidebar làm CSS Grid đẩy `main` vào cột 0 px, camera nhận Infinity: đặt cột rõ ràng và bỏ qua resize khi kích thước dưới 2 px. Chạy lại layout/shader ở bốn độ phân giải đều qua.
2. Đổi sang huyền phù trộn đều làm kiểm thử cũ giả định toàn bộ AgCl nằm lại thất bại: đối chiếu bảo toàn chất, sửa kỳ vọng theo mô hình mới, tính cả Ag⁺ còn dư phản ứng với Cl⁻ mới. Không xóa kiểm tra bảo toàn.
3. Luồng rót mới bỏ sót mẫu đồng rắn tự do: khôi phục thao tác đưa mẫu riêng, không dùng dòng chất lỏng cho khối rắn. Browser kiểm tra chuyển đúng 0,5 g một lần và không lỗi shader/runtime.
4. Sổ tràn ban đầu không được lưu cùng phiên và có thể quá dài: lưu/khôi phục, kiểm tra input trước khi xóa bàn, gộp các đường cũ mà vẫn bảo toàn tổng lượng. Kiểm thử roundtrip và 300 đường tràn qua.
5. Aliquot cực nhỏ có thể bị API từ chối khiến còn phần dư khi rót gần hết: hạ giới hạn dương của API, vẫn chặn 0/âm/NaN/Infinity; test aliquot 10⁻⁷ mL qua.
6. Instance buffer của hạt/hiệu ứng cần dispose ở cấp InstancedMesh, không chỉ geometry/material: bổ sung khi đổi bài và hết hiệu ứng. Browser kiểm tra reset phát dispose và xóa hiệu ứng khỏi scene.

Các log thất bại phát triển (nếu có) nằm riêng trong `validation_v35/development/`, không phải kết quả nghiệm thu cuối. Một số lần timeout của bộ thử chuột/đồng là do kịch bản bắt vật chưa ổn định hoặc kéo ngang va vào bình nhận; đã sửa đường thử nâng lên trước khi đưa qua miệng, không vô hiệu va chạm để làm test qua.

## Chưa kiểm chứng / giới hạn

- Webcam vật lý, ánh sáng/lấy nét, hai tay giao nhau, tỉ lệ gắp ≥9/10 mỗi tay, độ trễ đầu–cuối, 50 FPS trên i5/HD5500 hoặc máy GPU rời: **chưa đo**. Dùng `docs/MANUAL_CHECK_V35.md`.
- Không CFD/giọt thật/độ nhớt/vỡ thủy tinh; mặt thoáng gần tĩnh, không sóng chất lỏng. Tốc độ rót và lắng là tham số giáo dục, không số liệu thực nghiệm.
- Huyền phù được trộn đều khi rót; chưa gạn riêng lớp nước. Vũng có sổ bảo toàn nhưng chưa phản ứng với nhau; mở phiên chưa tái dựng vũng trang trí.
- Tutor hiện tại **chỉ là quy tắc**, không LLM hoặc mô hình học máy đánh giá kiến thức. Chưa có dữ liệu giáo viên gán nhãn, Macro-F1, thử nghiệm học sinh hoặc kết luận về hiệu quả giáo dục. Phân biệt rõ với MediaPipe là mô hình nhận diện tay có sẵn.

## Chạy lại kiểm thử

Sử dụng tại gốc dự án:

```text
npm test
python -m unittest discover -s tests
python tools/audit_v35.py
node tools/physics_acceptance_v34.mjs . validation_v35/physics_phase1.json
node tools/qa_v35.mjs
node tools/qa_core_v35.mjs
node tools/qa_regression_v35.mjs
```

Unit JS dùng Node và vendor trong ZIP, không cần `npm install` để chạy. Python full test cần dependency theo `requirements.txt` vì có kiểm tra desktop cũ; chạy sản phẩm web thì không cần cài chúng. Browser QA cần Playwright và Chromium cài riêng (`npm install --no-save playwright`, `npx playwright install chromium`); không đưa browser thử nghiệm nặng vào gói sản phẩm. Nếu dùng Python có tên khác, đặt biến `PYTHON`. Các script browser tự khởi động/dừng server cổng riêng. Camera giả lập là mặc định, không cần webcam.

Benchmark: đặt `BENCH_PROJECT` tới thư mục bản cần đo và `BENCH_OUTPUT` tới JSON kết quả, chạy `node tools/benchmark_v35.mjs`. Dùng cùng kích thước/render/backend để so sánh; báo cáo giả lập không thay số đo webcam thật từ bảng kỹ thuật trong ứng dụng.
