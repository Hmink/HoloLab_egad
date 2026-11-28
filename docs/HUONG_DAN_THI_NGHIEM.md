# HoloLab AR — phòng thí nghiệm hóa học ảo (chuột và bàn tay)

Phòng thí nghiệm Hóa học 3D chạy trên trình duyệt: lấy dụng cụ, rót, trộn và quan sát hiện tượng của 10 bài thực hành lớp 10–12. Điều khiển bằng **chuột** hoặc bằng **bàn tay trước webcam** (MediaPipe, chạy hoàn toàn trên máy, không gửi hình ảnh đi đâu).

Dựa trên HoloLab V3.9, có bổ sung **Hỗ trợ tay** (11/2026): vật nằm ngay dưới tay, tự căn miệng bình và rót nhẹ. Chi tiết kỹ thuật và số đo: [`BAO_CAO_THAO_TAC_TAY.md`](BAO_CAO_THAO_TAC_TAY.md).

> Đây là mô hình giáo dục có giới hạn. Các bài có ghi "Phân lớp đề xuất" cần giáo viên xác nhận trước khi dùng chính thức. Mô phỏng không thay thế thí nghiệm thật và hướng dẫn an toàn của giáo viên.

---

## 1. Cài đặt và khởi động

**Cần:** Python 3.10 trở lên; trình duyệt Chrome hoặc Edge bản mới; webcam (chỉ khi dùng tay). Không cần cài Node để chạy, vì giao diện và thư viện đã được đóng kèm trong `frontend/web/`.

1. Mở terminal tại thư mục `backend/` của repo.
2. Cài thư viện hóa học (một lần):
   ```bash
   pip install -r requirements-core.txt
   ```
3. Chạy server:
   - Windows: `py -3 server.py --browser-tracking` (hoặc nháy đúp `START_WINDOWS.bat`)
   - Linux/macOS: `python3 server.py --browser-tracking` (hoặc `bash START_LINUX.sh --browser-tracking`)
4. Trình duyệt tự mở http://127.0.0.1:8765. **Giữ cửa sổ terminal mở** trong suốt buổi thực hành; đóng nó là ứng dụng dừng.

Không mở `frontend/web/index.html` bằng cách nháy đúp (đường dẫn `file://`), vì ứng dụng cần server.

`--browser-tracking` cho nhận diện tay chạy trong trình duyệt (khuyên dùng). Bỏ cờ này nếu bạn đã cài bộ nhận diện Python (`SETUP_FAST_TRACKING_WINDOWS.bat`).

**EGAD · Giải thích** dùng mô hình ngôn ngữ chạy cục bộ (Ollama, Qwen3). Nếu chưa cài Ollama, lab vẫn chạy bình thường và EGAD báo chưa có mô hình. Cách cài: README ở thư mục gốc.

---

## 2. Quy trình một buổi thực hành

1. **Vào học:** trang đầu tiên là trang giới thiệu. Bấm **Bắt đầu học** (khu học tập) hoặc **Khám phá thí nghiệm** (thư viện).
   - **Tổng quan:** tiếp tục phiên đã lưu gần nhất và xem hoạt động gần đây.
   - **Thư viện thí nghiệm:** danh sách 10 bài. Tìm theo tên bài, chủ đề hoặc hóa chất (gõ không dấu cũng được); lọc theo lớp và chủ đề.
   - **Lịch sử học:** các phiên đã lưu trên trình duyệt này.
   Chọn một bài (hoặc nút **Bắt đầu**), đọc mục tiêu và các bước, bấm **Bắt đầu thực hành**. Dụng cụ và hóa chất của bài được đặt sẵn trên bàn. Nút **‹ Thư viện** trên thanh công cụ đưa bạn về danh sách bài.
   - Có thể mở thẳng một bài bằng đường dẫn, ví dụ `http://127.0.0.1:8765/#/learn/experiments/chloride`.
2. **Đọc bảng hướng dẫn** phía sau bàn: mục tiêu, phương trình dự đoán, thao tác và quan sát. Dòng thông báo phía trên cập nhật theo từng bước.
3. **Thao tác** bằng chuột (mục 3) hoặc bằng tay (mục 4).
4. **Quan sát:** màu, kết tủa, bọt khí, thể tích, pH. Rê chuột lên nhãn vật để xem thành phần và lượng chất.
5. **Giải thích:** bấm **EGAD · Giải thích** để trả lời câu hỏi của bài (cần tích chọn đồng ý ghi sự kiện thực hành). Kết quả là gợi ý, **không phải điểm**.
6. **Lưu** phiên nếu muốn làm tiếp sau (lưu trên trình duyệt của máy này); **Bắt đầu lại** để làm lại từ đầu.

---

## 3. Điều khiển bằng chuột

| Thao tác | Cách làm |
|---|---|
| Lấy dụng cụ / hóa chất | Kéo thẻ ở kho bên phải thả vào bàn |
| Di chuyển bình | Giữ chuột trái trên bình và kéo |
| Nghiêng để rót | Giữ chuột phải và kéo; hoặc chọn chế độ **Nghiêng / rót** rồi kéo chuột trái |
| Đưa gần / xa (chiều sâu) | Chế độ **Gần / xa**, hoặc con lăn chuột |
| Thả | Nhả nút chuột: bình trở về mô phỏng vật lý (có thể đổ nếu thả nghiêng) |
| Dựng thẳng bình đang chọn | Nút **Dựng thẳng** hoặc phím `W` |

**Rót bằng chuột:** đặt miệng bình nguồn **ngay phía trên** miệng bình nhận, **cùng chiều sâu**, rồi nghiêng quá 45°. Hoặc khi đã căn xong, chọn bình nguồn và nhấn `P` để rót một lượng chuẩn. Phần Hỗ trợ tay **không** áp dụng cho chuột.

---

## 4. Điều khiển bằng bàn tay (webcam)

### Chuẩn bị
- Ngồi cách webcam khoảng 50–80 cm, **đủ sáng**, nền phía sau đơn giản. Không để nguồn sáng mạnh sau lưng.
- Giơ tay sao cho **cả bàn tay** nằm trong khung hình. Vùng điều khiển phủ cả cửa sổ ứng dụng, nên chỉ cần di chuyển tay vừa phải.
- Bấm **Bật camera** và cho phép trình duyệt dùng webcam. Khung camera nhỏ hiện khung xương bàn tay; dòng trạng thái hiện `Tay A · Phải` hoặc `Tay A · Trái`. **Dừng** để tắt camera.
- Để công tắc **Hỗ trợ tay** ở trạng thái bật (mặc định). Lựa chọn này được nhớ cho lần sau.

### Cử chỉ
| Việc | Cử chỉ |
|---|---|
| Con trỏ | Điểm giữa đầu ngón cái và ngón trỏ, hiển thị là vòng tròn có chữ **A** (tay thứ hai là **B**) |
| Biết sẽ gắp vật nào | Đưa tay lại gần: **vạch sáng dọc thân vật** cho biết chụm tay lúc này sẽ gắp vật đó |
| Gắp | **Chụm** ngón cái và ngón trỏ. Vòng tròn đậm lên; thân bình tự trượt về ngay dưới tay |
| Di chuyển | Giữ chụm và di chuyển tay. Khi Hỗ trợ tay bật, chiều sâu được giữ nguyên |
| Nghiêng bằng tay (khi tự rót) | Giữ chụm và **xoay cổ tay** như vặn tay nắm cửa |
| Thả | **Mở** hai ngón ra |
| Lấy từ kho | Chụm trên thẻ ở kho bên phải rồi kéo vào bàn |
| Bấm nút | Chụm trên nút |
| Xoay 3D | Đổi chế độ cử chỉ sang **Xoay 3D** (phím `G`) |
| Đổi chiều sâu khi Hỗ trợ tay bật | Dùng **hai tay** cùng gắp một vật: kéo hai tay ra xa / lại gần |

### Rót với Hỗ trợ tay
1. Gắp bình nguồn và đưa nó lên **phía trên** bình nhận (chỉ cần gần thẳng hàng theo chiều ngang).
2. Khi thấy dòng **"Đã căn miệng … trên …"**, bình đã được căn đúng miệng, kể cả chiều sâu. Bình nhận được giữ cố định để không bị đổ.
3. **Giữ yên tay** khoảng 0,7 giây. Bình nghiêng chậm và rót **khoảng 2 mL**, với tốc độ tối đa 1,5 mL/s, rồi tự dựng lại. Thông báo: **"Đã rót khoảng 2 mL …"**.
4. Muốn rót thêm: **nhích tay** một chút rồi giữ yên lần nữa. Muốn dừng giữa chừng: **di chuyển tay**.
5. Nhấc bình ra chỗ trống rồi mới thả. Nếu lỡ thả khi bình còn ở trên bình khác, bình **tự trượt về chỗ đã lấy** rồi mới đặt xuống.
6. Hệ thống không rót vào bình nhận đã đầy khoảng 85%.

Tắt Hỗ trợ tay nếu muốn tự căn và tự nghiêng hoàn toàn. Khi đó chiều sâu đổi theo khoảng cách từ tay đến camera, và bạn phải tự căn miệng bình bằng mắt.

---

## 5. Hướng dẫn từng bài

Với các bài rót, cách làm chung là: gắp chai hóa chất ở cột "Rót", đưa lên trên bình ở cột "Vào", rót, rồi quan sát.

| Lớp | Bài | Rót | Vào | Quan sát mong đợi |
|---|---|---|---|---|
| 10 | Nhận biết ion chloride | AgNO₃ | Mẫu NaCl (đã acid hóa HNO₃); sau đó thử với nước đối chứng | Kết tủa **trắng** AgCl, vẩn đục rồi lắng; nước đối chứng không có kết tủa |
| 11 | Màu chỉ thị và môi trường acid–base | NaOH, rồi HCl | Bình mẫu (nước + phenolphthalein) | Hồng khi thêm NaOH; mất màu khi thêm đủ HCl; theo dõi pH |
| 11 | Nhận biết ion ammonium | NaOH | Mẫu NH₄Cl | Sau đó gắp **giấy quỳ đỏ ẩm**, giữ ngay **trên miệng** bình (không nhúng): quỳ hóa **xanh** do NH₃ |
| 12 | Sắt đẩy đồng khỏi dung dịch muối | (không rót) | Bình CuSO₄ | Gắp **thanh sắt**, hạ đầu thanh ngập vào dung dịch và giữ: đồng **đỏ nâu** bám vào, màu xanh nhạt dần. Nhấc ra thì dừng |
| 12 | Phản ứng màu biuret | Thuốc thử biuret (ít) | Ống protein; sau đó ống nước đối chứng | Protein chuyển **tím**; đối chứng giữ màu xanh nhạt |
| 11 | Trung hòa acid–base *(đề xuất)* | NaOH | Mẫu 20 mL HCl 0,10 M + chỉ thị | pH tăng dần; so sánh trước, tại và sau khoảng 20 mL NaOH; hồng khi base dư |
| 12 | Kết tủa copper(II) hydroxide *(đề xuất)* | NaOH | Mẫu CuSO₄ | Kết tủa **xanh** Cu(OH)₂ |
| 12 | Kết tủa calcium carbonate *(đề xuất)* | Na₂CO₃ | Mẫu CaCl₂ | Kết tủa **trắng** CaCO₃ |
| 11 | Acetic acid và hydrogencarbonate *(đề xuất)* | CH₃COOH | Mẫu NaHCO₃ (để **mở nắp**) | **Bọt khí** CO₂ không màu; bọt không phải kết tủa |
| 11 | Pha loãng dung dịch *(đề xuất)* | Nước | 100 mL CuSO₄ 0,05 M | Màu xanh **nhạt dần**; số mol Cu²⁺ không đổi, không có chất mới |

Ví dụ chi tiết với bài **Nhận biết ion chloride**:
1. Bắt đầu bài. Trên bàn có chai AgNO₃, ống **Mẫu NaCl** và ống **Nước đối chứng**.
2. Gắp chai AgNO₃, đưa lên trên ống Mẫu NaCl, chờ dòng "Đã căn miệng…", giữ yên tay.
3. Sau khoảng 2 mL: ống NaCl vẩn đục trắng (AgCl). Thông báo đổi thành "Kết tủa AgCl trắng…".
4. Nhích tay, đưa chai sang trên ống **Nước đối chứng**, rót tương tự: không có kết tủa.
5. Đặt chai về chỗ trống rồi thả tay. Bấm **EGAD · Giải thích** để trả lời câu hỏi của bài.

**Bài cần lượng lớn** (trung hòa, pha loãng): mỗi lần hỗ trợ chỉ rót khoảng 2 mL. Hãy rót nhiều lượt, dùng chuột, hoặc tắt Hỗ trợ tay để tự nghiêng. Lượng mỗi lần chỉnh được ở `doseMl` trong `frontend/web/src/pour-assist.js`.

---

## 6. Phím tắt (chọn vật trước khi dùng các phím chỉnh vật)

| Phím | Tác dụng | Phím | Tác dụng |
|---|---|---|---|
| `Space` | Thả mọi vật đang giữ | `G` | Đổi chế độ cử chỉ (kéo ↔ xoay 3D) |
| `A` / `D` | Nghiêng trái / phải | `J` / `L` | Xoay quanh trục đứng |
| `W` | Dựng thẳng | `K` | Đậy / mở nắp |
| `P` | Rót một lượng (khi đã căn miệng) | `Delete` | Xóa vật đang chọn |
| `R` | Dọn bàn | `E` / `O` | Xuất / mở phiên dạng JSON |
| `T` / `C` / `H` | Kho: dụng cụ / hóa chất / nguy cơ | `[` / `]` | Trang trước / sau của kho |

---

## 7. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Không mở được trang / trang trắng | Kiểm tra terminal còn chạy; mở đúng http://127.0.0.1:8765; không mở file HTML trực tiếp |
| Không thấy tay / "chưa nhận diện" | Tăng ánh sáng, đưa cả bàn tay vào khung, lùi xa camera một chút; kiểm tra quyền camera của trình duyệt |
| Vật bị thả khi đang cầm | Tay ra khỏi khung hoặc bị che quá 0,7 giây. Giữ tay trong khung, tránh để hai tay chéo nhau |
| Khó gắp | Chờ vạch sáng hiện trên vật rồi mới chụm; chụm dứt khoát; chỉnh ngưỡng chụm (thanh trượt trong phần cài đặt camera) |
| Đưa bình lên mà không thấy "Đã căn miệng" | Bình nguồn phải ở **phía trên** bình nhận và gần thẳng hàng; bình nhận phải đứng thẳng và chưa đầy |
| Rót xong mà không có hiện tượng | Đúng cặp hóa chất chưa? Lượng có thể quá ít: rót thêm một lượt |
| Dòng trạng thái báo sai tay Trái/Phải | Báo lại cho nhóm phát triển (nhãn đã được đổi chiều theo thử nghiệm với webcam, có thể khác giữa các máy) |
| Chạy chậm | Đóng tab khác; bật tăng tốc phần cứng của trình duyệt; tắt camera khi chỉ dùng chuột |

---

## 8. Quyền riêng tư

- Hình ảnh webcam chỉ được xử lý trên máy này, không lưu và không gửi đi.
- Sự kiện thực hành chỉ được ghi khi bạn tích chọn đồng ý, và chỉ lưu trên trình duyệt của máy. Có thể xuất hoặc xóa.
- Phiên đã lưu nằm trong trình duyệt của máy này.

---

## 9. Cho người phát triển

```bash
cd frontend
npm ci
npm test            # 156 test JavaScript
npm run build       # dựng lại web/ui/ (thư viện bài) và web/app/ (ứng dụng EGAD)
```

```bash
cd backend
pip install -r requirements-dev.txt
python -m unittest discover -s tests -v    # 124 test Python
```

Kiểm tra trình duyệt: `frontend/tools/qa_mouse_v39.mjs`, `qa_egad_v39.mjs` (cần Playwright; đặt `PLAYWRIGHT_PACKAGE`, và `PYTHON` tới Python có `sympy`).

| Thư mục | Vai trò |
|---|---|
| `frontend/web/src` | Three.js, chuột, nhận diện tay, vật lý, hóa học. Hỗ trợ tay: `interaction.js`, `pour-assist.js`, `main.js` |
| `frontend/web/data` | Bài học, rubric, câu hỏi |
| `frontend/web/vendor`, `frontend/web/models` | Thư viện và model nhận diện tay chạy cục bộ |
| `frontend/ui` | Mã nguồn khung thư viện bài (React) |
| `backend/server.py`, `backend/lab3d`, `backend/chemlab`, `backend/data` | Server và lõi hóa học Python |
| `frontend/tests_js`, `backend/tests`, `frontend/tools`, `backend/tools` | Kiểm thử và công cụ |

Các thông số Hỗ trợ tay (khoảng căn, lượng rót, tốc độ, thời gian giữ yên) nằm ở `ASSIST_DEFAULTS` trong `frontend/web/src/pour-assist.js`, và `HAND_PICK_PX`, `ASSIST_RATE_ML_S` trong `frontend/web/src/main.js`.

Giấy phép: `LICENSE`; thư viện bên thứ ba: `docs/THIRD_PARTY.md` và `licenses/`.
