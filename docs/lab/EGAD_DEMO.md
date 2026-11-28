# Giới hạn EGAD demo

Ví dụ thống kê không phải agent TeachBack dùng API. Chọn mẫu để xem đường đi dữ liệu và nhãn dự đoán; đây là mẫu huấn luyện nên kết quả tốt trên mẫu không chứng minh khả năng khái quát.

Dữ liệu: 45 câu tổng hợp, 9 câu hỏi, 5 học sinh hư cấu. Nhãn giáo viên từng câu còn trống. Đánh giá leave-one-question-out trên dữ liệu tổng hợp: accuracy 0.5111, macro-F1 0.4331 (kết quả lịch sử, không huấn luyện lại trong bản đóng gói này).

Bản agent tiếp theo dự kiến nhận câu hỏi + rubric + câu trả lời + bộ nhớ; phân tích theo tiêu chí, chọn câu hỏi tiếp theo và trả bằng chứng. Chưa tích hợp nhà cung cấp API và chưa đo chất lượng trên học sinh thật.

Không đưa dữ liệu học sinh có danh tính lên repository công khai. Nhật ký xuất từ giao diện lưu tại máy người dùng, không tự gửi lên máy chủ AI.
