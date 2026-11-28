# Bàn giao giao diện: Đợt 3 (Đăng nhập / Đăng ký)

Ngày 28/11/2026 · Theo `prompt_giao_dien_v2` mục 10 và API v3.1 mục 2. Xây trên bản xác thực của đồ án CNPM (`cnpm-quanlyhoctap-auth.zip`): giữ các ý tốt, sửa các điểm không hợp với HoloLab.

## 1. Đánh giá bản CNPM (`cnpm-quanlyhoctap-auth.zip`)

**Điểm tốt, đã giữ lại:**
- **Tách lớp rõ:** kiểu dữ liệu và kiểm tra dữ liệu, lớp gọi API, hook, form, trang.
- **Form dễ dùng:**
  - kiểm tra dữ liệu trước khi gửi;
  - nút hiện/ẩn mật khẩu;
  - khóa form và đổi chữ nút khi đang gửi;
  - hộp lỗi chung;
  - ô nhập lại mật khẩu;
  - `noValidate`.
- **`autocomplete` đúng** (`current-password`, `new-password`), nên trình quản lý mật khẩu hoạt động.
- **Đăng xuất luôn dọn trạng thái** phía trình duyệt (`finally`), kể cả khi gọi API lỗi.

**Điểm phải sửa khi dùng cho HoloLab:**

| # | Bản CNPM | Vấn đề | Bản HoloLab |
|---|---|---|---|
| 1 | Lưu `accessToken` trong `localStorage`, gửi `Authorization: Bearer` | Mã độc chèn vào trang (XSS) đọc được token. Prompt giao diện cấm lưu token vào `localStorage`. API v3.1 chốt dùng cookie phiên `HttpOnly` | Không lưu gì. Phiên là cookie `HttpOnly` do máy chủ đặt. Trang hỏi `GET /auth/me` để biết ai đang đăng nhập |
| 2 | Đăng nhập bằng **email**, đăng ký thu **họ và tên** | Học sinh THPT phần lớn chưa đủ 18 tuổi. API v3.1 chủ ý **không thu email và họ tên** (thu tối thiểu dữ liệu) | `username` 3–32 ký tự `a-z 0-9 _ . -`, nhắc **không dùng họ tên thật** |
| 3 | Đăng ký gọi `POST /accounts` cần quyền quản trị, có chọn vai trò "Giảng viên" | Trang đăng ký công khai không thể chạy, vì người đăng ký chưa có token quản trị. Mở cho tự chọn vai trò giáo viên là lỗ hổng | `POST /auth/register` chỉ tạo tài khoản **học sinh** và tự đăng nhập. Giáo viên tạo bằng lệnh trên máy chủ |
| 4 | Mật khẩu đăng nhập ≥ 6; đăng ký ≥ 8 kèm bắt buộc chữ hoa, chữ thường, số | Lệch với v3.1 (≥ 10). Quy tắc "phải có hoa/thường/số" làm mật khẩu khó nhớ mà không an toàn hơn (khuyến nghị NIST SP 800-63B). Đăng nhập không nên kiểm tra độ dài, vì sẽ chặn mật khẩu cũ hoặc mật khẩu tạm | Đăng ký: ≥ 10 ký tự, không chứa tên đăng nhập, gợi ý dùng cụm từ. Đăng nhập: chỉ kiểm tra đã nhập |
| 5 | Không có ô đồng ý xử lý dữ liệu | v3.1 bắt buộc `consent.version` khi đăng ký | Ô đồng ý có nội dung cụ thể, gửi `consent: {version}` |
| 6 | Đọc lỗi kiểu FastAPI (`detail`) và đoán theo mã HTTP | Lỗi của v3.1 là `{error, error_code, retryable}`. Mất mạng thì hiện "Failed to fetch" bằng tiếng Anh. Chưa xử lý `429` | Dựa vào `error_code`: `invalid_credentials`, `username_taken`, `rate_limited` (kèm số giây chờ), `account_disabled`; mất kết nối có thông báo riêng |
| 7 | Máy chủ chưa có API đăng nhập thì chỉ báo "Lỗi máy chủ (404)" | Prompt yêu cầu ghi rõ là chưa kích hoạt | 404/405/501, trang không phải JSON → **"Chức năng đăng nhập chưa được kích hoạt trên máy chủ này"**, không bao giờ giả đăng nhập thành công |
| 8 | Nút hiện/ẩn mật khẩu có `tabIndex={-1}` | Người dùng bàn phím không với tới nút. Prompt yêu cầu hỗ trợ bàn phím | Bấm được bằng Tab/Enter, có `aria-pressed`. Lỗi từng ô gắn `aria-invalid` + `aria-describedby`. Khi lỗi, con trỏ nhảy tới ô sai đầu tiên hoặc tới hộp thông báo |
| 9 | Đăng ký xong chờ 1,2 giây rồi chuyển sang trang đăng nhập | v3.1 tự đăng nhập sau khi đăng ký | Đăng ký xong vào thẳng Tổng quan |
| 10 | TypeScript, shadcn/ui, Tailwind, React Query, react-hook-form, zod, react-router, lucide | HoloLab giao diện là JSX thuần, định tuyến bằng hash, chạy offline. Prompt cấm thêm router và thư viện lớn | Cùng logic, viết lại bằng React có sẵn; kiểm tra dữ liệu bằng hàm thuần (có test), không thêm thư viện |
| 11 | Chữ "sinh viên", "giảng viên", email `@sis.hust.edu.vn` | Ngữ cảnh đại học, không phải THPT | "Học sinh", "giáo viên" |
| 12 | Quên mật khẩu: không có | v3.1 không có email | Ghi "Quên mật khẩu? Hãy nhờ giáo viên đặt lại" |

Nếu vẫn dùng bản CNPM cho đồ án đại học của bạn, nên sửa ít nhất mục 1 (token trong `localStorage`), mục 3 (form đăng ký công khai gọi API của quản trị) và mục 8 (`tabIndex={-1}`).

## 2. Những gì đã làm

| File | Nội dung |
|---|---|
| `frontend/ui/lib/auth.js` | Gọi `register`, `login`, `logout`, `me` theo v3.1 (`credentials: 'same-origin'`, không header `Authorization`); kiểm tra dữ liệu; ánh xạ `error_code` sang thông báo tiếng Việt; nhận ra máy chủ chưa có API đăng nhập (`not_enabled`); `CONSENT_VERSION` và `CONSENT_TEXT` |
| `frontend/ui/pages/Auth.jsx` | Trang Đăng nhập và Đăng ký (học sinh) |
| `frontend/ui/shell.jsx`, `components/Layout.jsx`, `pages/Learn.jsx` | Hỏi `/auth/me` khi mở trang; thanh trên cùng hiện tên đăng nhập và nút "Đăng xuất" khi đã đăng nhập; Tổng quan chào theo tên đăng nhập. Bỏ trang tạm `AuthSoon` |
| `frontend/ui/shell.css` | Giao diện biểu mẫu |
| `frontend/tests_js/ui-auth.test.mjs` | 6 test: quy tắc dữ liệu, nội dung gửi đi, `not_enabled`, ánh xạ lỗi, `me` và `logout`, kiểm tra mã không dùng `localStorage`, `sessionStorage`, `document.cookie` hay `Authorization` |

**Việc cần làm ở backend** (`CONSENT_VERSION` = `hololab-consent-2026-11`): backend phải nhận phiên bản này. Khi đổi `CONSENT_TEXT`, tăng cả phiên bản ở hai phía.

## 3. Kiểm thử (28/11/2026)

| Kiểm thử | Kết quả |
|---|---|
| `npm test` | **173/173** |
| `qa_mouse_v39.mjs` / `qa_egad_v39.mjs` | **12/12** / **13/13** |
| Máy chủ hiện tại (chưa có API đăng nhập) | Đăng ký và đăng nhập đều hiện "Chức năng đăng nhập chưa được kích hoạt…"; thanh trên cùng vẫn ở trạng thái chưa đăng nhập |
| Backend v3.1 giả lập (chặn request bằng Playwright) | Sai mật khẩu → "Tên đăng nhập hoặc mật khẩu không đúng." (con trỏ chuyển tới thông báo); đúng → về Tổng quan, thanh trên cùng hiện `tho_xanh` + Đăng xuất; tải lại trang vẫn đăng nhập (qua `/me`); đăng xuất → `POST /logout` → về trang giới thiệu |
| Bộ nhớ trình duyệt sau khi đăng nhập | Không có dữ liệu tài khoản (chỉ có tùy chọn Hỗ trợ tay sẵn có) |
| Bàn phím | Gửi form rỗng → con trỏ về ô đầu tiên bị sai; nút Hiện/Ẩn mật khẩu dùng được bằng Enter; tên đăng nhập tự chuyển thành chữ thường |
| 5 trang × 3 kích thước | Không tràn ngang, không có chữ dưới 12 px |

## 4. Chưa làm

- **Backend xác thực v3.1:**
  - bảng `users` và `auth_sessions`;
  - băm mật khẩu bằng argon2id;
  - cookie phiên `HttpOnly; Secure; SameSite=Strict`;
  - kiểm tra Origin;
  - giới hạn số lần thử;
  - lệnh `create-teacher`.

  Khi backend xong, giao diện dùng được ngay, không cần sửa.
- **Gắn tài khoản vào phiên học:** khi đăng nhập thì lưu phiên học và câu trả lời EGAD lên máy chủ (`/api/v1/sessions`). Việc này cần backend; hiện EGAD vẫn chạy như Đợt 2.
- **Trang dành cho giáo viên.**
