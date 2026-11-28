import React from 'react';
import { href } from '../lib/routes.js';
import { AboutArt, AssistantAvatar, HeroArt, Logo } from '../components/Art.jsx';
import { IconArrow, IconChat, IconHand, IconHistory } from '../components/Icons.jsx';

const FEATURES = [
  [IconHand, 'Thực hành trực quan', 'Tương tác với dụng cụ và hóa chất 3D bằng chuột, hoặc bằng bàn tay trước webcam.'],
  [IconChat, 'Giải thích cùng EGAD', 'Viết cách bạn hiểu hiện tượng, nhận câu hỏi gợi mở để làm rõ. Phản hồi là dự đoán của AI, chưa được giáo viên xác nhận.'],
  [IconHistory, 'Nhìn lại tiến trình', 'Mở lại các phiên đã lưu và những gì bạn đã làm, để biết phần nào cần ôn thêm.'],
];
const STEPS = ['Chọn thí nghiệm', 'Thực hành', 'Giải thích', 'Vận dụng'];

function Wave({ fill, className = '' }) {
  return (
    <svg className={'hl-wave ' + className} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 46C200 6 380 4 580 36s360 44 560 10 240-30 300-14v102H0z" fill={fill} />
    </svg>
  );
}

export function Intro({ lessonCount, onHelp }) {
  return (
    <div className="hl-intro">
      <section className="hl-hero" aria-labelledby="hl-hero-title">
        <div className="hl-hero-text">
          <p className="hl-eyebrow">Phòng thí nghiệm Hóa học ảo cho THPT</p>
          <h1 id="hl-hero-title">Tự tay khám phá.<br /><span>Tự mình hiểu sâu.</span></h1>
          <p className="hl-lead">Thực hành thí nghiệm 3D, giải thích hiện tượng cùng EGAD và nhìn lại quá trình học của bạn.</p>
          <div className="hl-actions">
            <a className="hl-btn hl-btn-primary hl-btn-lg" href={href.overview}>Bắt đầu học</a>
            <a className="hl-btn hl-btn-ghost hl-btn-lg" href={href.experiments}>Khám phá thí nghiệm</a>
          </div>
          {lessonCount > 0 && <p className="hl-hero-note">{lessonCount} bài thực hành lớp 10–12 · Chạy offline trên máy của bạn</p>}
        </div>
        <HeroArt />
      </section>

      <Wave fill="#E7EEDC" />
      <section className="hl-band hl-band-sage" aria-labelledby="hl-about-title">
        <div className="hl-about">
          <AboutArt />
          <div>
            <h2 id="hl-about-title">Một không gian để thử, hỏi và hiểu</h2>
            <p>Ở HoloLab, bạn tự rót, trộn và quan sát: kết tủa xuất hiện, dung dịch đổi màu, khí thoát ra. Lượng chất được tính toán và bảo toàn, nên mỗi thao tác đều có hệ quả.</p>
            <p>Sau khi quan sát, bạn viết lời giải thích của mình. EGAD không đưa đáp án ngay mà đặt câu hỏi gợi mở, giúp bạn tự nhận ra chỗ còn thiếu.</p>
            <p className="hl-fineprint">Đây là mô hình giáo dục có giới hạn, không thay thế thí nghiệm thật và hướng dẫn an toàn của giáo viên.</p>
          </div>
        </div>
      </section>

      <section className="hl-band hl-band-sage" aria-labelledby="hl-features-title">
        <h2 id="hl-features-title" className="hl-center">Học bằng cách làm, rồi tự giải thích</h2>
        <ul className="hl-features">
          {FEATURES.map(([Ico, title, text], i) => (
            <li key={title}>
              <span className={'hl-feature-icon hl-tint-' + i}><Ico size={30} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <Wave fill="#FAF8F1" className="hl-wave-on-sage" />

      <section className="hl-band" aria-labelledby="hl-steps-title">
        <h2 id="hl-steps-title" className="hl-center">Một bài thực hành diễn ra thế nào</h2>
        <ol className="hl-steps">
          {STEPS.map((s, i) => (
            <li key={s}><span className="hl-step-num">{i + 1}</span><strong>{s}</strong>{i < STEPS.length - 1 && <IconArrow size={20} />}</li>
          ))}
        </ol>
      </section>

      <section className="hl-band" aria-labelledby="hl-cta-title">
        <div className="hl-cta">
          <AssistantAvatar size={72} />
          <div>
            <h2 id="hl-cta-title">Sẵn sàng bắt đầu thí nghiệm đầu tiên?</h2>
            <p>Chọn một bài, đọc mục tiêu, rồi bắt tay vào làm.</p>
          </div>
          <a className="hl-btn hl-btn-primary hl-btn-lg" href={href.experiments}>Vào thư viện thí nghiệm</a>
        </div>
      </section>

      <footer className="hl-footer">
        <div className="hl-footer-brand">
          <span className="hl-brand"><Logo /><span><strong>HoloLab</strong><small>Phòng thí nghiệm Hóa học ảo</small></span></span>
          <p>Thực hành an toàn, quan sát kỹ và tự giải thích hiện tượng.</p>
        </div>
        <nav aria-label="Liên kết chân trang">
          <h3>Khám phá</h3>
          <a href={href.intro}>Giới thiệu</a>
          <a href={href.overview}>Học tập</a>
          <button type="button" onClick={onHelp}>Hướng dẫn thao tác</button>
        </nav>
        <div>
          <h3>Quyền riêng tư</h3>
          <p>Hình ảnh webcam chỉ được xử lý trên máy này, không lưu và không gửi đi. Phiên đã lưu nằm trong trình duyệt của bạn.</p>
        </div>
        <p className="hl-copy">© 2026 HoloLab</p>
      </footer>
    </div>
  );
}
