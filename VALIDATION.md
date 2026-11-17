# Kiểm chứng V3.0 — 26/10/2026

**Trạng thái: mã nguồn chạy được, đã qua kiểm thử phần mềm; CHƯA nghiệm thu đầy đủ trên webcam/thiết bị mục tiêu.** Render đạt ngưỡng 45 FPS trong các lượt đo dưới đây. Tracking trên đồ họa phần mềm vẫn chậm hơn V2.1 native; không khẳng định toàn bộ trải nghiệm đã mượt hơn bản cũ ngoài thực tế.

## Điều kiện đo

- Linux container, AMD EPYC 9V74, hạn mức khoảng 8 core; không có GPU phần cứng để đánh giá. Desktop dùng llvmpipe; trình duyệt dùng SwiftShader.
- V3: Chromium 134.0.6998.35 headless, Playwright 1.51.1, Three.js 0.180.0, MediaPipe Tasks 0.10.32, model full đóng kèm. Viewport 1280×800, 5 vật thể, một bình chuyển động bằng kịch bản, DPR cuối bằng 1,0.
- Nguồn kiểm tra: ảnh tham chiếu Google có hai bàn tay, lặp thành nguồn camera giả Y4M và video WebM. Model MediaPipe thật chạy, không thay bằng landmarks giả trong benchmark. **Đây không phải webcam thật hoặc video cử chỉ chuyển động thật.**
- Browser QA kiểm tra camera giả, stop/restart rồi video loop. Benchmark V3 cuối dùng WebM lặp từ ảnh. V2.1 dùng cùng ảnh qua capture giả 30 Hz; gọi inference/render thật, thay phần cửa sổ GUI bằng mock.
- Mỗi số dưới đây lấy từ một lượt cuối dài ≥60 giây, sau warm-up; không phải trung bình của nhiều người/máy/lượt. Khác runtime, bố cục workspace và backend nên là so sánh hệ thống, không phải thí nghiệm cô lập GPU hay thuật toán lọc.

## Benchmark cuối cùng

| Hệ thống | Thời gian | Render trung bình | Tracking | p95 khoảng frame render | Suy luận TB | p95 tuổi mẫu |
|---|---:|---:|---:|---:|---:|---:|
| V2.1 native desktop | 60,017 s | 28,06 FPS | 28,41 Hz | 48,57 ms | 24,83 ms | 58,50 ms |
| V3 + Python CPU | 60,016 s | 57,05 FPS | 9,61 Hz | 16,80 ms | 29,04 ms | 112,90 ms |
| V3 + Web CPU/WASM | 60,006 s | 57,83 FPS | 6,12 Hz | 16,80 ms | 119,21 ms | 187,80 ms |

Tệp gốc: `validation/benchmark_v21.json`, `benchmark_v3_native.json`, `benchmark_v3_wasm.json`. Mã V3 được khóa bằng SHA256 trong `validation/SOURCE_SHA256.json`; các JSON benchmark chứa bản sao manifest. `render_cpu_mean_ms` chỉ là thời gian JS gửi render, không phải thời gian GPU hoàn thành.

**Kết luận có thể đưa ra:** đường render V3 vượt 45 FPS trong môi trường trên; state machine mới khắc phục được các lỗi tái hiện bằng replay. **Kết luận chưa thể đưa ra:** độ chính xác gắp 9/10 trên tay thật, độ trễ đầu-cuối tốt hơn V2.1, hay V3 đạt độ mượt Shape Creator trên máy người dùng. Native detector nhanh hơn Web CPU trong phép đo này, nhưng đường lấy/chuyển ảnh của trình duyệt vẫn có overhead; tracking V3 thấp hơn native desktop. Đây là hạn chế thực, không bị che bằng FPS render.

Không có phép đo 60 giây tương đương cho V2.0 trong lần bàn giao này. Các con số render ngắn của V2.0/V2.1 trong tài liệu lịch sử không được ghép thành benchmark 60 giây.

## Kiểm thử đã chạy

| Nhóm | Kết quả | Phạm vi |
|---|---|---|
| Python | 90/90 pass | 85 test hồi quy cũ + 5 test API, nhập phiên, lượng chất, nắp và nguy cơ |
| JS thuần | 26/26 pass | FSM, hysteresis, nhãn nhiễu, gần/xa, đổi thứ tự, giao tay, dual owner, mất dấu, depth/rotation, mirror, aspect, scheduler/epoch và metrics |
| Browser QA: Python CPU | 14/14 pass | UI/raycaster thật, API, save/load, cảnh nguy cơ, replay hai tay, Orbit, resize, model thật, video loop và benchmark |
| Browser QA: Web CPU | 14/14 pass | Cùng bộ kiểm tra, không phụ thuộc MediaPipe Python cài bên ngoài |
| API đóng gói độc lập | 5/5 pass với `python -S` | SymPy/mpmath từ `python_vendor`; không dựa vào site-packages |
| Giữ lõi cũ | 20/20 tệp giống byte | `chemlab/*.py`, `lab3d/*.py`, `data/*.json`; xem `preserved_core.json` |
| Gắp tổng hợp | 10/10 mỗi nhãn tay | Các chuỗi landmarks tổng hợp, không phải tỷ lệ gắp của người thật |

Các trường hợp trọng yếu đã kiểm tra:

- Một mẫu mở nhiễu không tự nhả; khoảng pinch dao động trong deadband không nhấp trạng thái.
- Hai tay gần/xa điều khiển hai bình riêng, dù kết quả detector đảo thứ tự.
- Giao tay mơ hồ giữ owner; các đường giao có khác biệt palm scale giữ ID trong fixture đã định nghĩa.
- Hai tay một bình, một tay nhả: tái neo tay còn lại; không scale dụng cụ.
- Gián đoạn ngắn giữ vật và phục hồi không đổi target đột ngột; timeout đặt vật tại chỗ, yêu cầu mở để gắp lại.
- Raycaster/coordinate/controller chạy chung trong browser: test phục hồi đo target jump = 0 world units tại frame hồi phục.
- Camera/video đổi nguồn không nhận lại kết quả epoch cũ; cùng một frame camera không gửi inference lặp; không có queue frame.
- Viewport resize và OrbitControls có chế độ riêng; không có JS page error trong lượt QA cuối.
- Mọi request trong lượt runtime dùng localhost/blob; thư viện/model không cần CDN.

## Tái hiện nguyên nhân gốc

`tools/compare_controller.py` phát cùng chuỗi 120 landmarks liên tục với nhãn tin cậy cao Left/Right luân phiên; 8 mẫu đầu mở tay, sau đó chụm.

| Chỉ số trên cùng fixture | V2.1 | V3 |
|---|---:|---:|
| Mẫu controller hợp lệ | 2/120 | 120/120 |
| Lần gắp | 0 | 1 |
| Lần tự nhả sau khi gắp | Không gắp được | 0 |
| Vật còn được giữ cuối chuỗi | 0 | 1 |

Đây là bằng chứng lỗi selector/recovery và bản sửa; không chứng minh detector thực sẽ luôn tạo landmark chính xác.

Kiểm tra bộ lọc với nhiễu tổng hợp ±0,004 theo trục x: RMS ở bề rộng 1280 giảm từ 5,12 px xuống 1,01 px. Trễ bộ lọc trên đoạn ramp tổng hợp ≈37,02 ms. Con số này không bao gồm camera, inference, nội suy render hoặc màn hình, nên **không phải latency đầu-cuối**.

## Tiêu chí nghiệm thu và hạn chế

| Tiêu chí người dùng | Tình trạng |
|---|---|
| ≥45 FPS, đo 60 s | Đạt trong môi trường headless đã nêu; máy mục tiêu chưa đo |
| Gắp ≥9/10 mỗi tay | Replay đạt; người thật chưa đo |
| Không nhả, hai tay độc lập | Các fixture trạng thái và browser replay đạt; camera chuyển động thật chưa đo |
| Dấu vàng ổn định | Nguyên nhân logic đã sửa, test state đạt; chưa có đánh giá nhìn/đếm flicker trên video tay thật |
| Nhãn L/R đúng | Tách khỏi owner, có bộ lọc; chưa có ground truth giải phẫu cho mọi góc camera/mirror |
| Giao tay không đổi owner | Đạt các fixture; che khuất hoàn toàn vẫn không bảo đảm ID |
| Vùng camera/mép và phục hồi | Test tọa độ + mất dấu đạt; không nhận diện được phần tay ngoài ảnh |
| Chuyển động mượt/latency | Chưa đủ bằng chứng nghiệm thu; tracking software 6–10 Hz còn hạn chế và chậm hơn native desktop |
| Regression | Các test lõi/API/UI đã liệt kê đạt; không đồng nghĩa đã kiểm tra mọi tình huống hóa học hoặc OS |

Các giới hạn khác:

1. Chưa chạy webcam thật, Windows/Edge thực, GPU phần cứng, nhiều người, ánh sáng yếu hay motion blur. Không kiểm thử nút BAT trực tiếp trên Windows; đã kiểm thử server Python và gói giải nén trong Linux.
2. Chỉ có ID bằng chuyển động/scale/nhãn mềm, không nhận dạng sinh trắc. Hai tay chồng kín hoặc ra ngoài rồi đổi vị trí có thể vẫn bị đổi ID. Khi mơ hồ ưu tiên đóng băng; không dự đoán tiếp bàn tay vô hình.
3. Độ sâu dựa vào palm scale là tương đối, không phải phép đo khoảng cách bằng camera depth. Dung tích và tỷ lệ bình không thay khi điều chỉnh z.
4. Native CPU tùy chọn cần các gói trong `requirements-tracking.txt`. Web runtime đã đóng đủ thư viện/model; không đóng wheel Windows/GPU driver/Python interpreter vào ZIP.
5. Codec video phụ thuộc trình duyệt. Fixture WebM/VP9 đã qua kiểm tra; MP4/H.264 không chạy trong Chromium headless dùng ở đây. Video từ người dùng chưa có để kiểm tra.
6. JSON từ V2.1 được nhập vào V3. JSON V3 không có tương thích ngược với app.py desktop cũ. Sau thay đổi reach/mirror/backend/mode, bình được đặt tại chỗ và người dùng mở tay để bắt đầu lại.
7. Chất lỏng, kết tủa và hiệu ứng là mô hình hiển thị đơn giản; không phải mô phỏng chất lưu/cháy nổ vật lý. Bộ phản ứng hữu hạn; hóa học không có mô hình vẫn phải được ghi chưa xác định.

Hướng khắc phục tiếp theo dựa trên dữ liệu: đo Web GPU trên thiết bị mục tiêu và so với Python CPU; lấy video thật có quyền sử dụng để đánh giá 10 lần mỗi tay, giao tay/near–far/mất dấu; điều chỉnh bộ lọc và pinch theo thống kê lỗi; nếu native transport là nút thắt trên máy đó, ưu tiên thay đường truyền ảnh thay vì giảm chất lượng detector. Không tự xác nhận hoàn thành nghiệm thu khi các ô máy mục tiêu còn trống.
