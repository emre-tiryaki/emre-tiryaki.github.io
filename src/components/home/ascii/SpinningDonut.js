/**
 * Spinning Donut ASCII Animation
 * Based on Andy Sloane's donut.c algorithm
 * https://www.a1k0n.net/2011/07/20/donut-math.html
 */

const W = 80;
const H = 24;
const CHARS = '.,-~:;=!*#$@';

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

    const output = new Array(W * H).fill(' ');
    const zbuf = new Array(W * H).fill(0);

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
        const o = x + W * y;
        const L = Math.floor(
          8 * ((sinJ * sinA - sinI * cosJ * cosA) * cosB -
            sinI * cosJ * sinA -
            sinJ * cosA -
            cosI * cosJ * sinB)
        );

        if (y >= 0 && y < H && x >= 0 && x < W && D > zbuf[o]) {
          zbuf[o] = D;
          output[o] = CHARS[Math.max(L, 0)];
        }
      }
    }

    let result = '';
    for (let y = 0; y < H; y++) {
      result += output.slice(y * W, (y + 1) * W).join('') + '\n';
    }
    preElement.textContent = result;

    A += 0.07;
    B += 0.03;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);

  return () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}
