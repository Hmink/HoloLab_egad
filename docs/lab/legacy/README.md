# ChemLab CV 3D — bản sửa tương tác 2.1

Ứng dụng Python để gắp dụng cụ 3D từ kho, nghiêng bình và tự phối trộn chất trên bàn webcam.
Bản 2.1 sửa lỗi mất dụng cụ khi mất dấu, bổ sung chọn tay, vùng điều khiển tùy chỉnh và tối ưu vòng vẽ. Bình và các mesh 3D được giữ lại.

## Chạy trên Windows của bạn (Python 3.13)

Giải nén thành thư mục mới. Mở PowerShell **ngay trong thư mục có `app.py`**.
Không dùng lại môi trường `.venv` Python 3.14 từng gặp lỗi NumPy.

```powershell
py -3.13 -m venv .venv313
.\.venv313\Scripts\python.exe -m pip install --upgrade pip
.\.venv313\Scripts\python.exe -m pip install --only-binary=:all: -r requirements.txt
.\.venv313\Scripts\python.exe app.py --mouse-only --demo
```

Có thể nhấp `setup_windows.bat`, sau đó `run_mouse.bat` thay cho nhập lệnh.
Các tệp BAT dùng thư mục của chính chúng; không cần Activate.ps1 hay npm.

Để chạy bằng tay và webcam:

```powershell
.\.venv313\Scripts\python.exe download_model.py
.\.venv313\Scripts\python.exe app.py
```

Hoặc nhấp `run_camera.bat`. Có thể chép `models/hand_landmarker.task` từ bản cũ sang để khỏi tải lại.
Mô hình không kèm trong ZIP; script tải kiểm tra SHA-256 như bản trước.

Màn hình nhỏ hoặc muốn thử camera khác:

```powershell
.\.venv313\Scripts\python.exe app.py --width 1280 --height 800
.\.venv313\Scripts\python.exe app.py --camera 1
```

Máy cần driver hỗ trợ OpenGL 3.3. Nếu lỗi tạo context, cập nhật driver chính thức Intel/NVIDIA/AMD.
Chưa kiểm chứng trực tiếp webcam/GPU Windows của bạn; `app_2d.py` giữ bản giao diện cũ để đối chiếu cử chỉ.

## Điều khiển tay mới — đọc trước khi kiểm tra

Mặc định điều khiển bằng **tay PHẢI**, vùng **DỄ VỚI**. Chương trình nhận diện tối đa hai tay nhưng chỉ một tay được quyền điều khiển; kích thước tay lớn hơn không được ưu tiên. Khung xanh trong video là vùng tay điều khiển **toàn màn hình**, bao gồm cả kho bên trái.

| Phím | Chức năng |
|---|---|
| B | Đổi PHẢI → TRÁI → TỰ ĐỘNG; đặt vật đang cầm xuống trước khi đổi |
| 1 | DỄ VỚI: chỉ cần di chuyển tay trong vùng giữa ảnh để đi hết màn hình; mặc định |
| 2 | CHUẨN: khoảng di chuyển tay rộng hơn, điều khiển ít nhạy hơn |
| 3 | TOÀN ẢNH: dùng gần toàn ảnh; cần với tay xa hơn, không tăng góc nhìn vật lý |
| F | Bắt đầu hiệu chỉnh → đưa tay tới góc trái trên thoải mái, nhấn F → góc phải dưới thoải mái, nhấn F |
| Space | Đặt dụng cụ đang cầm lên bàn và bắt đầu lại thao tác |

Các tùy chỉnh bằng phím có tác dụng trong phiên đang chạy. Có thể dùng `--hand left --reach easy` khi khởi động, hoặc `run_camera_left.bat`.

**Khi mất dấu:** rót dừng ngay, vật thể đứng yên. Nếu cùng tay trở lại ổn định trong khoảng 2 giây, bạn có thể tiếp tục cầm mà vật không nhảy theo vị trí tay mới. Quá thời gian này, dụng cụ được đặt vào vị trí gần nhất trong vùng bàn; không bị xóa. Mở tay rồi gắp lại. Thả ngoài bàn cũng giữ vật thể. Muốn xóa cần chủ động Backspace hoặc R.

Để lấy đồ, mở ngón cái và trỏ trước cho trạng thái **Sẵn sàng gắp**, đưa con trỏ đến thẻ rồi chụm. Tay quá nhỏ, bị che hoặc cắt khỏi ảnh không thể được suy đoán chính xác; chương trình tạm dừng điều khiển thay vì tiếp tục rót.

**Không có phần mềm nào mở rộng được góc quang học của webcam.** Bản này giữ toàn ảnh camera, không cắt theo khung xanh; yêu cầu camera 1280×720 nhưng driver có thể dùng độ phân giải khác. Vùng điều khiển nhỏ giúp bạn không phải đưa tay đến sát mép ống kính. Hãy thử phím 1 hoặc hiệu chỉnh F trước khi đổi vị trí camera.

Nếu máy xử lý nhận diện chậm, có thể thử `run_camera_fast.bat` (ảnh nhận diện thu nhỏ về tối đa 960 pixel chiều ngang, vẫn giữ toàn góc ảnh). Đổi lại, bàn tay ở xa có ít pixel hơn. Không có cam kết FPS cố định.

## Cách tương tác

1. Chọn tab **Dụng cụ**, gắp một cốc hoặc bình tam giác và đặt lên bàn.
2. Chọn tab **Hóa chất**, kéo chai dung dịch sang bàn. Mỗi chai là một nguồn riêng có lượng hữu hạn.
3. Cầm chai, đưa **miệng chai** lên phía trên **miệng cốc**. Nghiêng cổ tay tương đối từ tư thế lúc gắp ít nhất 45°.
4. Sau khoảng 0,30 giây giữ đúng vị trí, chương trình chuyển một phần chất; giữ lâu sẽ rót tiếp.
5. Dựng lại bình hoặc nhấc ra khỏi miệng cốc để dừng. Mất dấu tay cũng dừng rót ngay.
6. Chọn bình nhận để xem lượng chất. **R** dọn bàn để thiết kế thí nghiệm khác.

Góc dùng đường cổ tay (0) → khớp gốc ngón giữa (9) trong ảnh, không phải góc cổ tay 3D tuyệt đối.
Mỗi bước rót là lượng ảo 10 mL; ống nhỏ giọt là 0,2 mL. Đây không phải lưu lượng chất lỏng vật lý.
Một bình đầy không nhận thêm; chương trình không tự làm mất chất khi tràn.

| Thao tác | Cách thực hiện |
|---|---|
| Gắp/kéo/thả | Chụm và mở tay, hoặc giữ/thả chuột trái trong `--mouse-only` |
| Nghiêng bằng chuột | Giữ vật thể bằng chuột, nhấn A/D nhiều lần; W dựng đứng |
| Rót thủ công | Chọn nguồn, đưa miệng nguồn trên miệng bình nhận, nhấn P |
| Xoay quanh trục đứng | J/L với vật thể đã chọn |
| Đóng/mở nắp | K với bình đã chọn |
| Kho dụng cụ / hóa chất / nguy hiểm | T / C / H |
| Chuyển trang kho | [ / ] hoặc nút < / > |
| Chế độ tự do / hướng dẫn | S hoặc nút dưới kho |
| Lưu / mở lại phiên | F5 / F9; phím thay thế E / O |
| Bỏ vật thể đã chọn | Backspace |
| Dọn bàn / thoát | R / Q hoặc Esc |

Với mẫu đồng rắn, đưa mảnh đồng trên miệng bình và giữ để thêm mẫu. Chưa có mô hình phản ứng của đồng.
Đèn cồn và cân được dựng 3D, hiện chỉ là dụng cụ trưng bày; chưa có gia nhiệt hoặc đo khối lượng qua cân.

## Đã có gì ở bản này?

- Mesh tam giác thực của cốc, bình tam giác, chai, ống nghiệm, ống nhỏ giọt; ánh sáng, thành kính trong, miệng rỗng, nắp và vạch chia minh họa.
- Kho cũng hiển thị ảnh dựng từ chính các mesh; không dùng icon phẳng thay cho vật thể trên bàn.
- Chất lỏng có thể tích riêng; mức đầy của bình tam giác tính từ tiết diện, không tăng tuyến tính theo chiều cao.
- Mảnh đồng rắn và hạt kết tủa là mesh 3D. Dòng rót, bọt và hiệu ứng nguy hiểm là lớp hoạt họa 2D.
- Chuyển chất bảo toàn sổ lượng ion, thể tích mô hình và mẫu rắn. Kết tủa được chuyển như huyền phù trộn đều; chưa lọc/tách lớp.
- Tự chọn bình, hóa chất, thứ tự, số lần rót; không phải đi theo một bài có sẵn.
- Lưu trạng thái và nhật ký JSON, mở lại hoặc chỉnh bố trí thí nghiệm bằng tệp dữ liệu.

## Phạm vi hóa học đang hỗ trợ

| Nhóm chất trong một bình, có thể thêm nước | Mô hình / hiện tượng |
|---|---|
| HCl + NaOH loãng | Trung hòa; lượng sản phẩm và nhiệt độ cuối xấp xỉ đoạn nhiệt |
| CuSO₄ + NaOH loãng | Kết tủa Cu(OH)₂ xanh, lượng ion dư; nhiệt độ chưa xác định |
| HCl + NaHCO₃ loãng | Sinh CO₂, bọt minh họa, ghi lượng khí thoát |
| CaCl₂ + Na₂CO₃ loãng | Kết tủa CaCO₃ trắng; nhiệt độ chưa xác định |

Các nguồn dung dịch loãng có chất tan đều 0,1 M; axit đặc trong kho Nguy hiểm chỉ có mô hình định tính. Phản ứng dùng ion đầy đủ, có ion khán Na⁺, Cl⁻, SO₄²⁻.
Cân bằng ma trận kiểm tra bảo toàn nguyên tố và điện tích; không dùng cân bằng phương trình để đoán sản phẩm.
Đây là mô hình giáo dục giản lược: phản ứng hoàn toàn, chưa tính cân bằng/Ksp, phức chất, động học, tái hòa tan, hoạt độ hoặc thể tích co giãn khi trộn.
Khối lượng dung dịch dùng xấp xỉ mật độ 1 g/mL; nhiệt dung 4,18 J/(g·K), bỏ qua nhiệt dung bình và thất thoát.
Không có dữ liệu nhiệt phản ứng thì hiển thị **chưa có mô hình**, không tự gán 25 °C làm kết quả.
Nếu cần tính khí ở phản ứng chưa có nhiệt, engine dùng nhiệt độ tham chiếu 298,15 K, 101325 Pa; đây không phải nhiệt độ thực đo.

**Thí nghiệm ngoài mẫu vẫn được bố trí và phối trộn.** Nhưng khi tổ hợp vượt bốn nhóm trên, có chất rắn chưa mô hình hoặc vượt giới hạn nồng độ/nhiệt độ, bình mang trạng thái **CHƯA XÁC ĐỊNH**.
Màu xám lúc đó là ký hiệu, không phải dự đoán màu hỗn hợp. Trạng thái này theo hỗn hợp khi chuyển sang bình khác; thêm nước không tự khôi phục kết quả định lượng.
Không có mô hình không đồng nghĩa không phản ứng hoặc an toàn.

## Thí nghiệm nguy hiểm trong thế giới ảo

Mặc định **TỰ DO**: cho phép xem tình huống nguy hiểm dưới dạng hiệu ứng và giải thích:

- H₂SO₄ đặc: phân biệt dung dịch nước đi vào axit (bắn tóe/nhiệt) với chiều ngược lại (nhiệt). Chỉ minh họa nguy cơ; không suy ra nhiệt độ, xác suất hay mức độ an toàn.
- HNO₃ đặc: nguy cơ tỏa nhiệt khi tiếp xúc dung dịch nước, đặc tính oxi hóa trong tình huống với vật liệu dễ cháy ảo.
- HCl đặc: minh họa nguy cơ hơi kích ứng/ăn mòn bằng làn mờ ký hiệu. Không tự tạo lửa khi rót HCl.
- Quy tắc và nguồn tham khảo được tách trong `data/hazards.json`. Chưa có mô hình động học hay nồng độ axit đặc.
- OX + FUEL: minh họa cháy. OX và FUEL là hai vật liệu giả định, không chỉ định thành phần hoặc công thức thật.
- Cố đưa hệ sinh khí vào bình kín: minh họa nguy cơ tăng áp. Không có mô hình áp suất, độ bền bình hay dự báo nổ.

Chuyển sang **HƯỚNG DẪN** để chặn các tình huống đã nhận diện trước khi chuyển chất.
Không có tiêu chí kính/găng tay mở khóa một hỗn hợp thành an toàn. Bộ luật này không bao quát mọi nguy cơ.
Hiệu ứng cháy, bắn tóe, vỡ do áp suất chỉ là hoạt họa định tính. Không dự báo cháy nổ như ngoài thực tế và không dùng làm quy trình thí nghiệm thật. Bộ luật không đánh dấu một tổ hợp là an toàn chỉ vì chưa có hiệu ứng.

## Tự tạo thí nghiệm khác và lưu lại

Không cần viết code: chọn chất và bình từ kho, tự trộn; nhấn F5/E để lưu vào `experiments/my_session.json`.
Tệp chứa bố trí, lượng chất, trạng thái mô hình và tối đa 3.000 sự kiện gần nhất, không chứa ảnh webcam.
F9/O mở lại tệp này; lưu tiếp sẽ thay thế phiên đã lưu. Có thể chỉ định tệp khác bằng `--session`.
Có thể dùng `--log metrics.jsonl` để ghi chỉ số theo khung hình cho nghiên cứu cử chỉ; tệp cùng tên sẽ bị ghi đè, không lưu video/ảnh.

Chạy một bố trí ví dụ:

```powershell
.\.venv313\Scripts\python.exe app.py --mouse-only --experiment experiments/free_lab.json
.\.venv313\Scripts\python.exe app.py --experiment experiments/precipitation.json
```

JSON bố trí mới tối giản:

```json
{
  "schema": "chemlab3d-experiment-1",
  "allow_risk": true,
  "objects": [
    {"stock": "beaker", "x_norm": 0.5, "y_norm": 0.7},
    {"stock": "hcl", "x_norm": 0.2, "y_norm": 0.25},
    {"stock": "naoh", "x_norm": 0.8, "y_norm": 0.25}
  ]
}
```

Tọa độ chuẩn hóa theo bàn, từ 0 đến 1; chương trình giữ vật thể trong vùng nhìn thấy.
Danh mục `stock`: beaker, flask, tube, dropper, lamp, balance, water, hcl, naoh, cuso4, nahco3, cacl2, na2co3, copper, acid_risk, nitric_risk, hcl_risk, oxidizer_risk, fuel_risk.
JSON chỉ là dữ liệu, không thực thi Python.

Muốn thêm **hóa chất/phản ứng chưa có trong danh mục** cần phát triển dữ liệu:

1. Thêm loài hóa học, nguyên tố, pha và điện tích trong `data/chemistry.json`.
2. Thêm nguồn dung dịch vào `lab3d/catalog.py`: nồng độ, ion, hệ số phân ly, nhãn.
3. Thêm phản ứng đã có cơ sở hóa học và phạm vi áp dụng trong JSON, rồi khai báo nhóm chất tương ứng trong `FAMILIES`.
4. Kiểm tra cân bằng nguyên tố/điện tích, chất giới hạn, sản phẩm, nguy cơ và giới hạn mô hình bằng test; nhờ giáo viên thẩm định trước khi coi là bài học đáng tin cậy.

Không có bộ AI tự dự đoán đúng mọi phản ứng. Tổ hợp ba chất có phản ứng cạnh tranh cần engine cân bằng/phản ứng mạng riêng, không tự chạy tuần tự tùy ý.

## Kiến trúc

| Tệp | Vai trò |
|---|---|
| `app.py` | Vòng lặp webcam, bàn tay/chuột, phím, lưu/mở, dựng 3D |
| `chemlab/tracking.py`, `selection.py` | MediaPipe tối đa hai tay, chọn tay theo nhãn và liên tục vị trí |
| `lab3d/camera.py` | Luồng lấy ảnh và nhận diện riêng, chỉ giữ khung mới nhất |
| `lab3d/hand_input.py` | Pinch theo tỉ lệ bàn tay, lọc One Euro, phục hồi khi mất dấu, ánh xạ vùng tay |
| `chemlab/gestures.py` | Bộ lọc và gate cơ sở; hành vi tương tác 2D cũ vẫn dùng module này |
| `data/hazards.json` | Quy tắc nguy cơ định tính, phân biệt loại axit và chiều thêm chất |
| `lab3d/catalog.py` | Dụng cụ/chất và các nhóm phản ứng được hỗ trợ |
| `lab3d/scene.py` | Grab/drag/drop, góc tay, vùng nhận, dwell, giao dịch rót, JSON phiên |
| `lab3d/mixture.py` | Lượng chất từng bình, định lượng, unknown propagation, tình huống nguy hiểm |
| `lab3d/geometry.py` | Lưới tam giác xoay tròn, mức đầy theo thể tích, hướng miệng bình |
| `lab3d/gl_renderer.py` | OpenGL, shader ánh sáng/kính, bộ nhớ đệm mesh |
| `lab3d/ui.py` | Bảng kho, webcam, bảng số liệu, hoạt họa hiệu ứng |
| `chemlab/chemistry.py` | Engine cân bằng và lượng chất dùng lại từ bản trước |
| `chemlab/safety.py` | Ví dụ lockout bản trước; UI 3D dùng chế độ mới ở mixture.py |
| `app_2d.py` | Giao diện cũ để đối chiếu, không có các tính năng 3D |

## Giới hạn hình ảnh và hướng nghiên cứu

Đây là **vật thể mesh 3D chiếu lên bàn màn hình**, chưa là AR định vị trong không gian thật: không có SLAM, che khuất bởi bàn tay, tương tác sâu trục Z hoặc va chạm vật lý chính xác.
Kính dùng transparency và highlights; chưa có khúc xạ quang học, PBR hoàn chỉnh hoặc mô hình Blender/glTF chi tiết.
Mặt chất lỏng xoay cùng bình trong bản này; chưa tự nằm ngang theo trọng lực, chưa mô phỏng chất lỏng/CFD. Thời gian hoạt họa không phải tốc độ phản ứng thật.

Để nghiên cứu KHKT, có thể đo lỗi rót nhầm, thời gian thao tác và độ trễ giữa bản 2D và 3D; kiểm tra hiểu biết về chất giới hạn bằng bài trước/sau có nhóm đối chứng. Phân biệt lỗi vận động với hiểu sai hóa học.
Tính năng 3D tự nó không chứng minh tính mới hoặc hiệu quả học tập. `RESEARCH.md` giữ các hướng đánh giá của bản trước.

## Kiểm tra

```powershell
.\.venv313\Scripts\python.exe -m unittest discover -s tests -v
.\.venv313\Scripts\python.exe app.py --snapshot my_preview.png
```

Xem `VALIDATION.md` để biết môi trường đã kiểm tra và các phần chưa kiểm chứng.
