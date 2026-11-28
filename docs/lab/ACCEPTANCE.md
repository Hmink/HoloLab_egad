# Phiếu nghiệm thu trên thiết bị mục tiêu

Chưa điền kết quả người dùng. Không thay ô trống bằng kết quả replay.

Máy/CPU/GPU: ______ ; RAM: ______ ; OS: ______ ; trình duyệt: ______ ; camera: ______ ; ngày: ______
Tracking delegate hiển thị: ______ ; độ phân giải camera: ______ ; viewport: ______ ; DPR: ______
Ánh sáng/nền/khoảng cách gần–xa đo được: ______ ; số người thử: ______

## Quy trình đối chiếu

- Dùng cùng camera, ánh sáng, tư thế và bố trí 5 dụng cụ. Thử V2.0/V2.1 và V3 theo thứ tự luân phiên để giảm hiệu ứng học thao tác. Không chạy hai bản tranh camera cùng lúc.
- Warm-up 10 giây. Đo V3 60 giây bằng nút tích hợp, lặp 3 lần. Lưu JSON từng lần; ghi FPS trung bình và p95 khoảng thời gian frame, tracking Hz, tuổi mẫu. Không chỉ chụp con số FPS tức thời.
- Mỗi tay 10 lần: đưa tay mở đến vật, chụm–nhấc–kéo–thả vào đích. Thành công khi đúng vật, giữ liên tục, không nhảy rõ hoặc tự nhả. Ghi thời gian và nguyên nhân thất bại từng lần.
- Sau đó thử mỗi tay một bình trong 10 giây; một tay gần và một tay xa. Giao tay có/không che nhau; ghi số lần đổi owner sai. Không coi việc giữ vị trí khi mơ hồ là mất vật.
- Thử cùng bình hai tay, nhả từng tay; xoay X/Y, nghiêng và chiều sâu. Đo/quan sát bước nhảy khi đổi owner.
- Mất dấu có chủ đích 0,2 s, 0,5 s, 1 s: bình phải còn, dừng rót và hồi phục không nhảy. Thử >1,8 s: bình được đặt tại chỗ; cần mở tay để gắp lại.
- Thử 4 mép vùng nhìn thấy, 16:9 và 4:3, mirror bật/tắt, đổi kích thước cửa sổ. Không di chuyển bàn tay ra ngoài camera rồi yêu cầu tiếp tục bám vị trí không quan sát được.
- Kiểm tra lại thí nghiệm cũ: lượng trước/sau, đầy bình, nguồn hết chất, nắp, kết tủa, khí thoát, nguy cơ minh họa/chặn và save/load.

| Hạng mục | Tiêu chí | Kết quả máy mục tiêu | Đạt/không đạt |
|---|---|---|---|
| Render | Trung bình ≥45 FPS trong 60 s | ______ | ______ |
| Tracking | Ghi Hz và tuổi mẫu; phải thao tác liên tục với độ trễ chấp nhận được | ______ | ______ |
| Gắp trái | ≥9/10 | ______ /10 | ______ |
| Gắp phải | ≥9/10 | ______ /10 | ______ |
| Giữ | Không tự nhả trong 10 s kéo bình thường | ______ | ______ |
| Hai bình | Hai tay độc lập, không tranh owner | ______ | ______ |
| Hai tay một bình | Không nhảy khi một tay thả | ______ | ______ |
| Dấu vàng | Không nhấp nháy bất thường lúc tracking ổn định | ______ | ______ |
| L/R | Không đảo nhãn sai trong thao tác đã quy định | ______ | ______ |
| Mép và recovery | Không mất vật; hồi phục ngắn | ______ | ______ |
| Hồi quy hóa học | Các phép thử trên giữ lượng, phản ứng và dữ liệu | ______ | ______ |

| Tay / lần | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Trái: đạt/thất bại | | | | | | | | | | |
| Phải: đạt/thất bại | | | | | | | | | | |

Nếu quay video đối chiếu, quay đồng thời bàn tay thật và màn hình ở tốc độ đủ cao để đo độ trễ. “Độ tuổi mẫu” trong JSON chỉ đo từ timestamp lấy frame tới kết quả nhận diện; không bao gồm toàn bộ độ trễ camera, màn hình và cảm nhận người dùng.

## Giá trị nghiên cứu có thể đánh giá

Câu hỏi: chuẩn hóa pinch + hysteresis + giữ owner + bộ lọc thích nghi giảm lỗi thao tác bao nhiêu so với bản cũ, ở các khoảng cách/giao tay/mất dấu đã định nghĩa? Biến độc lập là controller/thiết lập; biến phụ thuộc là tỷ lệ gắp, nhả sai, owner swap, jitter và latency. Tách thử loại bỏ từng thành phần để biết phần nào tạo cải thiện. Đây là đánh giá kỹ thuật tích hợp; không tuyên bố MediaPipe, AR lab hoặc One Euro là phát minh của dự án.

Muốn kết luận hiệu quả học hóa học cần một nghiên cứu giáo dục riêng với bài trước/sau và nhóm so sánh. Không suy ra điểm học tập từ FPS hay kết quả kiểm thử code.
