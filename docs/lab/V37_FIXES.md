# V3.7 — nguyên nhân và phạm vi sửa

## Bằng chứng trước khi sửa

V3.6 đã sửa đường release/timeout nhưng phép đo đồ họa phần mềm còn suy giảm.
Đối chiếu ba pha trong `validation_v37/profile-before.json`: render riêng, bật
camera + nhận diện, và camera vẫn chạy nhưng tạm bỏ gửi mẫu (chỉ trong công cụ
chẩn đoán, không phải chế độ sản phẩm).

Trong pha đầy đủ, bộ lấy mẫu CPU của Chromium ghi khoảng **16,90 giây** tại
`createImageBitmap` trong khoảng quan sát **19,42 giây**. Bước thu nhỏ ảnh chờ đồng
bộ dữ liệu trên luồng giao diện. Không có resize canvas lặp lại trong pha này;
draw call/triangle cũng không tăng. Đây là bằng chứng cho một nút thắt cụ thể trên
môi trường đo, không chứng minh mọi máy đều có cùng nguyên nhân.

Vị trí: `web/src/capture.js`, hàm `frame`. Bản trước chỉ dùng VideoFrame khi
`delegate === "GPU"`; đường CPU/native luôn đi qua `createImageBitmap(video,
{resizeWidth, resizeHeight})` trước khi gửi Worker. `await` không bảo đảm phần
chuẩn bị bên trong API hoàn toàn không chặn luồng chính.

## Các thay đổi

| Tệp | Sửa gì | Giới hạn giữ nguyên |
|---|---|---|
| `web/src/capture.js` | Dùng VideoFrame khi có; chuyển quyền sở hữu sang Worker; fallback một lần nếu không truyền được; đóng tài nguyên khi lỗi/phiên cũ; ghi thời gian lấy ảnh/gửi | Một mẫu đang xử lý, không hàng đợi, không nhận diện lặp frame; epoch/sequence và bộ lập lịch giữ nguyên |
| `web/src/hand-worker.js` | Thu nhỏ và lật gương trên Worker; canvas có gợi ý đọc CPU cho CPU/native; đo chuẩn bị ảnh, chạy model và chờ Worker | Cùng model/confidence/2 tay, VIDEO mode, ảnh CV 640 mặc định; GPU có đường canvas riêng |
| `web/src/metrics.js` | Thêm bốn trường thời gian vào báo cáo; thiếu dữ liệu trả null | FPS render, tracking Hz và tuổi mẫu vẫn tách riêng; độ trễ đầu–cuối chưa đo |
| `web/src/main.js` | Hiện các công đoạn trong bảng kỹ thuật thu gọn | Không đổi thao tác, bố cục hay callback cử chỉ |
| `web/index.html`, `server.py`, launcher, package metadata | Nhãn V3.7 | Dependency và đường khởi động không đổi |
| `tests_js/frame-transport.test.mjs`, công cụ QA/benchmark | Kiểm tra lỗi transfer, tài nguyên, một frame đang xử lý, pixel gương/tỷ lệ và số đo | Không thay thế kiểm thử bàn tay người thật |

Việc đóng VideoFrame/ImageBitmap trong nhánh thất bại là bản sửa quản lý tài nguyên
có kiểm tra tiêm lỗi. Không có bằng chứng rằng DataCloneError đã xuất hiện trên
máy người dùng. Không gọi đây là nguyên nhân đã xác nhận của lỗi gắp.

`willReadFrequently` là yêu cầu tối ưu cho canvas CPU, không bảo đảm một hệ số tăng
tốc độc lập. Các lượt profile thử có biến động tải; kết quả nghiệm thu dùng ba cặp
benchmark đầy đủ, không chọn riêng lượt nhanh nhất. Phần tiền xử lý vẫn có thể tốn
thời gian trên Worker; chuyển sang Worker không làm mất chi phí tính toán.

## Vật lý và cử chỉ

Không thay đổi ngưỡng pinch, One Euro, FSM, ID hai tay, release/700 ms mất dấu,
quán tính, restitution, friction, damping, collider, gravity, CCD hoặc fixed step
120 Hz. Không đặt mesh theo tay sau khi đã release. Những bản sửa của V3.6 vẫn
có trong V3.7 và được chạy hồi quy lại.

Các module được đối chiếu hash với ZIP V3.6 nguyên bản trong
`validation_v37/preserved_modules.json`. Toàn bộ khác biệt nằm trong
`patches/V36_to_V37.patch`; `changed_files.json` liệt kê cả tài liệu và công cụ.

## Đọc số đo đúng cách

- `capture_mean_ms`: thời gian chuẩn bị đối tượng ảnh trên giao diện trước gửi.
- `worker_queue_mean_ms`: từ ngay trước postMessage đến Worker nhận được mẫu.
- `preprocess_mean_ms`: Worker chuẩn bị kích thước, thu nhỏ và lật ảnh.
- `model_mean_ms`: gọi MediaPipe; không bao gồm chuẩn bị ảnh ở trên.
- `inference_mean_ms`: giữ định nghĩa cũ để đối chiếu. Với WASM gồm tiền xử lý và
  detect; với Python là thời gian inference trả về từ server. Không cộng trường
  này với preprocess/model lần nữa.
- `sample_age_p95_ms`: tuổi dữ liệu khi kết quả tới ứng dụng; không phải độ trễ
  từ chuyển động tay thật tới vật thể trên màn hình.

Tài liệu API tham chiếu: [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame),
[transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects),
[OffscreenCanvas.getContext](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/getContext).
