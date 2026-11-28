# HoloLab AR — ChemLab V3.1

Camera gương phía trên, phòng thí nghiệm Three.js phía dưới; sidebar thu gọn; trạm chuẩn độ; thư viện tính tỉ lượng 100 phương trình. Không cam kết nhận diện 50 Hz trên mọi máy. Xem `VALIDATION_V31.md` và `docs/V31_ARCHITECTURE.md` để biết kết quả, kiến trúc và giới hạn.

## Chạy nhanh
1. Giải nén vào thư mục mới. Cần Python ≥3.10 (Windows launcher ưu tiên Python 3.13).
2. Windows: nhấp `START_WINDOWS.bat`. Linux: `python3 server.py`.
3. Mở http://127.0.0.1:8765 trong Chrome/Edge. Giữ cửa sổ server mở.
4. Bật camera và cấp quyền. Không mở trực tiếp HTML, không chạy `app.py` để dùng bản Web.

Gói đã có Three.js, MediaPipe WASM/model và SymPy/mpmath; không cần Node/npm hoặc internet cho đường chạy Web cơ bản. Python interpreter và trình duyệt do máy người dùng cung cấp.

## Thử chuẩn độ
- Bấm **Chuẩn độ** hoặc **Buret 50 mL** bên trái. Bàn tự do được giữ lại và tạm ẩn.
- Mẫu mặc định: HCl 0,1 M, 25 mL; dung dịch chuẩn NaOH 0,1 M. pH ban đầu 1,00; tương đương ở 25 mL, pH 7,00.
- Đưa con trỏ vào nhãn **CHỤM + XOAY VAN**, chụm cái/trỏ rồi xoay cổ tay theo chiều mở. Mở tay để đóng. Mất tracking đóng van, cần mở tay và gắp lại; không tiếp tục rót mù.
- Có thể dùng thanh **Van**, **Đóng van**, hoặc **+ 0,05 mL**. Xem pH, chỉ thị màu và đồ thị. Van hết 50 mL tự đóng.
- Mở **Thiết lập mẫu mới**, chọn CH3COOH nếu muốn xem chuẩn độ axit yếu; thay nồng độ/thể tích rồi bấm **Nạp mẫu / Đặt lại**. Thay input chưa áp dụng cho tới khi bấm nút.
- **Xuất số liệu** tải JSON cấu hình và đường cong. **Lưu phiên** của bàn tự do không lưu trạng thái trạm chuẩn độ.
- Trạm cố định trong bản này; không kéo thuốc thử từ kho vào buret. Chế độ gắp/kéo hai tay vẫn có trên bàn tự do.

## 100 phương trình
Bấm **100 phản ứng**, chọn phương trình, nhập số mol và xác nhận điều kiện rồi **Trộn và tính**. Hiển thị chất giới hạn, sản phẩm lý thuyết, lượng dư và phản hồi. Bộ này là mô hình tỉ lượng trong thư viện, chưa liên kết mọi cặp hóa chất với thao tác rót 3D. Lõi rót tự do cũ giữ phạm vi phản ứng đã có.

## Hiệu năng
Trong **Hiệu chỉnh & đo kiểm**: chọn Web GPU/CPU; ảnh nhận diện 640 px hoặc 960 px; giới hạn 30/60 Hz. Kích thước 640 giúp giảm chi phí ảnh nhưng có thể giảm chính xác khi tay xa. 60 Hz chỉ là trần yêu cầu; camera 30 FPS không thể cho nhận diện 50 ảnh mới/giây.

Nhấn **Đo 60 giây → Xuất kết quả** để lấy số đo thực tế. Mục tiêu 50 FPS render khác 50 Hz tracking. Không suy ra “gần như không trễ” từ FPS render.

## Mã nguồn / kiểm thử
- `docs/V31_ARCHITECTURE.md`: module, công thức pH, điều kiện và nguồn tham khảo.
- `validation_v31/`: kết quả mới. `validation/` và `VALIDATION.md` là kết quả lịch sử V3.0, không phải nghiệm thu V3.1.
- `tests_js/`: cử chỉ, scheduler, cân bằng nguyên tố 100 phương trình, bảo toàn lượng, pH.
- `tools/qa_v31.mjs`: chạy kiểm thử browser/benchmark có đầu vào giả lập được khai báo.
- `docs/legacy/README_V30.md`: hướng dẫn đầy đủ các chức năng bàn tự do giữ lại.

Chưa kiểm thử webcam vật lý trên máy i5-5200U/Intel HD5500 của người dùng. Phòng dùng hình học tối giản nhằm giảm tải, chưa đạt độ chân thực đồ họa như Labster. Không có tài sản Labster trong gói.
