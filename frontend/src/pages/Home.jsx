export default function Home() {
  return (
    <section className="card">
      <h1>HoloLab — thí nghiệm hóa học ảo &amp; EGAD</h1>
      <ul>
        <li><a href="/">Phòng thí nghiệm 3D</a>: 10 bài thực hành, điều khiển bằng chuột hoặc bàn tay qua webcam.</li>
        <li><a href="#/egad">EGAD thử nghiệm</a>: nhập câu trả lời, mô hình ngôn ngữ cục bộ (Ollama) phân loại mức hiểu và gợi ý câu hỏi tiếp theo.</li>
      </ul>
      <p className="note">EGAD chỉ là công cụ thử nghiệm: kết quả là dự đoán của AI, chưa được giáo viên xác nhận.</p>
    </section>
  );
}
