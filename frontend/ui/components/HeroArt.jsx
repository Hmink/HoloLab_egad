import React from 'react';

// Original inline SVG (drawn for HoloLab, no third-party art): a cheerful high-school student
// holding up a test tube over a bench of colourful glassware, with the EGAD assistant asking "Vì sao?".
const INK = '#2B2A3A';
const SKIN = '#F7D2B6';
const SKIN_SHADE = '#EDB896';
const HAIR = '#4A2C20';
const HAIR_LIGHT = '#6B4130';
const GLASS = '#FFFFFF';

// Liquids on the bench (left → right).
const C = {
  red: '#E8473F', orange: '#F59A2A', yellow: '#F6C934', green: '#45B46A',
  blue: '#3A8EDB', purple: '#8E5BD0', pink: '#E9579C', cyan: '#2FB7C9',
};

function Tube({ x, top = 300, height = 78, color, level = 0.6, w = 14 }) {
  const bottom = top + height, r = w / 2, liquidTop = bottom - height * level;
  return (
    <g>
      <path d={`M${x} ${liquidTop}h${w}v${bottom - liquidTop - r}a${r} ${r} 0 0 1 -${w} 0z`} fill={color} />
      <path d={`M${x} ${top}h${w}v${height - r}a${r} ${r} 0 0 1 -${w} 0z`} fill={GLASS} fillOpacity=".25" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x={x - 2} y={top - 4} width={w + 4} height="6" rx="3" fill={GLASS} stroke={INK} strokeWidth="2.2" />
      <path d={`M${x + 3.5} ${top + 8}v${height - 22}`} stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity=".75" />
    </g>
  );
}

function Erlenmeyer({ x, size = 1, color }) {
  // x = centre of the base; base sits on the bench (y = 382)
  const s = size;
  return (
    <g transform={`translate(${x} 382) scale(${s})`}>
      <path d="M-30 -6l20 -34h20l20 34q3 6 -4 6h-52q-7 0 -4 -6z" fill={color} />
      <path d="M-9 -78v28l-26 44q-3 6 4 6h62q7 0 4 -6l-26 -44v-28" fill={GLASS} fillOpacity=".22" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="-13" y="-84" width="26" height="7" rx="3.5" fill={GLASS} stroke={INK} strokeWidth="2.4" />
      <path d="M-18 -20l8 -14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <circle cx="6" cy="-18" r="3" fill="#FFFFFF" opacity=".7" /><circle cx="-4" cy="-28" r="2" fill="#FFFFFF" opacity=".7" />
    </g>
  );
}

function RoundFlask({ x, r = 34, color }) {
  const cy = 382 - r - 2;
  return (
    <g>
      <rect x={x - r * 0.55} y={378} width={r * 1.1} height="6" rx="3" fill="#C9A77F" />
      <path d={`M${x - r + 4} ${cy + 6}a${r - 4} ${r - 4} 0 0 0 ${2 * (r - 4)} 0z`} fill={color} />
      <path d={`M${x - r + 4} ${cy + 6}q${r - 4} -10 ${2 * (r - 4)} 0`} fill={color} opacity=".9" />
      <circle cx={x} cy={cy} r={r} fill={GLASS} fillOpacity=".2" stroke={INK} strokeWidth="2.6" />
      <path d={`M${x - 9} ${cy - r + 2}v-34h18v34`} fill={GLASS} fillOpacity=".3" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x={x - 12} y={cy - r - 38} width="24" height="7" rx="3.5" fill={GLASS} stroke={INK} strokeWidth="2.4" />
      <path d={`M${x - r + 12} ${cy - 10}q4 -14 16 -20`} stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx={x + 10} cy={cy + 14} r="3.4" fill="#FFFFFF" opacity=".7" /><circle cx={x - 6} cy={cy + 20} r="2.2" fill="#FFFFFF" opacity=".7" />
    </g>
  );
}

function Beaker({ x, w = 44, h = 50, color }) {
  const top = 382 - h;
  return (
    <g>
      <path d={`M${x + 3} ${top + h * 0.45}h${w - 6}v${h * 0.55 - 6}q0 4 -4 4h${-(w - 14)}q-4 0 -4 -4z`} fill={color} />
      <path d={`M${x - 4} ${top}h${w + 4}M${x} ${top}v${h - 4}q0 4 4 4h${w - 8}q4 0 4 -4v${-(h - 4)}`} fill={GLASS} fillOpacity=".2" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M${x + 7} ${top + 8}v${h - 20}`} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      {[0.3, 0.5, 0.7].map((f) => <path key={f} d={`M${x + w - 12} ${top + h * f}h6`} stroke={INK} strokeWidth="1.6" opacity=".55" />)}
    </g>
  );
}

export function HeroArt() {
  return (
    <svg className="hl-hero-art" viewBox="0 0 600 470" role="img"
      aria-label="Minh họa: nữ sinh vui vẻ giơ ống nghiệm, bên bàn thí nghiệm có nhiều bình dung dịch nhiều màu, cùng trợ lý EGAD hỏi “Vì sao?”">
      {/* backdrop */}
      <path d="M70 150C90 60 220 20 330 40s240 40 250 150-40 230-190 250S90 430 60 330 50 240 70 150z" fill="#E7EEDC" />
      <circle cx="520" cy="70" r="26" fill="#F1D780" />
      <g fill="#FFFFFF" opacity=".9">
        <path d="M462 120l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        <path d="M120 230l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </g>

      {/* EGAD assistant (top left) */}
      <g transform="translate(78 92)">
        <path d="M0 -6q-2-26 24-28h70q16 0 16 16v16q0 16-16 16H56l-16 14v-14H16Q0 16 0 -6z" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" />
        <text x="54" y="0" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="19" fill={INK}>Vì sao?</text>
        <g transform="translate(14 32) scale(.8)">
          <path d="M32 30L14 46M32 30l18 16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <circle cx="14" cy="47" r="9" fill="#D4E2B8" stroke={INK} strokeWidth="2.5" />
          <circle cx="50" cy="47" r="9" fill="#F1D780" stroke={INK} strokeWidth="2.5" />
          <circle cx="32" cy="26" r="17" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
          <circle cx="26" cy="25" r="2.4" fill={INK} /><circle cx="38" cy="25" r="2.4" fill={INK} />
          <path d="M26 32q6 5 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ===== student ===== */}
      {/* ponytail (behind the head) */}
      <path d="M232 150q-46 6-52 54-4 34 16 58 4-30 18-46 10 18 6 40 26-24 26-62 0-26-14-44z" fill={HAIR} />
      <path d="M200 206q2 20 10 32" stroke={HAIR_LIGHT} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".7" />

      {/* torso: shirt, vest, bow tie */}
      <path d="M214 382q-4-92 34-120 20-12 52-12t52 12q38 28 34 120z" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M248 382q-2-78 18-114l34 44 34-44q20 36 18 114z" fill="#4F4E8E" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M300 312v70" stroke="#3E3D75" strokeWidth="2.4" />
      <circle cx="300" cy="334" r="3" fill="#E9E6F7" /><circle cx="300" cy="356" r="3" fill="#E9E6F7" />
      <path d="M266 268l34 44 34-44" fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M282 252l18 18 18-18" fill="#FFFFFF" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {/* bow tie */}
      <path d="M300 270l-26-12q-6 0-6 6v14q0 6 6 6z" fill="#D2346E" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M300 270l26-12q6 0 6 6v14q0 6-6 6z" fill="#D2346E" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M300 270l-12 30M300 270l12 30" stroke="#B52A5E" strokeWidth="5" strokeLinecap="round" />
      <rect x="292" y="262" width="16" height="16" rx="5" fill="#E0457F" stroke={INK} strokeWidth="2.4" />

      {/* neck */}
      <path d="M286 222h28v26q-14 10-28 0z" fill={SKIN_SHADE} />

      {/* head */}
      <ellipse cx="300" cy="160" rx="66" ry="68" fill={SKIN} stroke={INK} strokeWidth="2.6" />
      <ellipse cx="236" cy="168" rx="9" ry="13" fill={SKIN} stroke={INK} strokeWidth="2.4" />
      {/* hair: top + fringe */}
      <path d="M232 168q-10-92 70-98 76 0 68 92-8-38-32-50-6 22-38 28 12-12 10-26-22 24-62 26-12 12-16 28z" fill={HAIR} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M270 92q20-10 48-6" stroke={HAIR_LIGHT} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />
      {/* bow on the ponytail */}
      <g transform="translate(232 118) rotate(-24)">
        <path d="M0 0l-24-14q-6-2-6 4v20q0 6 6 4z" fill="#E9579C" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M0 0l24-14q6-2 6 4v20q0 6-6 4z" fill="#E9579C" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <circle r="7" fill="#F27DB2" stroke={INK} strokeWidth="2.4" />
      </g>

      {/* face */}
      <path d="M258 140q12-8 26-2M316 138q14-6 26 2" stroke={HAIR} strokeWidth="4" fill="none" strokeLinecap="round" />
      {[[272, 166], [328, 166]].map(([cx, cy]) => (
        <g key={cx}>
          <ellipse cx={cx} cy={cy} rx="15" ry="18" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" />
          <ellipse cx={cx + 1} cy={cy + 2} rx="10.5" ry="13" fill="#2FA4C8" />
          <ellipse cx={cx + 1} cy={cy + 3} rx="6" ry="7.5" fill="#1B2433" />
          <circle cx={cx - 3} cy={cy - 3} r="3.6" fill="#FFFFFF" /><circle cx={cx + 5} cy={cy + 7} r="1.8" fill="#FFFFFF" />
          <path d={`M${cx - 16} ${cy - 10}q16-16 32 0`} stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d="M254 158l-6-4M346 158l6-4" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="252" cy="194" rx="11" ry="7" fill="#F49A9A" opacity=".55" />
      <ellipse cx="348" cy="194" rx="11" ry="7" fill="#F49A9A" opacity=".55" />
      <path d="M298 186q3 3 6 0" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* open smile */}
      <path d="M280 200q20 22 40 0z" fill="#9E2F3A" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M288 208q12 8 24 0q-12-6-24 0z" fill="#F07C86" />
      <path d="M283 201h34" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* left arm (viewer's left) down to a dropper over the bench */}
      <path d="M228 284q-30 34-12 64 6 10 22 8" fill="none" stroke={INK} strokeWidth="31" strokeLinecap="round" />
      <path d="M228 284q-30 34-12 64 6 10 22 8" fill="none" stroke="#FFFFFF" strokeWidth="25.5" strokeLinecap="round" />
      <circle cx="244" cy="352" r="13" fill={SKIN} stroke={INK} strokeWidth="2.4" />
      <path d="M250 322v42" stroke={INK} strokeWidth="2.4" />
      <rect x="246" y="306" width="9" height="20" rx="4.5" fill="#E8473F" stroke={INK} strokeWidth="2.2" />
      <path d="M247 336h7v26l-3.5 8-3.5-8z" fill={GLASS} fillOpacity=".6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M248.5 352h4v10l-2 5-2-5z" fill={C.green} />

      {/* right arm raised, holding a test tube up */}
      <path d="M366 286q38-18 44-60 3-24 2-40" fill="none" stroke={INK} strokeWidth="31" strokeLinecap="round" />
      <path d="M366 286q38-18 44-60 3-24 2-40" fill="none" stroke="#FFFFFF" strokeWidth="25.5" strokeLinecap="round" />
      <path d="M352 268q14 2 26 10" fill="none" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
      <rect x="398" y="176" width="28" height="12" rx="6" fill="#E9E6F7" stroke={INK} strokeWidth="2.4" />
      <g transform="rotate(12 422 120)">
        <path d="M414 100h16v68a8 8 0 0 1-16 0z" fill={C.orange} />
        <path d="M414 70h16v98a8 8 0 0 1-16 0z" fill={GLASS} fillOpacity=".3" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <rect x="411" y="65" width="22" height="7" rx="3.5" fill={GLASS} stroke={INK} strokeWidth="2.4" />
        <path d="M418 80v70" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
        <circle cx="424" cy="116" r="2.4" fill="#FFFFFF" opacity=".8" /><circle cx="420" cy="128" r="1.8" fill="#FFFFFF" opacity=".8" />
      </g>
      <ellipse cx="412" cy="160" rx="16" ry="14" fill={SKIN} stroke={INK} strokeWidth="2.4" />
      <path d="M400 152q8-4 16 0M400 160q8-4 16 0" stroke={SKIN_SHADE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* sparkles near the raised tube */}
      <g fill="#F6C934" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M466 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
        <path d="M452 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </g>

      {/* ===== bench with colourful glassware ===== */}
      <rect x="30" y="380" width="540" height="22" rx="10" fill="#C9A77F" />
      <rect x="30" y="380" width="540" height="6" rx="3" fill="#D9BC95" />
      <rect x="62" y="402" width="16" height="56" rx="4" fill="#B08C63" /><rect x="522" y="402" width="16" height="56" rx="4" fill="#B08C63" />

      {/* tube rack, left */}
      <rect x="44" y="352" width="104" height="10" rx="4" fill="#9CC08F" stroke={INK} strokeWidth="2" />
      <rect x="50" y="362" width="6" height="20" fill="#9CC08F" /><rect x="136" y="362" width="6" height="20" fill="#9CC08F" />
      <Tube x={56} top={300} color={C.red} level={0.7} />
      <Tube x={78} top={292} height={86} color={C.yellow} level={0.75} />
      <Tube x={100} top={300} color={C.blue} level={0.55} />
      <Tube x={122} top={296} height={82} color={C.purple} level={0.65} />

      <Erlenmeyer x={186} size={0.82} color={C.green} />
      <Beaker x={410} w={40} h={46} color={C.cyan} />
      <Erlenmeyer x={474} size={0.72} color={C.pink} />
      <RoundFlask x={530} r={30} color={C.orange} />

      {/* front row in front of the student */}
      <Erlenmeyer x={258} size={0.66} color={C.purple} />
      <Beaker x={318} w={36} h={40} color={C.red} />
      <Tube x={366} top={318} height={62} color={C.green} level={0.6} w={12} />
      <Tube x={384} top={322} height={58} color={C.yellow} level={0.5} w={12} />

      {/* notebook + pencil */}
      <g transform="translate(150 368) rotate(-6)">
        <rect width="46" height="12" rx="2" fill="#3A8EDB" stroke={INK} strokeWidth="2" />
        <path d="M6 3h30" stroke="#FFFFFF" strokeWidth="2" opacity=".8" />
      </g>
      {/* leaves */}
      <path d="M574 376q-6-40 18-60 10 30-18 60z" fill="#9CC08F" /><path d="M28 376q-2-36-24-52-6 30 24 52z" fill="#527A50" opacity=".8" />
    </svg>
  );
}
