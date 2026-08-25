/**
 * Matrix Rain ASCII Animation - Classic Pure Green with Subtle Shade Transition
 */

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

const COLORS = [
  '#15803d', // tail: dark matrix green
  '#16a34a', // mid: classic green
  '#22c55e', // body: vivid green
  '#86efac', // head: soft glowing light green
];

export function createMatrixRain(preElement) {
  const COLS = 60;
  const ROWS = 24;

  const drops = Array.from({ length: COLS }, () => Math.floor(Math.random() * -ROWS));
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ ch: ' ', color: null }))
  );
  const brightness = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

  let animFrameId = null;
  let lastTime = 0;

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function frame(timestamp) {
    if (timestamp - lastTime < 70) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    // Fade brightness
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (brightness[r][c] > 0) {
          brightness[r][c]--;
          if (brightness[r][c] > 0) {
            grid[r][c].color = COLORS[brightness[r][c] - 1];
          } else {
            grid[r][c] = { ch: ' ', color: null };
          }
        }
      }
    }

    // Update each drop
    for (let c = 0; c < COLS; c++) {
      const row = drops[c];
      if (row >= 0 && row < ROWS) {
        grid[row][c] = {
          ch: randomChar(),
          color: COLORS[3], // Head is subtle soft light green
        };
        brightness[row][c] = 4;
      }
      drops[c]++;
      if (drops[c] > ROWS + 4) {
        drops[c] = Math.floor(Math.random() * -8);
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
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
