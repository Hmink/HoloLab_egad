# V3.6 — Chẩn đoán và thay đổi

Ngày: 29/10/2026. Nền so sánh: ZIP HoloLab_AR_V3_5.zip,
SHA-256 `89342c4c92c9092dd7f805c17e810a8cd667f1da627dc805856618db66b4aa2e`.
Mã nguồn được vá theo module; không dựng lại ứng dụng. Kết quả chạy nằm trong
`VALIDATION_V36.md` và `validation_v36/`.

## Vì sao bình vẫn treo khi đã mở tay?

Ảnh báo lỗi hiển thị **“Tay B · mất dấu · giữ vị trí”**. Điều đó cho thấy ứng dụng
đang giữ quyền sở hữu cho một track không còn quan sát được. Ảnh không đủ để kết luận
gravity/collider đã hỏng. Đường release → Rapier dynamic của V3.5 vẫn vượt qua kiểm
tra vật lý; lỗi cần sửa nằm ở điều kiện phát hiện release và quản lý track.

| Bằng chứng trong bản gốc | Hậu quả | Sửa ở V3.6 |
|---|---|---|
| `web/src/interaction.js`, `update`: chế độ rotate thay pinch ratio bằng `0.1` nếu `pose.fist` đúng | Mở cái–trỏ nhưng còn gập các ngón khác vẫn bị coi là đang nắm | Ghi nhận kiểu gắp ban đầu. Nắm bằng pinch phải thả theo pinch; fist chỉ dùng nếu bắt đầu bằng fist. Sau khi thả phải mở lại để tái kích hoạt fist. |
| `interaction.js`, nhánh missing/sweep: gia hạn theo mọi mẫu nhận lại và timeout 1.800 ms | Các mẫu đơn lẻ/nhiễu có thể kéo dài trạng thái giữ mất dấu | Thời gian giữ tạm 700 ms từ bằng chứng hợp lệ; cần hai mẫu liên tiếp sau mất dấu để gia hạn. Watchdog vẫn hoạt động khi camera ngừng trả callback. |
| `web/src/tracks.js`, `update`: mọi khoảng cách mẫu >100 ms bị đánh dấu `recovered` | Tracking <10 Hz liên tục rebase điểm neo, bình có thể dính một chỗ | Chỉ rebase nếu mẫu trước thực sự thiếu/mơ hồ hoặc gián đoạn >700 ms. Bài thử 6,67 Hz vẫn kéo được. |
| `interaction.js`, `setThreshold`: gọi `parkAll("settings")` | Đổi độ nhạy tự thả bình dù người dùng chưa thả | Cập nhật gate tại chỗ; giữ ngưỡng thả của lần gắp hiện tại đến khi kết thúc. |
| `web/src/filters.js`, `PinchGate.missing`: chỉ xóa bằng chứng khi một khoảng thiếu >180 ms | Những mẫu mở không liên tục có thể cộng dồn | Mỗi mẫu thiếu ngắt bằng chứng đang chờ, nhưng không xóa trạng thái đang gắp. |
| `web/src/capture.js`, init/schedule/worker messages: không khóa init đồng thời hoặc bảo vệ callback cũ | Có đường sinh worker/callback dư, cập nhật busy sai khi chuyển backend | Dùng một initPromise, một callback camera, generation/epoch/sequence; bỏ phản hồi từ worker và frame cũ. |
| `capture.js`, `applyCameraQuality`: bỏ yêu cầu nếu đang đổi chất lượng | Chọn nhanh nhiều mức khiến giao diện và mức áp dụng lệch nhau | Giữ yêu cầu cuối và áp dụng sau yêu cầu đang chạy. |
| `web/src/main.js`, thông báo mất dấu | “Giữ vị trí” không nói lúc nào thả | Hiển thị đếm ngược đến thả, đồng bộ với watchdog. Hai track cùng nhãn handedness hiển thị đang xác định, không ép đổi ID. |
| `main.js`, `clearDesk`: chưa xóa banner nguy hiểm còn thời gian sống | Cảnh báo của bài cũ vẫn nằm trên bàn mới | Xóa banner cùng trạng thái bàn khi reset. |
| Nút Chọn bài trên cửa sổ nhỏ: trạng thái ẩn do media query khác class desktop | Thuộc tính `aria-expanded` có thể báo ngược trạng thái đang hiển thị | Tính trạng thái mở riêng theo viewport, đồng bộ class và thuộc tính trợ năng; thêm kiểm tra mở/đóng trên cửa sổ nhỏ. |

Các tình huống release mới được chạy cả trên nguồn gốc lẫn bản vá. Sáu bài hồi quy
mới thất bại trên V3.5 và vượt qua trên V3.6. Trong đó timeout 700 ms và release nhanh
là thay đổi tiêu chí thiết kế; không diễn giải mọi khác biệt đó là lỗi cú pháp của bản cũ.

## Cử chỉ và vòng lặp

- Giữ MediaPipe task/model, worker suy luận, chuẩn hóa theo kích thước bàn tay,
  tọa độ mirror, hệ hai tay và One Euro. Không đổi các hệ số lọc vị trí của One Euro.
- Giữ close 0,43 / open 0,66 mặc định, debounce gắp 55 ms. Mở chưa rõ vẫn xác nhận
  105 ms. Nếu mở rõ với ratio ≥ max(0,9; open + 0,18), xác nhận 32 ms từ mẫu đầu.
  Một mẫu ngoại lai không đủ thả. Số ms này không phải độ trễ toàn hệ thống.
- Mất dấu ngắn giữ pose, tạm ngừng rót do tay điều khiển. Hết 700 ms không có bằng
  chứng ổn định thì bỏ owner và gọi đường release vật lý, không trả bình về vị trí đầu.
- Các trạng thái bổ sung PINCH_START, ROTATING, RELEASING nối vào FSM cũ; IDLE,
  HOVER, GRABBING, DRAGGING, RELEASED vẫn tương thích.
- Lọc trùng detector chỉ bỏ hai bộ 21 điểm gần như trùng nhau. Không bỏ một tay vì
  có cùng nhãn Left/Right. Khi hai tay che nhau lâu, camera một góc nhìn vẫn có giới hạn.
- Chỉ có một rAF render trong sản phẩm, một chuỗi video callback và tối đa một
  inference đang chạy. Worker cũ không được điều khiển busy/owner của worker mới.
- Overlay dùng màu vòng xanh cho A, vàng cho B; chấm vàng nhỏ là tâm tương tác.
  Chấm vàng không phải tín hiệu “đã gắp”. Trạng thái gắp còn phải xem chữ/owner.

## Cấu hình khi đang thực hành

| Nhóm | Tùy chọn | Cách áp dụng |
|---|---|---|
| A: tại chỗ | Độ nhạy pinch, DPR render, giới hạn tracking 30/60 Hz | Không tạo lại model hoặc thả bình. Ngưỡng thả đang dùng được giữ hết lượt. |
| A: tại chỗ, đổi neo | Vùng điều khiển, move/rotate, resize giao diện | Rebase ở mẫu hợp lệ kế tiếp, giữ vị trí và owner. |
| B: sau khi thả | LOW/HD/FHD, chiều rộng ảnh CV 640/960, mirror | Xếp hàng; chờ hết owner tay/chuột/van rồi áp dụng. Chỉ thay thành phần cần thiết. |
| C: khởi tạo lại thành phần | Backend AUTO/CPU/GPU/native | Chờ thả, hủy worker cũ, tạo worker mới và tiếp tục trên **cùng luồng video**. Không khởi động lại Three.js hoặc trang. |

Thông báo áp dụng/chờ/lỗi nằm phía trên bàn. Chọn nhiều lần giữ giá trị mới nhất
cho từng tùy chọn. Không bắt buộc tải lại trang sau đổi backend.

## Vật lý: giữ engine thật

Không thay gravity bằng phép ép tọa độ y. Rapier 0.17.3 và geometry/collider hiện tại
được giữ: mesh theo rigid body, đáy collider xoay theo quaternion và scale/pivot.
Release cuối cùng chuyển kinematic → dynamic; một tay thả khi tay kia vẫn giữ cùng
bình thì bình tiếp tục được giữ. `freezeHeld` chỉ đóng băng một lần, không đặt lại
history/target ở từng frame thiếu dấu.

| Thông số giữ nguyên từ V3.5 | Giá trị |
|---|---:|
| Tỷ lệ scene | 1 unit = 0,1 m |
| Gravity | 9,81 m/s² |
| Physics timestep | 1/120 s, accumulator có giới hạn bù |
| Tốc độ điều khiển tối đa | 0,75 m/s; gần va chạm 0,14 m/s |
| Gain / giới hạn vận tốc thả | 0,55 / 0,40 m/s |
| Linear / angular damping | 1,1 / 2,4 |
| Friction bàn / dụng cụ | 0,82 / 0,75 |
| Restitution | 0,02 |

Khoảng cách tiếp xúc nhỏ của solver không đồng nghĩa bình treo: trong 25 bài thử
bình xoay, gap lớn nhất khoảng 0,00313 scene unit (0,313 mm theo tỷ lệ mô hình).
Không phát hiện xuyên bàn trong bộ thử đó. Không tuyên bố không bao giờ xuyên trong
mọi cấu hình hoặc mọi mô hình chưa kiểm tra.

## Giao diện, gợi ý hóa học và hiệu ứng

- Kho dụng cụ/hóa chất ở bên phải, thu gọn được; bộ chọn bài vẫn bên trái.
  Đã kiểm tra 1920, 1366, 1024 và 640 px. Hướng dẫn phản ứng hiện trong vùng cuộn riêng.
- `reaction-hints.js` đọc phương trình/hiện tượng từ cùng dữ liệu của engine và
  bài học. `reaction-hints.json` chỉ bổ sung điều kiện, mức lưu ý, nguồn dẫn.
  Không cho gợi ý kích hoạt phản ứng và không tạo sản phẩm ngẫu nhiên.
- Các màu nguy cơ là thang lưu ý giáo dục theo điều kiện ghi kèm, **không phải
  phân loại GHS/SDS**. Gợi ý mô tả mẫu gốc, chưa phân tích mọi hỗn hợp trong bình.
- Hiệu ứng fire do engine xác nhận thêm 16 tia sáng, 12 cụm khói instanced và flash
  ngắn; không thêm đèn động/thư viện nặng. Buffers/materials được giải phóng khi hết
  hiệu ứng hoặc dọn bàn. Màu/lượng chất vẫn do engine cũ quyết định.
- Không thêm phản ứng nổ mới: engine hiện chưa có mô hình định lượng vụ nổ. Hiệu ứng
  pressure của bình kín vẫn là cảnh báo áp suất, không tự nâng thành vụ nổ.
  Pha loãng axit không tự có lửa; kết tủa không có tia lửa.

## Các phần được bảo toàn

Không sửa LiquidSimulation, PourableContainer, spill ledger, engine hóa học Python,
engine/bộ dữ liệu 5 bài THPT, bộ worker MediaPipe/model, solver chuẩn độ, thư viện 100
phản ứng, nhật ký opt-in và tutor quy tắc. Mã kiểm tra `tools/audit_v36.py` so SHA-256
với nền V3.5; danh sách cụ thể nằm trong `validation_v36/preserved_modules.json`.
Không thêm dependency chạy sản phẩm.

## Hạn chế phải công bố

1. Chưa có thử nghiệm webcam/bàn tay người thật trên laptop của người dùng; không
   kết luận nguyên nhân camera tối, lấy nét, driver hay 50 FPS trên máy đó.
2. Camera giả trong phép thử là test pattern, **không có tay**. MediaPipe thật vẫn
   chạy, nhưng gesture regression dùng dữ liệu tổng hợp riêng.
3. Mất dấu lâu không thể suy ra người dùng còn pinch hay đã mở tay. 700 ms là chính
   sách giữ tạm rồi thả; thiết bị tracking rất chậm cần đo lại trên video tay thật.
4. Hệ số physics không đổi; độ mượt và độ trễ đầu–cuối cần đo trên thiết bị đích.
5. Hạt chất lỏng/kết tủa và lửa là minh họa, không CFD, không dự báo nguy cơ thực tế.
