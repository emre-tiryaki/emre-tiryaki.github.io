/**
 * ASCII Fireworks Animation with Vibrant Multi-Color Explosion Palettes
 */

const SPARK = '.*#+';

const FIREWORKS_PALETTES = {
  fire: ['#f43f5e', '#fb923c', '#facc15', '#ffffff'],
  cyber: ['#00f5d4', '#7b2cbf', '#ff007f', '#ffffff'],
  aurora: ['#4ade80', '#22d3ee', '#818cf8', '#ffffff'],
  rainbow: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'],
  pastel: ['#c084fc', '#f472b6', '#38bdf8', '#ffffff'],
};

export function createFireworks(preElement, themeId = 'fire') {
  const selectedPalette = FIREWORKS_PALETTES[themeId] || FIREWORKS_PALETTES.fire;
  const COLS = 64;
  const ROWS = 24;

  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ ch: ' ', color: null, life: 0 }))
  );

  const rockets = []; // { c, r, target, palette }
  const particles = []; // { c, r, vc, vr, life, max, palette }

  let animFrameId = null;
  let lastTime = 0;

  function spawnRocket() {
    const c = 6 + Math.floor(Math.random() * (COLS - 12));
    rockets.push({ c, r: ROWS - 1, target: 3 + Math.floor(Math.random() * 8), palette: selectedPalette });
  }

  function explode(c, r, palette) {
    const count = 20 + Math.floor(Math.random() * 12);
    const maxLife = 11 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const spd = 0.45 + Math.random() * 0.35;
      particles.push({
        c,
        r,
        vc: Math.cos(ang) * spd,
        vr: Math.sin(ang) * spd,
        life: maxLife,
        max: maxLife,
        palette,
      });
    }
  }

  function frame(timestamp) {
    if (timestamp - lastTime < 50) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    // Fade grid
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c].life > 0) grid[r][c].life--;
        if (grid[r][c].life <= 0) grid[r][c] = { ch: ' ', color: null, life: 0 };
      }
    }

    // Rockets
    if (Math.random() < 0.08) spawnRocket();
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rk = rockets[i];
      grid[rk.r][rk.c] = { ch: '|', color: '#fde047', life: 3 };
      rk.r -= 1;
      if (rk.r <= rk.target) {
        explode(rk.c, rk.r, rk.palette);
        grid[rk.r][rk.c] = { ch: '@', color: '#ffffff', life: 5 };
        rockets.splice(i, 1);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.c += p.vc;
      p.r += p.vr;
      p.vr += 0.025; // gravity
      p.life--;
      const rr = Math.round(p.r);
      const cc = Math.round(p.c);
      if (
        p.life > 0 &&
        rr >= 0 && rr < ROWS &&
        cc >= 0 && cc < COLS
      ) {
        const ratio = p.life / p.max;
        const ch = SPARK[Math.max(0, SPARK.length - Math.ceil(ratio * SPARK.length) - 1)] || '*';
        const colorIdx = Math.min(p.palette.length - 1, Math.floor((1 - ratio) * p.palette.length));
        const color = p.palette[colorIdx];
        grid[rr][cc] = { ch, color, life: Math.max(grid[rr][cc].life, 4) };
      }
      if (p.life <= 0) particles.splice(i, 1);
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
