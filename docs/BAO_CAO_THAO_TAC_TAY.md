# Báo cáo: cải thiện thao tác bằng bàn tay trong HoloLab

Ngày: 23/11/2026 · Phạm vi: lab 3D HoloLab V3.9 (`frontend/web/src`) · Trạng thái: đã kiểm thử tự động và thử sơ bộ với webcam thật

## 1. Tóm tắt

Khi điều khiển bằng bàn tay trước webcam, người dùng gặp ba vấn đề: (1) bình hoặc ống nghiệm **trôi xa khỏi tay**; (2) **rất khó rót** từ bình này sang bình khác; (3) nhãn **Trái/Phải bị đảo**. Sau lần thử đầu còn hai vấn đề nữa: rót **quá nhanh**, và **làm đổ ống nghiệm** sau khi rót.

Nguyên nhân chính của (1) là một lỗi tích lũy độ lệch mỗi khi mất dấu tay trong thời gian ngắn. Nguyên nhân của (2) là điều kiện rót đòi hỏi căn chính xác theo cả chiều sâu, trong khi chiều sâu được đoán từ độ lớn bàn tay (rất nhiễu).

Các thay đổi:
- **Sửa lỗi trôi.** Luôn bật.
- **Thêm chế độ "Hỗ trợ tay"** (có công tắc, mặc định bật):
  - vật nằm dưới tay;
  - giữ nguyên chiều sâu;
  - tự căn miệng bình;
  - giữ yên tay để rót từng lượng khoảng 2 mL ở tốc độ tối đa 1,5 mL/s;
  - giữ cố định bình nhận;
  - đặt bình về chỗ cũ khi thả tay trên bình khác.
- **Đổi chiều nhãn Trái/Phải.**

Điều khiển bằng chuột, logic hóa học và mô hình vật lý không đổi. Toàn bộ kiểm thử cũ vẫn qua. Người dùng đã thử với webcam thật và xác nhận bản cuối hoạt động ổn.

## 2. Phương pháp

Vì môi trường phát triển không có webcam, phần lớn phép đo dùng **bàn tay mô phỏng**:
- Kịch bản Playwright đưa chuỗi "quan sát bàn tay" (vị trí, mức chụm, độ lớn bàn tay) vào đúng đường xử lý của ứng dụng (`__lab.replay`, chế độ `?test`). Ứng dụng chạy trên Chromium không giao diện với GPU giả lập.
- Đo khoảng cách trên màn hình giữa con trỏ tay và thân bình, lượng chất lỏng chuyển đi, lượng đổ ra bàn và độ đứng thẳng của ống nghiệm.

Hạn chế của phương pháp: bàn tay mô phỏng không có nhiễu, độ trễ hay hiện tượng mất dấu tự nhiên như webcam thật. Các kết luận định lượng vì vậy chỉ đúng cho các kịch bản đã dựng. Hành vi thực tế được xác nhận qua phản hồi của người dùng sau khi thử trên máy thật.

## 3. Nguyên nhân

### 3.1. Vật trôi xa khỏi tay
Khi gắp, hệ thống ghi lại độ lệch giữa tay và vật (`anchor.offset` trong `interaction.js`). Mỗi lần **mất dấu tay rồi nhận lại**, hệ thống tính lại độ lệch từ vị trí hiện tại để vật không bị nhảy. Nếu trong lúc mất dấu tay vẫn di chuyển, quãng di chuyển đó bị **giữ lại vĩnh viễn** trong độ lệch. Mất dấu ngắn xảy ra thường xuyên khi chụm ngón hoặc khi tay di chuyển nhanh.

Phép đo (bản gốc; mỗi lần mất dấu khoảng 140 ms, trong lúc đó tay đi 65 px):

| Sau lần mất dấu thứ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Khoảng cách tay – vật | 65 px | 130 px | 195 px | 260 px |

Các giả thuyết khác đã kiểm tra và **loại trừ** vì không gây khoảng cách lớn và lâu dài:
- giới hạn tốc độ của vật đang cầm: chỉ trễ tạm thời, tối đa khoảng 90 px khi tay đi nhanh, rồi đuổi kịp;
- thay đổi chiều sâu: lệch tối đa 16 px;
- vòng tròn con trỏ vẽ sai chỗ: không đúng, vòng tròn chính là con trỏ điều khiển.

### 3.2. Khó rót
- **Điều kiện rót** (`pourable.js`): miệng bình nguồn phải nằm thẳng phía trên miệng bình nhận, sai lệch không quá bán kính miệng (ống nghiệm rất hẹp), ở **cùng chiều sâu**, và nghiêng quá 45°.
- **Chiều sâu** được đoán từ độ lớn bàn tay trong ảnh. Chỉ cần xoay cổ tay là độ lớn này đổi. Đo được: khi độ lớn bàn tay giảm 50%, vật lùi từ z ≈ 0,35 về z ≈ −0,48, và trên màn hình 2D không nhìn thấy sai lệch này.
- **Kết quả với bản gốc** (đưa chai AgNO₃ lên ống NaCl rồi xoay cổ tay): **đổ 15–16 mL ra bàn, không tạo AgCl** ở cả ba mức lệch 0, 30 và 60 px.

### 3.3. Sau lần thử đầu tiên
- **Rót quá nhanh:** bản đầu nghiêng tới 120°, tốc độ khoảng 7–10 mL/s, và rót liên tục tới khi bình nhận đầy.
- **Đổ ống nghiệm:** bình nguồn chỉ cách miệng ống 0,16 đơn vị nên thân bình quét vào ống. Nếu thả tay khi đang ở trên ống, chai rơi xuống, lật và tràn khoảng 28 mL. Thêm vào đó, phần giữ cố định ống nhận chưa có tác dụng, vì vòng lặp mỗi khung hình tự thả mọi vật không có tay giữ.
- **Gắp khó:** với tay, chỉ gắp được khi chụm trong vòng 48 px quanh **đáy** vật, trong khi tay lại cầm ở giữa thân.
- **Nhãn Trái/Phải:** theo mã, ảnh vào MediaPipe đã được lật gương (lúc đó nhãn gốc đáng lẽ đúng), nhưng thử thật cho thấy nhãn bị đảo.

## 4. Thay đổi

| Thay đổi | Tệp | Khi nào có hiệu lực |
|---|---|---|
| Độ lệch sau khi nhận lại tay **trượt dần** về độ lệch mục tiêu (hằng số thời gian 120 ms) thay vì giữ vĩnh viễn; không nhảy ở khung hình đầu | `interaction.js` | Luôn |
| Khi gắp: thân bình trượt về dưới điểm chụm (khoảng 55% chiều cao) | `interaction.js`, `main.js` | Hỗ trợ tay |
| Giữ nguyên chiều sâu khi cầm bằng một tay (hai tay vẫn chỉnh chiều sâu được) | `interaction.js` | Hỗ trợ tay |
| Gắp theo khoảng cách tới **trục thân** vật (≤ 70 px); vạch sáng báo vật sẽ được gắp | `main.js` | Hỗ trợ tay |
| **Căn miệng bình:** bình nguồn ở phía trên và gần thẳng hàng (≤ 85 px vào, ≥ 130 px ra) thì tự căn x, z và nâng lên cách miệng bình nhận 0,35 | `pour-assist.js` | Hỗ trợ tay |
| **Giữ yên 0,65 s để rót:** nghiêng chậm (0,9 rad/s), ngừng nghiêng khi bắt đầu chảy, tốc độ tối đa 1,5 mL/s, mỗi lượt 2 mL; nhích tay để rót tiếp; không rót vào bình đầy 85% | `pour-assist.js`, `liquid-simulation.js`, `main.js` | Hỗ trợ tay |
| Giữ cố định bình nhận khi đang rót; thả ra sau khi bình nguồn rời đi | `main.js` | Hỗ trợ tay |
| Thả tay khi bình còn ở trên bình khác: bình trượt về chỗ đã lấy rồi mới đặt xuống | `main.js` | Hỗ trợ tay |
| Công tắc **Hỗ trợ tay** trên thanh công cụ, có ghi nhớ | `index.html`, `styles.css`, `main.js` | — |
| Đổi chiều nhãn Trái/Phải | `main.js` | Luôn |

Những gì không đổi: điều khiển chuột, phản ứng hóa học, bảo toàn chất (giới hạn tốc độ chỉ làm chậm dòng chảy), mô hình vật lý, và điều kiện nhận chất lỏng của bình.

## 5. Kết quả

### 5.1. Vật bám tay sau khi mất dấu (8 lần mất dấu, chờ ổn định khoảng 1 giây)
| Bản | Khoảng cách tay – vật |
|---|---|
| Gốc | tăng dần: 65 → 260 px (sau 4 lần) |
| Có sửa, **tắt** Hỗ trợ tay | **0 px ở cả 8 lần** |
| Có sửa, **bật** Hỗ trợ tay | 3–88 px, không tăng dần. Khoảng lệch là **có chủ ý**: chai được căn miệng khi đi qua phía trên ống |

### 5.2. Rót AgNO₃ vào ống NaCl bằng tay mô phỏng
Độ lớn bàn tay giảm 15% trong lúc di chuyển, để mô phỏng việc xoay cổ tay.

| Bản | Lệch 0 px | Lệch 30–40 px | Lệch 60 px |
|---|---|---|---|
| Gốc (xoay cổ tay) | đổ 15,8 mL ra bàn, không có AgCl | đổ ra bàn | đổ ra bàn |
| Phương án thay thế đã cân nhắc (xoay cổ tay) | đổ 15,2 mL ra bàn | đổ ra bàn | đổ ra bàn |
| Hỗ trợ tay bản đầu | 10 mL vào ống, 0,5 mmol AgCl | 10 mL vào ống | căn được, chưa kịp rót |
| **Hỗ trợ tay bản cuối** | **2,08 mL vào ống, 0,104 mmol AgCl, không đổ** | **2,15 mL, không đổ** | — |

Chi tiết bản cuối:
- **Tốc độ:** tối đa 1,50 mL/s, mỗi lượt kéo dài 1,3–1,45 giây.
- **Ống nghiệm:** đứng thẳng (trục y = 1,00) sau khi rót.
- **Thả tay khi chai ở trên ống:** chai trượt về chỗ cũ, không tràn (0 mL), ống vẫn đứng.
- **Gắp ống nghiệm hẹp** khi chụm cạnh thân 25 px: thành công.

### 5.3. Kiểm thử hồi quy
| Bộ kiểm thử | Kết quả |
|---|---|
| Kiểm thử JavaScript (`npm test`) | **146/146** (135 cũ + 11 mới trong `tests_js/hand-assist.test.mjs`) |
| Kiểm thử Python | 98/99; lỗi còn lại do thiếu OpenCV trên máy kiểm thử, có từ trước |
| `tools/qa_mouse_v39.mjs` (chuột, vật lý, 60 giây hiển thị) | **12/12** |
| `tools/qa_egad_v39.mjs` (10 bài, rót tạo phản ứng, EGAD) | **12/12** |

### 5.4. Thử với webcam thật (người dùng)
- **Lần 1:** nhãn Trái/Phải bị đảo; vẫn khó cầm; rót tự động được nhưng quá nhanh và làm đổ ống nghiệm. Các vấn đề này dẫn tới bản cuối.
- **Lần 2 (bản cuối):** người dùng xác nhận hoạt động ổn.

## 6. Phương án đã cân nhắc nhưng không chọn

Một phương án khác cũng đã được thử và đo:
- kéo độ lệch về điểm cầm 25% mỗi khung hình;
- hút miệng bình 78% về phía miệng ống trong bán kính 0,42;
- nới vùng nhận chất lỏng của bình lên 1,45 lần bán kính miệng.

Phương án này sửa được lỗi trôi (lệch 2–28 px), nhưng không được chọn vì:
- **Không rót được:** trong phép thử 5.2 vẫn đổ ra bàn.
- **Làm hỏng 3 kiểm thử** về việc vật không được nhảy.
- **Nới vùng nhận chất lỏng:** chất lỏng rơi ngoài miệng ống vẫn được tính là vào, và thay đổi này áp dụng cả khi dùng chuột.
- **Lực hút không có vùng đệm,** nên vật có thể nhảy qua lại ở mép vùng hút.
- **Tốc độ kéo phụ thuộc số khung hình/giây của camera.**

## 7. Hạn chế và việc tiếp theo

- **Số đo định lượng dựa trên tay mô phỏng.** Chưa đo thời gian hoàn thành bài, tỉ lệ gắp hụt hay tỉ lệ đổ với nhiều người dùng thật. Nên ghi các số này khi thử với học sinh.
- **Nhãn Trái/Phải** được đổi theo kết quả thử trên một máy, áp dụng cho cả nhận diện trong trình duyệt và bằng Python. Cần kiểm tra trên các máy và webcam khác.
- **Bài cần nhiều chất lỏng** (trung hòa, pha loãng) phải rót nhiều lượt 2 mL. Có thể cho phép giữ yên lâu hơn để rót liên tục.
- **Khi Hỗ trợ tay bật, một tay không chỉnh được chiều sâu.** Phải dùng hai tay, hoặc tắt hỗ trợ.
- **Các thông số chưa được tối ưu với người dùng thật:** 70/85/130 px, 0,65 giây, 1,5 mL/s, 2 mL, 0,35. Chúng nằm ở `ASSIST_DEFAULTS` (`pour-assist.js`), `HAND_PICK_PX` và `ASSIST_RATE_ML_S` (`main.js`).
- **Thao tác không phải rót** (giấy quỳ, thanh sắt) chưa có hỗ trợ căn vị trí riêng.
