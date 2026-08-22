/**
 * ASCII Fireworks Animation
 * Rockets climb, explode into star bursts, then fade.
 */

const SPARK = '.*#+';

export function createFireworks(preElement) {
  const COLS = 70;
  const ROWS = 30;

  // grid[r][c] = { ch, life }  life: 0 = empty
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ ch: ' ', life: 0 }))
  );

  const rockets = []; // {c, r, target}
  const particles = []; // {c, r, vc, vr, life, max}

  let animFrameId = null;
  let lastTime = 0;

  function spawnRocket() {
    const c = 6 + Math.floor(Math.random() * (COLS - 12));
    rockets.push({ c, r: ROWS - 1, target: 4 + Math.floor(Math.random() * 12) });
  }

  function explode(c, r) {
    const count = 18 + Math.floor(Math.random() * 14);
    const maxLife = 10 + Math.floor(Math.random() * 8);
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
      });
    }
  }

  function frame(timestamp) {
    if (timestamp - lastTime < 55) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    // Fade grid
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c].life > 0) grid[r][c].life--;
        if (grid[r][c].life <= 0) grid[r][c] = { ch: ' ', life: 0 };
      }
    }

    // Rockets
    if (Math.random() < 0.06) spawnRocket();
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rk = rockets[i];
      grid[rk.r][rk.c] = { ch: '|', life: 3 };
      rk.r -= 1;
      if (rk.r <= rk.target) {
        explode(rk.c, rk.r);
        grid[rk.r][rk.c] = { ch: '@', life: 6 };
        rockets.splice(i, 1);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.c += p.vc;
      p.r += p.vr;
      p.vr += 0.02; // gravity
      p.life--;
      const rr = Math.round(p.r);
      const cc = Math.round(p.c);
      if (
        p.life > 0 &&
        rr >= 0 && rr < ROWS &&
        cc >= 0 && cc < COLS
      ) {
        const ch = SPARK[Math.max(0, SPARK.length - Math.ceil((p.life / p.max) * SPARK.length) - 1)] || '*';
        grid[rr][cc] = { ch, life: Math.max(grid[rr][cc].life, 4) };
      }
      if (p.life <= 0) particles.splice(i, 1);
    }

    let out = '';
    for (let r = 0; r < ROWS; r++) {
      let line = '';
      for (let c = 0; c < COLS; c++) line += grid[r][c].ch;
      out += line + '\n';
    }
    preElement.textContent = out;

    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}
