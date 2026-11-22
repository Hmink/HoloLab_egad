# Unreleased

- Sửa phân loại lỗi Gemini: 404 là `model_not_found` (không thử lại, kèm hướng dẫn), mọi 4xx khác không thử lại; thêm `backend/list_models.py` liệt kê model dùng được với key; tách `envfile.py`.
- API EGAD: thêm `question_id` (đưa câu hỏi vào prompt), `session_id` (trả lại nguyên giá trị), `error_code`/`retryable` cho mọi lỗi; `lab_actions` dành riêng cho GĐ4. Frontend gửi các trường mới và hiện nút "Thử chấm lại".
- Frontend mới (Vite + React): khung ứng dụng, trang EGAD thử nghiệm, dữ liệu bài học/rubric nháp, test JS; thêm `docs/API.md`.
- Backend chạy được khi thiếu lõi hóa học (API hóa học trả 503); `/api/health` báo `chemistry`; `GEMINI_BASE_URL` để test.
- Dọn repo: báo cáo/patch lịch sử chuyển vào `archive/`; bỏ launcher Linux trùng.
- EGAD dùng Gemini API (thay adapter llama.cpp `egad_local.py` bằng `egad_llm.py`); endpoint `/api/egad/assess`; cần `consent_cloud`; key chỉ từ môi trường/`.env`.
- Sửa đường dẫn model bàn tay về `web/models/`; phiên bản lấy từ `version.py`; `server.py` báo lỗi rõ khi thiếu mã lõi và không lộ lỗi nội bộ khi thiếu thư viện.
- Thêm `tests/test_egad_llm.py`, `.env.example`.
- Tái cấu trúc thành `backend/`, `frontend/`, `docs/` (thêm `paths.py`; web phục vụ từ `frontend/web/`).

---

# V3.9 · 05/11/2026

- EGAD rubric 4 trạng thái, bằng chứng, lịch sử, câu hỏi gợi mở, quyền đồng ý/xóa/xuất.
- Adapter llama.cpp loopback tùy chọn; không có API key, không kèm trọng số, chưa chạy mô hình thật.
- Kho bên phải dạng lưới, tìm kiếm không dấu, nhóm dung dịch/chất rắn/bình/dụng cụ hỗ trợ/nguy cơ.
- 5 bài bổ sung, nâng tổng lên 10; lượng chất có bảo toàn và điều kiện rót, hiệu ứng kết tủa/khí/pha loãng.
- Không giả pH cho cân bằng carbonate/acetate chưa giải; các bài mới ghi rõ phân lớp chưa xác minh.
- Sửa gợi ý nước đối chứng biuret trước đây bị ghi nhầm thành AgCl.
- Sửa vùng thao tác bị thu hẹp ở màn 640px khi tăng chiều rộng kho.
- Sửa phiên bản health/catalog server còn ghi 3.7.
- Bộ đóng gói loại trừ .env.

# V3.8 Mouse First — 05/11/2026

- React/Vite library and mouse toolbar; existing 5 lessons preserved.
- Mouse move, right-button tilt, depth mode, release on lost pointer/window focus.
- Bounded session undo/redo and local saved sessions.
- Rounded hollow tube profile and fixed rack with removable Rapier joints.
- No changes to MediaPipe model/capture/filters/FSM or chemistry and liquid core.
- Scope and measured limitations: archive/VALIDATION_V38.md. Not full 20-tool/10-lesson completion.

# V3.7 — 30/10/2026

- Profile phát hiện createImageBitmap/resize phía giao diện chặn render trên đường CPU/đồ họa phần mềm. Dùng VideoFrame cho cả CPU/native khi được hỗ trợ; Worker giữ nguyên kích thước ảnh CV và chiều gương.
- Canvas tiền xử lý dùng willReadFrequently cho CPU/native; giữ đường canvas GPU. Không đổi model, confidence, numHands, độ phân giải CV mặc định hoặc thuật toán cử chỉ.
- Nếu tạo/truyền VideoFrame không được hỗ trợ, đóng tài nguyên và tự dùng ImageBitmap; không lặp phép thử lỗi ở mọi frame. Đóng ảnh khi postMessage thất bại hoặc khi phiên camera đã đổi.
- Báo riêng capture/queue/preprocess/model ms, transport và số đo 60 giây; không gộp FPS render với tốc độ tracking.
- Kiểm tra lại release, physics, chất lỏng, bài học, UI, camera giả lập và chuyển dữ liệu ảnh. Chi tiết cùng giới hạn webcam thật/50 FPS: archive/VALIDATION_V37.md.
- Không thêm dependency sản phẩm; đóng gói đầy đủ mã nguồn và thư viện offline.

---

# V3.6 — 29/10/2026

- Sửa pinch-origin bị fist giữ sai trong rotate; mở tay rõ xác nhận nhanh, giữ chống nhiễu một mẫu.
- Mất tracking ngắn giữ tạm; sau 700 ms không có bằng chứng ổn định thì release qua Rapier. Một mẫu nhận lại lẻ không gia hạn vô hạn.
- Phân biệt tracking chậm dưới 10 Hz và mất tracking thật; không rebase điểm neo ở mọi mẫu chậm.
- Chỉnh độ nhạy không parkAll; cấu hình camera/CV/backend/mirror xếp hàng đến khi thả. Worker/backend đổi trên luồng camera đang có.
- Một initPromise, một chuỗi video callback, một inference đang chạy; bảo vệ epoch/sequence khỏi phản hồi cũ.
- Kho bên phải, gợi ý phản ứng/điều kiện/nguồn đọc từ engine và bài học; sửa banner nguy hiểm còn sót sau dọn bàn.
- Fire được engine xác nhận có thêm tia sáng/khói/flash có giới hạn và dispose. Không tự tạo phản ứng nổ, lửa khi pha axit hoặc kết tủa.
- Bổ sung số đo camera thực/ảnh CV/min FPS/debounce; không coi debounce là độ trễ đầu–cuối.
- Không đổi LiquidSimulation, lượng chất, các hằng số Rapier, model MediaPipe, One Euro hoặc thêm dependency sản phẩm.
- Kết quả và giới hạn: archive/VALIDATION_V36.md; chưa nghiệm thu webcam thật/50 FPS trên máy người dùng.

---

# V3.5 — 28/10/2026

- Sửa clamp góc roll/pitch; góc liên tục cho một/hai tay, giữ giới hạn tốc độ physics.
- PourableContainer cho 5 loại bình; mặt thoáng ngang, rót theo mép miệng/trọng lực, lưu lượng liên tục, úp hết, tràn có bảo toàn/lưu phiên. Giữ đường đưa mẫu đồng rắn riêng.
- Bàn rộng hơn, camera/collider/biên khớp; khung thực hành lớn, chọn bài tự thu gọn, nhãn ngắn và tiện ích phụ thu gọn.
- AgCl/Cu(OH)₂/CaCO₃ có độ đục/hạt/lắng theo lượng sản phẩm; giữ engine bài học, điều kiện, câu hỏi và các hiệu ứng cũ.
- Nhật ký học tập opt-in, xuất JSON/xóa; tutor quy tắc thử nghiệm, không gọi hoặc tuyên bố đã huấn luyện AI đánh giá kiến thức.
- MediaPipe, bộ lọc, ID hai tay, pinch/release, camera, Rapier, chuẩn độ và dependency giữ nguyên. Có START_LINUX.sh.
- Kiểm chứng/benchmark/giới hạn: archive/VALIDATION_V35.md. Chưa nghiệm thu webcam thật; benchmark GPU phần mềm không đạt 50 FPS.

---

# V3.4 — 27/10/2026

- Kiểm tra chỗ trống trước khi sinh body; không để collider mới chồng vật đang có, không di chuyển vật đang cầm. Giữ thông số giới hạn vận tốc/va chạm V3.3.
- Thư viện THPT 5 bài, chọn lớp → chủ đề → bài → bắt đầu, tự dọn/nạp đúng hóa chất và lượng ban đầu.
- Engine bài học độc lập: lượng chất hữu hạn, chất giới hạn, pH, kết tủa AgCl, khí NH3/quỳ ẩm, Cu bám Fe, màu biuret định tính. Không phản ứng chỉ vì va chạm.
- Màn chiếu 3D 4 trang, hướng dẫn, nguồn chương trình và 4 câu hỏi có gợi ý mỗi bài.
- Collider cốc rỗng cho bài nhúng Fe, kiểm tra nắp trước khi đóng, lưu/mở phiên bài học gồm lượng chất và pose.
- Không thay CV, pinch/FSM, hai tay, One Euro, camera, chuẩn độ hoặc hóa học cũ. Không thêm dependency.
- Kiểm chứng và giới hạn: archive/VALIDATION_V34.md. Chưa nghiệm thu webcam thực hoặc 50 FPS trên máy người dùng.

---

# V3.3 — 27/10/2026

- Giới hạn tốc độ tịnh tiến/góc của body đang gắp; giảm tốc và dùng shape cast/contact khi gần vật khác.
- Ước lượng vận tốc thả theo frame thực, EMA 40 ms, gain 0,55 và cap 0,40 m/s; loại quán tính khi freeze/treo frame.
- Friction/damping/restitution điều chỉnh vừa phải; sleeping theo dịch chuyển đáy thực và cache bounds giảm CPU.
- Bốn thành chắn và trần theo camera thao tác; giới hạn full collider cho cả held/dynamic; recovery lỗi hiếm, không recenter vật đang gắp.
- Font Be Vietnam Pro local, UI trung tính, tăng cỡ chữ, thu gọn debug, nhãn tập trung dụng cụ đang chọn.
- PBR glass/liquid, beaker có miệng rót, graduations lấy mức từ bộ tích phân thể tích cũ, nhãn chai/rim/rack/thiết bị và bóng tiếp xúc nhẹ.
- 33 file CV/cử chỉ/camera/chuẩn độ/hóa học giữ nguyên. Xem archive/VALIDATION_V33.md cho kết quả và hạn chế, gồm giảm FPS trong phép đo GPU phần mềm.

# V3.2 — 27/10/2026

- Sửa bình lơ lửng sau release: dùng Rapier 0.17.3, chuyển kinematic/dynamic theo owner cuối cùng.
- Thêm static body bàn khớp mesh và collider dụng cụ theo world scale/pivot; chặn đáy collider khi cầm, gravity/fixed-step/CCD/ma sát/sleep khi thả.
- Giữ bình khi tracking mất ngắn, bảo toàn hai owner và thêm quán tính từ chuyển động đã thực hiện.
- Webcam HD mặc định, Low/HD/Full HD, báo độ phân giải thực tế; autofocus có điều kiện, chống kéo giãn, tự giảm tải.
- Giữ model MediaPipe, chuẩn hóa pinch, hysteresis, One Euro, nhãn tay, dữ liệu và các chức năng thí nghiệm. Thêm hook acquire, không thay thuật toán CV.
- Đo riêng CPU physics; log/checklist ở `archive/VALIDATION_V32.md` và `validation_v32/`.

---

# V3.1 — 27/10/2026

- Camera mirror nhỏ phía trên; workspace phòng 3D độc lập phía dưới; kho thu gọn.
- Phòng low-poly, bàn, biển báo, thùng chất thải và hộp găng tay; tài sản tự tạo.
- Trạm chuẩn độ: buret 50 mL, van chụm/xoay có hysteresis và One Euro; pH meter 3D, chỉ thị, đồ thị và export.
- Cân bằng điện tích cho axit axetic; phương trình ổn định số học cho axit mạnh, có tự ion hóa của nước.
- Thư viện 100 phương trình với kiểm tra nguyên tố/chất giới hạn/điều kiện. Tách rõ khỏi phạm vi rót 3D cũ.
- Capture cap 60 Hz, mặc định ảnh 640 px, tùy chọn 960 px; giữ no-duplicate/no-queue và GPU/CPU fallback.
- Giữ nguyên 20 tệp lõi hóa học/dụng cụ. `archive/VALIDATION_V31.md` ghi kết quả và mục tiêu tracking 50 Hz chưa đạt.

---

# V3.0

- Tách ID hai tay, label L/R và quyền điều khiển vật thể. Không còn reset bình chỉ vì nhãn handedness dao động.
- Chuẩn hóa pinch theo palm XY có sửa aspect; hysteresis, debounce và FSM độc lập cho từng tay.
- One Euro cho vị trí, kích thước palm và góc; giữ offset khi gắp; tái neo khi phục hồi/đổi owner.
- Giữ bình khi tracking gián đoạn; dừng rót ngay khi mẫu không hợp lệ; timeout đặt bình tại chỗ, không xóa.
- Thao tác hai bình độc lập hoặc hai tay cùng một bình; wrist tilt, depth và chế độ yaw/pitch.
- Ánh xạ camera/overlay/con trỏ/ray-plane rõ ràng; gần toàn ảnh mặc định; mirror và tỷ lệ video contain.
- Renderer Three.js trực tiếp, cache hình học, giảm cập nhật DOM/overlay dư; DPR động; OrbitControls tách chế độ.
- Worker classic với dynamic ESM import để WASM loader hoạt động; một inference đang chạy, guard mediaTime/epoch; VideoFrame cho GPU nếu hỗ trợ, ImageBitmap fallback.
- Đường MediaPipe Python CPU tùy chọn tái sử dụng detector cũ, bỏ selector cũ; JPEG chỉ đi tới localhost. Thư viện/model Web đóng kèm.
- FPS render, tracking Hz, tuổi mẫu, transport và JSON đo 60 giây riêng biệt.
- Giữ nguyên 20 tệp lõi Python/dữ liệu; adapter hóa học và nhập phiên có kiểm tra, cập nhật kết quả nguyên tử.
- Bổ sung unit, browser QA, replay lỗi và benchmark so sánh. Chưa nghiệm thu webcam thực; xem archive/VALIDATION.md.
