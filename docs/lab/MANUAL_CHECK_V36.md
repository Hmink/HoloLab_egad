# Kiểm tra V3.6 bằng webcam thật

Các bài tự động không thay thế quy trình này. Ghi tên máy, CPU/GPU, hệ điều hành,
trình duyệt và phiên bản; ghi rõ dùng webcam nào. Không ghi thông tin cá nhân vào
nhật ký học tập. Dùng một thư mục giải nén mới, dừng server cũ, Ctrl+F5 rồi xác nhận
tab ghi **V3.6**.

## Camera và đo hiệu năng

1. Mở `http://127.0.0.1:8765`, bấm Bật camera và cấp quyền. Đóng ứng dụng khác nếu
   đang dùng camera. Nếu ứng dụng Camera của Windows cũng đen, kiểm tra nắp che,
   phím khóa camera và quyền Windows trước khi quy lỗi cho HoloLab.
2. Trong Thông tin bình & tùy chọn điều khiển, chọn HD; để ảnh CV 640 trước.
   Đối chiếu **độ phân giải stream thực tế** và **ảnh CV thực tế** trong Thông số kỹ
   thuật. Video HD không có nghĩa inference cũng chạy HD.
3. Đưa tay rõ vào camera, đủ sáng, tránh ngược sáng. Giữ rồi di chuyển chậm/nhanh;
   ghi xem mất dấu xảy ra ở vị trí/góc nào. Không đánh đồng mất dấu với sai kiến thức.
4. Đo 60 giây khi bật camera và thao tác 5 bình; xuất báo cáo JSON. Ghi render FPS,
   tracking Hz, min FPS/1 giây, inference ms, tuổi mẫu và số tay nhận được. Đo 3 lượt
   trên V3.5 và V3.6 cùng máy, cùng camera/cấu hình/bài học, không mở cả hai đồng thời.
5. Độ trễ đầu–cuối chưa được số đo này bao phủ. Nếu cần, quay đồng thời tay thật và
   màn hình bằng máy quay tốc độ cao; tính chênh frame giữa chuyển động thật và bình.
6. LOW, HD, FHD chỉ kiểm tra ở mức camera hỗ trợ; không ép 1080p nếu FPS/độ rõ kém.

## Cử chỉ và lỗi bình treo

| Thử | Cách làm | Điều cần ghi |
|---|---|---|
| Gắp từng tay | 10 lần trái, 10 lần phải, tay ở gần/xa khác nhau | Số lần đúng / 10; loại bình và chế độ |
| Giữ | Giữ một bình 30 giây, đi qua vùng hợp lệ | Số lần tự nhả; đoạn tracking bị mất |
| Thả nhìn thấy rõ | Gắp bình trên cao, mở cái–trỏ trong camera | Owner hết; bình rơi, không về vị trí đầu |
| Thả trong rotate | Gắp bằng pinch, đổi rotate, mở cái–trỏ nhưng gập 3 ngón còn lại | Không còn bị fist giữ sai |
| Mất dấu ngắn | Che tay khoảng 0,2–0,3 giây rồi đưa lại | Giữ bình, không ném do tracking nhảy |
| Mất dấu lâu | Đưa tay khỏi camera >1 giây | Đếm ngược; khoảng 0,7 giây không có bằng chứng thì bình rơi |
| Hai tay riêng | Mỗi tay giữ một bình, đưa chéo/chênh độ sâu | Không đổi owner; nếu mơ hồ thì giữ ngắn thay vì nhảy |
| Hai tay một bình | Cùng giữ, lần lượt mở một tay rồi tay cuối | Chỉ tay cuối thả mới rơi; không giật khi bàn giao |
| Tracking chậm | Thử thiết bị yếu, ghi tracking Hz | Phân biệt dưới 10 Hz với mất dấu thật; không đứng một chỗ vì rebase liên tục |

Chấm vàng nhỏ chỉ là tâm tương tác. Vòng xanh/vàng phân biệt track A/B. Hãy đọc
trạng thái và tên bình, không dùng màu chấm để kết luận gắp thành công.

## Physics và rót

Lặp 25 lượt: mỗi kiểu cốc, bình tam giác, ống nghiệm, chai, nhỏ giọt ở các góc
0°, 45°, 90°, 135°, 180°. Nâng lên → mở tay → quan sát rơi → gắp lại.
Ghi video nếu có treo, xuyên bàn, văng khỏi biên hoặc nhảy pose.

- Kéo xuống dưới mặt bàn, tới bốn mép; collider phải chặn cả bình đang gắp.
- Ném nhẹ và chạm bình cạnh bên; có chuyển động vừa phải, không phóng ra ngoài.
- Đặt bình rồi không thao tác 60 giây, kiểm tra đứng yên.
- Bài AgCl: AgNO₃ vào mẫu NaCl tạo đục/trắng; nước đối chứng sạch không tạo AgCl.
- Nghiêng từng bước, úp ngược; dung dịch giảm liên tục, tràn được ghi nhận.
- Gắp/đặt/nhúng thanh Fe, xác nhận Cu bám chỉ khi tiếp xúc dung dịch phù hợp.
- Làm lại 5 bài, kiểm tra câu hỏi, lưu/mở phiên, chuẩn độ và nhật ký tùy chọn.

## Cấu hình, giao diện và chạy lâu

1. Khi đang giữ bình, đổi pinch/DPR/tracking Hz/reach/move–rotate: owner không mất.
2. Khi đang giữ, yêu cầu đổi ảnh CV/camera/mirror/backend: thấy thông báo chờ; thả
   bình rồi thay đổi mới áp dụng. Đổi backend không cần tải lại trang.
3. Thu/mở kho bên phải và Chọn bài bên trái; kiểm tra nhãn không đè nhau, cuộn được
   gợi ý hóa học và tùy chọn. Thử cửa sổ nhỏ và chế độ toàn màn hình.
4. Chạy liên tục 30 phút với camera và thao tác thật; mỗi 5 phút đo FPS/Hz, theo dõi
   Task Manager nếu cần. Không kết luận leak chỉ vì RAM tăng rồi được GC thu lại.
5. Mở F12 Console: lưu lỗi đầu tiên cùng thao tác, thời điểm và file/dòng. Ghi rõ
   “chưa kiểm tra” cho trường hợp không thực hiện; không thay bằng “đạt”.

Mẫu ghi lỗi: **Bài / bình / chế độ / tay A-B / độ phân giải thực / tracking Hz /
thao tác trước lỗi / trạng thái hiển thị / có lặp lại được không / lỗi console**.
