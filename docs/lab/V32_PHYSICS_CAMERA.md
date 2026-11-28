# V3.2 — sửa vật lý và chất lượng camera

## Nguyên nhân trong V3.1
- `main.js::park()` chỉ clamp tọa độ `target`, không có trọng lực hay chuyển body type.
- `render3d.js::render()` luôn lerp mesh về target, kể cả khi đã release. Không có physics engine trong dependency V3.1.
- Bàn trong `environment.js` chỉ là BoxGeometry 30 × 0,14 × 9 tại (0; -1,7; -1,5), không có collider. `clampPosition` chỉ giới hạn tâm trên viewport, không biết đáy bình hay góc nghiêng.
- Webcam bị yêu cầu 640×480; ảnh CV được thu nhỏ với resizeQuality low; giao diện chưa công bố kích thước stream thực tế. Đây là nguyên nhân giảm chi tiết từ phần mềm, chưa đủ để kết luận camera bị mất nét quang học.

## Thay đổi theo module
| Module | Sửa đổi |
|---|---|
| `physics.js` mới | Rapier 0.17.3, gravity, rigid body/collider, chuyển quyền giữ, fixed timestep, va chạm bàn và quán tính |
| `environment.js` | Gắn tham chiếu cho mesh bàn hiện có; giữ nguyên kích thước/vị trí/màu |
| `render3d.js` | Đăng ký/xóa body cùng mesh; bỏ lerp mesh độc lập; giữ nguyên mô hình/vật liệu/biên dạng |
| `interaction.js` | Thêm callback acquire trước anchor; giữ góc ban đầu của bình đã đổ ngoài giới hạn góc cũ để gắp lại không tự xoay. Nhận diện, ngưỡng và bộ lọc giữ nguyên |
| `main.js` | Hook acquire/release/chuột, đồng bộ ownership hai tay và physics loop; các phím xoay sửa pose body qua sự kiện |
| `camera-quality.js` mới | Profile Low/HD/Full HD, constraints, lấy settings, autofocus nếu được hỗ trợ, chính sách tự giảm khi tải cao |
| `capture.js`, `hand-worker.js` | HD mặc định, báo thông số thật; giữ chính sách downsample của bản cũ, không đổi mô hình/threshold/landmarks |
| `index.html`, `styles.css` | Thêm lựa chọn camera và dòng độ phân giải thật; giữ bố cục hiện có |
| `metrics.js` | Ghi chi phí CPU physics riêng ngoài render/track |

## Đơn vị, bàn và collider
Scene dùng 1 unit = 0,1 m, để cốc cao khoảng 1,1 unit tương ứng 11 cm. Rapier chạy SI: mét, giây, kg; gravity (0; -9,81; 0). Chuyển đổi duy nhất tại biên vào/ra engine, không sửa scale mesh để ép khớp.

Body bàn là fixed, collider cuboid lấy từ geometry và matrixWorld của mesh bàn. Tâm SI là (0; -0,17; -0,15), kích thước SI (3; 0,014; 0,9), mặt trên y = -0,163 m (scene -1,63). Không tạo plane vô hạn thay thế mặt bàn.

Dụng cụ bàn tự do là dynamic body với compound rounded convex hull từ các mesh vật lý đã áp dụng local pivot và group scale 0,67. Border hull 0,5 mm. Loại các đường vạch, vòng chọn, chất lỏng và hạt hiệu ứng khỏi collider. Nắp chỉ đóng góp khi đang đóng. Khi đổi nắp, collider được xây lại; khi chuyển chất lỏng, cập nhật khối lượng giả định.

Collider là proxy lồi cho thân bình, chưa phải thành kính rỗng; không hỗ trợ lồng bình hay đổ hạt rắn qua miệng bằng va chạm. Khối lượng vỏ dụng cụ và chất lỏng dùng gần đúng để điều khiển động lực học, không dùng làm phép cân chính xác. Buret và thiết bị gắn cố định của trạm chuẩn độ giữ cách hoạt động cũ; không biến thành vật thể thả tự do.

## Gắp, release và mất dấu
- Khi FSM xác nhận grab: callback lấy pose body thực, chuyển KinematicPositionBased, rồi tính offset tay. Không nhảy về target cũ.
- Khi còn giữ: cùng bộ lọc tay cũ; physics nội suy mục tiêu với hằng số 25 ms như trước. Gửi bằng setNextKinematicTranslation/Rotation.
- Kinematic không tự bị static contact đẩy lại: trước mỗi bước, tính các điểm cực trị của collider đã xoay, gồm border, và giới hạn để đáy collider ở trên mặt bàn với khe 0,3 mm.
- Khi release hợp lệ: bỏ owner ngay trong sự kiện, owner cuối cùng làm body Dynamic. Lấy pose hiện tại, không nhảy đến mục tiêu chưa đi hết. Không thêm timer release mới; hysteresis 105 ms cũ vẫn được giữ theo yêu cầu giữ logic cử chỉ.
- Vận tốc thả lấy từ khoảng 75 ms chuyển động body đã đi theo tay, giới hạn 1,2 m/s. Không bịa vận tốc từ landmarks bị mất dấu.
- Một tay thả trong thao tác hai tay: owner còn lại giữ kinematic.
- Mất dấu/ambiguous ngắn: giữ body kinematic tại pose hiện tại, xóa lịch sử quán tính, dừng rót theo cơ chế sẵn có. Nhận lại dùng cơ chế rebase cũ. Timeout 1,8 s cũ hoặc đặt bình thủ công: chuyển dynamic với vận tốc bằng 0.
- Sau release, chỉ physics ghi transform mesh. Target và Euler cho UI được lấy ngược từ body, không có vòng lerp target khác ghi đè.

## Chống xuyên và ổn định
- Fixed step 1/120 s; tối đa 12 bước mỗi frame, chặn dt tích lũy sau khi tab treo. Không phụ thuộc trực tiếp số lần render.
- Hard CCD và soft CCD trên body; 4 CCD substeps, 12 solver iterations; ma sát bàn 0,65, dụng cụ 0,6; đàn hồi 0,08, damping và sleep.
- Bổ sung ràng buộc vận tốc pháp tuyến với bàn dựa trên điểm đỡ của collider sau dự báo góc quay và gia tốc. Giới hạn vận tốc tiến vào bàn trước World.step để tránh xuyên khi bước nhanh. Đây là lớp bảo vệ vận tốc trước solver, **không clamp y mesh/body sau release**.
- Khi tiếp xúc gần bàn, vận tốc và quay đủ nhỏ trong 0,4 s, đưa body về sleep để dập rung tiếp xúc. Va chạm hay gắp lại đánh thức body.
- Va chạm khác giữa các dụng cụ do Rapier giải. Chưa thêm collider cho các vật trang trí tĩnh khác trong phòng.

## Camera và ảnh CV
- Low: 640×480; HD mặc định: 1280×720; Full HD: 1920×1080 nếu constraints được chấp nhận. Full HD lỗi thì fallback HD; HD/Low dùng chế độ gần nhất nếu camera không đáp ứng exact.
- Đổi chất lượng tạm dừng gửi frame và loại kết quả thuộc epoch ảnh cũ; mỗi kết quả mang kích thước input để không tính pinch theo sai aspect. Dòng camera đọc getSettings và videoWidth/videoHeight thật, không suy diễn từ kích thước CSS. Tần số camera là frameRate do track báo, không đồng nghĩa tracking Hz.
- Nếu camera công bố focusMode continuous, yêu cầu autofocus và giữ nguyên kích thước đã đàm phán. Không ép tùy chọn mà webcam không hỗ trợ. Không chỉnh màu/brightness giả để che lỗi lấy nét.
- Object-fit contain, mirror và ánh xạ aspect giữ nguyên. Canvas inference giữ đúng tỷ lệ. Giữ chính sách resize ảnh CV của bản cũ để không đưa một bộ lọc ảnh mới vào đường nhận diện đang hoạt động. Tăng kích thước stream và kích thước input là hai lựa chọn độc lập; không áp sharpen/contrast giả.
- Ảnh CV mặc định vẫn ≤640 px như bản cũ; tùy chọn 960 còn nguyên. Webcam HD không đồng nghĩa model phải chạy ở HD. Độ trễ và độ chính xác phải đo trên máy đích.
- Tự giảm FHD→HD→Low khi tải cao liên tục 10 s; cooldown 15 s; không tự tăng lại gây dao động. Có checkbox tắt tự giảm để đo đối chiếu.

## Kiểm chứng và nguồn
Xem `VALIDATION_V32.md` cùng log trong `validation_v32`. Các phép thử có landmarks giả lập hoặc webcam giả lập được gắn nhãn, không gọi là kiểm tra camera vật lý.

Tham chiếu API chính thức:
- Rapier rigid bodies: https://rapier.rs/docs/user_guides/javascript/rigid_bodies/
- Rapier colliders: https://rapier.rs/docs/user_guides/javascript/colliders/
- Rapier API và type definitions của package 0.17.3 đi kèm lúc phát triển.
- MDN getSettings: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings
- MDN applyConstraints: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/applyConstraints
