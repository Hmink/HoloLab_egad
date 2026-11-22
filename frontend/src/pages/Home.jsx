export default function Home() {
  return (
    <section className="card">
      <h1>HoloLab — thí nghiệm hóa học ảo &amp; EGAD</h1>
      <p>Bản khung giao diện. Hiện có:</p>
      <ul>
        <li><a href="#/egad">EGAD thử nghiệm</a>: nhập câu trả lời, Gemini phân loại mức hiểu và gợi ý câu hỏi tiếp theo.</li>
        <li>Phòng thí nghiệm 3D: <em>chưa có</em> (giai đoạn 3).</li>
      </ul>
      <p className="note">EGAD chỉ là công cụ thử nghiệm: kết quả là dự đoán của AI, chưa được giáo viên xác nhận.</p>
    </section>
  );
}
