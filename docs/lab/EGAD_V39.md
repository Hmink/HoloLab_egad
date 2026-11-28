# EGAD V3.9 — chạy cục bộ, nhãn dự đoán

## Dùng ngay, không cần API key

1. Chọn bài trong thư viện và bắt đầu thực hành.
2. Bấm **EGAD · Giải thích** trên thanh công cụ.
3. Đồng ý ghi nhật ký trong phiên. Không nhập tên, lớp cụ thể hoặc dữ liệu cá nhân.
4. Chọn Dự đoán hoặc Giải thích, nhập câu trả lời, bấm Phân tích câu trả lời.
5. Đọc nhãn dự đoán, bằng chứng, ý còn thiếu và câu hỏi tiếp theo. Trả lời bổ sung để cập nhật lịch sử.
6. Xuất nhật ký để giữ dữ liệu; xóa hoặc bỏ đồng ý sẽ xóa bộ nhớ phiên. Tải lại trang cũng mất lịch sử. File JSON đã tải về không bị xóa tự động.

Bốn trạng thái: hiểu đúng, chưa đầy đủ, có quan niệm sai, chưa đủ bằng chứng. Đánh giá theo khái niệm của từng bài, không gắn nhãn cố định cho cả học sinh. Dự đoán và giải thích có chuỗi lịch sử riêng. Bản này có một khái niệm trọng tâm/bài với hai tiêu chí ý nghĩa; chưa bao phủ toàn bộ nội dung kiến thức.

## Mã nguồn và phương pháp

- `web/src/egad.js`: phân tích theo mẫu ngôn ngữ, bộ nhớ tối đa 200 đánh giá, chính sách chọn câu hỏi từ rubric.
- `web/data/egad-rubrics.json`: tiêu chí, mẫu quan niệm sai và câu hỏi cho 10 bài.
- `web/src/egad-panel.js`: hiển thị an toàn bằng textContent.
- `egad_local.py`: adapter tùy chọn cho llama.cpp. Không có khóa hoặc dịch vụ trả phí.
- `tools/evaluate_egad.py`: tính confusion matrix, Macro-F1, balanced accuracy từ nhãn giáo viên độc lập.

Rubric là baseline xác định theo quy tắc, KHÔNG phải mô hình ngôn ngữ được huấn luyện. Có thể bỏ sót câu đúng khác cách diễn đạt, không hiểu đầy đủ phủ định hoặc câu nhiều mệnh đề. Trường hợp nghi vấn/chưa chắc chắn được ưu tiên hỏi lại. Không báo phần trăm tin cậy vì chưa hiệu chuẩn. Các kiểm thử nhân tạo không phải dữ liệu nghiên cứu học sinh.

Sự kiện phản ứng/rót được gắn làm bằng chứng thao tác, tách dữ liệu camera không chắc chắn. Hiện nhãn kiến thức baseline dựa vào lời giải thích; chưa có mô hình học kết hợp hành động–ngôn ngữ hay ước lượng tiến bộ theo thời gian đã kiểm định. Lịch sử đổi nhãn chỉ phản ánh các lần trả lời, chưa chứng minh ghi nhớ dài hạn.

## Tùy chọn mô hình mã nguồn mở

Có thể dùng **llama.cpp** (runtime MIT, https://github.com/ggml-org/llama.cpp). Đây là tích hợp giao thức với runtime có sẵn; không nhận mã nguồn llama.cpp là đóng góp riêng của nhóm. Tài liệu server: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md . Đã đối chiếu giao thức ngày 05/11/2026.

Cài một bản llama.cpp thích hợp cho hệ điều hành và chọn một mô hình GGUF dạng instruct có hỗ trợ tiếng Việt, kiểm tra giấy phép trọng số riêng. ZIP HoloLab **không chứa runtime hoặc trọng số mô hình**, không tự tải hàng GB dữ liệu. Chưa benchmark mô hình cụ thể; không cam kết khả năng chạy trên i5/8GB.

Khởi động runtime (thay đường dẫn bằng file đã cài):

```bash
llama-server -m /duong/dan/model-instruct.gguf --host 127.0.0.1 --port 8080 -c 4096
```

Windows dùng `llama-server.exe` và đường dẫn file trên máy. Sau khi server báo sẵn sàng, tích **Phân tích thêm bằng llama.cpp trên máy** rồi gửi câu trả lời. HoloLab gửi riêng nội dung câu trả lời và kiến thức bài học qua loopback, không gửi video/landmarks hoặc lịch sử danh tính. Kết quả mô hình hiển thị riêng, không âm thầm thay nhãn rubric. Xuất nhật ký bao gồm kết quả mô hình nếu có.

Adapter chỉ cho phép `127.0.0.1:8080`, chặn chuyển hướng và proxy, một yêu cầu tại một thời điểm, timeout 25 giây. Kiểm tra cấu trúc, nhãn, ID khái niệm, tính nhất quán và trích dẫn đúng câu học sinh. Kiểm tra này **không bảo đảm suy luận hóa học của mô hình là đúng**. Chưa truyền memory hoặc chuỗi thao tác vào mô hình cục bộ trong phiên bản này.

Không có mô hình: thông báo rõ không kết nối được; rubric vẫn chạy. Đây là HTTP nội bộ, không phải API trả phí hay OpenAI service. Không cần mở cổng Internet. Chưa kiểm thử suy luận với trọng số mô hình thật; chỉ đã kiểm thử hợp đồng adapter bằng phản hồi giả lập và xử lý khi thiếu runtime.

## Đánh giá nghiên cứu

Chuẩn bị CSV UTF-8 có `student_id,concept_id,teacher_label,predicted_label`. Dùng mã ẩn danh; các nhãn là correct/incomplete/misconception/insufficient. Giáo viên đánh giá độc lập theo rubric; không dùng nhãn EGAD làm đáp án chuẩn.

```bash
python tools/evaluate_egad.py teacher_holdout.csv
```

Chia train/test theo học sinh, không chia các lượt của cùng học sinh sang hai tập. Khi thiếu một trong bốn lớp, báo rõ: Macro-F1 vẫn tính trên bốn lớp, balanced accuracy tính trên các lớp có mẫu. Chưa có số liệu thực nghiệm để công bố độ chính xác hoặc hiệu quả học tập.
