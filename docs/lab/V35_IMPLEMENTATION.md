# V3.5 — Nguyên nhân, bản sửa và phạm vi giữ nguyên

## Bằng chứng trong nguồn V3.4

| Vấn đề | Vị trí nguồn V3.4 | Xử lý V3.5 |
|---|---|---|
|Bình không úp ngược / đảo góc|`web/src/interaction.js:310–335`: clamp pitch ±1,2 rad, roll ±1,5 rad, delta góc tương đối bị quấn; `main.js:1014–1015`: phím A/D cũng clamp|Dùng góc tay đã lọc và nối liên tục có sẵn; tích lũy delta hai tay; bỏ chặn góc tổng, giữ cap tốc độ Rapier. Không thay pinch/FSM/One Euro.|
|Rót từng cục, không chảy hết khi buông / rót lệch|`main.js:440–467`: yêu cầu chủ tay hợp lệ, chờ 300 ms, mỗi 550 ms rót một lượng cố định và phải có đích; `server.py:77` chưa nhận aliquot tùy biến|`LiquidSimulation` 80 ms, định lượng theo góc/mức đầy và dt, đích theo miệng + trọng lực; tràn có sổ. Bình tự do đổ nghiêng có thể chảy, tay mất dấu ngắn thì giữ/tạm dừng.|
|Chất lỏng nghiêng theo cả bình, giống bị dính|`render3d.js:262,305`: lathe theo local-Y, tạo lại hình học khi đổi lượng, toàn bộ mesh xoay cùng bình|Geometry lòng bình cố định, clipping theo mặt phẳng ngang thế giới; buffer nắp mặt thoáng tái sử dụng.|
|Rót vào gần bình dù chưa trúng miệng|`render3d.js:387`: ngưỡng dx<0,48, dz<0,65 quanh tâm, không xét mặt phẳng miệng|Tia trọng lực từ mép thấp nhất của miệng nguồn, giao mặt phẳng miệng đích, kiểm tra bán kính/nắp/hướng đích. Không phản ứng vì vỏ bình chạm nhau.|
|Bàn/khung nhìn chật, nhãn dài|`environment.js:25`: bàn rộng 30; `styles.css:472` workspace chia flex với nhiều panel; nhãn bài hiện tên/công thức/nồng độ/thể tích dài|Bàn 36, camera fit theo aspect, biên tính từ camera; khung 62–64vh; chọn bài tự thu gọn, nhãn ngắn dưới khung, thông tin đầy đủ ở tooltip/inspector.|
|AgCl khó nhận thấy|`lesson-visuals.js` dùng một số hạt nhỏ trên nền dung dịch nhạt|Renderer chung dựa trên mol sản phẩm; độ đục, số hạt và màu đúng loài đã biết; lắng minh họa.|

Vị trí tương ứng trong bản mới: `interaction.js:288–322`, `main.js` hàm `pour`, `spill`, `transferSolidSamples`, `render3d.js` hàm `resize`, `updateWorkspace`, `pourTarget`, `render`. Diff chính xác nằm trong `patches/V34_to_V35.patch`; danh sách/hash thay đổi ở `validation_v35/changed_files.json`.

## Phân chia module

| Module | Trách nhiệm / thay đổi |
|---|---|
|`capture.js`, `hand-worker.js`, `tracks.js`, `coordinates.js`, `filters.js`, `camera-quality.js`|Giữ nguyên từng byte: camera, worker MediaPipe, ID hai tay, mapping, mirror, pinch/lọc, điều chỉnh resolution.|
|`interaction.js`|Chỉ thay tích lũy roll/pitch và delta hai tay, giữ cơ chế quyền sở hữu, mất dấu, release.|
|`physics.js`, `lesson-geometry.js`|Giữ nguyên: Rapier, static bàn từ kích thước mesh thật, fixed step, collider, collision/CCD, vận tốc, friction, sleep, recovery.|
|`pourable.js` (mới)|Dung tích/volume/mixture sống, hình miệng, normal, mép thấp nhất, mặt thoáng, lưu lượng, đích, tràn. Dùng chung beaker/flask/tube/bottle/dropper.|
|`liquid-simulation.js` (mới)|Lập lịch dòng chảy 80 ms, dt chặn 120 ms tránh burst sau tab treo, một phép chuyển trên mỗi bình, tràn khi quá dung tích.|
|`liquid-visual.js` (mới)|Clipping vật liệu + buffer mặt thoáng; không dựng lại LatheGeometry mỗi lần lượng chất đổi.|
|`reaction-visuals.js` (mới)|AgCl trắng, Cu(OH)₂ xanh, CaCO₃ trắng; hiệu ứng phụ thuộc lượng có thật trong mixture. Không tạo sản phẩm.|
|`spill-ledger.js` (mới)|Bảo toàn và kiểm tra dữ liệu tràn khi lưu/mở; tối đa 128 dòng, phần cũ gộp thành tổng.|
|`lesson-chemistry.js`|Phát sự kiện có nguồn; rót huyền phù mang theo kết tủa, kim loại rắn Fe/Cu giữ riêng. Phản ứng/tỉ lượng cũ giữ nguyên.|
|`lessons.js`, `lesson-visuals.js`|Đích rót hình học mới, lượng liên tục, kiểm tra Fe ngập mặt thoáng thật; thu gọn UI, nhãn, tín hiệu khí, logger/câu hỏi.|
|`student-logger.js` (mới)|Opt-in, sự kiện tối thiểu, t_ms/sequence, tối đa 3000, export/xóa; không video/landmarks/network/localStorage.|
|`ai-tutor.js` (mới)|Baseline theo quy tắc: kiểm tra bình nhận, hướng dẫn, giải thích bài, gợi ý câu sai, tách lỗi tracking. Luôn có `source: rules`.|
|`main.js`, `server.py`|Ghép module vào vòng lặp/transfer cũ, aliquot API, import nguyên tử, giữ đường đồng rắn riêng, UI sự kiện.|
|`environment.js`, `render3d.js`, `index.html`, `styles.css`, `lessons-thpt.json`|Bàn/camera, visualization, bố cục/nhãn. JSON bài chỉ thêm shortLabel, không gán lại lớp/chủ đề.|

Không thay dependency: Three.js 0.180.0, Rapier 0.17.3, MediaPipe Tasks Vision 0.10.32. Giữ model, vendor, fonts, chuẩn độ, 100 phương trình và Python chemistry cũ. `preserved_modules.json` xác minh 14 module bất biến bằng SHA256.

## Dòng dữ liệu và các bất biến

MediaPipe worker → `Interaction` → mục tiêu kinematic → Rapier fixed step → pose mesh thực → hình học miệng/mặt thoáng → chuyển aliquot vào engine hóa học → cập nhật lượng/hiện tượng → màn chiếu, câu hỏi, nhật ký.

Không ép mesh theo tay sau khi thả. Mesh nhận pose từ body. Đường rót đọc pose đã mô phỏng, không đọc trực tiếp góc tay đích khi body chưa xoay tới đó. Khi mất tracking ngắn, owner vẫn giữ và dòng đang do tay điều khiển dừng; timeout release cũ không thay đổi.

Thể tích: `nguồn trước − nguồn sau = đích tăng + tràn`. Mol/protein/indicator theo aliquot tương ứng, sau đó phản ứng tiêu thụ/sinh chất theo engine. Nguồn không âm, đích không vượt capacity. Khi HTTP đang xử lý, version/epoch và reservation ngăn phản hồi cũ ghi đè bàn mới. Một request đã được dự trữ hợp lệ được commit nguyên tử dù người dùng vừa thả tay. API lỗi/khóa nguy cơ không bị coi là một lượng tràn.

`PourableContainer` dùng tích phân mẫu trọng số 24×24 trong tiết diện, tìm mức lỏng bằng chia đôi 18 bước. Cache theo volume/quaternion; bình không thay đổi không tính lại mặt thoáng. Mặt phẳng thế giới ngang; normal biến đổi về local chỉ để tìm giao tuyến. Mô hình giả định scale đồng nhất của dụng cụ hiện tại và bình nằm trực tiếp dưới scene, không có parent transform phi đồng nhất.

Góc bắt đầu cần ≥45° **và** mức lỏng chạm mép; chai ít dung dịch không nhất thiết rót ở 45°. Tốc độ danh định khi úp: cốc 32 mL/s, chai/bình tam giác 18, ống nghiệm 4, ống nhỏ giọt 0,8; có hệ số góc. Đây là lựa chọn tương tác, chưa hiệu chuẩn với chất lỏng/vòi thật. Phần dư cuối vẫn rót hết, không dùng giảm lũy thừa để để lại lượng vô hạn.

Vũng tối đa 24 mesh tái dùng; sổ lượng tràn độc lập với số vũng hiển thị. Hạt kết tủa tối đa 32 instance/bình, cập nhật cùng nhịp chất lỏng; thời gian lắng minh họa 8 s. Chưa mô phỏng phản ứng trên mặt bàn. Bộ sinh bọt chỉ nhận sự kiện khí của engine.

## Thông số vật lý giữ nguyên

| Tham số | Giá trị |
|---|---:|
|Đơn vị scene|0,1 m / unit|
|Gravity / fixed step|−9,81 m/s² / 1/120 s|
|Tốc độ held / gần vật khác|0,75 / 0,14 m/s|
|Tốc độ góc held|4 rad/s, không giới hạn góc tích lũy|
|Vận tốc release|EMA 40 ms; gain 0,55; cap 0,40 m/s|
|Friction bàn / dụng cụ|0,82 / 0,75|
|Restitution|0,02; thành biên 0|
|Linear/angular damping|1,1 / 2,4|
|CCD substeps|4|

Bàn rộng 30→36 scene units; depth 9 và thickness 0,14 giữ nguyên. `LabPhysics` lấy BoxGeometry và world transform của mesh nên static collider đổi theo, không có kích thước collider viết cứng riêng. Giới hạn X tối đa 7→8,5 nhưng thực tế còn phụ thuộc camera/aspect; không tuyên bố mọi cửa sổ đều có cùng vùng thao tác. Camera fit chừa đủ biên trước; resize khi đang cầm vẫn dùng cơ chế cũ, không kéo vật về giữa.

Chưa có bằng chứng để giảm solver/CCD hoặc bỏ biên. Chi phí physics đo khoảng 0,92 ms/frame ở GPU phần mềm; inference khoảng 72 ms. Các luồng vẫn tách: camera frame mới → worker; Rapier fixed timestep; liquids 80 ms; render requestAnimationFrame. Không tăng resolution CV.

## Giao diện và nghiên cứu

Chọn lớp/chủ đề/bài ở sidebar; bắt đầu thu gọn và trở lại đầu trang. Các chức năng phụ không xóa, chuyển vào phần mở rộng. Nhãn chứa tên ngắn + lượng, thông tin nồng độ ban đầu nằm trong inspector/tooltip. Phông Be Vietnam Pro đóng kèm, không tải từ mạng.

Nhật ký ghi thao tác, lượng chất, sản phẩm/điều kiện thành công, từ chối, tracking-gap/recover, câu trả lời trắc nghiệm và văn bản học sinh chủ động lưu. Các sự kiện không chắc chắn về CV có nhãn riêng. Mặc định tắt, tắt ghi/xóa sẽ xóa bộ nhớ; không thu danh tính. Export do người dùng bấm; file đã tải không bị xóa bởi nút xóa trong ứng dụng.

Tutor dùng các quy tắc và nội dung đã có trong bài. Chưa suy luận/chấm câu tự luận, không phân loại mức hiểu, không dùng kết quả thao tác sai để gắn nhãn học sinh. Những chỉ số nghiên cứu Macro-F1/balanced accuracy và so sánh thao tác–ngôn ngữ–kết hợp là hướng tiếp theo, **chưa có kết quả**. Không cần API key; chưa gọi mô hình ngoài.

## Tài liệu API đối chiếu

- [Rapier — vị trí rigid body và kinematic targets](https://rapier.rs/docs/user_guides/javascript/rigid_body_position/).
- [Three.js — Material/clippingPlanes](https://threejs.org/docs/pages/Material.html).
- [Three.js — WebGLRenderer/localClippingEnabled](https://threejs.org/docs/pages/WebGLRenderer.html).

Tệp kiểm thử, số đo, tiêu chí chưa đạt và checklist webcam thật nằm ở `VALIDATION_V35.md` và `docs/MANUAL_CHECK_V35.md`.
