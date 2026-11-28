# Backend xác thực (API v3.1, giai đoạn 1: tài khoản)

Ngày 28/11/2026. Đây là phần đầu của backend v3.1. Phần này làm 4 endpoint trong mục 2 của hợp đồng: `POST /api/v1/auth/register`, `login`, `logout` và `GET /api/v1/auth/me`. Giao diện Đăng nhập/Đăng ký ở Đợt 3 chạy được với backend này mà không phải sửa gì.

## 1. Kiến trúc

```
Trình duyệt ──► server.py :8765  (lab 3D, EGAD, API cũ)
                   │  /api/v1/*  chuyển tiếp nội bộ
                   ▼
            hololab_api (FastAPI) trên 127.0.0.1:<cổng ngẫu nhiên>  ──►  PostgreSQL
```

- **Một địa chỉ duy nhất cho người dùng.** `server.py` tự khởi động API ngay trong tiến trình của nó, nên học sinh vẫn chỉ chạy `python server.py`. Trình duyệt chỉ thấy một địa chỉ, nhờ vậy cookie phiên và việc kiểm tra Origin đều đơn giản.
- **Cơ chế "tắt êm".** Nếu chưa đặt `HOLOLAB_DATABASE_URL`, chưa cài gói, không kết nối được cơ sở dữ liệu hoặc chưa chạy migrate, thì `server.py` in lý do (ví dụ `Tài khoản: tắt (…)`) và lab vẫn chạy như cũ. Lúc đó trang Đăng nhập báo "chưa được kích hoạt".
- **Chạy API riêng** (khi đặt sau reverse proxy cho mọi đường dẫn): `uvicorn hololab_api.app:app --host 127.0.0.1 --port 8766`.

| File | Vai trò |
|---|---|
| `backend/hololab_api/config.py` | Cấu hình từ biến môi trường |
| `backend/hololab_api/models.py` | Bảng `users`, `auth_sessions` |
| `backend/hololab_api/security.py` | argon2id, mã phiên, giới hạn số lần thử, kiểm tra Origin và HTTPS |
| `backend/hololab_api/auth.py` | 4 endpoint |
| `backend/hololab_api/errors.py` | Mọi lỗi đều có dạng `{error, error_code, retryable}` |
| `backend/hololab_api/embedded.py` | Chạy API trong `server.py` và chuyển tiếp request |
| `backend/migrations/` | Alembic (`0001_accounts`) |
| `backend/manage.py` | Lệnh quản trị |
| `backend/tests/test_api_auth.py` | 18 test |

## 2. Cài đặt (máy chủ của lớp)

1. **Cài gói Python:**
   ```bash
   cd backend
   pip install -r requirements-core.txt -r requirements-api.txt
   ```
2. **Cài PostgreSQL 16 và tạo cơ sở dữ liệu.** Mật khẩu là của bạn, đừng dùng mật khẩu mẫu:
   ```bash
   sudo -u postgres psql -c "CREATE ROLE hololab LOGIN PASSWORD 'mat-khau-cua-ban';" -c "CREATE DATABASE hololab OWNER hololab;"
   ```
   Trên Windows: cài bằng bộ cài của PostgreSQL, rồi chạy hai lệnh SQL trên trong **SQL Shell (psql)**.
3. **Cấu hình:** trong `backend/.env` (file này không được commit), thêm:
   ```
   HOLOLAB_DATABASE_URL=postgresql+psycopg://hololab:mat-khau-cua-ban@127.0.0.1:5432/hololab
   ```
   Nếu mật khẩu có ký tự đặc biệt (`@ : / #`), phải mã hóa URL cho nó, ví dụ `@` thành `%40`.
4. **Tạo bảng và tài khoản giáo viên:**
   ```bash
   python manage.py migrate
   python manage.py create-teacher gv.hoa      # hỏi mật khẩu 2 lần, không hiện ra màn hình
   python server.py --browser-tracking         # dòng thứ hai phải là "Tài khoản: bật (postgresql)."
   ```

**Thử nhanh không cần PostgreSQL** (chỉ để demo, **không** dùng cho dữ liệu học sinh thật): đặt `HOLOLAB_DATABASE_URL=sqlite:///hololab.db`, rồi chạy `python manage.py migrate`.

**Lệnh quản trị khác:**
- `python manage.py set-password <tên>`: đặt mật khẩu mới, đồng thời đăng xuất mọi phiên của tài khoản đó.
- `python manage.py set-active <tên> off`: khóa tài khoản. Dùng `on` để mở khóa.

Có thể thêm `--password-stdin` để đọc mật khẩu từ một dòng nhập vào, tiện khi viết script.

## 3. Học sinh truy cập từ máy khác: cần HTTPS

`server.py` chỉ lắng nghe `127.0.0.1`. Để học sinh vào từ máy khác, đặt một reverse proxy HTTPS phía trước. Ví dụ với Caddy (tự lấy chứng chỉ khi có tên miền):

```
lab.truong.edu.vn {
    reverse_proxy 127.0.0.1:8765
}
```

Sau đó thêm `HOLOLAB_TRUST_FORWARDED=1` vào `.env`, để API dùng `X-Forwarded-For/Proto/Host` do Caddy gửi kèm (lấy IP thật cho giới hạn số lần thử, nhận ra kết nối là HTTPS). Chỉ bật cờ này khi mọi request đều đi qua proxy của bạn.

**Vì sao bắt buộc HTTPS:** qua `http://` trong mạng LAN, cookie phiên đi trên đường truyền không mã hóa, người cùng mạng đọc được. Vì vậy API **từ chối đăng ký và đăng nhập qua http từ máy khác**, trả lỗi `503 not_configured` kèm hướng dẫn. Chỉ khi thử nghiệm, có thể đặt `HOLOLAB_ALLOW_INSECURE_HTTP=1` để bỏ qua kiểm tra này. Khi mở `http://127.0.0.1` ngay trên máy chủ thì vẫn dùng được, không cần HTTPS.

**Cần sửa trước khi chạy sau proxy:** các API cũ (`/api/egad/assess`, `/api/transfer`…) hiện chỉ chấp nhận Origin `http://127.0.0.1` hoặc `localhost`. Đặt sau Caddy với tên miền thì các request đó bị từ chối (403). Việc này cần sửa ở bước chuyển các API cũ sang v3.1. Trong lúc chờ, EGAD chạy được khi mở trực tiếp trên máy chủ.

## 4. Các quy tắc đã cài

| Quy tắc | Cách làm |
|---|---|
| Mật khẩu | argon2id (argon2-cffi, cấu hình RFC 9106). Tự băm lại khi tham số thay đổi |
| Tên đăng nhập | 3–32 ký tự `a-z 0-9 _ . -`, lưu chữ thường; không thu email hay họ tên |
| Mật khẩu mới | 10–128 ký tự, không chứa tên đăng nhập; không bắt buộc chữ hoa hay số |
| Vai trò | Đăng ký công khai **luôn** là `student`. Gửi thêm trường `role` (hay trường lạ khác) → `400 invalid_input`. Giáo viên chỉ tạo bằng `manage.py` |
| Đồng ý | `consent.version` phải nằm trong `HOLOLAB_CONSENT_VERSIONS` (mặc định `hololab-consent-2026-11`). Lưu phiên bản cùng thời điểm đồng ý. Khi đổi văn bản đồng ý, thêm phiên bản mới và giữ phiên bản cũ |
| Cookie | `session=<256 bit ngẫu nhiên>; HttpOnly; SameSite=Strict; Path=/`, có `Secure` khi chạy HTTPS. Cơ sở dữ liệu chỉ lưu SHA-256 của mã phiên |
| Hết hạn | 24 giờ không hoạt động (theo v3.1), và tối đa 30 ngày kể từ khi đăng nhập (giới hạn thêm cho an toàn). Phiên hết hạn bị xóa |
| CSRF | Mọi POST/PUT/PATCH/DELETE phải có `Origin` trùng với máy chủ (403 nếu thiếu hoặc khác), cộng thêm `SameSite=Strict` |
| Đoán mật khẩu | Sai 10 lần mỗi tên, hoặc 50 lần mỗi IP, trong 15 phút → `429 rate_limited` kèm `retry_after_seconds` (kể cả khi lần sau nhập đúng). Đăng ký: 10 lần mỗi IP mỗi giờ |
| Không lộ tài khoản | Sai tên hay sai mật khẩu đều trả cùng một thông báo. Tên không tồn tại vẫn chạy argon2, để thời gian phản hồi như nhau. "Tài khoản bị khóa" chỉ báo khi mật khẩu đúng |
| Khóa tài khoản | Phiên đang mở của tài khoản bị khóa bị hủy ở request kế tiếp |

**Giới hạn hiện tại:** bộ đếm số lần thử nằm trong bộ nhớ (một tiến trình), nên khởi động lại `server.py` là bộ đếm về 0. Khi chạy nhiều tiến trình, cần chuyển bộ đếm vào cơ sở dữ liệu.

## 5. Kiểm thử (28/11/2026)

| Kiểm thử | Kết quả |
|---|---|
| `python -m unittest tests.test_api_auth` trên SQLite | **18/18** |
| Cùng bộ test trên **PostgreSQL 16** (`HOLOLAB_TEST_DATABASE_URL=…`) | **18/18** |
| Toàn bộ test Python | **142** (124 cũ + 18), qua |
| So sánh migration với mô hình bảng (Alembic autogenerate) | 0 khác biệt |
| Đầu-cuối: `manage.py migrate` + `create-teacher`, `server.py` với PostgreSQL, giao diện thật trên Chromium | Đăng ký `hs.lop10a.07` → về Tổng quan, cookie `HttpOnly` + `SameSite=Strict` và JavaScript không đọc được; tải lại trang vẫn đăng nhập; trùng tên → báo lỗi; đăng xuất → hết cookie; giáo viên sai/đúng mật khẩu; lab 3D vẫn chạy; trong DB: mật khẩu `$argon2id$…`, có lưu phiên bản đồng ý |

CI (`.github/workflows/checks.yml`) có thêm job `backend-postgres`, chạy bộ test này trên PostgreSQL 16.

## 6. Bước tiếp theo

1. **`/api/v1/sessions` và các lượt trả lời (v3.1 mục 4–5):** lưu phiên học và câu trả lời EGAD theo tài khoản, xóa sau 1 tháng (`purge_after`). Sau đó giao diện chuyển hội thoại EGAD và Lịch sử học sang nguồn dữ liệu máy chủ (lớp `ui/lib/history.js` đã sẵn chỗ để thay).
2. **API dành cho giáo viên (v3.1 mục 6) và nhật ký kiểm toán (`audit_log`).**
3. **Chuyển các API cũ sang dùng chung kiểm tra Origin và HTTPS**, để chạy được sau reverse proxy.
4. **Chuyển bộ đếm số lần thử vào cơ sở dữ liệu,** nếu chạy nhiều tiến trình.
