# Kiểm chứng HoloLab AR V3.4 — 27/10/2026

Đã kiểm thử mã nguồn và trình duyệt tự động. **Chưa thử webcam vật lý, chưa nghiệm thu 50 FPS hoặc độ trễ đầu-cuối trên máy i5/RTX của người dùng.** “Đạt” bên dưới chỉ áp dụng đúng tình huống, dữ liệu và môi trường ghi trong log.

## Kết quả tự động

| Nhóm | Kết quả | Bằng chứng |
|---|---|---|
| Unit/integration JavaScript | 78/78 | `validation_v34/unit_tests.tap` |
| Python hóa học và chức năng cũ | 90/90 | `validation_v34/python_tests.txt` |
| Physics P0 mở rộng | 7/7 nhóm | `validation_v34/physics.json` |
| Bài học trong trình duyệt | 15/15 | `validation_v34/lessons_browser.json` |
| CV/camera/physics/chuẩn độ trong trình duyệt | 12/12 | `validation_v34/browser_checks.json` |
| Hồi quy phiên làm việc/an toàn/thư viện cũ | 5/5 | `validation_v34/regression_checks.json` |

JS gồm 63 kiểm thử trước đây và 15 kiểm thử mới (13 engine/nội dung, 2 collider bài học). Unit kiểm tra phương trình bảo toàn nguyên tố, chất giới hạn, moles/thể tích qua 100 lần chuyển mẫu, mẫu đối chứng, điều kiện sai, pH, dừng phản ứng khi nhấc Fe và lượng NH₃ hữu hạn. Đây là tính nhất quán của mô hình đã định nghĩa, không phải xác thực thực nghiệm mọi màu sắc/động học.

Kiểm thử browser sử dụng mô hình Three.js/Rapier thật và gọi các đường điều khiển của ứng dụng. Bộ bài học thử selector bằng UI, rót theo miệng/độ nghiêng, nhúng Fe, quỳ ở vùng khí, hoàn thành câu hỏi và gợi ý, đổi bài, khôi phục lượng chất và pose Fe trong lòng cốc. Có kiểm tra **vòng animation sản phẩm tự rót sau dwell**, không gọi thẳng engine cho tình huống đó. Phần tay dùng chuỗi landmarks tổng hợp; riêng MediaPipe inference chạy thật với video lặp từ một ảnh tĩnh. Không xem đây là 15 người dùng gắp thành công hoặc nhận diện tay thật khi chuyển động.

## Vật lý P0

| Tình huống | Kết quả quan sát trong log |
|---|---|
| 30 lần nâng/thả, varied FPS, gắp lại, release lặp | Không nhảy khi gắp lại; không xuyên bàn hoặc vượt biên. |
| 20 lần ném nhẹ | Vận tốc thả lớn nhất 0,230816 m/s; vẫn có quán tính; không vượt vùng hợp lệ. |
| 30 lần chạm nhẹ hai bình | Vận tốc lớn nhất bình bị chạm 0,080100 m/s; bình dịch chuyển khoảng 0,0534 m trong tình huống tổng hợp; không phóng khỏi bàn. |
| Bốn mép và trần, cả held/dynamic | Không vượt giới hạn collider trong chuỗi thử. |
| 6 bình đứng yên 60 giây mô phỏng | Độ dời đo được 0; cả 6 sleeping. |
| Mất tracking/freeze rồi hồi phục, frame stall | Giữ vị trí; không truyền vận tốc ném cũ. |
| Spawn cùng chỗ khi một vật đang cầm | Độ xuyên ban đầu 0; vị trí vật đang cầm không đổi. |

Các nhóm trên có `recoveryCount=0`, nghĩa là không cần teleport để che các lỗi thường gặp trong thử nghiệm. Ngoài ra có test riêng cố ý tạo lỗi ra ngoài biên để xác nhận recovery hoạt động; không gộp nó vào số 0 trên.

Test browser với mesh sản phẩm thêm 20 lần thả: min gap đáy 0,003122 scene unit (~0,312 mm), không xuyên bàn; bài chuyển động nhanh có max throw ~0,400 m/s, tiếp xúc peak ~0,1455 m/s, không ra khỏi khung camera thao tác. Unit cốc rỗng thêm 30 drop/regrab, không xuyên, không cần recovery. Test nắp kiểm tra thanh sắt chắn miệng dù chưa ngập chất lỏng.

**Đối chiếu chính xác:** V3.3 cùng script P0 đạt 6/7, V3.4 đạt 7/7. V3.3 spawn chồng có initial penetration 0,102250732 m, V3.4 bằng 0. Những bài thả/va chạm/biên còn lại đều đã đạt trên V3.3. Không lấy cải thiện một trường hợp này để nói mọi chuyển động của V3.4 đã mượt hơn hoặc tất cả lỗi trong video đã được tái hiện.

## Benchmark 60 giây

Cùng host, chạy nối tiếp, Chromium 134 headless, **SwiftShader (GPU phần mềm) + MediaPipe CPU**. Video giả lập 1280×720@30 lặp ảnh tĩnh; ảnh infer 640×360. Viewport 1366×900, canvas 1022×418, DPR1, auto camera quality tắt để so cùng tải. Một mục tiêu cầm được điều khiển bằng code; các vật còn lại không tác động. Không ghi nhận camera vật lý.

| Cảnh | Thời gian s | Render FPS | Tracking Hz | CPU physics trung bình ms/frame | Độ tuổi mẫu p95 ms |
|---|---:|---:|---:|---:|---:|
| V3.3 — 5 vật, bàn tự do | 60.00 | 27.40 | 2.58 | 1.32 | 461.1 |
| V3.4 — cùng 5 vật | 60.08 | 30.06 | 2.83 | 1.21 | 410.8 |
| V3.4 — bài Fe, 2 vật + màn chiếu | 60.08 | 28.33 | 2.58 | 0.34 | 486.9 |

Nguồn: `benchmark_before.json`, `benchmark_after.json`, `benchmark_lesson.json` trong `validation_v34/`. Không xuất hiện lỗi JS. Các bình không tác động giữ độ dời 0 và sleeping trong 60 giây thật của cả ba lượt. Lượt bài Fe có một cốc rỗng đứng yên và một thanh sắt di chuyển bên cạnh, kèm màn chiếu; đây **không phải** đo tiếp xúc liên tục hay phản ứng cả 60 giây. Bộ thử thao tác riêng đã kiểm tra nhúng/rút/hiện tượng.

Render FPS khác tracking Hz. Độ tuổi mẫu không phải motion-to-photon latency. Thời gian CPU physics không bao gồm toàn bộ GPU render/MediaPipe. Lượt bài học khác số vật, nên không dùng để kết luận nhanh/chậm hơn bàn tự do. Mỗi cấu hình mới đo một lượt; khác biệt trước/sau có thể chịu nhiễu môi trường, chưa có kiểm định thống kê. **Mục tiêu 50 FPS chưa đạt trong môi trường đo này.** Không suy rộng số đo cho i5-5200U, HD5500 hoặc máy RTX.

## Camera và giữ nguyên CV

- Fixture HD: `getSettings` và video intrinsic đều 1280×720@30; Worker báo input 640×360. `object-fit:contain`, mirror giữ đúng.
- Low được cấp 640×480; Full HD không có trong fixture nên ứng dụng fallback HD và thông báo. Chưa xác nhận webcam thật hỗ trợ 1920×1080.
- MediaPipe thật phát hiện 2 tay trên ảnh tĩnh. Hai tay tổng hợp đi qua FSM, giữ khi mất tracking ngắn, handoff/release đúng. Không đo tỷ lệ gắp 9/10 của người thật.
- Các tệp capture, worker, tọa độ, quality, filter, tracking, interaction được so hash giữ nguyên V3.3; xem `preserved_modules.json`.

## Chạy lại và kiểm tra trên máy thật

README có lệnh cài/chạy. Để lặp kiểm thử Node:

```bash
node --test --test-reporter=tap tests_js/*.test.mjs
node tools/physics_acceptance_v34.mjs . validation_v34/physics_local.json
```

Browser QA cần Playwright dành cho phát triển, không cần khi dùng app. Đặt `PLAYWRIGHT_PACKAGE` tới module `playwright/index.mjs`, `CAMERA_FIXTURE` tới video Y4M nếu chạy core/benchmark. Sau đó `node tools/qa_lessons_v34.mjs`, `node tools/qa_core_v34.mjs`, `node tools/qa_regression_v34.mjs`. Các script mặc định dùng python3 trên Linux; benchmark hỗ trợ biến `PYTHON` để chọn Python. `BENCH_PROJECT`, `BENCH_OUTPUT` và tùy chọn `BENCH_LESSON=iron-copper` chọn cảnh/đích của `tools/benchmark_v34.mjs`.

Trên máy người dùng, thử từng tay và hai tay, 30 thả, 20 ném nhẹ, 30 chạm, bốn mép, mất tracking ngắn, đứng yên 60 giây. Thử rót và nhúng trong 5 bài; xuất JSON qua **Thông số kỹ thuật và hiệu chỉnh → Đo 60 giây → Xuất kết quả**. Ghi CPU/GPU/RAM, trình duyệt, chất lượng camera thực, độ phân giải CV, thao tác và số lần lỗi. Chỉ sau dữ liệu này mới nghiệm thu FPS/độ trễ/cảm giác gắp thực.

## Hạn chế còn lại

Chưa thử phần cứng/webcam Windows của người dùng, camera thiếu sáng/lấy nét, chuyển động nhanh, che khuất lâu hoặc tải nền. Giới hạn vùng theo camera thao tác tiêu chuẩn; Orbit là chế độ xem riêng, không cam kết mọi vật nằm trong khung khi người dùng tự xoay nhìn ra nơi khác. Nhãn/liquid là hiển thị giáo dục; chưa có vỡ kính/tràn/CFD/động học/hoạt độ chính xác. Chỉ cốc bài Fe có lòng rỗng, các proxy dụng cụ cũ giữ nguyên. Nội dung biuret định tính, phép NH₄⁺ dùng mẫu chuẩn, chloride chưa bao trùm mọi halide. Chưa nghiên cứu thực nghiệm hiệu quả học tập.

## Gói bàn giao

`SOURCE_SHA256.json` ghi hash nguồn runtime; `changed_files.json` và `patches/V33_to_V34.patch` đối chiếu V3.3; `package_check.json` ghi kiểm tra ZIP/giải nén/chạy server. Ảnh kiểm thử, video người dùng, fixture và node_modules không đóng gói. Các báo cáo `validation_v33/` và cũ hơn là lịch sử, không phải số đo V3.4.
