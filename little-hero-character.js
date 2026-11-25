/*!
 * Little Hero Character v1.0
 * Nhân vật 2D tự chứa (SVG + JS thuần), không cần thư viện, nhúng được vào bất kỳ website nào.
 *
 * CÁCH DÙNG NHANH
 *   <script src="little-hero-character.js"></script>
 *   <little-hero id="hero" base="girl" size="180"></little-hero>
 *   <script>
 *     const hero = document.getElementById('hero');
 *     hero.perform('Chạy đến nhờ cô giáo giúp', {correct:true, towards:240}); // chạy + vui
 *     hero.perform('Nhặt vở giúp bạn',          {correct:true, towards:120}); // đi tới, cúi nhặt, đưa cho bạn
 *     hero.perform('Đứng cười bạn',             {correct:false});             // buồn / hối hận
 *     hero.act('hug', 'love');                                                // đặt thẳng tư thế + cảm xúc
 *   </script>
 *
 * TƯ THẾ (pose):  idle walk run wave cheer hug crouch lift give point stop no scared sad angry flail bow think carry sweep fold tidy read draw drink eat brush wash breathe listen sit
 * CẢM XÚC (mood): happy calm wink surprise worry sad scared angry love serious
 */
(function (g) {
  'use strict';
  if (g.LittleHero && g.LittleHero.version) return;

  const R = Math.PI / 180, TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const lum = h => { const n = parseInt(String(h).replace('#', '').padEnd(6, '0').slice(0, 6), 16); return (n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11; };

  /* ================= NGOẠI HÌNH ================= */
  const BASES = {
    boy:  { st: 'short', hair: '#3A2A1A', skin: '#FFD7B5', top: '#FFC93C', tp: 'star',  bot: '#3B4A8C', bt: 'pants', acc: 'none', cape: 1, capeC: '#7B5CFF', shoe: '#FF6B6B', eyes: 'round', blush: 1, frk: 0 },
    girl: { st: 'pig',   hair: '#5A3A22', skin: '#FFD7B5', top: '#FF8FA3', tp: 'heart', bot: '#7B5CFF', bt: 'skirt', acc: 'bow',  cape: 1, capeC: '#FF6B6B', shoe: '#FFFFFF', eyes: 'round', blush: 1, frk: 0 }
  };
  // st: short long pig bun spiky curly bob bald | tp: plain stripes dots star heart | bt: pants shorts skirt
  // acc: none glasses shades cap bow crown band | eyes: round big arc sleepy

  function buildSVG(L) {
    const sk = L.skin, hc = L.hair, top = L.top, bot = L.bot, shoe = L.shoe;
    const ink = lum(top) > 150 ? '#26325B' : '#FFFFFF';
    const thFill = L.bt === 'skirt' ? sk : bot, shFill = (L.bt === 'skirt' || L.bt === 'shorts') ? sk : bot;
    const hf = `<path d="M54 56 Q52 8 100 10 Q148 8 146 56 Q128 32 100 32 Q72 32 54 56Z" fill="${hc}"/>`;
    const hair = {
      short: hf, long: hf,
      pig: hf + `<circle cx="46" cy="64" r="15" fill="${hc}"/><circle cx="154" cy="64" r="15" fill="${hc}"/><circle cx="58" cy="44" r="5" fill="#FF6B6B"/><circle cx="142" cy="44" r="5" fill="#FF6B6B"/>`,
      bun: hf + `<circle cx="100" cy="6" r="17" fill="${hc}"/>`,
      spiky: hf + `<polygon points="58,34 68,2 84,26" fill="${hc}"/><polygon points="84,22 100,-8 116,22" fill="${hc}"/><polygon points="116,26 132,2 142,34" fill="${hc}"/>`,
      curly: hf + [64, 82, 100, 118, 136].map((x, i) => `<circle cx="${x}" cy="${[40, 28, 24, 28, 40][i]}" r="13" fill="${hc}"/>`).join(''),
      bob: hf, bald: ''
    }[L.st];
    const hairBack = L.st === 'long' ? `<rect x="50" y="22" width="100" height="125" rx="46" fill="${hc}"/>` : L.st === 'bob' ? `<rect x="50" y="22" width="100" height="84" rx="40" fill="${hc}"/>` : '';
    const acc = {
      glasses: '<g fill="none" stroke="#26325B" stroke-width="3"><circle cx="80" cy="58" r="14"/><circle cx="120" cy="58" r="14"/><path d="M94 58h12"/></g>',
      shades: '<rect x="64" y="48" width="32" height="18" rx="8" fill="#222"/><rect x="104" y="48" width="32" height="18" rx="8" fill="#222"/>',
      cap: '<path d="M52 44 Q54 4 100 4 Q146 4 148 44Z" fill="#4F8DF7"/><rect x="88" y="38" width="64" height="10" rx="5" fill="#2B5FD9"/>',
      bow: '<polygon points="136,26 160,14 160,40" fill="#FF4F7B"/><polygon points="136,26 112,14 112,40" fill="#FF4F7B"/><circle cx="136" cy="26" r="6" fill="#E0305F"/>',
      crown: '<path d="M64 16 L72 -6 L86 10 L100 -10 L114 10 L128 -6 L136 16Z" fill="#FFC93C" stroke="#E0A800" stroke-width="2"/>',
      band: '<path d="M54 38 Q100 14 146 38" stroke="#FF6B6B" stroke-width="9" fill="none" stroke-linecap="round"/>'
    }[L.acc] || '';
    const pat = {
      stripes: [0, 1, 2, 3].map(i => `<rect x="60" y="${110 + i * 16}" width="80" height="8" fill="${ink}" opacity=".4"/>`).join(''),
      dots: [[80, 118], [100, 126], [120, 118], [88, 146], [112, 146], [100, 166]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${ink}" opacity=".55"/>`).join(''),
      star: `<polygon points="100,116 106,130 121,130 109,139 113,154 100,145 87,154 91,139 79,130 94,130" fill="${ink}" opacity=".85"/>`,
      heart: '<path d="M100 152 L84 134 Q78 120 92 118 Q100 118 100 128 Q100 118 108 118 Q122 120 116 134Z" fill="#FF4F7B"/>',
      plain: ''
    }[L.tp] || '';
    const eyeFill = '#26325B';
    const eye = (id, cx) => L.eyes === 'arc'
      ? `<path data-j="${id}" d="M${cx - 8} 60 Q${cx} 49 ${cx + 8} 60" stroke="${eyeFill}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
      : `<g data-j="${id}"><ellipse rx="7" ry="9" fill="${eyeFill}"/><circle cx="-2" cy="-3" r="2.6" fill="#fff"/></g>`;
    const frk = L.frk ? [[76, 70], [84, 74], [116, 74], [124, 70]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.8" fill="#C27A4A"/>`).join('') : '';
    const eyes = L.acc === 'shades' ? '<g data-j="eyeL"/><g data-j="eyeR"/>' : eye('eyeL', 80) + eye('eyeR', 120);
    const prp = (cls) => `<text data-j="${cls}" x="0" y="${cls === 'handProp' ? 40 : 0}" font-size="30" text-anchor="middle" opacity="0"></text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -24 200 276" role="img" aria-label="Hero">
<ellipse data-j="shadow" cx="100" cy="239" rx="42" ry="7" fill="#26325B" opacity=".18"/>
<text data-j="floorProp" x="152" y="238" font-size="30" text-anchor="middle" opacity="0"></text>
<g data-j="rig">
 <g data-j="legL"><rect x="-9" y="-6" width="18" height="36" rx="9" fill="${thFill}"/><g data-j="shL"><rect x="-8" y="-4" width="16" height="34" rx="8" fill="${shFill}"/><ellipse cx="2" cy="31" rx="14" ry="7" fill="${shoe}"/></g></g>
 <g data-j="legR"><rect x="-9" y="-6" width="18" height="36" rx="9" fill="${thFill}"/><g data-j="shR"><rect x="-8" y="-4" width="16" height="34" rx="8" fill="${shFill}"/><ellipse cx="-2" cy="31" rx="14" ry="7" fill="${shoe}"/></g></g>
 <g data-j="torso">
  ${L.cape ? `<path data-j="cape" d="M70 110 Q100 98 130 110 L150 215 Q100 232 50 215Z" fill="${L.capeC}"/>` : ''}
  <defs><clipPath id="lhc"><rect x="66" y="102" width="68" height="76" rx="24"/></clipPath></defs>
  <rect x="66" y="102" width="68" height="76" rx="24" fill="${top}"/><g clip-path="url(#lhc)">${pat}</g>
  ${L.bt === 'skirt' ? `<path d="M62 150 L138 150 L152 192 L48 192Z" fill="${bot}"/>` : ''}
  <g data-j="armL"><rect x="-8" y="-6" width="16" height="36" rx="8" fill="${top}"/><g data-j="foreL"><rect x="-7" y="-4" width="14" height="30" rx="7" fill="${sk}"/><circle cx="0" cy="28" r="9" fill="${sk}"/></g></g>
  <g data-j="armR"><rect x="-8" y="-6" width="16" height="36" rx="8" fill="${top}"/><g data-j="foreR"><rect x="-7" y="-4" width="14" height="30" rx="7" fill="${sk}"/><circle cx="0" cy="28" r="9" fill="${sk}"/>${prp('handProp')}</g></g>
  <g data-j="head">
   ${hairBack}<circle cx="100" cy="58" r="46" fill="${sk}"/>${hair}
   <circle data-j="blush" cx="66" cy="76" r="8" fill="#FF8FA3" opacity=".6"/><circle data-j="blush2" cx="134" cy="76" r="8" fill="#FF8FA3" opacity=".6"/>
   ${eyes}
   <path data-j="browL" stroke="#26325B" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/><path data-j="browR" stroke="#26325B" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>
   <path data-j="mouth" stroke="#26325B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
   ${frk}${acc}
   <ellipse data-j="tearL" cx="70" cy="70" rx="3" ry="5" fill="#6EC6FF" opacity="0"/><ellipse data-j="tearR" cx="130" cy="70" rx="3" ry="5" fill="#6EC6FF" opacity="0"/>
   <path data-j="sweat" d="M148 30 q-7 11 0 15 q7 -4 0 -15z" fill="#8ED8FF" opacity="0"/>
   <text data-j="anger" x="140" y="20" font-size="26" opacity="0">💢</text>
   <g data-j="hearts" font-size="20" text-anchor="middle"><text data-j="h0">💗</text><text data-j="h1">💗</text><text data-j="h2">💗</text></g>
   <g data-j="stars" font-size="20" text-anchor="middle"><text data-j="s0">⭐</text><text data-j="s1">⭐</text><text data-j="s2">✨</text></g>
  </g>
 </g>
</g>
</svg>`;
  }

  /* ================= BỘ XƯƠNG: các tư thế (độ, "ra ngoài" là dương cho cả hai bên) ================= */
  // aL/aR: vai | eL/eR: khuỷu | thL/thR: đùi | shL/shR: cẳng chân | lean: nghiêng người | drop: hạ hông | bob: nhún | tilt/nod: đầu
  const J0 = { bob: 0, sx: 0, roll: 0, lean: 0, drop: 0, nod: 0, tilt: 0, jx: 0, aL: 9, aR: 9, eL: 5, eR: 5, thL: 0, thR: 0, shL: 0, shR: 0, star: 0, heart: 0 };
  // IK đơn giản: hạ hông c (0..1) mà bàn chân vẫn chạm đất
  function crouchLeg(c) {
    const d = 18 * c, th = 34 * c, ct = Math.cos(th * R);
    const a = -Math.acos(clamp((56 - d) / 28 - ct, -1, 1)) / R;
    return { drop: d, th: th, sh: a - th };
  }
  const S = Math.sin, C = Math.cos, ab = Math.abs, mx = Math.max;
  const POSES = {
    idle:  t => ({ bob: S(t * 2) * 1.3, aL: 9 + S(t * 2) * 1.5, aR: 9 - S(t * 2) * 1.5, tilt: S(t * .8) * 1.5 }),
    walk:  t => { const w = t * 8, s = S(w), l = mx(0, s), r = mx(0, -s); return { bob: -ab(C(w)) * 3, sx: s * 2.5, roll: s * 2, lean: 4, thL: l * 12, thR: r * 12, shL: -l * 60, shR: -r * 60, aL: 10 + s * 20, aR: 10 - s * 20, eL: 16, eR: 16, tilt: s * 1.5 }; },
    run:   t => { const w = t * 13, s = S(w), l = mx(0, s), r = mx(0, -s); return { bob: -ab(S(w)) * 9 - 3, sx: s * 2, roll: s * 3, lean: 15, thL: l * 22, thR: r * 22, shL: -l * 100, shR: -r * 100, aL: 24 + s * 38, aR: 24 - s * 38, eL: 85, eR: 85, tilt: -3 }; },
    wave:  t => ({ bob: S(t * 2), aR: 150, eR: 12 + S(t * 11) * 28, aL: 9, eL: 5, tilt: 6 + S(t * 2) * 2 }),
    cheer: t => { const j = ab(S(t * 5)), k = crouchLeg((1 - j) * .22); return { bob: -j * 20, drop: k.drop, thL: k.th, thR: k.th, shL: k.sh, shR: k.sh, aL: 160 + S(t * 10) * 6, aR: 160 - S(t * 10) * 6, eL: 10, eR: 10, tilt: S(t * 5) * 3, star: 1 }; },
    hug:   t => ({ lean: 8, aL: -62 + S(t * 4) * 3, aR: -62 + S(t * 4) * 3, eL: -58, eR: -58, tilt: 8, bob: S(t * 4) * 1.2, heart: 1 }),
    crouch:() => { const k = crouchLeg(1); return { drop: k.drop, thL: k.th, thR: k.th, shL: k.sh, shR: k.sh, lean: 30, aL: 10, aR: 42, eL: 8, eR: 30, tilt: 10 }; },
    lift:  t => ({ lean: 4, aR: 25, eR: -105, aL: 9, eL: 5, tilt: 4, bob: S(t * 3) * 1 }),
    give:  t => ({ lean: 6, aR: 78 + S(t * 6) * 6, eR: -10 + S(t * 6) * 10, aL: 9, eL: 5, tilt: 6, bob: S(t * 2) }),
    carry: t => ({ lean: 5, aL: -34, aR: -34, eL: 55, eR: -55, bob: S(t * 3) }),
    sweep: t => ({ lean: 12, aL: 18, aR: 43 + S(t * 8) * 16, eL: -20, eR: -52 + S(t * 8) * 9, bob: S(t * 4) }),
    fold:  t => ({ lean: 10, aL: -28, aR: 28, eL: -50, eR: 50, tilt: 5, bob: S(t * 3) }),
    tidy:  t => ({ lean: 10, aL: -28, aR: 28, eL: -50, eR: 50, tilt: 5, bob: S(t * 3) }),
    read:  t => ({ aL: -32, aR: 32, eL: -68, eR: 68, tilt: 8 + S(t * 2) * 2, bob: S(t * 2) }),
    draw:  t => ({ lean: 7, aL: -18, aR: 38 + S(t * 9) * 5, eL: -45, eR: -62 + S(t * 9) * 8, tilt: 5 }),
    drink: t => ({ aR: 28, eR: -86 + S(t * 3) * 4, aL: 9, eL: 5, tilt: 9, bob: S(t * 3) }),
    eat:   t => ({ aR: 28 + S(t * 5) * 5, eR: -82, aL: 9, eL: 5, tilt: 8, bob: S(t * 4) }),
    brush: t => ({ aR: 28 + S(t * 18) * 4, eR: -88 + S(t * 18) * 8, aL: 9, eL: 5, tilt: 8 }),
    wash:  t => ({ aL: 25 + S(t * 8) * 8, aR: 25 - S(t * 8) * 8, eL: -52, eR: 52, lean: 5, bob: S(t * 4) }),
    clean: t => ({ lean: 11, aL: 18, aR: 43 + S(t * 8) * 16, eL: -20, eR: -52 + S(t * 8) * 9, bob: S(t * 4) }),
    breathe: t => ({ aL: -18, aR: -18, eL: -30, eR: -30, tilt: S(t * 1.5), bob: S(t * 1.5) }),
    listen: t => ({ aR: 58, eR: -78, aL: 9, eL: 5, tilt: -7 + S(t * 1.5) * 2 }),
    sit:   () => { const k = crouchLeg(.75); return { drop: k.drop, thL: k.th, thR: k.th, shL: k.sh, shR: k.sh, lean: 8, aL: 9, aR: 9, eL: 5, eR: 5 }; },
    point: t => ({ aR: 92, eR: 2, aL: 9, eL: 5, tilt: 7, lean: 3, bob: S(t * 2) }),
    stop:  t => ({ aR: 80, eR: 100, aL: 34, eL: -100, tilt: S(t * 9) * 5, lean: -2 }),
    no:    t => ({ aL: -20, aR: -20, eL: -70, eR: -70, tilt: S(t * 12) * 9, lean: -2 }),
    scared:t => ({ jx: 1.6, aL: 100, aR: 100, eL: 110, eR: 110, lean: -5, drop: 4, thL: 6, thR: 6, shL: -10, shR: -10, bob: S(t * 25) * .8 }),
    sad:   t => ({ lean: 7, tilt: 12, nod: 2, aL: 4, aR: 4, eL: -6, eR: -6, bob: S(t * 1.6) * 1.2 - 1 }),
    angry: t => { const s = S(t * 7), l = mx(0, s), r = mx(0, -s); return { lean: 4, bob: -ab(S(t * 7)) * 2, aL: 40, aR: 40, eL: -120, eR: -120, thL: l * 8, thR: r * 8, shL: -l * 50, shR: -r * 50, tilt: S(t * 14) * 2 }; },
    flail: t => ({ bob: S(t * 5) * 6 - 4, sx: S(t * 3.1) * 2, aL: 140 + S(t * 14) * 28, aR: 140 + C(t * 13) * 28, eL: S(t * 17) * 40, eR: C(t * 16) * 40, thL: S(t * 9) * 14, thR: C(t * 10) * 14, shL: -mx(0, S(t * 9)) * 40, shR: -mx(0, C(t * 10)) * 40, tilt: S(t * 6) * 8, lean: S(t * 4) * 6 }),
    bow:   () => ({ lean: 42, tilt: 6, aL: 10, aR: 10, eL: 6, eR: 6, nod: 4 }),
    think: t => ({ aR: -35, eR: -95, aL: 9, eL: 5, tilt: 9 + S(t) * 2, nod: -2, lean: -2 })
  };
  const POSE_MOOD = { hug: 'love', flail: 'scared', scared: 'scared', sad: 'sad', angry: 'angry', stop: 'serious', no: 'serious', think: 'worry', listen: 'worry', cheer: 'happy', wave: 'happy' };

  /* ================= CẢM XÚC ================= */
  // eye/eyeR: độ mở mắt | bL/bR: góc mày (dương = đầu mày hạ xuống = giận, âm = đầu mày nhướn = lo/buồn) | bY: độ cao mày | mW/mC/mO: miệng
  const M0 = { eye: 1, eyeR: 1, bL: 0, bR: 0, bY: 0, mW: 13, mC: 20, mO: 6, bl: .6, tear: 0, sweat: 0, anger: 0, heart: 0, star: 0 };
  const MOODS = {
    happy:    {},
    calm:     { bL: 0, bR: 0, bY: 0, mW: 11, mC: 6, mO: 0, bl: .35 },
    wink:     { eyeR: .08, mC: 22 },
    surprise: { eye: 1.25, eyeR: 1.25, bY: -9, mW: 7, mC: 0, mO: 20 },
    worry:    { bL: -14, bR: -14, bY: -2, mW: 9, mC: -7, mO: 0, sweat: 1 },
    sad:      { eye: .85, eyeR: .85, bL: -22, bR: -22, bY: 1, mW: 10, mC: -16, mO: 0, tear: 1, bl: .3 },
    scared:   { eye: 1.3, eyeR: 1.3, bL: -18, bR: -18, bY: -8, mW: 11, mC: -3, mO: 15, sweat: 1, bl: .15 },
    angry:    { eye: .8, eyeR: .8, bL: 20, bR: 20, bY: 2, mW: 12, mC: -10, mO: 0, anger: 1, bl: .9 },
    love:     { eye: .35, eyeR: .35, mW: 14, mC: 24, mO: 8, bl: 1, heart: 1 },
    serious:  { bL: 8, bR: 8, mW: 9, mC: -1, mO: 0, bl: .35 }
  };
  const mouthPath = (w, c, o) => {
    const y = 82, x1 = 100 - w, x2 = 100 + w;
    return o < 1.5 ? `M${x1} ${y} Q100 ${y + c} ${x2} ${y}` : `M${x1} ${y} Q100 ${y + c * .4} ${x2} ${y} Q100 ${y + c + o} ${x1} ${y}Z`;
  };
  const browPath = (side, a, y) => {
    const cx = side ? 122 : 78, cy = 43 + y, A = a * R, dx = 14 * Math.cos(A), dy = 14 * Math.sin(A);
    return side ? `M${cx - dx} ${cy + dy} L${cx + dx} ${cy - dy}` : `M${cx + dx} ${cy + dy} L${cx - dx} ${cy - dy}`;
  };

  /* ================= LỜI CHỌN -> HÀNH ĐỘNG + CẢM XÚC ================= */
  const KINDS = [
    ['flail', /vung van|duoi nuoc|flail|drown/],
    ['hug',   /\bom\b|cai om|hug|embrace/],
    ['brush', /danh rang|chai rang/],
    ['wash',  /rua tay|xa phong|rua sach bot/],
    ['breathe', /hit tho|tho cham|binh tinh/],
    ['read',  /doc sach|doc truyen|xem sach/],
    ['draw',  /ve tranh|to mau|ve hinh/],
    ['drink', /uong nuoc|uong sua/],
    ['eat',   /an com|an bua|an banh/],
    ['sweep', /quet nha|quet san|don san/],
    ['carry', /cam (do|sach|balo)|mang (do|sach|balo)|xach /],
    ['fold',  /gap quan ao|gap ao|gap do/],
    ['tidy',  /sap xep|xep do choi|don do choi|cat do choi/],
    ['listen', /lang nghe|cho ban noi/],
    ['sit',   /ngoi nghi|ngoi xuong/],
    ['pick',  /nhat (len|vo|sach|do|bong|ao|but|ban|giup|ho|ve|cai|qua)|luom|pick up|pick /],
    ['run',   /chay|bo chay|\brun\b|rush|sprint|flee/],
    ['bow',   /xin loi|cam on|cui chao|sorry|thank|\bbow\b/],
    ['give',  /chia se|nhuong|dua cho|trao|tang |giup|give|share|help/],
    ['point', /chi tay|chi cho|chi vao|point/],
    ['stop',  /tu choi|noi khong|khong muon|khong di|dung lai|khong nhan|khong tra loi|khong gui|khong mo|khong cho|\bstop\b|refuse|say no/],
    ['hide',  /tron|nup|\bhide\b|\bduck\b/],
    ['angry', /danh (lai|ban|nhau|em)|giat|la het|cau gat|chui|nem |xo day|\bhit\b|shout|grab|push|kick/],
    ['sad',   /khong (noi|lam gi|giup|bao)|im lang|lam ngo|gia vo|bo mac|khoc|buon|bo cuoc|giau|cry|silent|ignore/],
    ['walk',  /\bdi\b|di theo|buoc|lai gan|tien |den gan|\bwalk\b|follow|approach|go to|\bgo\b/],
    ['wave',  /goi|vay|chao|noi |hoi |ke |bao |gui |\bcall\b|wave|\btell\b|\bask\b|\bsay\b/],
    ['cheer', /reo|mung|\bcheer\b|celebrate|\byay\b/],
    ['think', /nghi|suy nghi|\bthink\b|wonder/]
  ];
  function moodFor(kind, s, ok) {
    if (kind === 'hug') return 'love';
    if (kind === 'flail' || kind === 'hide') return 'scared';
    if (kind === 'angry') return 'angry';
    if (kind === 'sad') return 'sad';
    if (kind === 'think') return 'worry';
    if (kind === 'stop') return ok === false ? 'angry' : 'serious';
    if (ok === false) return /so |hoang|nguy hiem|afraid|scared/.test(s) ? 'scared' : 'sad';
    return 'happy';
  }
  // Trả về { kind, mood, steps[] }. opts: correct(true/false), towards(px, +phải/-trái), distance, dir, mood, say, returnHome, kind
  function analyze(text, o) {
    o = o || {};
    const s = ' ' + norm(text) + ' ';
    let kind = o.kind;
    if (!kind) { kind = 'wave'; for (const k of KINDS) if (k[1].test(s)) { kind = k[0]; break; } }
    const ok = o.correct, mood = o.mood || moodFor(kind, s, ok), D = o.towards, has = typeof D === 'number' && D !== 0;
    const sg = has ? (D < 0 ? -1 : 1) : (o.dir === 'left' ? -1 : 1);
    const dur = (px, sp) => clamp(Math.abs(px) / sp * 1000, 700, 2800);
    const walkTo = sp => has ? [{ pose: sp > 200 ? 'run' : 'walk', mood: mood, ms: dur(D, sp), move: D }] : [];
    let st = [];
    switch (kind) {
      case 'run':  { const px = has ? D : sg * (o.distance || 260); st = [{ pose: 'run', mood: mood, ms: dur(px, 300), move: px }]; break; }
      case 'walk': { const px = has ? D : sg * (o.distance || 150); st = [{ pose: 'walk', mood: mood, ms: dur(px, 110), move: px }]; break; }
      case 'hug':  st = walkTo(110).concat([{ pose: 'hug', mood: ok === false ? mood : 'love', ms: 2600 }]); break;
      case 'pick': st = walkTo(110).concat([{ pose: 'crouch', mood: mood, ms: 900, prop: 'floor' }, { pose: 'lift', mood: mood, ms: 800, prop: 'hand' }, { pose: 'give', mood: mood, ms: 1200 }]); break;
      case 'give': st = walkTo(110).concat([{ pose: 'give', mood: mood, ms: 1600 }]); break;
      case 'sweep': case 'clean': st = [{ pose: kind === 'clean' ? 'clean' : 'sweep', mood: mood, ms: 1900, prop: 'hand' }]; break;
      case 'carry': st = walkTo(110).concat([{ pose: 'carry', mood: mood, ms: 1700, prop: 'hand' }]); break;
      case 'fold': case 'tidy': case 'read': case 'draw': case 'drink': case 'eat': case 'brush':
      case 'wash': case 'breathe': case 'listen': case 'sit':
        st = [{ pose: kind, mood: mood, ms: 1900, prop: kind === 'wash' ? 'hand' : 'none' }]; break;
      case 'point':st = [{ pose: 'point', mood: mood, ms: 1800 }]; break;
      case 'wave': st = walkTo(110).concat([{ pose: 'wave', mood: mood, ms: 1800 }]); break;
      case 'stop': st = [{ pose: 'stop', mood: mood, ms: 1900 }]; break;
      case 'bow':  st = walkTo(110).concat([{ pose: 'bow', mood: mood, ms: 1500 }]); break;
      case 'cheer':st = [{ pose: 'cheer', mood: mood, ms: 1800 }]; break;
      case 'sad':  st = [{ pose: 'sad', mood: mood, ms: 2000 }]; break;
      case 'hide': st = [{ pose: 'crouch', mood: mood, ms: 900 }, { pose: 'scared', mood: mood, ms: 1500 }]; break;
      case 'flail':st = [{ pose: 'flail', mood: mood, ms: 3200 }]; break;
      case 'angry':st = [{ pose: 'angry', mood: mood, ms: 1700 }]; break;
      case 'think':st = [{ pose: 'think', mood: mood, ms: 1800 }]; break;
    }
    st.push({ pose: 'idle', mood: mood, ms: 300, prop: 'none' });
    if (o.say && st[0]) st[0].say = o.say;
    if (o.returnHome) { const tot = st.reduce((a, x) => a + (x.move || 0), 0); if (tot) st.push({ pose: 'walk', mood: mood, ms: dur(tot, 130), move: -tot }, { pose: 'idle', mood: mood, ms: 200 }); }
    return { kind, mood, steps: st };
  }

  /* ================= PHẦN TỬ NHÚNG (Web Component) ================= */
  const CSS = `:host{display:inline-block;position:relative;line-height:0;vertical-align:bottom}
.w{position:relative;width:var(--hs,160px)}:host(.lesson-hero-character) .w{width:min(var(--hs,160px),100%)}svg{display:block;width:100%;height:auto;overflow:visible}
.bub{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin-bottom:8px;background:#fff;color:#26325B;border-radius:14px;padding:6px 12px;font:700 15px/1.25 system-ui,'Segoe UI',sans-serif;width:max-content;max-width:240px;box-shadow:0 3px 0 #0002;z-index:5}
.bub[hidden]{display:none}.bub:after{content:"";position:absolute;left:50%;top:100%;margin-left:-7px;border:7px solid transparent;border-top-color:#fff;border-bottom:0}`;
  const live = new Set();
  let raf = 0, last = 0;
  function loop(now) {
    raf = 0;
    const dt = clamp((now - last) / 1000 || 0, 0, .05);
    last = now;
    live.forEach(h => h._tick(dt, now));
    if (live.size) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && live.size) { last = performance.now(); raf = requestAnimationFrame(loop); } }

  const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
  class LittleHero extends Base {
    static get observedAttributes() { return ['pose', 'mood', 'base', 'look', 'size', 'dir', 'aria-label']; }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._pose = 'idle'; this._mood = 'happy'; this._look = null; this.t = Math.random() * 10;
      this.c = Object.assign({}, J0); this.m = Object.assign({}, M0);
      this._x = 0; this._dir = 1; this._tok = 0; this._mv = null; this._blink = 2 + Math.random() * 3; this._bt = -1;
      this._prop = ''; this._propMode = 'none'; this._r = null;
      this._reduced = !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    connectedCallback() { this._readAttrs(); this._render(); live.add(this); kick(); }
    disconnectedCallback() { live.delete(this); this._tok++; }
    attributeChangedCallback(n, o, v) {
      if (!this._r || o === v) return;
      if (n === 'pose') this._pose = POSES[v] ? v : 'idle';
      else if (n === 'mood') this._mood = MOODS[v] ? v : 'happy';
      else if (n === 'size') this._size();
      else if (n === 'dir') this._setDir(v);
      else if (n === 'aria-label') this._r.svg.setAttribute('aria-label', v || 'Hero');
      else this._render();
    }
    _readAttrs() {
      const p = this.getAttribute('pose'), m = this.getAttribute('mood');
      if (p && POSES[p]) this._pose = p;
      if (m && MOODS[m]) this._mood = m;
      this._setDir(this.getAttribute('dir'), true);
    }
    get lookData() {
      let a = {}; try { a = JSON.parse(this.getAttribute('look') || '{}'); } catch (e) { }
      return Object.assign({}, BASES[this.getAttribute('base')] || BASES.boy, a, this._look || {});
    }
    _render() {
      const L = this.lookData;
      this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="w">${buildSVG(L)}<div class="bub" hidden></div></div>`;
      const r = this._r = {};
      this.shadowRoot.querySelectorAll('[data-j]').forEach(e => { r[e.getAttribute('data-j')] = e; });
      r.svg = this.shadowRoot.querySelector('svg'); r.bub = this.shadowRoot.querySelector('.bub'); r.w = this.shadowRoot.querySelector('.w');
      this._eyeK = L.eyes === 'big' ? 1.2 : L.eyes === 'sleepy' ? .65 : 1;
      this._blushOff = L.blush === 0;
      this._size(); this._setDir(this._dir < 0 ? 'left' : 'right', true); this._applyProp();
      r.svg.setAttribute('aria-label', this.getAttribute('aria-label') || 'Hero');
    }
    _size() { if (this._r) this._r.w.style.setProperty('--hs', (parseFloat(this.getAttribute('size')) || 160) + 'px'); }
    _setDir(v, quiet) { this._dir = v === 'left' ? -1 : 1; if (this._r) this._r.svg.style.transform = this._dir < 0 ? 'scaleX(-1)' : ''; }

    /* ---------- API ---------- */
    get pose() { return this._pose; } set pose(v) { this.act(v); }
    get mood() { return this._mood; } set mood(v) { this.act(null, v); }
    act(pose, mood) {
      this._tok++;
      if (pose && POSES[pose]) this._pose = pose;
      if (mood && MOODS[mood]) this._mood = mood; else if (pose && POSE_MOOD[pose] && !mood) this._mood = POSE_MOOD[pose];
      return this;
    }
    setLook(obj) { this._look = Object.assign(this._look || {}, obj || {}); if (this._r) this._render(); return this; }
    resetLook() { this._look = null; if (this._r) this._render(); return this; }
    setProp(emoji, mode) { this._prop = emoji || ''; this._propMode = emoji ? (mode || 'floor') : 'none'; this._applyProp(); return this; }
    _applyProp() {
      const r = this._r; if (!r) return;
      r.floorProp.textContent = this._prop; r.handProp.textContent = this._prop;
      r.floorProp.setAttribute('opacity', this._prop && this._propMode === 'floor' ? 1 : 0);
      r.handProp.setAttribute('opacity', this._prop && this._propMode === 'hand' ? 1 : 0);
    }
    say(text, ms) {
      const b = this._r && this._r.bub; if (!b) return this;
      clearTimeout(this._sayT);
      if (!text) { b.hidden = true; return this; }
      b.textContent = text; b.hidden = false;
      this._sayT = setTimeout(() => { b.hidden = true; }, ms || 2400);
      return this;
    }
    _glide(dx, ms) {
      if (dx === 0) return;
      if (this._reduced) { this._x += dx; this.style.transform = `translateX(${this._x}px)`; return; }
      this._mv = { from: this._x, to: this._x + dx, t0: performance.now(), dur: Math.max(300, ms || 1000) };
      this._setDir(dx < 0 ? 'left' : 'right');
    }
    sequence(steps) {
      const tok = ++this._tok;
      return new Promise(done => {
        let i = 0;
        const next = () => {
          if (tok !== this._tok) return done(false);
          if (i >= steps.length) return done(true);
          const s = steps[i++];
          if (s.pose && POSES[s.pose]) this._pose = s.pose;
          this._mood = s.mood && MOODS[s.mood] ? s.mood : (POSE_MOOD[s.pose] || this._mood);
          if (s.prop !== undefined) { this._propMode = s.prop === 'none' ? 'none' : s.prop; this._applyProp(); }
          if (s.say) this.say(s.say, s.ms);
          if (s.move) this._glide(s.move, s.ms);
          setTimeout(next, s.ms || 0);
        };
        next();
      });
    }
    // Biến một lời chọn thành hành động: chạy -> chạy, đi -> đi, ôm -> ôm, nhặt -> cúi nhặt... + cảm xúc tương ứng
    perform(text, opts) {
      const a = analyze(text, Object.assign({ dir: this._dir < 0 ? 'left' : 'right' }, opts));
      this.dispatchEvent(new CustomEvent('hero-start', { detail: { kind: a.kind, mood: a.mood, text } }));
      return this.sequence(a.steps).then(ok => { if (ok) this.dispatchEvent(new CustomEvent('hero-end', { detail: { kind: a.kind } })); return ok; });
    }
    moveTo(dx, o) { o = o || {}; const run = o.mode === 'run', ms = o.duration || clamp(Math.abs(dx) / (run ? 300 : 110) * 1000, 600, 2800); return this.sequence([{ pose: run ? 'run' : 'walk', mood: 'happy', ms, move: dx }, { pose: 'idle', mood: 'happy', ms: 0 }]); }
    reset() { this._tok++; this._pose = 'idle'; this._mood = 'happy'; this._mv = null; this._x = 0; this.style.transform = ''; this.say(''); this.setProp(''); return this; }

    /* ---------- vòng lặp hoạt ảnh ---------- */
    _tick(dt, now) {
      const r = this._r; if (!r) return;
      const tt = this._reduced ? 0 : (this.t += dt), k = 1 - Math.exp(-dt * 18), k2 = 1 - Math.exp(-dt * 10);
      const tg = POSES[this._pose](tt), c = this.c, m = this.m, mt = Object.assign({}, M0, MOODS[this._mood]);
      for (const key in J0) c[key] += ((tg[key] !== undefined ? tg[key] : J0[key]) - c[key]) * k;
      for (const key in M0) m[key] += (mt[key] - m[key]) * k2;
      // chớp mắt
      this._blink -= dt; let bm = 1;
      if (this._blink < 0) { this._bt += dt; if (this._bt < 0) this._bt = 0; const p = this._bt / .18; if (p >= 1) { this._blink = 2 + Math.random() * 4; this._bt = -1; } else bm = 1 - Math.sin(p * Math.PI) * .92; }
      // di chuyển trong không gian
      if (this._mv) {
        const v = this._mv, p = clamp((now - v.t0) / v.dur, 0, 1), e = p * p * (3 - 2 * p);
        this._x = v.from + (v.to - v.from) * e; if (p >= 1) this._mv = null;
        this.style.transform = `translateX(${this._x.toFixed(1)}px)`;
      }
      const set = (el, a, v) => { if (el && el._v !== v) { el._v = v; el.setAttribute(a, v); } }, f = n => +n.toFixed(2);
      const hipY = 176 + c.drop;
      set(r.rig, 'transform', `translate(${f(c.sx + S(tt * 55) * c.jx)} ${f(c.bob)}) rotate(${f(c.roll)} 100 238)`);
      set(r.torso, 'transform', `translate(0 ${f(c.drop)}) rotate(${f(c.lean)} 100 176)`);
      set(r.legL, 'transform', `translate(84 ${f(hipY)}) rotate(${f(c.thL)})`); set(r.shL, 'transform', `translate(0 28) rotate(${f(c.shL)})`);
      set(r.legR, 'transform', `translate(116 ${f(hipY)}) rotate(${f(-c.thR)})`); set(r.shR, 'transform', `translate(0 28) rotate(${f(-c.shR)})`);
      set(r.armL, 'transform', `translate(56 114) rotate(${f(c.aL)})`); set(r.foreL, 'transform', `translate(0 28) rotate(${f(c.eL)})`);
      set(r.armR, 'transform', `translate(144 114) rotate(${f(-c.aR)})`); set(r.foreR, 'transform', `translate(0 28) rotate(${f(-c.eR)})`);
      set(r.head, 'transform', `translate(0 ${f(c.nod)}) rotate(${f(c.tilt)} 100 104)`);
      if (r.cape) set(r.cape, 'transform', `skewX(${f(-c.lean * .5 - c.sx)}) translate(${f(-c.lean * .6)} 0)`);
      set(r.shadow, 'rx', f(clamp(42 + c.bob * .6, 24, 46)));
      // khuôn mặt
      const arc = r.eyeL && r.eyeL.tagName === 'path';
      if (!arc) {
        set(r.eyeL, 'transform', `translate(80 58) scale(${f(lerp(1, m.eye, .55) * this._eyeK)} ${f(m.eye * this._eyeK * bm)})`);
        set(r.eyeR, 'transform', `translate(120 58) scale(${f(lerp(1, m.eyeR, .55) * this._eyeK)} ${f(m.eyeR * this._eyeK * bm)})`);
      }
      const bo = clamp((ab(m.bL) + ab(m.bY) * 1.4) / 10, 0, 1);
      set(r.browL, 'd', browPath(0, m.bL, m.bY)); set(r.browR, 'd', browPath(1, m.bR, m.bY)); set(r.browL, 'opacity', f(bo)); set(r.browR, 'opacity', f(bo));
      set(r.mouth, 'd', mouthPath(m.mW, m.mC, m.mO)); set(r.mouth, 'fill', m.mO > 2 ? '#5A1E2E' : 'none');
      const bl = this._blushOff ? 0 : m.bl; set(r.blush, 'opacity', f(bl)); set(r.blush2, 'opacity', f(bl));
      // hiệu ứng: nước mắt, mồ hôi, tim, sao, giận
      const tf = (tt * 34) % 24;
      set(r.tearL, 'cy', f(70 + tf)); set(r.tearR, 'cy', f(70 + ((tt * 34 + 9) % 24)));
      set(r.tearL, 'opacity', f(clamp(m.tear, 0, 1) * (1 - tf / 24))); set(r.tearR, 'opacity', f(clamp(m.tear, 0, 1) * (1 - ((tt * 34 + 9) % 24) / 24)));
      set(r.sweat, 'opacity', f(clamp(m.sweat, 0, 1))); set(r.sweat, 'transform', `translate(0 ${f((tt * 10) % 8)})`);
      set(r.anger, 'opacity', f(clamp(m.anger, 0, 1))); set(r.anger, 'transform', `scale(${f(1 + S(tt * 9) * .12)})`);
      const hz = Math.max(m.heart, c.heart), sz = Math.max(m.star, c.star);
      for (let i = 0; i < 3; i++) {
        const ph = ((tt * .9 + i / 3) % 1);
        const h = r['h' + i]; set(h, 'transform', `translate(${f(60 + i * 40 + S(tt * 3 + i) * 6)} ${f(14 - ph * 50)})`); set(h, 'opacity', f(clamp(hz, 0, 1) * (1 - ph)));
        const s = r['s' + i], an = tt * 3 + i * 2.1; set(s, 'transform', `translate(${f(100 + 64 * Math.cos(an))} ${f(14 + 18 * S(an))})`); set(s, 'opacity', f(clamp(sz, 0, 1)));
      }
    }
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  if (typeof customElements !== 'undefined' && !customElements.get('little-hero')) customElements.define('little-hero', LittleHero);

  /* ================= API TOÀN CỤC ================= */
  g.LittleHero = {
    version: '1.0.0',
    element: LittleHero,
    poses: Object.keys(POSES), moods: Object.keys(MOODS), bases: BASES,
    analyze: analyze,                       // phân tích lời chọn -> {kind, mood, steps}
    create(parent, opts) {                   // tạo nhân vật bằng JS: LittleHero.create(div,{base:'girl',size:200})
      const el = document.createElement('little-hero'); opts = opts || {};
      ['base', 'size', 'pose', 'mood', 'dir'].forEach(k => { if (opts[k] != null) el.setAttribute(k, opts[k]); });
      if (opts.look) el.setAttribute('look', JSON.stringify(opts.look));
      (parent || document.body).appendChild(el); return el;
    },
    _test: { POSES, MOODS, J0, M0, buildSVG, crouchLeg, mouthPath, browPath }
  };
})(typeof window !== 'undefined' ? window : globalThis);
