# HoloLab + EGAD synthetic pilot

## Chạy ngay
Giải nén ZIP. Mở terminal trong thư mục có server.py; chạy `python server.py` (Windows: `py server.py`). Mở địa chỉ server in ra. Giữ terminal mở.
Bản này giữ nguyên lõi chuột, thí nghiệm, vật lý V3.9. Link EGAD mô hình thử nghiệm nằm bên trái. EGAD rubric cũ vẫn riêng biệt.

## Chuột
- Chọn Di chuyển, giữ chuột trái trên bình và kéo.
- Chọn Nghiêng / rót, kéo ngang để nghiêng, kéo dọc để xoay trước/sau.
- Chọn Gần / xa để chỉnh chiều sâu. Căn miệng nguồn cao hơn miệng nhận, cùng chiều sâu rồi nghiêng.
- Nhả chuột để thả. Không cần webcam.

## Base44
Đây là gói SOURCE + STATIC WEB + COMPONENT tích hợp, KHÔNG phải ZIP import tự động của Base44.
1. Triển khai toàn bộ web/ ở gốc một HTTPS origin riêng (giữ cấu trúc thư mục). Tài nguyên dùng đường dẫn /vendor, /ui, /data.
2. Đưa base44/HoloLabEmbed.jsx và BASE44_PROMPT.txt vào dự án Base44. Thay labUrl bằng URL HTTPS thực tế.
3. Cho phép domain Base44 trong chính sách frame-ancestors ở host. Cấp quyền camera nếu dùng tracking. Không nhúng server.py vào frontend.
4. Các endpoint Python tùy chọn (native tracking, EGAD Gemini) không có trên static hosting; dùng chuột và EGAD pilot JS không cần chúng.
5. Chưa có liên thông tài khoản / ghi kết quả Base44 / sự kiện thao tác. Pilot xuất nhật ký JSON thủ công.
6. Nếu cần chuyển toàn bộ mã sang React/Base44 thay iframe, cần mã nguồn dự án Base44 để chỉnh build và kiểm thử riêng.

## Mô hình đã train
TF-IDF ký tự 2–4 gram + Logistic Regression cân bằng lớp. 45 câu AI mô phỏng, nhãn ASSISTANT_PROVISIONAL, cột teacher_label null. Không phải LLM, chưa hiểu câu hỏi/rubric; đặc trưng chỉ lấy câu trả lời.
training/data.json giữ nguồn và nhãn; web/data/egad-model.json chứa weights. Python train xuất JSON để JS chạy offline, không API key.
Huấn luyện lại: cài scikit-learn==1.8.0, numpy; chạy python training/train.py. Chỉ dùng dữ liệu thật sau khi kiểm tra rubric và nhãn; giữ tập kiểm thử độc lập, không trộn dữ liệu mô phỏng với dữ liệu thật mà mất cột nguồn.

## Kết quả và giới hạn
Leave-one-question-out 9 folds trên dữ liệu mô phỏng: accuracy 0.5111, Macro-F1 0.4331. Kết quả thấp, chưa đủ để chấm học sinh. Chưa có kiểm định độc lập với nhãn giáo viên, không có bằng chứng hiệu quả giáo dục.
135/135 test JavaScript pass, gồm kiểm tra inference JS khớp Python 45 mẫu và test hồi quy có sẵn. Xem training/test-results.txt và metrics.json.
Chưa kiểm thử tương tác bằng chuột trong trình duyệt ở lượt bàn giao này, chưa đo FPS, chưa chạy webcam thật, chưa triển khai vào tài khoản Base44. Các báo cáo phiên bản cũ trong ZIP là lịch sử, không phải kết quả kiểm tra lại hiện tại.

## Kiểm tra thủ công trước sử dụng
Chọn bài chloride; tạo bình; kéo lên/thả 20 lần; thử xoay/rót và đổi chiều sâu; xác nhận không xuyên bàn. Mở EGAD pilot, chọn câu hỏi, nhập câu, phân tích và xuất JSON. Thử lại các bước trên trang Base44 published. Không dùng nhãn dự đoán để quyết định điểm số.

Kiểm thử Python hiện tại: chạy 99 tests, có 1 lỗi import do môi trường thiếu cv2/OpenCV; không tuyên bố toàn bộ Python tests pass. Lần chạy từ thư mục cha thất bại import đã được chạy lại đúng thư mục dự án. File training/python-tests.txt giữ kết quả lần chạy đúng.
