/**
 * Spinning Donut ASCII Animation with Dynamic Multi-Color 3D Shading
 */

const W = 70;
const H = 24;
const CHARS = '.,-~:;=!*#$@';

const COLOR_MAP = [
  '#4338ca', // deep indigo (shadow)
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#a855f7', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#fb7185', // light rose
  '#f97316', // orange
  '#fb923c', // amber
  '#facc15', // yellow
  '#fde047', // light yellow
  '#ffffff', // peak white highlight
];

export function createSpinningDonut(preElement) {
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
