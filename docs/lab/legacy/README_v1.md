# ChemLab CV — Bản mẫu Python 1.0

Ngày chuẩn bị: 25/10/2026. Python + OpenCV + MediaPipe Tasks.

Mục tiêu của gói này: bạn có thể tự cài, đọc code và chạy thao tác **kho dụng cụ → chụm tay → kéo → đặt lên bàn webcam**. Các tệp được chia nhỏ để thay thuật toán cử chỉ mà không sửa toàn bộ giao diện.

## 1. Phạm vi đã có

| Thành phần | Trạng thái |
|---|---|
| Giao diện tiếng Việt, kho trái / bàn webcam phải, tỉ lệ 3:7 hoặc 1:1 | Đã viết |
| MediaPipe nhận 21 điểm trên một bàn tay, vẽ khung xương trên webcam | Đã viết, có kiểm tra gọi model |
| Con trỏ tay, chụm, giữ, kéo, thả, gắp lại đồ vật | Đã viết |
| Lọc rung One Euro, hysteresis, xác nhận theo thời gian | Đã viết |
| Tạm mất dấu tay: đóng băng, mất lâu: hủy giao dịch kéo | Đã viết |
| Chế độ chuột không cần camera, dùng cùng logic kéo thả | Đã viết |
| 5 dụng cụ và 5 thẻ hóa chất/mẫu vật | Đồ họa 2D; chưa có công năng đo, đốt hay phản ứng |
| JSON có ion, phương trình, hiện tượng, phạm vi mô hình, nhãn nguy hiểm | Có 4 mô hình phản ứng và mẫu SDS có nguồn |
| Cân bằng ma trận, chất giới hạn, khối lượng, khí lý tưởng, nhiệt xấp xỉ | Module riêng; chạy bằng `chemistry_demo.py` |
| Khóa thao tác nguy hiểm | Module và kiểm thử riêng; chưa nối vào giao diện camera |
| Rót, lắc, animation phản ứng, đồ thị T(t), banner đỏ, PPE trên UI | Thiết kế mở rộng ở phần 8; chưa triển khai trong app |
| AR 3D có chiều sâu, che khuất và neo mặt bàn thật | Chưa có; bản hiện tại là lớp đồ họa 2D trên webcam |

Nhãn `SDS?` trên các thẻ hóa chất là thông báo chưa gắn SDS đúng sản phẩm/nồng độ. Đây không phải biểu tượng GHS chính thức. Không tự gán nguy cơ của HCl đặc cho dung dịch HCl 0,1 M. Mẫu H2SO4 có nhãn GHS/NFPA được lưu riêng trong JSON để học cảnh báo.

## 2. Cài và chạy trên Windows

Khuyến nghị Python **3.11 64-bit** trong môi trường riêng. Gói đã được kiểm tra ở Python 3.12/Linux; webcam, driver và cửa sổ Windows cần thử trên máy của bạn.

1. Giải nén ZIP vào `D:\ChemLab_CV_Python`. Thư mục đó phải có `app.py` và `requirements.txt` ngay bên trong. Nếu giải nén tạo thêm một cấp thư mục, mở terminal trong thư mục con chứa `app.py`.
2. Mở PowerShell hoặc Terminal trong VS Code.
3. Chạy từng dòng:

```powershell
cd D:\ChemLab_CV_Python
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe download_model.py
.\.venv\Scripts\python.exe app.py
```

Các lệnh gọi trực tiếp `python.exe` trong môi trường ảo, không cần chạy `Activate.ps1` hay thay ExecutionPolicy của PowerShell. Không chạy bằng `npm` hoặc Vite: đây là ứng dụng Python desktop độc lập.

Nếu đang dùng Python 3.12, thay dòng tạo môi trường bằng `py -3.12 -m venv .venv`. Lệnh `py -0p` liệt kê Python đã cài. Nếu không có lệnh `py`, dùng đường dẫn đầy đủ đến Python đã cài hoặc `python -m venv .venv` sau khi kiểm tra `python --version`.

Lần cài và tải model cần mạng. Sau đó xử lý camera ở máy bạn; app không gửi khung hình lên dịch vụ và không cần API key.

### Chạy thử khi chưa có camera

```powershell
.\.venv\Scripts\python.exe app.py --mouse-only
```

Giữ chuột trái trên thẻ dụng cụ, kéo sang bên phải, rồi thả. Dùng đường này để kiểm tra UI trước khi kiểm tra CV.

### Các tùy chọn thường dùng

```powershell
# Bố cục 1:1
.\.venv\Scripts\python.exe app.py --split 0.5

# Laptop màn hình nhỏ
.\.venv\Scripts\python.exe app.py --width 1152 --height 680

# Camera khác
.\.venv\Scripts\python.exe app.py --camera 1

# So sánh với ngưỡng 40 pixel theo đề bài
.\.venv\Scripts\python.exe app.py --pinch pixels

# Thử bỏ lọc rung
.\.venv\Scripts\python.exe app.py --no-smoothing

# Ghi dữ liệu định lượng cục bộ, không ghi ảnh/video
.\.venv\Scripts\python.exe app.py --log logs\session_01.jsonl

# Kiểm tra module hóa học riêng
.\.venv\Scripts\python.exe chemistry_demo.py

# Kiểm thử logic
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

`--log` ghi đè tệp cùng tên: đặt tên phiên khác nhau để giữ dữ liệu. Nhật ký chứa cấu hình, thời gian tương đối, vị trí con trỏ thô/đã lọc, tỉ số pinch, sự kiện và thời gian xử lý. Thông tin đúng/sai của ý định người dùng cần được người đánh giá gán nhãn; phần mềm không tự biết người dùng định làm gì.

### Linux/macOS

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python download_model.py
.venv/bin/python app.py
```

Đây là app có cửa sổ, cần môi trường desktop. Không dùng `opencv-python-headless`. Trên macOS, wheel MediaPipe đã chọn có bản ARM64; máy Intel/macOS cần kiểm tra wheel tương thích trước khi cài.

## 3. Thao tác bằng tay

1. Đặt một bàn tay trong khung webcam, ánh sáng vừa đủ; mở ngón cái và ngón trỏ để trạng thái chuyển sang “SẴN SÀNG”.
2. Di chuyển tay và quan sát **vòng tròn con trỏ**. Đưa con trỏ tới thẻ “Cốc thủy tinh”.
3. Chụm cái–trỏ và giữ ngắn để gắp. Thẻ sẽ tạo một vật thể mới có mã `#01`.
4. Giữ chụm, kéo con trỏ sang bàn bên phải.
5. Mở tay để thả. Có thể gắp lại vật thể để chuyển chỗ.
6. Chụm lên tab “Hóa chất” hoặc nhấn `C` để đổi kho; `T` về dụng cụ; `R` dọn bàn; `Q`/`Esc` thoát.

Mất dấu dưới 0,35 giây: vật thể đứng yên, không tự thả. Mất lâu hơn: vật mới bị hủy, vật đã có trở lại vị trí ban đầu. Mở tay để bắt đầu thao tác mới. Giữ duy nhất một tay trong vùng điều khiển; phiên bản này chưa giải bài toán danh tính nhiều bàn tay.

**Tại sao vòng tròn không luôn nằm đúng giữa hai ngón trong ảnh?** Camera chỉ ở bên phải nhưng kho ở bên trái. Vì vậy tọa độ tay trong vùng hoạt động 12%–88% của camera được ánh xạ lên toàn cửa sổ. Khung xương vẫn đúng tọa độ ảnh; vòng tròn là con trỏ điều khiển. Vật thể đi theo con trỏ đó. Đây là mô hình điều khiển 2D, chưa phải neo vật thể 3D trực tiếp vào lòng bàn tay trong không gian thật.

## 4. Kiến trúc và thứ tự đọc mã

| Tệp | Trách nhiệm |
|---|---|
| `app.py` | Camera, vòng lặp, lấy input, gọi scene, render, tùy chọn dòng lệnh, ghi log |
| `chemlab/config.py` | Kích thước, bố cục, ngưỡng, vùng điều khiển |
| `chemlab/tracking.py` | MediaPipe Tasks HandLandmarker; trả landmark và thời gian inference |
| `chemlab/gestures.py` | Khoảng cách, ánh xạ tọa độ, One Euro, phát sự kiện grab/release/cancel |
| `chemlab/scene.py` | Kho, vật thể, vùng chọn, giao dịch kéo/thả và hoàn tác |
| `chemlab/render.py` | Đồ họa, text tiếng Việt, video letterbox, vẽ tay, HUD |
| `data/chemistry.json` | Chất/ion, phản ứng, hiện tượng, thông số, SDS, quy tắc khóa |
| `chemlab/chemistry.py` | Cân bằng nguyên tử/điện tích và tính điểm cuối phản ứng |
| `chemlab/safety.py` | Ra quyết định cho phép/khóa mô hình ảo, không sửa lượng chất |
| `chemistry_demo.py` | Ví dụ gọi safety trước rồi mới tính hóa học |
| `tests/` | Các trường hợp kiểm tra có ý nghĩa về tương tác và định lượng |
| `RESEARCH.md` | Đề xuất đề tài, giả thuyết, thiết kế đánh giá, giới hạn kết luận |
| `SOURCES.md` | Nguồn kỹ thuật, nghiên cứu, an toàn và phạm vi sử dụng |

Luồng hiện tại: `camera → tracking → gestures → scene → render`. Backend ở đây là **tầng logic trong cùng chương trình**, chưa cần máy chủ hay cơ sở dữ liệu SQL. Khi có nhiều người dùng, tách `reaction`, `reagent`, `session`, `action_event`, `vessel_state` thành các bảng SQLite/PostgreSQL; không để frame render truy vấn DB mỗi lần.

Luồng mở rộng: `ý định rót → kiểm tra ngữ cảnh → safety → tính thử → kiểm tra bảo toàn/dung tích → commit → hiệu ứng + log`. Khi bị khóa, giữ nguyên trạng thái vật chứa; không để chất đã chuyển rồi mới hiện cảnh báo.

## 5. Hiểu thuật toán chụm tay

Khoảng cách pixel:

`d = hypot((x4-x8)*frame_width, (y4-y8)*frame_height)`.

Không nhân cả x và y với chiều rộng: ảnh 16:9 sẽ làm sai khoảng cách. Độ rộng lòng bàn tay:

`p = hypot((x5-x17)*frame_width, (y5-y17)*frame_height)`.

Chế độ mặc định dùng `r = d/p`: giảm ảnh hưởng của độ phân giải và khoảng cách tay–camera. Ngưỡng khởi đầu `r < 0.30` để gắp, `r > 0.46` để thả, giữ vùng giữa để tránh bật/tắt liên tục. Đây là tham số cần thực nghiệm, không phải hằng số chính xác cho mọi người và góc tay. Lòng bàn tay nghiêng mạnh vẫn làm p thay đổi; cần hiệu chuẩn hoặc bộ ước lượng tốt hơn khi mở rộng.

Chế độ `--pinch pixels` dùng `<40 px` để gắp, `>60 px` để thả. Cả hai chế độ cùng dùng khoảng xác nhận 75 ms. Sự kiện chỉ phát khi đổi trạng thái; nếu tạo vật thể ở mọi frame có `d<40`, một lần chụm sẽ sinh rất nhiều cốc.

`OneEuro` lọc vị trí con trỏ theo thời gian: di chuyển chậm thì lọc mạnh hơn, di chuyển nhanh thì tăng khả năng bám. Bộ lọc này là phương pháp đã công bố, không phải thuật toán mới của đề tài. Ngưỡng, gain và timeout mới là các tham số để bạn thử nghiệm. Mất tracking sẽ reset bộ lọc vị trí và các chuyển trạng thái đang chờ.

## 6. Cơ sở dữ liệu hóa học

Tách 3 cấp:

1. **Species**: hạt hóa học có công thức, số nguyên tử, điện tích, trạng thái. Ví dụ `H_plus`, `OH_minus`, `H2O`.
2. **Reagent**: hóa chất cụ thể trong chai, gồm nồng độ, thành phần ion, sản phẩm nhà cung cấp và SDS. Cùng HCl nhưng khác nồng độ có thể cần nhãn khác.
3. **Vessel state** (bước mở rộng): lượng từng species, thể tích dung dịch, nhiệt độ, dung tích, bình kín/hở, bảo hộ và lịch sử thao tác. Chưa lưu lượng chất trong vật thể UI của v1.

JSON dùng phản ứng ion rút gọn để giảm trùng lặp: `H+ + OH- → H2O`, ion Na+/Cl- vẫn ở ledger nhưng không bị tiêu hao. Bốn phản ứng mẫu: trung hòa; Cu(OH)2 xanh; CaCO3 trắng; hiđrocacbonat tạo CO2. Màu hex phục vụ hiển thị, không phải dữ liệu phổ hấp thụ đo được.

GHS và NFPA 704 là hai hệ thống riêng. GHS có nhóm nguy hại, cấp, biểu tượng, từ cảnh báo; NFPA có health/flammability/instability/special. Không đổi trực tiếp “GHS cấp 1” thành “NFPA mức 1”. Mẫu H2SO4 >95% trích cấu trúc nhãn từ SDS Fisher/Acros AC424525000 sửa ngày 19/12/2025; dữ liệu không đại diện mọi sản phẩm axit sulfuric.

Thiếu dữ liệu nhiệt thì dùng `null`, không dùng `0`. Thiếu phản ứng phù hợp thì báo “chưa có mô hình”, không kết luận “không phản ứng”. Cân bằng chỉ tìm hệ số cho tập chất đã biết; nó không tự đoán sản phẩm, điều kiện hay động học.

## 7. Định lượng: tính được gì, với giả thiết nào?

Từ dung dịch: `n = C_M * V_L`. Từ chất rắn: `n = m_g / M_g_mol`.

Ma trận A có mỗi hàng là một nguyên tố và thêm hàng điện tích. Cột chất tham gia mang dấu dương, sản phẩm mang dấu âm. Giải `A·ν=0` bằng `SymPy.Matrix.nullspace()`, quy đồng phân số rồi rút gọn về số nguyên dương. Không tự chọn nghiệm nếu nullspace nhiều chiều.

Với phản ứng `aA + bB → cC`:

`ξ = min(n_A/a, n_B/b)`; `n_A' = n_A-aξ`; `n_C sinh = cξ`.

Nhiệt giản lược:

`Q_dung_dịch = -ξ * ΔH_phản_ứng`.

`T_sau = T_đầu + Q / (m_dung_dịch*c_p + C_bình)`.

Ví dụ **số liệu mô hình**, 50 mL HCl 0,1 M và 50 mL NaOH 0,1 M tại 25°C, lấy m=100 g, cp=4,18 J/(g.K), C_bình=0, bỏ qua thất thoát:

- ξ = 0,005 mol.
- Với ΔH≈−57.300 J/mol phản ứng, Q≈286,5 J.
- ΔT≈0,685 K; T_sau≈25,685°C.
- 0,090075 g H2O là lượng nước **tạo thêm**, không phải toàn bộ nước dung môi.

Đây là điểm cuối lý tưởng; chưa có phương trình động học để sinh đồ thị T(t) có ý nghĩa vật lý. Muốn có đồ thị theo thời gian, cần mô hình tốc độ phản ứng, truyền nhiệt ra môi trường và kiểm chứng tham số. Không vẽ đường cong ngẫu nhiên rồi gọi là kết quả định lượng.

Với khí: `V = nRT/P`, T tính bằng kelvin, P bằng pascal; kết quả m³ nhân 1000 ra L. Module báo thể tích khí lý tưởng tương đương ở T/P đầu vào; không thay cho lượng khí thật thu được khi có hòa tan, ngưng tụ hoặc rò rỉ. Không dùng mặc định 22,4 L/mol cho mọi điều kiện.

Giới hạn hiện tại: dung dịch loãng, trộn đều, một phản ứng đã biết, xấp xỉ phản ứng hoàn toàn; không Ksp, không động học, không dung dịch đậm đặc, không mô hình điện hóa hay phức chất. Phạm vi code kiểm tra được chỉ là một phần của các điều kiện vật lý; người tích hợp phải kiểm tra tất cả thành phần hỗn hợp, thứ tự phản ứng và hoạt độ trước khi tăng phạm vi.

## 8. Thiết kế bước tiếp theo: rót, lắc và khóa

### Rót

- Không dùng góc đường nối đầu ngón 4–8 làm góc cốc: hai điểm gần trùng nhau khi chụm, góc rất nhiễu.
- Ước lượng góc 2D từ vector cổ tay 0 tới khớp giữa 9, lấy góc tương đối với tư thế lúc gắp. Đây là góc trong ảnh, không phải đo đầy đủ tư thế cổ tay 3D.
- Chỉ chuyển `HOLDING → POURING` nếu nguồn đang được cầm, miệng nguồn ở trên miệng vật nhận, có chất, vật nhận còn dung tích, tracking hợp lệ, góc ≥45° liên tục khoảng 200 ms. Ngừng khi góc <35° hoặc mất mục tiêu/tracking. Các số này là tham số khởi đầu cần thử nghiệm.
- Chuyển lượng chất theo thời gian `dV=min(flow_rate*dt, V_nguồn, dung_tích_còn_lại)`. Lưu lượng là tham số mô hình, không suy ra thể tích thật chỉ từ góc camera.
- Dùng cùng tỷ lệ thể tích để chuyển các ion hòa tan; không chuyển toàn bộ chai ở mỗi frame.
- Kiểm tra safety trên trạng thái trước chuyển. Tính trên bản sao, commit nguồn/đích cùng lúc sau khi vượt các điều kiện.

### Lắc

- Theo dõi vận tốc ngang và các lần đổi chiều trong một cửa sổ thời gian.
- Chỉ đếm đổi chiều khi biên độ/vận tốc vượt ngưỡng đã hiệu chuẩn để loại rung tracking.
- Khóa phân loại lắc khi đang rót, chuyển cảnh hoặc chưa cầm vật chứa.
- Lắc hỗ trợ trộn/tốc độ trong mô hình thích hợp. Không mặc định mọi phản ứng chỉ bắt đầu khi lắc; phản ứng trung hòa có thể xảy ra ngay khi tiếp xúc.

### Safety lockout

`safety.py` đã có logic khóa tình huống nước→axit đặc, oxi hóa mạnh↔dễ cháy, hóa chất bị hạn chế, sản phẩm khí độc, sinh khí trong bình kín, thiếu bảo hộ và thiếu mô hình.

Khi nối UI: banner đỏ cần có **thao tác bị chặn → lý do → quay lại trạng thái hợp lệ**. Nhóm “thiếu PPE” cho phép bổ sung PPE để xét lại. Nhóm “phản ứng/thao tác bị cấm” vẫn bị chặn sau khi có kính/găng; không dùng PPE như nút bỏ qua an toàn. Các rule là mô hình sư phạm ban đầu, chưa phải cơ sở dữ liệu tương kỵ hóa chất hoàn chỉnh.

## 9. Gỡ lỗi

| Dấu hiệu | Cách kiểm tra |
|---|---|
| Không thấy `app.py` / `requirements.txt` | Terminal đang sai thư mục; mở đúng thư mục sau giải nén |
| Không có webcam | Thử `--camera 1`, đóng Teams/Zoom/ứng dụng camera, cấp quyền camera cho desktop apps |
| Chưa có model | Chạy `download_model.py`; xem mạng/proxy; dùng tệp .task đúng, không dùng .tflite riêng lẻ |
| Chụm không gắp | Mở tay trước, đưa vòng tròn lên thẻ, giữ chụm >75 ms; tay quá nhỏ/xa có thể bị loại |
| Tay rất rung | Thêm ánh sáng, giảm nền rối, giữ một tay; chỉnh OneEuro và pinch trong `config.py` |
| Con trỏ đi ngược | Bản này lật ảnh đúng một lần trước nhận diện; đừng tự lật x lần thứ hai |
| `mp.solutions` không tồn tại | Bản này dùng `mediapipe.tasks`; không dán code legacy vào tracker |
| `imshow` lỗi / Qt / thiếu libGL | Chạy trên desktop, cài đúng OpenCV có GUI; Linux có thể cần `libgl1` |
| Hai bản OpenCV cùng cài | Tạo venv sạch; chỉ cài `opencv-contrib-python` theo requirements |
| Cửa sổ cao hơn màn hình | Dùng `--width 1152 --height 680` |
| Muốn chạy offline trên máy khác | Chuẩn bị sẵn wheels đúng OS/Python và tệp model; gói ZIP không chứa model hoặc thư viện |

## 10. Lộ trình tự lập trình

1. Chạy `--mouse-only`; đọc `Scene.handle()` và sửa tên/màu một dụng cụ.
2. Chạy camera; đọc `measure_hand()`, `PinchGate` và `map_pointer()`; thử normalized/pixels.
3. Thu log các điều kiện sáng/khoảng cách khác nhau, kiểm tra gắp sai và mất dấu.
4. Bổ sung `VesselState`, thể tích và nội dung; nối **một** phản ứng trung hòa đã kiểm chứng.
5. Tích hợp rót, kiểm tra bảo toàn và lockout; làm bài tập dự đoán–thực hiện–giải thích.
6. Chỉ sau khi logic đúng mới thêm 3D và hiệu ứng. Đồ họa phải phản ánh state của engine.

Xem `RESEARCH.md` để biến lộ trình này thành nghiên cứu có đối chứng, không chỉ demo giao diện.
