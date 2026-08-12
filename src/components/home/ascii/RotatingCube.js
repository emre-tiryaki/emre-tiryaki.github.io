/**
 * Rotating 3D Cube ASCII Animation
 * 8 vertices rotated with Rx·Ry·Rz matrices → perspective projection → line drawing
 */

const W = 60;
const H = 30;

function rotate(x, y, z, rx, ry, rz) {
  // Rotate around X
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  // Rotate around Y
  let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  // Rotate around Z
  let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  return [x3, y3, z2];
}

function project(x, y, z) {
  const d = 5 + z;
  const scale = 10;
  const px = Math.floor(W / 2 + (x * scale) / d);
  const py = Math.floor(H / 2 - (y * scale) / d);
  return [px, py];
}

function drawLine(buf, x0, y0, x1, y1, ch) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (x0 >= 0 && x0 < W && y0 >= 0 && y0 < H) {
      buf[y0 * W + x0] = ch;
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

const EDGES = [
  [0,1],[1,2],[2,3],[3,0], // front face
  [4,5],[5,6],[6,7],[7,4], // back face
  [0,4],[1,5],[2,6],[3,7], // connecting edges
];

const EDGE_CHARS = ['+', '+', '+', '+', '.', '.', '.', '.', '|', '|', '|', '|'];

export function createRotatingCube(preElement) {
  let rx = 0.5;
  let ry = 0;
  let rz = 0.3;
  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 50) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const buf = new Array(W * H).fill(' ');

    const s = 1.5; // cube half-size
    const rawVertices = [
      [-s, -s, -s], [ s, -s, -s], [ s,  s, -s], [-s,  s, -s],
      [-s, -s,  s], [ s, -s,  s], [ s,  s,  s], [-s,  s,  s],
    ];

    const verts = rawVertices.map(([x, y, z]) => rotate(x, y, z, rx, ry, rz));
    const proj = verts.map(([x, y, z]) => project(x, y, z));

    // Draw vertex markers
    proj.forEach(([px, py]) => {
      if (px >= 0 && px < W && py >= 0 && py < H) {
        buf[py * W + px] = '#';
      }
    });

    // Draw edges
    EDGES.forEach(([a, b], i) => {
      const [x0, y0] = proj[a];
      const [x1, y1] = proj[b];
      drawLine(buf, x0, y0, x1, y1, EDGE_CHARS[i % EDGE_CHARS.length]);
    });

    // Draw vertex markers on top of lines
    proj.forEach(([px, py]) => {
      if (px >= 0 && px < W && py >= 0 && py < H) {
        buf[py * W + px] = '@';
      }
    });

    let result = '';
    for (let y = 0; y < H; y++) {
      result += buf.slice(y * W, (y + 1) * W).join('') + '\n';
    }
    preElement.textContent = result;

    rx += 0.03;
    ry += 0.05;
    rz += 0.01;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
