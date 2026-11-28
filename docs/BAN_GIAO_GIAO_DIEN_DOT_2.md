# Bàn giao giao diện: Đợt 2

Ngày 28/11/2026 · Theo `prompt_giao_dien_v2` (mục 8, 9) · Áp dụng sau Đợt 1.

**Phạm vi:**
- màn hình thực hành: tên bài, thanh công cụ mới, khung EGAD bên phải;
- Lịch sử học: chi tiết phiên, câu trả lời EGAD của lần mở trang;
- vẽ lại tranh trang giới thiệu.

## 1. Màn hình thực hành

Bố cục là một lưới 4 cột: `[bài (ẩn)] [bàn 3D] [kho dụng cụ] [EGAD]`.

**Khung EGAD:**
- Là một cột riêng (`<aside id="egad-dock">`), **không bao giờ đè lên canvas**.
- Canvas tự co theo cột nhờ `ResizeObserver` có sẵn trên `#workspace`.

| Chiều rộng màn hình | Kho dụng cụ và EGAD |
|---|---|
| ≥ 1360 px | Mở được cả hai. EGAD mở sẵn |
| 901–1359 px | Thay phiên: mở cái này thì cái kia thu lại. EGAD thu gọn sẵn |
| ≤ 900 px | EGAD là ngăn kéo phủ lên trang (đóng bằng nút › hoặc Esc) |
| ≤ 600 px | Kho dụng cụ thu gọn sẵn khi vào bàn (nút "Kho bên phải" để mở) |

Lựa chọn mở hay thu gọn EGAD được nhớ trong `localStorage` `hololab-egad-open` (chỉ là tùy chọn hiển thị).

**Thanh công cụ** (`frontend/ui/components/LabToolbar.jsx`):
- **Hàng trên:** ‹ Thư viện · tên bài · nút **EGAD**.
- **Hàng dưới, chia nhóm:**
  - Chế độ chuột: Di chuyển, Nghiêng / rót, Gần / xa.
  - Chỉnh sửa: Dựng thẳng, Hoàn tác, Làm lại, Bắt đầu lại, Xóa vật, Lưu.
  - Kho, Bật camera, Dừng, Hỗ trợ tay, Toàn màn hình.
  - Trợ giúp.
- **Khi vùng lab hẹp hơn 1180 px,** nhóm Chỉnh sửa chỉ hiện biểu tượng. Tên nút vẫn còn cho trình đọc màn hình, cho tooltip và cho kiểm thử.
- **Các nút của lab** (kho, camera, Hỗ trợ tay, toàn màn hình) vẫn là đúng các phần tử DOM cũ với trình xử lý cũ. Chúng chỉ được chuyển vào thanh công cụ mới.
- **Chiều cao bàn 3D** được tính theo vị trí thật của `#workspace` (biến CSS `--hl-bench-top`). Vì vậy bàn luôn vừa khung nhìn dù thanh công cụ có 1 hay 2 hàng, hay khi khung camera hiện ra.

## 2. Khung EGAD (`frontend/ui/components/EgadChat.jsx`, `ui/lib/egad-chat.js`)

**Giao diện:**
- Header có avatar trợ lý (SVG).
- Câu hỏi của bài hiện như tin nhắn của trợ lý. Câu trả lời của học sinh nằm bên phải, màu xanh. Phản hồi của AI nằm bên trái.
- Lời chào ghi rõ: **"Mỗi câu trả lời được phân tích riêng: EGAD chưa nhớ các câu trả lời trước."**
  - Mỗi lần gửi là một lần gọi độc lập `POST /api/egad/assess` (gửi `lesson`, `question_id`, `session_id`, `consent`).
  - Hội thoại nhiều lượt sẽ có khi có `/api/v1/sessions`.

**Phản hồi:**
- Nội dung chính là câu hỏi gợi mở (`feedback`).
- Mục thu gọn **"Xem nhận xét chi tiết"** chứa nhận định chung, từng ý của rubric (tên ý lấy từ `egad-rubrics.json`), lý do, câu trích và nguồn.
- Luôn có dòng **"Dự đoán của AI, chưa được giáo viên xác nhận."**

**Ô nhập:**
- Enter để gửi, Shift+Enter để xuống dòng.
- **Không gửi khi đang gõ dấu** (bộ gõ tiếng Việt). React không có `isComposing` trên sự kiện tổng hợp, nên mã đọc `nativeEvent.isComposing` và `keyCode 229`. Lỗi này tìm ra khi kiểm thử và đã sửa.
- Đếm 0/1000 ký tự.

**Đồng ý:**
- Có ô đồng ý riêng: gửi câu trả lời tới EGAD trên máy chủ của lớp, nhắc không nhập họ tên.
- Chưa tích thì nút Gửi bị khóa.
- Lựa chọn chỉ giữ trong trang đang mở, không lưu.

**Lỗi:**
- Hiện thông báo của backend.
- Nút **Thử lại** chỉ hiện khi `retryable: true`.
- Với `llm_unavailable`, `model_not_found`, `not_configured` hoặc mất kết nối, khung ghi rõ EGAD chưa dùng được mô hình và có nút **Mở bảng tiêu chí**. Bảng này là bảng EGAD theo tiêu chí có sẵn trong lab, chạy được không cần mô hình.

**Các chức năng khác:**
- **Câu hỏi khác:** chuyển câu.
- **Xóa hội thoại:** xóa hội thoại của bài đang mở.
- **Trên bàn tự do:** khung mời chọn một bài, vì câu hỏi gắn với từng bài.

**Lưu trữ:** hội thoại nằm trong bộ nhớ trang, theo từng bài. Quay lại bài thì vẫn còn, **tải lại trang thì mất**. Không ghi vào `localStorage`, không giả lập lưu lâu dài.

**Không đổi** prompt EGAD, logic chấm, API hay backend. Hàm gọi API và các hàm phụ dùng lại từ `frontend/src/api.js` và `frontend/src/lib/egad.js` (giống trang `/app/`).

## 3. Lịch sử học

**Nguồn dữ liệu:**
- Trang nhận dữ liệu qua `ui/lib/history.js` → `browserHistory({saved, lessons, turns})`.
- Kết quả trả về là một cấu trúc chung `{source, sessions[], live[]}`.
- Khi có API phiên học v3.1, chỉ cần viết một nguồn trả cùng cấu trúc.

**Nội dung trang:**
- **Mục "Câu trả lời EGAD trong lần mở trang này"** (gắn nhãn *Chưa lưu · mất khi tải lại trang*): gồm câu hỏi, câu trả lời, phản hồi EGAD với nhãn dự đoán, hoặc lỗi nếu chưa phân tích được.
- **Mỗi phiên đã lưu:**
  - Có nút **Chi tiết** (bài, lớp, trạng thái, thời gian lưu, mục tiêu) và **Xem lại**.
  - Ghi rõ phiên lưu trên trình duyệt chỉ gồm bàn thí nghiệm, không kèm câu trả lời EGAD.
- Không tạo nhãn, điểm hay báo cáo để lấp chỗ trống.

## 4. Tranh trang giới thiệu

Tranh `frontend/ui/components/HeroArt.jsx` được vẽ lại theo ảnh mẫu bạn gửi:
- nữ sinh tóc đuôi ngựa, nơ hồng, áo gile, giơ ống nghiệm;
- bàn có nhiều bình và ống nghiệm nhiều màu;
- trợ lý EGAD hỏi "Vì sao?".

Đây là **SVG tự vẽ**, không dùng lại ảnh mẫu, chạy offline. Ảnh mẫu không rõ nguồn và giấy phép, nên không đưa vào repo.

## 5. File thay đổi

| File | Nội dung |
|---|---|
| `frontend/ui/shell.jsx` | Màn thực hành: cột EGAD (portal vào `#egad-dock`), thay phiên kho/EGAD, theo dõi bài đang mở qua `#lab-title`, điều hướng hiển thị ngay trong cú bấm |
| `frontend/ui/components/LabToolbar.jsx` | Thanh công cụ mới, tính `--hl-bench-top` |
| `frontend/ui/components/EgadChat.jsx`, `ui/lib/egad-chat.js` | Khung EGAD và logic thuần (câu hỏi, phím Enter/IME, lỗi không có mô hình, bộ nhớ trang) |
| `frontend/ui/lib/history.js`, `ui/pages/Learn.jsx` | Nguồn dữ liệu lịch sử; trang Lịch sử học mới |
| `frontend/ui/components/HeroArt.jsx`, `Art.jsx`, `Icons.jsx` | Tranh mới; thêm icon (gửi, trợ giúp, lưu, hoàn tác, làm lại, xóa, dựng thẳng) |
| `frontend/ui/shell.css` | Bố cục và giao diện màn thực hành, khung chat, chi tiết lịch sử |
| `frontend/web/src/main.js` | Thêm một hàm đọc `lesson()` (mã bài đang mở) vào API cho giao diện. Không đổi logic lab |
| `frontend/web/index.html` | Đổi tiêu đề bảng rubric thành "Bảng tiêu chí EGAD · Tự kiểm tra (không cần mô hình)" |
| `frontend/web/ui/shell.js`, `hololab-ar-v3.css` | Bản build |
| `frontend/tests_js/ui-practice.test.mjs` | 5 test mới |
| `frontend/tools/qa_egad_v39.mjs` | Xem mục 7 |
| `README.md`, `docs/HUONG_DAN_THI_NGHIEM.md`, `docs/CHANGELOG.md` | Cập nhật hướng dẫn |

## 6. Kết quả kiểm thử (chạy thật, 28/11/2026)

| Kiểm thử | Kết quả |
|---|---|
| `npm test` | **167/167** (162 + 5 mới) |
| `npm run build` | Qua |
| Python `unittest` | **124** test, qua |
| `qa_mouse_v39.mjs` | **12/12**, chạy 3 lần |
| `qa_egad_v39.mjs` | **13/13** (12 cũ + 1 mới: khung chat khi không có mô hình), chạy 3 lần |
| Khung EGAD với Ollama giả (trả lời theo rubric thật của bài) | Chưa đồng ý thì không gửi; Enter lúc đang gõ dấu không gửi; Shift+Enter xuống dòng; trạng thái chờ; phản hồi + nhận xét chi tiết; lỗi HTTP 500 → Thử lại + Mở bảng tiêu chí; Câu hỏi khác; quay lại bài vẫn còn hội thoại; Lịch sử học hiện đúng 2 câu trả lời |
| Hỗ trợ tay khi khung EGAD mở (canvas 736 px thay vì 1096 px) | Gắp ống hẹp, căn miệng, rót **2,05–2,14 mL**, AgCl tạo thành, tối đa **1,5 mL/s**, không đổ, ống đứng thẳng |
| Mất dấu tay 8 lần, tắt hỗ trợ | Lệch **0 px** ở cả 8 lần khi tay ở trong bàn. Kịch bản cũ (mỗi lần đi 60 px) lệch 8 px ở lần thứ 8: tay đã ra sát mép phải, nơi lab có chủ ý giữ vật cách mép canvas 60 px. Khi đóng EGAD (canvas rộng) hoặc đi 40 px mỗi lần thì cả 8 lần đều 0 px |
| Mất dấu tay 8 lần, bật hỗ trợ | Vẫn giữ vật (như Đợt 1) |
| Bố cục 1440 / 1280 / 1024 / 820 / 390 px | Không tràn ngang, không chữ dưới 12 px, bàn 3D vừa khung nhìn. Rộng bàn 3D: 738 / 928 / 672 / 478 / 358 px |
| 5 trang × 3 kích thước (Đợt 1) | Vẫn không tràn ngang, không chữ dưới 12 px, Lora đã nạp, không lỗi JavaScript |

## 7. Thay đổi kiểm thử và lỗi đã sửa

- **`qa_egad_v39.mjs`:**
  - Nút "EGAD · Giải thích" không còn. Script giờ đi qua khung EGAD.
  - Script kiểm tra cổng đồng ý, Enter/Shift+Enter, lỗi rõ ràng có "Thử lại" khi không có Ollama, rồi bấm **Bảng tiêu chí** để mở bảng rubric.
  - Các bước kiểm tra bảng rubric phía sau giữ nguyên.
- **Lỗi có sẵn từ trước, đã sửa:** ở chế độ chuột, bấm "Thu gọn" kho thì kho ẩn nhưng **vẫn để lại cột trống 310 px**. Nguyên nhân là `body.mouse-first{--stock-width:310px}` đè quy tắc `supplies-closed`.
- **Điều hướng bằng nút hiển thị ngay trong cùng cú bấm.** Trước đây giao diện chờ sự kiện `hashchange` ở lượt sau, nên có lúc trễ sau một khung hình 3D và làm kiểm thử đếm thẻ bị sai.
- **Không đổi bố cục khi chuyển qua lại** giữa thư viện và bàn thí nghiệm (cột EGAD giữ nguyên phía sau lớp phủ), để canvas WebGL không phải đổi kích thước mỗi lần.

## 8. Chưa làm hoặc chưa kiểm chứng

- **Đợt 3:** biểu mẫu Đăng nhập/Đăng ký và lớp tích hợp xác thực (chờ backend v3.1).
- **Cần backend:** hội thoại nhiều lượt có trí nhớ, lưu hội thoại EGAD, lịch sử trên máy chủ.
- **Trên điện thoại,** bàn 3D vẫn hẹp (358 px) và thanh công cụ chiếm 3 hàng. Lab vốn thiết kế cho máy tính và máy tính bảng.
- **Khi khung EGAD mở, con trỏ tay vẫn ánh xạ ra cả cửa sổ** (như thiết kế cũ: "con trỏ đi được toàn màn hình, kể cả kho"). Vì vậy phần bàn 3D chỉ chiếm khoảng một nửa vùng tay với tới. Nếu thấy khó với tới khi dùng webcam thật, thu gọn EGAD trong lúc thao tác. Có thể cân nhắc ánh xạ tay theo vùng bàn 3D, nhưng đó là thay đổi trong mã lab và cần thử với webcam thật.
- **Chưa kiểm chứng:**
  - mô hình Qwen3 thật (mới dùng Ollama giả);
  - webcam thật;
  - trình duyệt và thiết bị thật (mới chạy Chromium không giao diện);
  - trình đọc màn hình;
  - đánh giá của học sinh và giáo viên.
