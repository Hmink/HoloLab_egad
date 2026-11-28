import React from 'react';

// Original flat illustrations for HoloLab (inline SVG, offline, no third-party art).
const INK = '#243C32';
const SKIN = '#E9B994';
const HAIR = '#3B2E28';

export function Logo({ size = 40 }) {
  return (
    <svg className="hl-logo-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#E7EEDC" />
      <path d="M19 9h10M21 9v11L12 36q-2 4 3 4h18q5 0 3-4l-9-16V9" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M15.5 31h17l2.5 5q1 2-1.5 2h-19q-2.5 0-1.5-2z" fill="#9CC08F" />
      <circle cx="22" cy="27" r="1.8" fill="#9CC08F" /><circle cx="27" cy="23.5" r="1.3" fill="#9CC08F" />
      <path d="M31 14q5-6 10-3-3 6-10 3z" fill="#527A50" />
    </svg>
  );
}

/** EGAD, the science assistant: a friendly three-atom molecule. */
export function AssistantAvatar({ size = 44 }) {
  return (
    <svg className="hl-assistant" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 30L14 46M32 30l18 16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="14" cy="47" r="9" fill="#D4E2B8" stroke={INK} strokeWidth="2.5" />
      <circle cx="50" cy="47" r="9" fill="#F1D780" stroke={INK} strokeWidth="2.5" />
      <circle cx="32" cy="26" r="17" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
      <circle cx="26" cy="25" r="2.4" fill={INK} /><circle cx="38" cy="25" r="2.4" fill={INK} />
      <path d="M26 32q6 5 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="21.5" cy="30" r="2.2" fill="#F4B9A8" opacity=".8" /><circle cx="42.5" cy="30" r="2.2" fill="#F4B9A8" opacity=".8" />
    </svg>
  );
}

/** Hero: a high-school student in a lab coat and goggles, a lab bench and the assistant. */
export function HeroArt() {
  return (
    <svg className="hl-hero-art" viewBox="0 0 600 470" role="img" aria-label="Minh họa: học sinh mặc áo blouse, đeo kính bảo hộ, cầm bình tam giác bên bàn thí nghiệm cùng trợ lý EGAD">
      <path d="M70 150C90 60 220 20 330 40s240 40 250 150-40 230-190 250S90 430 60 330 50 240 70 150z" fill="#E7EEDC" />
      <circle cx="505" cy="78" r="30" fill="#F1D780" />
      <g fill="none" stroke="#527A50" strokeWidth="2.2" opacity=".55">
        <circle cx="120" cy="96" r="9" /><circle cx="146" cy="80" r="7" /><path d="M127 91l12-7" />
        <circle cx="470" cy="190" r="7" /><circle cx="492" cy="206" r="9" /><path d="M476 195l9 6" />
      </g>
      {/* bench */}
      <rect x="40" y="380" width="520" height="22" rx="10" fill="#C9A77F" />
      <rect x="70" y="402" width="16" height="56" rx="4" fill="#B08C63" /><rect x="514" y="402" width="16" height="56" rx="4" fill="#B08C63" />
      {/* beaker + rack on the bench */}
      <path d="M90 318h56l-5 58q0 6-6 6h-34q-6 0-6-6z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M94 348h48l-3 28q0 3-4 3h-34q-4 0-4-3z" fill="#A9D2EA" />
      <rect x="168" y="352" width="82" height="10" rx="4" fill="#9CC08F" />
      {[0, 1, 2].map((i) => (
        <g key={i}><path d={`M${178 + i * 24} 316h12v54q0 7-6 7t-6-7z`} fill="#FFFFFF" stroke={INK} strokeWidth="2.6" />
          <path d={`M${180 + i * 24} 344h8v24q0 5-4 5t-4-5z`} fill={['#F2B6CB', '#D4E2B8', '#F1D780'][i]} /></g>
      ))}
      {/* student */}
      <path d="M262 380q-6-110 38-128h72q44 18 38 128z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M336 252l-14 52M336 252l14 52" stroke="#D4E2B8" strokeWidth="10" strokeLinecap="round" />
      <path d="M318 252h36l-18 30z" fill="#527A50" />
      <rect x="322" y="214" width="28" height="40" rx="12" fill={SKIN} />
      <ellipse cx="336" cy="180" rx="44" ry="48" fill={SKIN} />
      <path d="M290 178q-4-62 50-64 48 2 46 58-12-24-40-28-30 2-56 34z" fill={HAIR} />
      <path d="M288 176q4 30 14 40" stroke={HAIR} strokeWidth="10" strokeLinecap="round" />
      <rect x="300" y="166" width="72" height="26" rx="13" fill="#D9EEF3" fillOpacity=".85" stroke={INK} strokeWidth="3" />
      <path d="M336 166v26" stroke={INK} strokeWidth="2.5" />
      <circle cx="319" cy="180" r="3.2" fill={INK} /><circle cx="353" cy="180" r="3.2" fill={INK} />
      <path d="M326 207q10 7 20 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* arm + flask */}
      <path d="M392 290q34 6 40 34" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
      <path d="M392 290q34 6 40 34" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".35" />
      <path d="M426 300h28M430 300v30l-22 40q-4 9 6 9h52q10 0 6-9l-22-40v-30" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M418 352h50l10 20q2 5-4 5h-62q-6 0-4-5z" fill="#9CC08F" />
      <circle cx="436" cy="362" r="4" fill="#FFFFFF" opacity=".9" /><circle cx="450" cy="342" r="3" fill="#9CC08F" /><circle cx="444" cy="322" r="2.4" fill="#9CC08F" />
      <circle cx="430" cy="330" r="12" fill={SKIN} />
      {/* assistant */}
      <g transform="translate(470 222)">
        <path d="M32 30L14 46M32 30l18 16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <circle cx="14" cy="47" r="9" fill="#D4E2B8" stroke={INK} strokeWidth="2.5" />
        <circle cx="50" cy="47" r="9" fill="#F1D780" stroke={INK} strokeWidth="2.5" />
        <circle cx="32" cy="26" r="17" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
        <circle cx="26" cy="25" r="2.4" fill={INK} /><circle cx="38" cy="25" r="2.4" fill={INK} />
        <path d="M26 32q6 5 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <path d="M468 214q-10-30 18-40h56q14 0 14 14v18q0 14-14 14h-30l-14 12v-12z" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
      <text x="514" y="200" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="20" fill={INK}>Vì sao?</text>
      {/* leaves */}
      <path d="M560 376q-6-40 18-60 10 30-18 60z" fill="#9CC08F" /><path d="M42 376q-2-36-24-52-6 30 24 52z" fill="#527A50" opacity=".8" />
    </svg>
  );
}

/** About: an open notebook with an equation, a molecule and a speech bubble (asking & explaining). */
export function AboutArt() {
  return (
    <svg className="hl-about-art" viewBox="0 0 440 330" role="img" aria-label="Minh họa: sổ ghi chép mở với phương trình phản ứng, mô hình phân tử và bong bóng hội thoại">
      <path d="M40 120C60 40 180 20 270 40s160 70 150 160-110 120-220 110S20 200 40 120z" fill="#E7EEDC" />
      <path d="M80 230l130 26V130L80 104z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M340 230l-130 26V130l130-26z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 134l88 17M100 154l70 13M100 174l84 16" stroke="#9CC08F" strokeWidth="5" strokeLinecap="round" />
      <text x="274" y="166" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="14" fill={INK} transform="rotate(-11 274 166)">Ag⁺ + Cl⁻ → AgCl↓</text>
      <path d="M232 196l88-17" stroke="#F1D780" strokeWidth="6" strokeLinecap="round" />
      <g stroke={INK} strokeWidth="3"><path d="M330 70l30 24M330 70l-22 30" />
        <circle cx="330" cy="70" r="14" fill="#F2B6CB" /><circle cx="362" cy="96" r="10" fill="#FFFFFF" /><circle cx="306" cy="102" r="10" fill="#FFFFFF" /></g>
      <path d="M70 60q0-16 16-16h72q16 0 16 16v28q0 16-16 16h-46l-22 18v-18q-20 0-20-16z" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <path d="M92 66h56M92 82h38" stroke="#527A50" strokeWidth="5" strokeLinecap="round" />
      <path d="M380 250q-4-36 20-56 8 30-20 56z" fill="#9CC08F" />
    </svg>
  );
}

const THUMB_BG = ['#F7DDD1', '#E7EEDC', '#FBF0C9', '#DCECF4', '#ECE1F4'];
const THUMB_LIQ = ['#9CC08F', '#F2B6CB', '#A9D2EA', '#F1C76E', '#C6AEE6'];

/** Small lesson thumbnail: test tube, flask and beaker in the lesson's colour. */
export function LessonThumb({ index = 0 }) {
  const bg = THUMB_BG[index % THUMB_BG.length], liq = THUMB_LIQ[index % THUMB_LIQ.length];
  return (
    <svg className="hl-thumb" viewBox="0 0 96 72" aria-hidden="true">
      <rect width="96" height="72" rx="16" fill={bg} />
      <path d="M18 18h12v34q0 7-6 7t-6-7z" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
      <path d="M20 40h8v12q0 4-4 4t-4-4z" fill={liq} />
      <path d="M44 14h10M46 14v13L36 50q-2 6 4 6h18q6 0 4-6L52 27V14" fill="#FFFFFF" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M38 44h22l3 7q1 3-2 3H37q-3 0-2-3z" fill={liq} />
      <path d="M68 30h16l-2 24q0 3-3 3h-6q-3 0-3-3z" fill="#FFFFFF" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M70 44h12l-1 9q0 2-2 2h-6q-2 0-2-2z" fill={liq} opacity=".85" />
    </svg>
  );
}

/** Empty state: a clean flask waiting on a small mound. */
export function EmptyArt() {
  return (
    <svg className="hl-empty-art" viewBox="0 0 160 110" aria-hidden="true">
      <ellipse cx="80" cy="96" rx="64" ry="12" fill="#E7EEDC" />
      <path d="M68 18h24M71 18v22L52 80q-3 10 8 10h40q11 0 8-10L89 40V18" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 72h44l4 9q1 4-4 4H58q-5 0-4-4z" fill="#D4E2B8" />
      <path d="M116 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F1D780" />
    </svg>
  );
}
