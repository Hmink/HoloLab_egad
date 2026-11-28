# Định hướng KHKT cho ChemLab CV

## 1. Vấn đề thực tiễn nên giải quyết

Sản phẩm hướng tới học sinh cần luyện dự đoán hiện tượng, định lượng và trình tự thao tác trước buổi thực hành; giáo viên cần nhìn thấy lỗi cụ thể để phản hồi. Một laptop có webcam là cấu hình mục tiêu, cần đo trên thiết bị thực tế trước khi công bố yêu cầu phần cứng. Phần mềm chạy cục bộ sau khi cài, giảm phụ thuộc mạng và không cần dịch vụ LLM trả phí.

Các lợi ích **cần kiểm chứng**: tăng cơ hội luyện tập khi dụng cụ hạn chế; luyện tình huống có nguy cơ mà không đưa hóa chất thật vào phiên học; nối thao tác, hiện tượng, phương trình và số liệu; hỗ trợ giáo viên phát hiện sai về chất giới hạn hoặc thứ tự thao tác.

Phòng lab ảo không tạo cảm giác lực, ma sát, nhiệt, mùi và kỹ năng thao tác với vật thật đầy đủ. Kết luận phù hợp là hỗ trợ chuẩn bị và củng cố thực hành. Không tự tuyên bố thay thế toàn bộ phòng thí nghiệm hoặc đảm bảo người dùng sẽ thao tác an toàn ngoài đời.

## 2. Điều gì đã tồn tại?

| Nguồn đã kiểm tra | Điều đã có | Hệ quả đối với đề tài |
|---|---|---|
| FunWithComputerVision / threejs-handtracking-101 | MediaPipe điều khiển hình 3D; nội suy làm mượt giá trị mục tiêu | Gắn đồ vật vào chuyển động tay không tự là đóng góp mới |
| MediaPipe Hands, Zhang và cộng sự (2020) | Pipeline phát hiện bàn tay và 21 landmark thời gian thực | Bạn sử dụng model có sẵn; không tuyên bố tự huấn luyện bộ nhận diện tay |
| One Euro, Casiez, Roussel, Vogel (2012) | Bộ lọc thích ứng theo tốc độ, cân đối rung và trễ | Dùng One Euro riêng lẻ không phải thuật toán mới |
| ChemCollective Virtual Lab | Phòng lab hóa học ảo, chọn thuốc thử, bài tập nồng độ và định lượng | “Có lab ảo và tính mol” đã có tiền lệ |
| Lessons learned… Frontiers in Education (2024) | Khảo sát trải nghiệm AR trong học hóa hữu cơ; tác giả phân biệt nhận thức tự báo cáo với kết quả học thực tế | Cần bài kiểm tra kiến thức độc lập; hứng thú cao không đồng nghĩa hiểu sâu hơn |

Đây là đối chiếu bước đầu, không phải tổng quan hệ thống chứng minh chưa ai làm một kỹ thuật. Trước khi chốt tuyên bố tính mới, tìm thêm các từ khóa `context-aware hand gesture virtual chemistry laboratory`, `intent recognition hand tracking`, `adaptive pinch threshold`, `procedural error detection virtual lab`, rồi lập bảng so sánh nhiệm vụ, input, thuật toán và cách đánh giá.

## 3. Đề tài có thể bảo vệ

Tên đề xuất:

**Nghiên cứu phương pháp nhận diện ý định thao tác có xét ngữ cảnh và kiểm soát sai trình tự trong phòng thí nghiệm hóa học ảo sử dụng webcam.**

Lõi nghiên cứu: giảm gắp/rót/lắc nhầm dưới tác động của khoảng cách, ánh sáng, rung và mất dấu, trong khi vẫn giữ độ trễ chấp nhận được. Mô hình ngữ cảnh biết người học đang cầm gì, có vật nhận hay chưa, có chất hay chưa, vật nhận có dung tích hay không, và bước nào được phép trong bài thực nghiệm.

Cơ hội đóng góp có thể kiểm chứng:

1. Bộ giải mã ý định kết hợp đặc trưng thời gian + trạng thái vật chứa + vùng thao tác, so với cách chỉ dùng khoảng cách ngón và góc tay.
2. Cơ chế hiệu chuẩn ngưỡng theo người/phiên, đánh giá khả năng chuyển sang người và điều kiện chưa thấy.
3. Bộ dữ liệu sự kiện thao tác ảo và rubric nhãn lỗi, gồm các ca lỗi dễ nhầm; có log cấu hình và phiên bản để tái lập.
4. Kết quả định lượng về đánh đổi giữa nhầm thao tác và độ trễ, đồng thời kiểm tra lợi ích học tập bằng đối chứng riêng.

V1 đã cung cấp nền để thu dữ liệu, chưa triển khai bộ hiệu chuẩn hoặc mô hình học ý định. Bộ quy tắc trạng thái và ngưỡng hiện có là baseline kỹ thuật. Chỉ sau khi thuật toán đề xuất hơn baseline trong thử nghiệm phù hợp mới trình bày là đóng góp có bằng chứng.

Nếu muốn bổ sung ML: bắt đầu với logistic regression/Random Forest trên chuỗi đặc trưng cửa sổ (pinch ratio, vận tốc, góc, độ lệch tâm, số lần đổi chiều, khoảng cách tới miệng bình, state), rồi so sánh với rule-based FSM. Chia dữ liệu theo người, không chia ngẫu nhiên frame của cùng một chuỗi vào train/test. Không cần bắt đầu bằng LLM hay mô hình lớn.

## 4. Câu hỏi nghiên cứu và thước đo

| Câu hỏi | Thiết kế | Chỉ số chính |
|---|---|---|
| RQ1: Chuẩn hóa theo tay và lọc thích ứng có giảm thao tác sai khi đổi khoảng cách/ánh sáng? | Cùng người, cùng nhiệm vụ, các cấu hình thuật toán đối chứng | Tỉ lệ hoàn thành; gắp sai/phút; thả nhầm/lượt; độ rung pixel; thời gian hoàn thành |
| RQ2: Ngữ cảnh giảm kích hoạt rót/lắc nhầm hơn ngưỡng đơn? | Bộ tình huống có nhãn ý định, gồm các chuyển động tương tự nhau | Precision/recall/F1 theo từng sự kiện; ma trận nhầm lẫn; độ trễ phát hiện |
| RQ3: Cảnh báo theo hành động giúp hiểu chất giới hạn và lỗi trình tự? | Bài học cùng nội dung/thời lượng, phân nhóm phù hợp | Điểm trước–sau; bài chuyển giao mới; kiểm tra trì hoãn; lỗi trình tự còn lặp lại |

Không lấy số kiểm thử phần mềm vượt qua làm độ chính xác CV. Không lấy FPS làm độ chính xác. Không lấy thời gian `detect_for_video` làm độ trễ toàn hệ thống.

## 5. Thực nghiệm kỹ thuật vừa sức

Giai đoạn thí điểm có thể bắt đầu 12–20 người, mỗi người 10–15 lượt gắp/đặt ở vài khoảng cách và điều kiện sáng. Đây là cỡ mẫu vận hành ban đầu, không phải khẳng định đủ lực thống kê cho mọi hiệu ứng. Dùng số liệu thí điểm để ước tính biến thiên và điều chỉnh số người/lượt.

Ghi rõ thiết bị, độ phân giải webcam thực tế, nguồn sáng, khoảng cách, bàn tay sử dụng và cấu hình thuật toán. Khoảng cách dùng các mức thực tế phù hợp khung hình; không thay khoảng cách và góc tay đồng thời nếu muốn tách tác động. Có các ca che khuất ngắn, ra khỏi khung và người dùng chỉ trỏ mà không định gắp.

Các cấu hình chạy được ngay:

| Cấu hình | Lệnh | Mục đích |
|---|---|---|
| A: Pixel, không lọc | `python app.py --pinch pixels --no-smoothing --log logs/A_01.jsonl` | Mốc so sánh ngưỡng cố định |
| B: Chuẩn hóa, không lọc | `python app.py --pinch normalized --no-smoothing --log logs/B_01.jsonl` | Tách tác dụng chuẩn hóa |
| C: Chuẩn hóa + One Euro | `python app.py --pinch normalized --log logs/C_01.jsonl` | Tách tác dụng lọc |
| D: Chuột | `python app.py --mouse-only --log logs/D_01.jsonl` | Đối chứng phương thức nhập khi đánh giá UI/học tập |

A/B/C vẫn cùng hysteresis, debounce và cách hoàn tác để so sánh công bằng; A không phải bản chỉ có một câu `if d<40`. Thứ tự A/B/C đảo giữa người dùng để giảm ảnh hưởng luyện tập. Để kiểm tra ngưỡng 40px có bị bất lợi do cấu hình camera, bổ sung baseline pixel được hiệu chuẩn trên tập phát triển rồi khóa tham số trước tập đánh giá.

Khi có mô hình ngữ cảnh, giữ nội dung hóa học và cơ chế khóa như nhau giữa các cấu hình. Nếu cần đánh giá bộ phân loại khi bỏ ngữ cảnh, dùng dữ liệu ghi trước hoặc phiên ảo có kiểm soát; không thay các điều kiện an toàn ngoài đời.

Định nghĩa đơn vị đo trước khi thu dữ liệu:

- **Gắp sai**: có event grab nhưng nhãn ý định là chỉ trỏ/không gắp.
- **Thả nhầm**: vật được đặt dù người dùng vẫn định giữ, khác với hủy do mất tracking.
- **Thời gian hoàn thành**: từ tín hiệu bắt đầu nhiệm vụ đến lần thả hợp lệ cuối.
- **Rung khi giữ yên**: RMS độ lệch của con trỏ quanh trung vị trong cửa sổ tĩnh đã gán nhãn.
- **Độ trễ xử lý**: log inference/loop; gọi đúng tên này. Độ trễ đầu-cuối cần đo từ hành động thật tới màn hình, ví dụ quay ngoài tốc độ cao với cách gán mốc nhất quán.
- **Thống kê**: báo cáo theo người, trung vị/IQR và khoảng tin cậy hoặc phân tích phù hợp; không coi hàng nghìn frame của một người là hàng nghìn người độc lập.

Log hiện tại có pointer, raw_midpoint, ratio và sự kiện, đủ cho kiểm tra cơ bản. Chưa ghi toàn bộ landmark/góc để huấn luyện rót/lắc; cần thêm các đặc trưng đó khi mở rộng. Việc hủy/commit/drop thành công nên bổ sung event riêng khi xây bộ thu dữ liệu chính thức, thay vì suy ra nhãn ý định từ số vật thể.

## 6. Đánh giá giáo dục riêng với hiệu năng CV

Bài học ban đầu nên tập trung **chất giới hạn và trung hòa**: yêu cầu dự đoán chất dư, chọn lượng chất, thực hiện ảo, giải thích chênh lệch giữa dự đoán và kết quả. Nội dung này cho phép kiểm tra định lượng mà chưa cần mô phỏng hóa học quá rộng.

Thiết kế đối chứng:

- Nhóm 1 dùng chuột, nhóm 2 dùng tay; cùng dữ liệu, bài tập, phản hồi, thời lượng và giáo viên.
- Tiền kiểm tra để đo nền kiến thức; hậu kiểm tra dùng bài tương đương; bài trì hoãn sau khoảng một tuần nếu điều kiện cho phép.
- Chấm câu giải thích theo rubric, người chấm không biết nhóm nếu tổ chức được.
- Khảo sát dễ dùng/hứng thú là biến phụ. Thang tự xây phải nói rõ là tự xây; nếu dùng SUS/UEQ thì dùng bản và cách chấm hợp lệ.
- Thí điểm khoảng 24–40 học sinh có thể giúp đánh giá khả thi, không bảo đảm đủ lực thống kê. Cỡ mẫu chính thức cần dựa trên hiệu ứng/biến thiên và điều kiện trường.
- Tự nguyện, phù hợp quy định nhà trường và sự đồng ý liên quan khi thu dữ liệu học sinh. Dùng mã ẩn danh; mặc định không lưu khuôn mặt/video.

Rubric gợi ý, mỗi tiêu chí 0–2 điểm: xác định đúng chất giới hạn; tính đúng lượng chất sau phản ứng; giải thích hiện tượng/nhiệt theo mô hình; phát hiện lỗi thao tác và chọn cách khắc phục hợp lệ. Rubric này là bản đề xuất, cần giáo viên thẩm định trước khi dùng đánh giá.

## 7. Kiểm chứng hóa học

Mỗi mô hình cần tập bài chuẩn: thiếu một chất, dư A, dư B, đúng tỉ lệ, lượng rất nhỏ, đầu vào âm/NaN, vượt phạm vi nhiệt độ/nồng độ. Đối chiếu bảo toàn nguyên tử, điện tích, khối lượng toàn hệ thích hợp và năng lượng trong giả thiết đã nêu.

Đối với kết tủa: phân biệt phản ứng hoàn toàn xấp xỉ với cân bằng độ tan. Đối với khí: phân biệt khí tương đương lý tưởng với khí thu được. Đối với nhiệt: ghi ΔH, cp, nhiệt dung bình, điều kiện đầu và thất thoát. Nếu chưa có dữ liệu, trả trạng thái không đủ mô hình thay vì tạo số liệu.

Giáo viên/tham vấn hóa học cần rà soát danh mục phản ứng, rubric và các tình huống an toàn trước triển khai lớp. Việc tự so khớp công thức với chính code không thay cho xác nhận khoa học độc lập.

## 8. Kế hoạch phát triển theo mốc nghiệm thu

1. **Nền tương tác:** gắp/đặt ổn định, log dùng được, xử lý mất dấu; đạt trên máy đích.
2. **Một thí nghiệm định lượng:** vật chứa có state; rót theo dt; tính mol; ledger bảo toàn.
3. **Cảnh báo có giải thích:** kiểm tra trước commit, banner rõ, hoàn tác đúng, PPE không bỏ qua lỗi cấm.
4. **Thuật toán đề xuất:** hiệu chuẩn/ngữ cảnh; tập dữ liệu, baseline và phép loại bỏ từng thành phần.
5. **Thử nghiệm có đối chứng:** khóa tham số trước đánh giá; báo cáo cả ca thất bại.
6. **Đóng gói bảo vệ:** video demo, source, dữ liệu được phép chia sẻ, nhật ký phiên bản, kết quả thật, giới hạn.

Không dùng câu “thuật toán đạt 95%”, “tăng 30% kết quả học” hay “hoàn toàn mới” trước khi có dữ liệu và phép đánh giá hỗ trợ.
