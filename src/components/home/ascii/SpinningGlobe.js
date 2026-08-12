/**
 * Spinning Globe ASCII Animation
 * Sphere surface points projected with Z-buffer depth sorting
 */

const W = 70;
const H = 28;
const DENSITY = '.:-=+*#%@';

export function createSpinningGlobe(preElement) {
  let angle = 0;
  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 60) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const buf = new Array(W * H).fill(' ');
    const zbuf = new Array(W * H).fill(-Infinity);

    const R = 10; // globe radius in "units"
    const scaleX = 1.8; // chars are taller than wide
    const scaleY = 1;
    const offsetX = W / 2;
    const offsetY = H / 2;
    const fov = 20; // distance from viewer

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const tilt = 0.3; // slight tilt for globe feel
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    for (let phi = 0; phi < Math.PI; phi += 0.05) {
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.03) {
        // Sphere surface point
        const sx = R * Math.sin(phi) * Math.cos(theta);
        const sy = R * Math.sin(phi) * Math.sin(theta);
        const sz = R * Math.cos(phi);

        // Rotate around Y axis
        const rx = sx * cosA - sy * sinA;
        const ry_raw = sx * sinA + sy * cosA;
        // Apply tilt around X axis
        const ry = ry_raw * cosT - sz * sinT;
        const rz = ry_raw * sinT + sz * cosT;

        // Perspective projection
        const d = fov + rz;
        if (d <= 0) continue;

        const px = Math.floor(offsetX + (rx / d) * fov * scaleX);
        const py = Math.floor(offsetY - (ry / d) * fov * scaleY);
        const idx = py * W + px;

        if (px < 0 || px >= W || py < 0 || py >= H) continue;

        // Lighting: simple diffuse from top-right
        const lightX = 0.6;
        const lightY = -0.6;
        const lightZ = 0.5;
        const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
        const nx = sx / len;
        const ny = sy / len;
        const nz = sz / len;
        // Rotate normal same as point
        const rnx = nx * cosA - ny * sinA;
        const rny_raw = nx * sinA + ny * cosA;
        const rny = rny_raw * cosT - nz * sinT;
        const rnz = rny_raw * sinT + nz * cosT;

        const lum = rnx * lightX + rny * lightY + rnz * lightZ;
        const charIdx = Math.max(0, Math.min(DENSITY.length - 1, Math.floor((lum + 1) / 2 * DENSITY.length)));

        if (d > zbuf[idx]) {
          zbuf[idx] = d;
          buf[idx] = DENSITY[charIdx];
        }
      }
    }

    let result = '';
    for (let y = 0; y < H; y++) {
      result += buf.slice(y * W, (y + 1) * W).join('') + '\n';
    }
    preElement.textContent = result;

    angle += 0.04;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
