/**
 * Rotating 3D Cube ASCII Animation with Multi-Color Holographic Edges
 */

const W = 60;
const H = 22;

function rotate(x, y, z, rx, ry, rz) {
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  return [x3, y3, z2];
}

function project(x, y, z) {
  const d = 3.6 + z;
  const scaleX = 24;
  const scaleY = 12;
  const px = Math.floor(W / 2 + (x * scaleX) / d);
  const py = Math.floor(H / 2 - (y * scaleY) / d);
  return [px, py];
}

function drawLine(grid, x0, y0, x1, y1, ch, color) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (x0 >= 0 && x0 < W && y0 >= 0 && y0 < H) {
      grid[y0][x0] = { ch, color };
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // front face -> Cyan
  [4, 5], [5, 6], [6, 7], [7, 4], // back face -> Magenta
  [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges -> Yellow
];

const EDGE_CONFIG = [
  { ch: '#', color: '#00f0ff' },
  { ch: '#', color: '#00f0ff' },
  { ch: '#', color: '#00f0ff' },
  { ch: '#', color: '#00f0ff' },
  { ch: '+', color: '#ff2a85' },
  { ch: '+', color: '#ff2a85' },
  { ch: '+', color: '#ff2a85' },
  { ch: '+', color: '#ff2a85' },
  { ch: '|', color: '#ffd000' },
  { ch: '|', color: '#ffd000' },
  { ch: '|', color: '#ffd000' },
  { ch: '|', color: '#ffd000' },
];

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

    const grid = Array.from({ length: H }, () =>
      Array.from({ length: W }, () => ({ ch: ' ', color: null }))
    );

    const s = 1.35;
    const rawVertices = [
      [-s, -s, -s], [ s, -s, -s], [ s,  s, -s], [-s,  s, -s],
      [-s, -s,  s], [ s, -s,  s], [ s,  s,  s], [-s,  s,  s],
    ];

    const verts = rawVertices.map(([x, y, z]) => rotate(x, y, z, rx, ry, rz));
    const proj = verts.map(([x, y, z]) => project(x, y, z));

    // Draw multi-color edges
    EDGES.forEach(([a, b], i) => {
      const [x0, y0] = proj[a];
      const [x1, y1] = proj[b];
      const cfg = EDGE_CONFIG[i];
      drawLine(grid, x0, y0, x1, y1, cfg.ch, cfg.color);
    });

    // Draw vertex markers with glowing white/green
    proj.forEach(([px, py], i) => {
      if (px >= 0 && px < W && py >= 0 && py < H) {
        grid[py][px] = { ch: '@', color: i < 4 ? '#38bdf8' : '#34d399' };
      }
    });

    // Render HTML with colored spans
    let html = '';
    for (let y = 0; y < H; y++) {
      let curColor = null;
      let curText = '';
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];
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

    rx += 0.025;
    ry += 0.04;
    rz += 0.015;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
