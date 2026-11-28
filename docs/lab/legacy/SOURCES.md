# Nguồn và ghi công

Kiểm tra ngày 25/10/2026. Mã Python của gói được viết độc lập cho bản mẫu; không chép mã dự án trả phí. Các thư viện và mô hình giữ giấy phép riêng của tác giả/nhà phát hành.

1. **MediaPipe Hand Landmarker — Python guide (Google)**
   https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/python
   API `HandLandmarker`, chế độ VIDEO, model .task, timestamp. Bản mẫu dùng API Tasks thay cho `mp.solutions.hands` cũ. Lời gọi VIDEO xử lý đồng bộ; từ v2.1 nó chạy trên luồng nhận diện riêng, tách khỏi luồng lấy ảnh và giao diện.

2. **MediaPipe 0.10.32 — PyPI**
   https://pypi.org/project/mediapipe/0.10.32/
   Phiên bản chọn để tái lập; không khẳng định là bản mới nhất. Có wheel Windows x86-64, Linux x86-64, macOS ARM64 ở trang phát hành.

3. **MediaPipe Hands: On-device Real-time Hand Tracking — Zhang et al. (2020)**
   https://arxiv.org/abs/2006.10214
   Bài gốc về pipeline bàn tay; dùng để xác định phần kỹ thuật đã có.

4. **Fun With Computer Vision — tác giả collidingScopes**
   https://www.funwithcomputervision.com/
   https://github.com/collidingScopes/threejs-handtracking-101
   https://github.com/collidingScopes/threejs-handtracking-101/blob/main/index.html
   Mã demo công khai có `targetSphereSize`, `currentSphereSize`, `smoothingFactor=0.15` và nội suy giữa giá trị hiện tại/mục tiêu. Đây là ví dụ Web/Three.js; không thể dán nguyên vào Python/OpenCV. Chỉ tham khảo tổ chức phản hồi và ý tưởng làm mượt. Không kết luận đã xem mã Shape Creator trả phí.

5. **1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in Interactive Systems — Casiez, Roussel, Vogel, CHI 2012**
   https://gery.casiez.net/1euro/
   https://doi.org/10.1145/2207676.2208639
   Cơ sở của bộ lọc trong `gestures.py`; đây là kỹ thuật có trước, cần ghi công khi viết báo cáo.

6. **ChemCollective Virtual Labs**
   https://chemcollective.org/vlabs
   Ví dụ phòng lab hóa học ảo và bài tập định lượng đã tồn tại.

7. **Lessons learned: the use of an augmented reality application in organic chemistry laboratories — Frontiers in Education (2024)**
   https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1384129/full
   Tác giả nêu rõ dữ liệu là tự báo cáo và không đủ để kết luận trực tiếp mức tăng kiến thức. Dùng để định hướng thiết kế đánh giá, không suy rộng kết quả đại học sang học sinh phổ thông.

8. **OSHA — Comparison of NFPA 704 and HazCom 2012 Labels**
   https://www.osha.gov/sites/default/files/publications/OSHA3678.pdf
   Hai hệ nhãn có mục đích và cách phân cấp khác nhau; không quy đổi mức nguy hiểm giữa chúng bằng một số chung.

9. **Fisher Scientific / Acros — SDS Sulfuric acid AC424525000**
   https://www.fishersci.com/store/msds?countryCode=US&language=en&partNumber=AC424525000&productDescription=SULFURIC+ACID+ACS+500ML&vendorId=VN00033901
   Bản sửa 19/12/2025; thành phần H2SO4 >95% khối lượng. Nguồn cho cấu trúc nhãn mẫu, nguy cơ ăn mòn và NFPA health 3 / flammability 0 / instability 2 / W. Không dùng cho mọi nồng độ hoặc mọi nhà cung cấp.

10. **CDC/NIOSH Pocket Guide — Sulfuric acid**
    https://www.cdc.gov/niosh/npg/npgd0577.html
    Nguồn cho nguy cơ phản ứng mạnh với nước, tỏa nhiệt và tính ăn mòn. Rule của phần mềm là quy tắc giáo dục ảo, không phải SDS hay hướng dẫn thao tác ngoài đời.

11. **Virtual Labs — Calorimetry, Heat of Neutralization**
    https://pcv-amrt.vlabs.ac.in/exp/calorimetry-heat-neutralization/theory.html
    Tham khảo xấp xỉ nhiệt trung hòa và cân bằng nhiệt; con số −57,3 kJ/mol áp dụng trong mô hình axit mạnh/bazơ mạnh loãng. Mã mô hình tự cân bằng điện tích; không sao chép lỗi ký hiệu có thể xuất hiện trong phương trình trên trang.

12. **Google MediaPipe sample notebook và model**
    https://github.com/google-ai-edge/mediapipe-samples/blob/main/examples/hand_landmarker/python/hand_landmarker.ipynb
    Model: https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
    Ảnh kiểm tra của notebook: https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/woman_hands.jpg
    Model và ảnh tham chiếu không được đóng kèm ZIP. Script tải model có kiểm tra SHA256 đã xác nhận trong phiên kiểm tra.


## Nâng cấp 3D (25/10/2026)

- ModernGL context / OpenGL 3.3, standalone rendering: https://moderngl.readthedocs.io/en/latest/reference/moderngl.html
- ModernGL 5.12.0, wheel Windows CPython 3.13: https://pypi.org/project/moderngl/5.12.0/
- glcontext 3.0.0: https://pypi.org/project/glcontext/3.0.0/
- University of Wisconsin–Madison, CuSO4/NaOH, kết tủa xanh: https://www2.chem.wisc.edu/deptfiles/genchem/lab/ccaold/sthtm/cuso/cusonaoh.htm
- NIOSH, sulfuric acid, phản ứng với nước và tỏa nhiệt: https://www.cdc.gov/niosh/npg/npgd0577.html

Mesh và shader do dự án tự tạo bằng mã, không sao chép mô hình/texture bên thứ ba.
Thông số UI về khoảng cách, thời gian rót và hoạt họa là thiết kế tương tác, không là dữ liệu động học hóa học.
Tình huống OX/FUEL là minh họa nhóm nguy cơ bằng vật liệu giả định; không có thành phần thực.


## Sửa tương tác và tình huống axit (26/10/2026)

- Google Hand Landmarker guide: cấu hình `num_hands=2`, handedness, image/world landmarks; không coi nhãn tay là định danh sinh trắc. https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/python
- NIOSH — Sulfuric acid: không phải chất lỏng cháy; có nguy cơ tỏa nhiệt mạnh khi tiếp xúc nước. https://www.cdc.gov/niosh/npg/npgd0577.html
- NIOSH — Nitric acid: chất lỏng không cháy nhưng tăng khả năng cháy của vật liệu cháy; phản ứng với nước tỏa nhiệt. https://www.cdc.gov/niosh/npg/npgd0447.html
- NIOSH — Hydrogen chloride: nguồn cho nguy cơ hơi gây kích ứng/ăn mòn. Không sử dụng thông số khí HCl khan để định lượng dung dịch HCl đặc. https://www.cdc.gov/niosh/npg/npgd0332.html

Các nguồn chỉ hỗ trợ nhận diện nhóm nguy cơ. Màu, hình dạng hạt, thời gian và cường độ hiệu ứng là thiết kế hoạt họa, không được suy ra từ số liệu thí nghiệm. Cần giáo viên rà soát trước khi sử dụng làm nội dung đánh giá học sinh. Mã bản mẫu và bản sửa có hỗ trợ AI; không quy toàn bộ công việc cho học sinh.
