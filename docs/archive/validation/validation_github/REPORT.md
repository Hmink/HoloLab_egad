# Kiểm tra bản đóng gói GitHub — 17/11/2026

## Thay đổi trong lượt này
- README mới: chạy Windows/Linux, điều khiển chuột, GitHub Desktop/Git, giới hạn triển khai.
- Giữ README trước trong docs/README_PREVIOUS.md.
- Trang EGAD pilot có bộ chọn 45 câu mẫu mô phỏng theo 9 câu hỏi. Mẫu thuộc tập huấn luyện, không phải dữ liệu kiểm thử độc lập.
- Thêm .gitignore cho secrets/môi trường/nhật ký; workflow GitHub Actions chạy npm ci, test, build.
- Thêm HTTP smoke script; các script QA trình duyệt hỗ trợ CHROMIUM_EXECUTABLE.
- Không chỉnh thuật toán CV, chuột, vật lý hoặc phản ứng. Không huấn luyện lại model, không tích hợp API cloud.

## Kết quả thực chạy
| Kiểm tra | Kết quả |
|---|---|
| npm ci | Thành công |
| npm test | 135/135 đạt |
| npm run build | Thành công, Vite 7.2.2 |
| Python unittest | 98 bài đạt, 1 lỗi import module test_render_paths vì thiếu cv2; chưa kiểm thử được module desktop này |
| Khởi động Python server và 9 HTTP tài nguyên | Đạt |
| Cú pháp JS nội tuyến trang pilot | Đạt |
| 45 mẫu / 9 câu hỏi và nhãn nguồn mô phỏng | Đạt |
| QA Chromium | Không chạy được: Chromium bị môi trường chặn socket hệ thống khi khởi động; không ghi nhận pass tương tác |
| Webcam thật, FPS/độ trễ, thao tác chuột trong trình duyệt | Chưa xác minh lại trong lượt này |
| Agent API / Base44 / GitHub deploy | Chưa triển khai |

Các test đơn vị chứa kiểm tra vật lý, chuột, hóa học và tính tương đương model JS/Python. Chúng không thay thế kiểm tra người dùng thật. Các báo cáo validation_v* khác là lịch sử kế thừa, không tính vào kết quả mới. Workflow GitHub Actions đã soạn nhưng chưa chạy trên GitHub.

## Kiểm tra thủ công trước trình diễn
1. Chạy server.py, mở trang, chưa bật camera; kiểm tra Console không có lỗi.
2. Mở thư viện, chọn chloride và bắt đầu; kiểm tra đủ dụng cụ.
3. Kéo bình bằng chuột, nghiêng bằng chuột phải, đổi chiều sâu; thả phải rơi xuống bàn.
4. Lặp 20 lần gắp/thả; thử bốn mép bàn và chạm nhẹ hai bình; không xuyên bàn hay mất bình.
5. Đặt miệng AgNO3 trên mẫu NaCl rồi nghiêng; kiểm tra lượng chất chuyển và AgCl hình thành. So sánh mẫu nước đối chứng.
6. Mở /egad-pilot.html; chọn câu và mẫu, phân tích; thử câu trống, câu mới, đổi câu hỏi và tải nhật ký. Nhãn mô hình có thể sai: báo lại để giáo viên đối chiếu.
7. Bật camera riêng để kiểm tra cử chỉ nếu cần. Máy yếu vẫn dùng chuột được.
8. Kiểm tra Lưu/khôi phục phiên, hoàn tác/làm lại; không dùng dữ liệu học sinh thật trong repository công khai.

Giới hạn: model pilot chỉ phân loại văn bản độc lập với câu hỏi, dữ liệu tổng hợp và nhãn tạm. Không được trình bày là model EGAD đã kiểm chứng hoặc LLM agent đã huấn luyện.
