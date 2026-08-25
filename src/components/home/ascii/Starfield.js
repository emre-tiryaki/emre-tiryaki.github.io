/**
 * ASCII Starfield Animation with Multi-Spectral Celestial Colors
 */

const STAR_TYPES = [
  { ch: '.', color: '#94a3b8' }, // Distant dim dwarf
  { ch: '+', color: '#fde047' }, // Warm yellow star
  { ch: '*', color: '#ffffff' }, // Bright white star
  { ch: 'o', color: '#38bdf8' }, // Electric blue star
  { ch: 'O', color: '#ec4899' }, // Magenta giant
  { ch: '✦', color: '#c084fc' }, // Violet pulsar / nova
];

export function createStarfield(preElement) {
  const COLS = 64;
  const ROWS = 22;

  const stars = [];
  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) {
    stars.push({
      c: Math.random() * COLS,
      r: Math.random() * ROWS,
      depth: Math.random(), // 0 = far, 1 = near
      typeIdx: Math.floor(Math.random() * STAR_TYPES.length),
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
        s.typeIdx = Math.floor(Math.random() * STAR_TYPES.length);
      }
      const cc = Math.round(s.c);
      const rr = Math.round(s.r);
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) {
        const star = STAR_TYPES[s.typeIdx];
        grid[rr][cc] = { ch: star.ch, color: star.color };
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
