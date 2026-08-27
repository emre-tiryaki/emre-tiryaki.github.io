/**
 * Spinning Donut ASCII Animation with Dynamic Multi-Color 3D Shading
 */

const W = 70;
const H = 24;
const CHARS = '.,-~:;=!*#$@';

const THEMES = {
  cyberpunk: [
    '#4338ca', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
    '#fb7185', '#f97316', '#fb923c', '#facc15', '#fde047', '#ffffff'
  ],
  matrix: [
    '#052e16', '#14532d', '#166534', '#15803d', '#16a34a', '#22c55e',
    '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4', '#ffffff'
  ],
  solar: [
    '#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ea580c',
    '#f97316', '#fb923c', '#facc15', '#fde047', '#fef08a', '#ffffff'
  ],
  ocean: [
    '#082f49', '#0c4a6e', '#075985', '#0284c7', '#0369a1', '#0ea5e9',
    '#38bdf8', '#7dd3fc', '#a5f3fc', '#cffafe', '#e0f2fe', '#ffffff'
  ],
  synthwave: [
    '#3b0764', '#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7',
    '#c084fc', '#e879f9', '#f472b6', '#38bdf8', '#67e8f9', '#ffffff'
  ],
  monochrome: [
    '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
    '#e2e8f0', '#f1f5f9', '#f8fafc', '#ffffff', '#ffffff', '#ffffff'
  ],
};

export function createSpinningDonut(preElement, themeId = 'cyberpunk') {
  const COLOR_MAP = THEMES[themeId] || THEMES.cyberpunk;
  let A = 0;
  let B = 0;
  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 50) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const output = Array.from({ length: H }, () =>
      Array.from({ length: W }, () => ({ ch: ' ', color: null }))
    );
    const zbuf = Array.from({ length: H }, () => new Array(W).fill(0));

    for (let j = 0; j < 6.28; j += 0.07) {
      for (let i = 0; i < 6.28; i += 0.02) {
        const sinI = Math.sin(i);
        const cosI = Math.cos(i);
        const sinJ = Math.sin(j);
        const cosJ = Math.cos(j);
        const sinA = Math.sin(A);
        const cosA = Math.cos(A);
        const sinB = Math.sin(B);
        const cosB = Math.cos(B);

        const h = cosJ + 2;
        const D = 1 / (sinI * h * sinA + sinJ * cosA + 5);
        const t = sinI * h * cosA - sinJ * sinA;

        const x = Math.floor(W / 2 + (W / 2.5) * D * (cosI * h * cosB - t * sinB));
        const y = Math.floor(H / 2 + (H / 2.5) * D * (cosI * h * sinB + t * cosB));
        const L = Math.floor(
          8 * ((sinJ * sinA - sinI * cosJ * cosA) * cosB -
            sinI * cosJ * sinA -
            sinJ * cosA -
            cosI * cosJ * sinB)
        );

        if (y >= 0 && y < H && x >= 0 && x < W && D > zbuf[y][x]) {
          zbuf[y][x] = D;
          const lumIdx = Math.max(0, Math.min(CHARS.length - 1, L));
          output[y][x] = {
            ch: CHARS[lumIdx],
            color: COLOR_MAP[lumIdx],
          };
        }
      }
    }

    let html = '';
    for (let y = 0; y < H; y++) {
      let curColor = null;
      let curText = '';
      for (let x = 0; x < W; x++) {
        const cell = output[y][x];
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

    A += 0.07;
    B += 0.03;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);

  return () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}
