# HoloLab AR — ChemLab V3.0

Bản sửa điều khiển hai tay và giao diện WebGL. Lõi hóa học Python, dữ liệu phản ứng, mẫu thí nghiệm và biên dạng bình của V2.1 được giữ lại. Kết quả kiểm thử và phần **chưa nghiệm thu bằng webcam thật** nằm trong `VALIDATION.md`; không coi tên phiên bản là xác nhận đạt mọi tiêu chí.

## Chạy trên Windows

1. Giải nén toàn bộ ZIP vào một thư mục mới, ví dụ `D:\HoloLab_AR_V3`. Không chạy bên trong cửa sổ xem ZIP và không chép đè thư mục V2.1.
2. Nhấp đúp **START_WINDOWS.bat**. Máy có Python 3.13 sẽ dùng đúng phiên bản này. SymPy/mpmath, Three.js, MediaPipe WASM và model đã có trong gói; đường chạy V3 không cần cài OpenCV/MediaPipe Python, Node hay npm.
3. Trình duyệt mở **http://127.0.0.1:8765**. Dùng Chrome hoặc Edge có WebGL2 và Web Worker; bấm **Bật camera**, chọn cho phép truy cập. Giữ cửa sổ lệnh đang chạy.

Nếu trình duyệt không tự mở, nhập địa chỉ trên. Có thể chạy thủ công trong PowerShell tại thư mục dự án:

```powershell
py -3.13 server.py
```

Nếu cổng đang được dùng:

```powershell
py -3.13 server.py --port 8766
```

Trên Linux/macOS: `sh start-linux-macos.sh` hoặc `python3 server.py`. Cần Python ≥3.10; kiểm thử đóng gói dùng Python 3.12 với `-S`, không lấy thư viện từ site-packages.

**Tùy chọn tăng tốc tracking trên CPU:** nếu Python đang chạy có MediaPipe/OpenCV từ V2.1, V3 có thể dùng lại detector đó và bỏ hoàn toàn bộ chọn một tay cũ. Chọn **Hiệu chỉnh & đo kiểm → Tracking → Python CPU**, rồi Bật camera lại. Nếu chưa có thư viện, chạy `SETUP_FAST_TRACKING_WINDOWS.bat` một lần (cần internet và Python 3.13), sau đó `START_WINDOWS.bat` sẽ dùng `.venv` vừa tạo. Có thể cài thủ công bằng `python -m pip install -r requirements-tracking.txt` trong môi trường ảo. Chế độ Web luôn còn sẵn; `--browser-tracking` tắt đường Python để đối chiếu.

Tự động ưu tiên Web GPU trên GPU phần cứng; trên GPU phần mềm ưu tiên Python CPU nếu có, nếu không dùng Web CPU. Chế độ Python chỉ truyền ảnh JPEG đến **server localhost trên cùng máy**, không đưa lên dịch vụ ngoài. Không cài tự động thư viện từ trong ứng dụng.

**Không mở `web/index.html` bằng file:// và không dùng `python -m http.server`**: giao diện cần API hóa học của `server.py`. Máy không cần internet khi chạy gói đã giải nén. Camera và ảnh nhận diện được xử lý trên máy; nút Lưu phiên chỉ lưu trạng thái dụng cụ, không lưu video.

## Điều khiển

| Thao tác | Cách thực hiện |
|---|---|
| Lấy bình | Đưa con trỏ A/B lên thẻ bên trái; chụm cái và trỏ khoảng 0,06–0,1 giây |
| Kéo/thả | Giữ chụm để kéo; mở ngón đủ rõ khoảng 0,1–0,2 giây để thả |
| Hai vật thể | Mỗi tay gắp một bình; A/B là ID theo dõi, không phải trái/phải |
| Một vật thể, hai tay | Tay thứ hai gắp cùng bình; tâm hai con trỏ kéo bình, hướng đường nối nghiêng bình, khoảng cách hai tay đổi chiều sâu |
| Nghiêng và chiều sâu | Khi giữ: xoay cổ tay để nghiêng, đưa gần/xa camera để điều chỉnh độ sâu tương đối |
| Xoay X/Y | Chọn “Xoay 3D” hoặc G; mở tay sau khi đổi chế độ, rồi chụm/nắm tay và kéo |
| Khi mất dấu | Giữ nguyên bình, dừng rót; trở lại trong 1,8 giây để tiếp tục. Lâu hơn: đặt bình tại chỗ, mở tay rồi gắp lại |
| Thao tác chuột | Kéo thẻ/bình; con lăn đổi độ sâu; dùng khi camera không có quyền truy cập |
| Phím | A/D nghiêng; J/L xoay; W dựng; K nắp; P rót; Space đặt bình; Backspace bỏ mẫu |
| Chọn kho | T dụng cụ; C hóa chất; H tình huống nguy hiểm; [ và ] đổi trang |
| Phiên thí nghiệm | E lưu; O mở JSON; R dọn bàn; S đổi chế độ nguy cơ |

Con trỏ tương tác được ánh xạ từ ảnh camera sang **toàn ứng dụng**, gồm cả kho. Vì vậy nó có thể không nằm đúng trên đầu ngón trong phần video; khung xương vẫn vẽ đúng trên ảnh. Camera không bị crop để lấy một vùng nhỏ. Mặc định dùng vùng 3,5%–96,5% của ảnh làm vùng điều khiển. “Vừa” và “Dễ với” tăng độ khuếch đại di chuyển, không tăng góc nhìn quang học.

Nhấn **Đặt bình** để kết thúc thao tác ngay. Không cố điều khiển bàn tay ngoài khung camera. Giao tay hoàn toàn hoặc che kín có thể làm mất định danh; phần mềm ưu tiên giữ bình khi phân vân, nhưng không bảo đảm phân biệt hai tay giống hệt nhau qua mọi che khuất.

**Xem góc 3D** dành cho OrbitControls bằng chuột và tạm dừng cử chỉ. Bấm trở lại để khôi phục góc thao tác cố định.

## Hóa học được giữ lại

- Kho 19 mục: dụng cụ, hóa chất định lượng, vật liệu rắn và tình huống nguy cơ định tính.
- Chuyển lượng chất hữu hạn; giới hạn dung tích; nắp bình; lưu/mở JSON và các bố trí mẫu cũ.
- Các họ phản ứng đã có: axit mạnh–bazơ mạnh, Cu(OH)₂, CaCO₃ và khí CO₂ từ bicarbonat/axit; cân bằng nguyên tố/điện tích và chất giới hạn trong lõi Python.
- Chỉ nhiệt trung hòa trong miền mô hình có số liệu nhiệt độ. Hỗn hợp chưa có mô hình được ghi “chưa xác định”; không suy diễn là an toàn.
- Axit đậm đặc và nguy cơ cháy, bắn tóe, hơi, áp suất tiếp tục là **hoạt họa định tính**, không có năng lượng nổ/động học/yield được bịa đặt. Đèn cồn và cân vẫn là dụng cụ 3D chưa có mô hình gia nhiệt/cân.
- Chế độ hướng dẫn chặn các nguy cơ đã biết; chế độ tự do cho xem minh họa ảo. Bảo hộ ảo không làm một phản ứng thực trở nên an toàn.

Đưa miệng bình nguồn lên phía trên miệng bình nhận, nghiêng ≥45° và giữ khoảng 0,3 giây để rót. Mỗi lần chuyển danh định 10 mL, hoặc 0,2 mL với ống nhỏ giọt, có giới hạn lượng còn lại/dung tích. Đây là tham số thao tác của phần mềm. Nhận diện gián đoạn, mẫu quá cũ hoặc tay giao không rõ thì dừng chuyển chất.

## Đo trên máy của bạn

1. Bật camera, đặt 5 bình, cho hai tay vào ảnh; chờ 10 giây cho khởi tạo ổn định.
2. Mở **Hiệu chỉnh & đo kiểm → Đo 60 giây**; kéo bình trong khi đo, giữ tab ở phía trước.
3. Bấm **Xuất kết quả** để lưu JSON. So sánh FPS render, tracking Hz, độ tuổi mẫu và DPR. Từ 45 FPS render không đồng nghĩa tracking đạt 45 Hz.
4. Làm phiếu `docs/ACCEPTANCE.md`: 10 lần gắp mỗi tay, giữ 10 giây, gần/xa, giao tay, mép ảnh, mất dấu 0,2–0,5 giây và hai tay cùng bình. Ghi cả thất bại.

Nếu tracking chậm: kiểm tra quyền camera, ánh sáng, bàn tay đủ lớn trong ảnh; đóng ứng dụng đang dùng camera. Đặt chất lượng “Nhẹ” để giảm tải render. Tự động dùng GPU nếu phù hợp, chuyển CPU khi thấy phần mềm giả lập GPU hoặc GPU liên tục quá chậm. Không giảm ngưỡng phát hiện/độ phân giải nhận diện một cách âm thầm để làm đẹp FPS.

Pinch mặc định: bắt 0,43, thả 0,66 theo tỷ lệ khoảng cách đầu ngón/kích thước bàn tay. Có thanh hiệu chỉnh; khi đổi thiết lập, bình được đặt tại chỗ và phải mở tay để gắp lại. Bàn tay quá nhỏ, rung/mờ hoặc nghiêng sát cạnh có thể cần đổi góc camera.

## Mã nguồn và kiểm thử

- `web/src/capture.js`, `hand-worker.js`: ảnh mới, một inference đang chạy, model/CPU/GPU.
- `tracks.js`: ghép hai tay bằng vị trí, vận tốc, tỷ lệ bàn tay; nhãn chỉ là tín hiệu mềm.
- `filters.js`, `interaction.js`: One Euro, hysteresis, FSM, quyền sở hữu, khôi phục.
- `coordinates.js`, `render3d.js`: mirror, aspect ratio, ray-plane, mesh và chất lỏng.
- `main.js`, `metrics.js`: UI, phối hợp, API nguyên tử và benchmark.
- `server.py`, `chemlab/`, `lab3d/mixture.py`, `data/`: adapter và lõi hóa học cũ.
- `native_tracking.py`: tùy chọn tái sử dụng detector Python cũ; trả cả hai tay, không gọi `HandSelector` cũ.
- `tests_js/`, `tests/`, `tools/`, `validation/`: kiểm thử, kịch bản tái lập và kết quả.

Kiểm thử JS thuần không cần npm install: `node --test tests_js/*.test.mjs` (đã kiểm tra bằng Node 24). Chạy kiểm thử Python API: `python -m unittest discover -s tests -p test_web_api.py`. Toàn bộ 90 kiểm thử Python gồm đường desktop cũ cần các gói trong `requirements.txt`; nên cài vào môi trường ảo riêng nếu muốn chạy chúng.

Tái tạo thư viện web: `npm ci` rồi `npm run vendor`. Các phiên bản khóa trong package-lock. Công cụ browser QA cần Playwright và fixture riêng; xem `docs/REPRODUCE.md`. Gói đã phát hành không cần chạy các bước phát triển này.

`app.py`, `app_2d.py` và tài liệu `docs/legacy/` được giữ để đối chiếu. **Chạy app.py là giao diện desktop V2.1 cũ, chưa được vá điều khiển V3.** Đường chạy chính thức của gói này là `server.py` / `START_WINDOWS.bat`.
