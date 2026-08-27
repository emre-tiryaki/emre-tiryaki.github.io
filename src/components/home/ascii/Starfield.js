/**
 * ASCII Starfield Animation with Multi-Spectral Celestial Colors
 */

const STAR_THEMES = {
  'multi-spectral': [
    { ch: '.', color: '#94a3b8' },
    { ch: '+', color: '#fde047' },
    { ch: '*', color: '#ffffff' },
    { ch: 'o', color: '#38bdf8' },
    { ch: 'O', color: '#ec4899' },
    { ch: '✦', color: '#c084fc' },
  ],
  'blue-shift': [
    { ch: '.', color: '#0369a1' },
    { ch: '+', color: '#0284c7' },
    { ch: '*', color: '#38bdf8' },
    { ch: 'o', color: '#7dd3fc' },
    { ch: 'O', color: '#00f0ff' },
    { ch: '✦', color: '#ffffff' },
  ],
  'solar-gold': [
    { ch: '.', color: '#78350f' },
    { ch: '+', color: '#b45309' },
    { ch: '*', color: '#f59e0b' },
    { ch: 'o', color: '#fbbf24' },
    { ch: 'O', color: '#fde047' },
    { ch: '✦', color: '#ffffff' },
  ],
  'emerald-nebula': [
    { ch: '.', color: '#064e3b' },
    { ch: '+', color: '#047857' },
    { ch: '*', color: '#10b981' },
    { ch: 'o', color: '#34d399' },
    { ch: 'O', color: '#6ee7b7' },
    { ch: '✦', color: '#ffffff' },
  ],
  'cosmic-violet': [
    { ch: '.', color: '#4c1d95' },
    { ch: '+', color: '#6d28d9' },
    { ch: '*', color: '#8b5cf6' },
    { ch: 'o', color: '#a78bfa' },
    { ch: 'O', color: '#f472b6' },
    { ch: '✦', color: '#ffffff' },
  ],
};

export function createStarfield(preElement, themeId = 'multi-spectral') {
  const starTypes = STAR_THEMES[themeId] || STAR_THEMES['multi-spectral'];
  const COLS = 64;
  const ROWS = 22;

  const stars = [];
  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) {
    stars.push({
      c: Math.random() * COLS,
      r: Math.random() * ROWS,
      depth: Math.random(), // 0 = far, 1 = near
      typeIdx: Math.floor(Math.random() * starTypes.length),
    });
  }

  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 50) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ ch: ' ', color: null }))
    );

    for (const s of stars) {
      s.c -= 0.15 + s.depth * 0.85;
      if (s.c < 0) {
        s.c = COLS - 1 + Math.random() * 3;
        s.r = Math.random() * ROWS;
        s.depth = Math.random();
        s.typeIdx = Math.floor(Math.random() * starTypes.length);
      }
      const cc = Math.round(s.c);
      const rr = Math.round(s.r);
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) {
        const star = starTypes[s.typeIdx];
        if (star) {
          grid[rr][cc] = { ch: star.ch, color: star.color };
        }
      }
    }

    let html = '';
    for (let r = 0; r < ROWS; r++) {
      let curColor = null;
      let curText = '';
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.color !== curColor) {
          if (curText) {
            html += curColor ? `<span style="color:${curColor}">${curText}</span>` : curText;
            curText = '';
          }
          curColor = cell.color;
        }
        curText += cell.ch;
      }
      if (curText) {
        html += curColor ? `<span style="color:${curColor}">${curText}</span>` : curText;
      }
      html += '\n';
    }
    preElement.innerHTML = html;

    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}
