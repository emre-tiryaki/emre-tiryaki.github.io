/**
 * Matrix Rain ASCII Animation
 * Column-based falling characters (Katakana + Latin mix)
 */

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export function createMatrixRain(preElement) {
  // Use character-based grid
  const FONT_W = 9; // approximate px per char for display
  const COLS = 60;
  const ROWS = 28;

  const drops = Array.from({ length: COLS }, () => Math.floor(Math.random() * -ROWS));
  const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(' '));
  const brightness = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

  let animFrameId = null;
  let lastTime = 0;

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function frame(timestamp) {
    if (timestamp - lastTime < 80) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    // Fade all brightness
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (brightness[r][c] > 0) brightness[r][c]--;
        else grid[r][c] = ' ';
      }
    }

    // Update each drop
    for (let c = 0; c < COLS; c++) {
      const row = drops[c];
      if (row >= 0 && row < ROWS) {
        grid[row][c] = randomChar();
        brightness[row][c] = 3; // head brightness
        // Trailing cells
        if (row > 0) brightness[row - 1][c] = Math.max(brightness[row - 1][c], 2);
        if (row > 1) brightness[row - 2][c] = Math.max(brightness[row - 2][c], 1);
      }
      drops[c]++;
      if (drops[c] > ROWS + 5) {
        drops[c] = Math.floor(Math.random() * -10);
      }
    }

    let result = '';
    for (let r = 0; r < ROWS; r++) {
      result += grid[r].join('') + '\n';
    }
    preElement.textContent = result;

    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
