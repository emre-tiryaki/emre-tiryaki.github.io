/**
 * ASCII Starfield Animation
 * Stars drift leftward with depth-based speed (parallax); wraps around.
 */

const STAR = '.+*oOS';

export function createStarfield(preElement) {
  const COLS = 70;
  const ROWS = 30;

  const stars = [];
  const COUNT = 90;
  for (let i = 0; i < COUNT; i++) {
    stars.push({
      c: Math.random() * COLS,
      r: Math.random() * ROWS,
      depth: Math.random(), // 0 = far, 1 = near
    });
  }

  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 60) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(' '));
    for (const s of stars) {
      // speed by depth
      s.c -= 0.15 + s.depth * 0.85;
      if (s.c < 0) {
        s.c = COLS - 1 + Math.random() * 3;
        s.r = Math.random() * ROWS;
        s.depth = Math.random();
      }
      const cc = Math.round(s.c);
      const rr = Math.round(s.r);
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) {
        const idx = Math.min(STAR.length - 1, Math.floor(s.depth * STAR.length));
        grid[rr][cc] = STAR[idx];
      }
    }

    let out = '';
    for (let r = 0; r < ROWS; r++) {
      out += grid[r].join('') + '\n';
    }
    preElement.textContent = out;

    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}
