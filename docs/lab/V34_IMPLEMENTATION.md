# V3.4 — Phạm vi sửa và kiến trúc bài học

Bản này phát triển trên nguồn V3.3 đã bàn giao, không viết lại ứng dụng. Video người dùng gửi hiển thị tiêu đề V3.2; vì vậy không dùng video đó làm bằng chứng rằng V3.3/V3.4 đã lỗi hoặc đã đạt. Các nguyên nhân V3.2 và bản sửa trước nằm trong `V33_STABILITY.md`; dưới đây phân biệt rõ phần giữ lại và phần mới được kiểm chứng.

## Nguyên nhân và thay đổi vật lý

| Phát hiện | Bằng chứng trong mã / kiểm thử | Xử lý |
|---|---|---|
| Hai dụng cụ mới có thể sinh chồng nhau | V3.3 `web/src/physics.js:249` chỉ `constrain` với bàn/biên trước `setTranslation`, không kiểm tra dụng cụ khác. Cùng bài thử spawn: độ xuyên collider ban đầu 0,102250732 m. | V3.4 `physics.js:271`, `initialPosition`: broadphase AABB rồi Rapier `contactShape`; thử chỗ trống gần vị trí yêu cầu, cập nhật query từ body thực. Không di chuyển vật đang cầm hoặc đã có trên bàn. Hết chỗ thì hủy body mới và báo lý do. |
| Một convex hull kín không biểu diễn lòng cốc | `geometry` cũ dựng hull từ các đỉnh thành bình, hull lấp luôn miệng; thanh sắt không thể thực sự nhúng vào dung dịch. Đây là giới hạn khi thêm bài mới. | `physics.js:172` và `lesson-geometry.js`: riêng cốc CuSO₄ dùng 16 phần thành + đáy, có va chạm và cùng scale/pivot. Các bình khác giữ collider cũ. |
| Thêm nắp khi thanh sắt còn ngang miệng tạo collider chồng lấn | Đổi `sealed` làm tạo thêm collider nắp; kiểm tra “đang phản ứng” thôi sẽ bỏ sót thanh sắt ở trên lớp chất lỏng. | `physics.js:353`, `canSeal`, cùng handler K trong `main.js`: query hình nắp dự kiến trước khi đóng. Báo nhấc thanh sắt ra; không tắt va chạm. Có unit test trường hợp thanh chưa ngập dung dịch. |

Bài so sánh V3.3 đạt 6/7 nhóm P0, V3.4 đạt 7/7. Lỗi mới được chứng minh là **khởi tạo chồng collider**; phép thử không quan sát V3.3 bay khỏi biên, nên không suy diễn rằng lỗi này chắc chắn gây mọi hiện tượng trong video. Dữ liệu gốc: `validation_v34/physics_before_v33.json` và `physics.json`.

Các cơ chế đã sửa ở V3.3 được giữ: vận tốc thả lấy từ dịch chuyển body thực / thời gian frame thực, EMA tau 40 ms; không lấy quãng đường tracking mất dấu chia dt nhỏ; freeze và frame >150 ms xóa quán tính. Release idempotent, chuyển kinematic→dynamic đúng một lần, không cộng impulse nhiều lần. Body động điều khiển mesh. Kinematic dùng `setNextKinematicTranslation/Rotation`, giới hạn tốc độ và shape cast để tránh xuyên vào bình khác. Khi gần vật khác vẫn được chạm/đẩy nhẹ; không vô hiệu collision.

### Thông số giữ nguyên từ V3.3

| Tham số | Giá trị |
|---|---:|
| Đơn vị | 1 scene unit = 0,1 m; Rapier dùng SI |
| Gravity / fixed timestep | −9,81 m/s² / 1/120 s |
| Catch-up / CCD | tối đa 12 substep; 4 CCD substep |
| Tốc độ cầm / gần va chạm | ≤0,75 / ≤0,14 m/s |
| Vận tốc thả | EMA 40 ms × 0,55; cap 0,40 m/s |
| Cap ngang dynamic bất thường / góc | 0,65 m/s / 8 rad/s |
| Friction bàn / dụng cụ | 0,82 / 0,75 |
| Restitution / thành biên | 0,02 / 0 |
| Linear / angular damping | 1,1 / 2,4 |
| Ổn định liên tục trước sleeping bổ sung | 0,65 s |

Không tăng friction hoặc thêm thư viện để che lỗi. Bốn thành biên, trần, full-collider support với bàn và recovery cũ còn nguyên. Vùng x phụ thuộc camera thao tác; resize khi cầm được hoãn, không đẩy vật đang cầm về giữa. Rapier 0.17.3, Three.js 0.180.0, MediaPipe Tasks Vision 0.10.32 giữ phiên bản đóng gói cũ.

## Các module của thư viện THPT

| Tệp | Trách nhiệm |
|---|---|
| `web/data/lessons-thpt.json` | 5 bài, nguồn/chương trình, stock và lượng ban đầu, điều kiện, 4 câu/bài có gợi ý, quy tắc tỉ lượng máy đọc được. Chỉ lớp 10–12, Hóa học. |
| `web/src/lesson-chemistry.js` | Engine thuần dữ liệu, độc lập DOM/Three/MediaPipe. Mol, mL, khối lượng, pH lý tưởng, tỉ lượng chất giới hạn, tín hiệu quan sát, bảo toàn khi rót, kiểm tra snapshot. Không nhận callback va chạm để tự phản ứng. |
| `web/src/lessons.js` | Điều phối chọn lớp/chủ đề/bài, nạp/dọn bàn, rót qua miệng bình, cập nhật lượng chất, inspector/nhãn, câu hỏi, lưu/mở bài. |
| `web/src/lesson-visuals.js` | Màn chiếu 3D bốn trang, thanh Fe và lớp Cu, quỳ ẩm, AgCl, kiểm tra vị trí trong chất lỏng hoặc vùng khí. |
| `web/src/lesson-geometry.js` | Collider cốc rỗng riêng cho bài nhúng sắt. |
| `web/src/main.js` | Adapter vào create/pour/tick/session hiện hữu; chặn hóa chất ngoài bài, giữ các lối vào bàn tự do và chuẩn độ. |
| `web/src/render3d.js` | Thêm hai loại dụng cụ bài học vào cùng đường dựng mesh/body; dọn mesh khi spawn thất bại. |
| `web/index.html`, `web/styles.css` | Bộ chọn, bảng hướng dẫn thu gọn, trang màn chiếu, câu hỏi, nhãn rõ. Giữ font local, camera gương và bố cục chính. |

Luồng thao tác: MediaPipe/cử chỉ cũ → mục tiêu vật lý cũ → vị trí mesh/body thực → kiểm tra miệng rót/độ ngập/vùng khí → chuyển lượng chất và phản ứng → hiện tượng, màn chiếu, câu hỏi. Va chạm hai vỏ chai không thỏa điều kiện hóa học.

### Chuẩn bị bàn và phiên làm việc

`Lessons.start` kiểm tra model và pose nhập trước khi dọn bàn. Thoát Orbit/chuẩn độ nếu đang dùng; dọn owner, mesh và body cũ rồi chỉ tạo vật thuộc bài. Khi chọn lại thẻ kho trong bài, lấy chính vật hiện có, không sinh hóa chất vô hạn. Snapshot có lượng chất, pose và trạng thái nắp; đã thử lưu/mở khi Fe ở trong cốc mà không bị dịch ra ngoài vì AABB coi lòng cốc là đặc. Bản đồ nhãn vẫn giữ danh tính và công thức ban đầu; số mol/thể tích hiện tại ở inspector. Nồng độ trên nhãn được ghi rõ **ban đầu**.

### Điều kiện và mô hình của năm bài

- **Chloride:** mẫu NaCl acid hóa HNO₃ + AgNO₃, Ag⁺ + Cl⁻ → AgCl trắng. Rót đúng hình học, bình mở và còn chỗ. Nước đối chứng không kết tủa. Lượng kết tủa theo chất giới hạn; 18 hạt hiển thị là ký hiệu, không phải từng phân tử.
- **Chỉ thị:** NaOH làm mẫu có phenolphthalein hồng; HCl trung hòa làm mất màu. Phải quan sát hồng rồi mất màu mới hoàn thành. pH xét tự ion hóa của nước; màu chuyển khoảng 8,2–10, không thay đổi ngẫu nhiên.
- **Ammonium:** NH₄⁺ + OH⁻ → NH₃ + H₂O. Lượng NH₃ hữu hạn, thoát ở bình mở; quỳ đỏ ẩm phải ở phía trên đúng miệng bình khi đang có khí. Không nhúng quỳ vào base rồi gọi đó là phép nhận biết khí, không tạo kết tủa sai.
- **Fe–CuSO₄:** chỉ khi thanh Fe ngập chất lỏng đúng mẫu, chưa bị nắp chặn, còn Fe/Cu²⁺. Lượng Cu bám và Fe²⁺ tăng 1:1, Cu²⁺ giảm; nhấc ra dừng. Tốc độ phản ứng đã gia tốc để học, không phải mô hình động học thực.
- **Biuret:** protein + thuốc thử Cu(II) pha sẵn trong kiềm có tartrate → phức tím định tính; nước đối chứng không tím. Không tự tạo phương trình phân tử giả cho mọi protein. Cu tổng, protein và thể tích được bảo toàn khi chuyển mẫu, không suy ra định lượng protein nếu chưa có đường chuẩn.

Giới hạn: chất lỏng chưa có CFD/tràn/mặt thoáng động đầy đủ; khi rót đang giả định phần kết tủa ở lại; không mô phỏng vỡ thủy tinh; chưa mô phỏng thủy phân Fe/Cu, hoạt độ, động học nhiệt hoặc khí thải thực. Mô hình chỉ chạy các quy tắc của bài chọn; không suy đoán tùy ý cho mọi hỗn hợp. Lớp phủ kim loại là hiển thị, không thay đổi hình dạng thanh hay collider theo hao hụt khối lượng.

## Những phần giữ nguyên

So sánh SHA256 với V3.3 nằm ở `validation_v34/preserved_modules.json`: CV worker/capture, tọa độ gương, HandTrack ID, One Euro, pinch/FSM/quyền hai tay, chất lượng webcam, chuẩn độ, engine 100 phương trình và backend Python cũ. `server.py` chỉ đổi số phiên bản; bản vá không thay giao thức camera hay thuật toán cử chỉ. Tệp thay đổi đầy đủ ở `validation_v34/changed_files.json`, diff ở `patches/V33_to_V34.patch`.

Màn chiếu dùng một CanvasTexture, chỉ vẽ lại khi nội dung thay đổi; nhãn DOM chỉ ghi khi giá trị/biến đổi khác. Chemistry update khoảng 80 ms, physics vẫn fixed timestep riêng. Không tăng độ phân giải CV hay bật shader nặng. Đọc `VALIDATION_V34.md` để phân biệt kiểm thử tự động, benchmark môi trường phần mềm và các tiêu chí cần đo trên máy thật.
