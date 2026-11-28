# Phân tích nguyên nhân và các module đã sửa

Nguồn đã đối chiếu: bản Python V2.0, bản Python V2.1 gần nhất, gói Web HoloLab AR ShapeCreator cũ, ảnh lỗi của người dùng và `shape-creator-tutorial/main.js` công khai. Không có video webcam thật của người dùng để xác nhận mọi giả thuyết thị giác.

## Nguyên nhân có bằng chứng

| Vấn đề | Bằng chứng trong mã cũ | Cách xử lý V3 | Kiểm chứng |
|---|---|---|---|
| Dấu vàng mất dù có skeleton | `HandSelector.choose()` loại kết quả khi nhãn khác tay mong muốn và score ≥0,65; skeleton tồn tại không đồng nghĩa controller có đầu vào | Hai track ID độc lập; handedness chỉ là chi phí mềm và nhãn hiển thị | Replay nhãn luân phiên: V2.1 chỉ 2/120 frame điều khiển hợp lệ; V3 120/120 |
| Mắc “đang bắt lại” | `StableHandInput.missing()` reset thời điểm phục hồi; cần liên tục 120 ms hợp lệ, chuỗi xen kẽ không vượt qua được | Giữ owner trong gián đoạn, tái neo ngay khi ghép được track; không đợi lại 120 ms | Replay đúng chuỗi gây lỗi; 0 lần gắp ở V2.1, 1 lần ở V3, giữ đến cuối |
| Tự đặt bình/đổi tay | `generation` đổi gây `hand.reset()` và `scene.cancel()` | Nhãn không reset quyền sở hữu; release chỉ bằng bằng chứng mở tay hoặc timeout/đặt chủ động | Kiểm thử đổi thứ tự kết quả, đổi nhãn và mất dấu |
| Hai tay tranh nhau | Desktop chỉ có một `scene.drag`; bản Web cũ dùng index và trạng thái drag chung | `Map<trackId, state>`, mỗi object có tối đa hai owners; mỗi object cập nhật một lần | Hai bình độc lập, cùng bình, một tay nhả, chuột và tay không cùng giữ |
| Nhảy vị trí lúc gắp/phục hồi | Gán tâm vật thể trực tiếp cho tọa độ ngón hoặc đổi hệ tọa độ mà không tái neo | Giữ offset lúc gắp; rebase khi phục hồi, đổi viewport hoặc owner | Raycaster thật trong browser + replay: target jump bằng 0 tại frame hồi phục |
| FPS thấp | Pipeline desktop đọc ảnh OpenGL về RAM, ghép Pillow/OpenCV rồi hiển thị; ảnh lỗi người dùng hiển thị khoảng 24 FPS | Three.js vẽ thẳng WebGL; tách tracking Worker, bỏ inference lặp frame; giữ native detector khi Web CPU chậm | Benchmark riêng 60 giây, không dùng FPS render thay tracking Hz |

V2.1 thay tỷ lệ pinch XY bằng khoảng cách world XYZ khi có world landmarks nhưng giữ bộ ngưỡng. Đây là **nguy cơ đổi độ nhạy**, chưa đủ bằng chứng xác nhận là nguyên nhân riêng trên webcam người dùng. V3 dùng thống nhất khoảng cách XY đã sửa aspect, chia cho kích thước bàn tay, hysteresis và debounce theo thời gian. Hai ngưỡng bắt/thả mặc định 0,43/0,66 là giá trị khởi đầu cần kiểm nghiệm người dùng.

Khung vùng tay nhỏ của V2.1 là vùng khuếch đại con trỏ, không phải crop detector. V3 bỏ cách hiển thị dễ gây hiểu nhầm và mặc định gần toàn ảnh. Không thuật toán nào mở rộng được vùng quang học camera chưa quan sát.

## Kế hoạch triển khai và kết quả theo module

1. **Đóng băng lõi cũ:** giữ `chemistry.py`, `mixture.py`, catalog, JSON và các test hồi quy. Biên dạng bình được xuất sang `profiles.json`, không thay tỷ lệ hình học theo cử chỉ zoom.
2. **Pinch + FSM:** One Euro cho XY, log kích thước bàn tay và góc liên tục; hysteresis; debounce bắt 55 ms, thả 105 ms; các trạng thái IDLE/HOVER/GRABBING/DRAGGING/RELEASED. Một mẫu nhiễu không tạo release.
3. **Định danh hai tay:** ghép toàn cục hai quan sát với hai track theo vị trí dự đoán, palm scale và nhãn mềm; slot A/B cố định cho tuổi đời track. Giao tay mơ hồ giữ vị trí. Label được tích lũy, không dùng làm khóa object.
4. **Tọa độ và quyền sở hữu:** camera input lật một lần trong Worker; display toggle ánh xạ landmarks tương ứng; video contain không crop; con trỏ phủ toàn ứng dụng; ray-plane chiếu theo camera thật của Three.js. Nhả một owner thì tái neo owner còn lại.
5. **Vòng lặp:** `requestVideoFrameCallback` hoặc fallback có guard `mediaTime`; một bitmap/inference đang chạy, không có hàng đợi frame. Worker trả sequence/epoch/timestamp; kết quả nguồn camera cũ bị bỏ. `requestAnimationFrame` chỉ render và cập nhật các trạng thái thời gian.
6. **Hiệu năng:** hình học bình dùng cache; hình học chất lỏng đổi khi lượng chất đổi; vật thể/particle dùng lại; DOM text/label chỉ ghi khi khác. Overlay cập nhật theo mẫu hoặc kiểm tra timeout. DPR động 0,65–1,0; không tự cắt ảnh nhận diện hoặc hạ confidence để làm đẹp số liệu.
7. **Phản hồi phép đo:** Web CPU/WASM trên SwiftShader chậm, nên thêm `native_tracking.py` dùng detector Python đã có, trả cả hai tay về **cùng** controller mới. Model Web và nguồn ảnh native đều nhận ảnh mirror giống nhau. Detector cũ được dùng lại, logic chọn một tay cũ không còn trên đường V3.
8. **Hồi quy và bàn giao:** test chức năng qua trình duyệt thật, model thật trên ảnh/video đầu vào quy định, replay cử chỉ, benchmark 60 giây và đóng gói thư viện/model cục bộ. Nghiệm thu webcam mục tiêu vẫn là bước còn lại, có phiếu đo rõ ràng.

## Đối chiếu Shape Creator

Mã công khai dùng khoảng cách chuẩn hóa XYZ giữa 4–8 <0,06, phát hiện hai ngón trỏ gần nhau để tạo hình, hai pinch để đổi scale; không phải ngưỡng góc 0,6. Tọa độ được nhân tuyến tính vào mặt phẳng z=0. Render chạy RAF riêng, camera gọi `hands.send`.

V3 học cách tổ chức render và phản hồi trực tiếp, nhưng không sao chép biến `selectedShape` chung. Upstream không có hysteresis, One Euro, ID hai owner độc lập hay điều khiển độ sâu của V3. V3 bổ sung các phần đó và không tự scale dụng cụ hóa học. Vật thể được giữ offset khi gắp; đây là bổ sung của bản vá, không phải tính năng được tìm thấy trong upstream. Không dùng thư viện/asset trả phí.

## Bảng chức năng trước–sau

| Chức năng | V2.1 desktop đã kiểm tra | V3 |
|---|---|---|
| Mesh bình/lọ | Profile quay 3D, ModernGL | Giữ profile, Three.js WebGL; giao diện render khác |
| Controller | Một tay mong muốn, một drag | Hai ID/owner; cùng bình tối đa hai tay |
| Giao tay | Không có ghép toàn cục hai owners | Dự đoán/scale; tạm giữ khi mơ hồ; chưa bảo đảm mọi che khuất |
| Phục hồi | 120 ms liên tục, có thể bị khóa lặp | Ngắn: giữ + tái neo; 1,8 s: đặt tại chỗ, mở để gắp lại |
| Điểm vàng | Phụ thuộc `control_valid`, có thể mất liên tục | Vẽ từ trạng thái controller; vòng mờ khi mất dấu thực |
| Nhãn L/R | Có thể reset controller khi đổi nhãn | Bộ lọc nhãn riêng, slot A/B không đổi do thứ tự kết quả |
| Góc/độ sâu | Các cơ chế cũ không hỗ trợ hai owner | Một tay và hai tay có neo tương đối, giới hạn chiều sâu |
| Hiệu chỉnh vùng | Vùng “easy” mặc định nhỏ | Gần toàn ảnh mặc định; các mức gain có lựa chọn |
| Hóa học, lượng, nắp, nguy cơ | Lõi Python và quy tắc JSON | Dùng lại; kiểm thử hồi quy và API nguyên tử |
| Lưu/mở | JSON phiên/mẫu của desktop | Đọc định dạng cũ; lưu `hololab3-session-1` mới; bản cũ không đọc được định dạng mới |
| Đo hiệu suất | FPS vòng lặp; log native | FPS render, Hz model, tuổi mẫu, transport native, benchmark JSON |
| Chạy | Cài toàn bộ Python/OpenGL | Web runtime đã đóng gói; native CPU tùy chọn dùng thư viện Python cũ |

Các khác biệt có chủ đích: giao diện được chuyển sang trình duyệt để bỏ đường đọc GPU về RAM; không còn phím chọn chỉ một tay; không còn hiệu chỉnh hai góc bằng F, thay bằng các mức vùng tay; timeout 2,0 s của V2.1 đổi thành 1,8 s. Nút/nguồn thí nghiệm và mô hình hóa học không bị xóa. Giao diện desktop cũ vẫn được giữ để đối chiếu, không được gọi là đã vá V3.
