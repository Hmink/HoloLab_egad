# Bàn giao giao diện: Đợt 1

Ngày 26/11/2026 · Theo `prompt_giao_dien_v2` · Phạm vi: design tokens, phông Lora, định tuyến, trang giới thiệu, khu học tập (sidebar), Tổng quan, Thư viện dạng hàng ngang, Lịch sử học (dữ liệu trình duyệt), trang tạm Đăng nhập/Đăng ký.

## 1. Cách tích hợp

- Giữ lab 3D ở `/` (`frontend/web/index.html`). Lớp React của lab (`frontend/ui/`, build ra `frontend/web/ui/shell.js`) giờ là một ứng dụng nhỏ điều hướng bằng hash, hiển thị **phía trên** bàn thí nghiệm. Khi vào một bài, lớp này ẩn đi để lộ bàn 3D. Cách này không đụng tới canvas, vật lý, nhận diện tay hay Hỗ trợ tay.
- Dùng hash route vì server Python chỉ phục vụ file tĩnh (không có SPA fallback). Không thêm thư viện router.

| Đường dẫn | Màn hình |
|---|---|
| `#/` (mặc định) | Trang giới thiệu |
| `#/learn/overview` | Tổng quan |
| `#/learn/experiments` | Thư viện thí nghiệm |
| `#/learn/history` | Lịch sử học |
| `#/learn/experiments/<id>` | Bàn thí nghiệm của bài `<id>` (mở thẳng được). `free` = bàn trống; `session` = phiên đã lưu vừa mở lại |
| `#/login`, `#/register` | Trang tạm: tài khoản chưa được kích hoạt |

- `?test` (dùng cho kiểm thử) không có hash vẫn mở thẳng bàn 3D như trước.
- Nút Back/Forward của trình duyệt hoạt động. Quay lại đúng bài đang làm thì **không** khởi động lại bài. Mã bài không tồn tại thì về thư viện kèm thông báo.

## 2. File thay đổi

| File | Nội dung |
|---|---|
| `frontend/ui/tokens.css` | Design tokens: màu, phông, cỡ chữ, khoảng cách, bo góc, đổ bóng, viền focus |
| `frontend/ui/shell.jsx` | Điều hướng hash, chọn màn hình, vào/ra bàn thí nghiệm; giữ nguyên thanh công cụ chuột và hộp trợ giúp |
| `frontend/ui/shell.css` | Giao diện giới thiệu, khu học tập, danh sách, hộp xem trước; thanh công cụ dùng chung token |
| `frontend/ui/components/Layout.jsx` | Thanh điều hướng trên cùng (có menu cho màn nhỏ), sidebar thu gọn được và drawer |
| `frontend/ui/components/Art.jsx`, `Icons.jsx` | Minh họa SVG tự vẽ (học sinh THPT, bàn thí nghiệm, trợ lý EGAD) và bộ icon đồng nhất |
| `frontend/ui/pages/Intro.jsx` | Trang giới thiệu |
| `frontend/ui/pages/Learn.jsx` | Tổng quan, Thư viện, Lịch sử học, trang tạm Đăng nhập/Đăng ký, hộp xem trước bài |
| `frontend/ui/lib/routes.js`, `search.js` | Logic thuần: định tuyến, tìm kiếm không dấu, lọc, trạng thái phiên đã lưu |
| `frontend/ui/landing.jsx` | Xóa (thay bằng các file trên) |
| `frontend/web/src/main.js` | Thêm một trường `stocks` (tên và công thức hóa chất của bài) truyền cho giao diện. Không đổi logic lab |
| `frontend/web/styles.css` | Khai báo phông Lora |
| `frontend/web/vendor/fonts/lora-*.woff2`, `licenses/LORA-OFL.txt`, `docs/THIRD_PARTY.md` | Phông Lora 5.3.0 (SIL OFL 1.1), subset latin, latin-ext, vietnamese, độ đậm 400/600 |
| `frontend/web/ui/shell.js`, `hololab-ar-v3.css` | Bản build (`npm run build:shell`) |
| `frontend/tests_js/ui-library.test.mjs` | 6 test mới: định tuyến, tìm kiếm (cả theo hóa chất, không dấu), lọc, trạng thái phiên |
| `frontend/tools/qa_egad_v39.mjs` | Lọc lớp 10 trước khi tìm "chloride" (xem mục 5) |
| `README.md`, `docs/HUONG_DAN_THI_NGHIEM.md`, `docs/CHANGELOG.md` | Cập nhật hướng dẫn |

## 3. Hướng dẫn chạy

```bash
cd backend
pip install -r requirements-core.txt
python server.py --browser-tracking
```

Mở http://127.0.0.1:8765 (trang giới thiệu). Không cần build lại: `frontend/web/ui/` đã được build sẵn. Khi sửa `frontend/ui/`, chạy `cd frontend && npm run build:shell`.

## 4. Kết quả kiểm thử (chạy thật, 26/11/2026)

| Kiểm thử | Kết quả |
|---|---|
| `npm test` | **162/162** (156 cũ + 6 mới) |
| `npm run build` | Qua (`build:shell` và `build:app`) |
| Python `unittest` (backend) | Qua |
| `qa_mouse_v39.mjs` (chuột, vật lý, lưu/mở lại, 60 giây hiển thị) | **12/12** |
| `qa_egad_v39.mjs` (thư viện, EGAD, 10 bài, rót tạo phản ứng) | **12/12** |
| Hỗ trợ tay (tay mô phỏng): gắp ống hẹp, căn miệng, rót | 2,01 mL vào ống, 0,101 mmol AgCl, tối đa 1,5 mL/s, không đổ, ống vẫn đứng |
| Hỗ trợ tay: mất dấu tay 8 lần | Tắt hỗ trợ: lệch 0 px cả 8 lần; bật hỗ trợ: vẫn giữ vật (như trước khi đổi giao diện) |
| 5 trang × 3 kích thước (1440, 820, 390 px) | Không tràn ngang; không có chữ dưới 12 px; phông Lora đã nạp; không lỗi JavaScript |
| Luồng điều hướng | Giới thiệu → Bắt đầu học → Thư viện; lọc lớp 11 → 5 bài, thêm chủ đề → 1 bài, xóa bộ lọc → 10; không có kết quả → thông báo và nút xóa bộ lọc; xem trước → vào bàn 3D (canvas 1096 px); ‹ Thư viện; Back của trình duyệt về đúng bài không khởi động lại; mở thẳng `#/learn/experiments/biuret`; mã sai → thông báo; sidebar thu gọn (76 px); drawer đóng bằng Esc |
| Cuộn trang thư viện | Cuộn bằng con lăn tới hết 10 bài |

Lỗi tìm thấy và đã sửa trong lúc kiểm thử:
- **Trang trong khu học tập không cuộn được:** CSS của lab áp `height: 100dvh` cho mọi thẻ `<main>`. Đổi vùng nội dung sang `<div>`.
- **Phương trình trong tranh minh họa bị cắt chữ.**
- **Màu vòng tròn trùng nền.** (Lỗi này thuộc bản giao diện trước.)

## 5. Lưu ý và thay đổi cần biết

- **Tìm theo hóa chất làm "chloride" khớp 3 bài** (Nhận biết ion chloride, Ammonium chloride, Calcium chloride). Vì vậy `qa_egad_v39.mjs` được cập nhật: lọc lớp 10 trước khi tìm, giống `qa_mouse_v39.mjs`.
- **Tên hóa chất trong dữ liệu là tiếng Anh** ("Silver nitrate"), nên tìm "bạc nitrat" không ra kết quả. Muốn tìm bằng tên tiếng Việt cần bổ sung tên tiếng Việt vào `stocks` trong `lessons-thpt.json`. Đó là việc về nội dung, không phải giao diện.
- **Không có bộ lọc trạng thái học**, vì chưa có dữ liệu tiến độ thật. Nút "Học tiếp" chỉ hiện khi có phiên đã lưu của đúng bài đó. Trạng thái phiên lấy từ các cờ thật mà lab ghi lại (`observed`, `complete`).
- **Đăng nhập/Đăng ký mới là trang tạm**, ghi rõ chưa kích hoạt. Không có đăng nhập giả. Thanh trên cùng luôn ở trạng thái chưa đăng nhập.
- **Lab 3D vẫn chạy phía sau** khi đang ở trang giới thiệu hay khu học tập, như trước đây. Nếu cần nhẹ máy hơn, có thể tạm dừng vòng lặp hiển thị trong lúc lớp phủ đang mở. Việc này thuộc mã lab nên chưa làm trong đợt này.

## 6. Chưa làm hoặc chưa kiểm chứng

- **Đợt 2:** màn hình thực hành có khung EGAD bên phải, thanh công cụ mới, chi tiết phiên trong Lịch sử học.
- **Đợt 3:** biểu mẫu Đăng nhập/Đăng ký và lớp tích hợp xác thực (chờ backend API v3.1).
- **Cần backend:** tài khoản, phiên học nhiều lượt, lịch sử trên máy chủ, hội thoại EGAD nhiều lượt.
- **Chưa kiểm chứng:** trên trình duyệt và thiết bị thật (mới chạy Chromium không giao diện), với webcam thật, bằng trình đọc màn hình, và chưa có đánh giá của học sinh hay giáo viên.
