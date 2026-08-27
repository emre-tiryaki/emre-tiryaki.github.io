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
  [0, 1], [1, 2], [2, 3], [3, 0], // front face
  [4, 5], [5, 6], [6, 7], [7, 4], // back face
  [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
];

const CUBE_THEMES = {
  cyber: {
    front: { ch: '#', color: '#00f0ff' },
    back: { ch: '+', color: '#ff2a85' },
    connect: { ch: '|', color: '#ffd000' },
    vFront: '#38bdf8',
    vBack: '#f472b6',
  },
  matrix: {
    front: { ch: '#', color: '#22c55e' },
    back: { ch: '+', color: '#15803d' },
    connect: { ch: '|', color: '#86efac' },
    vFront: '#4ade80',
    vBack: '#16a34a',
  },
  solar: {
    front: { ch: '#', color: '#f97316' },
    back: { ch: '+', color: '#dc2626' },
    connect: { ch: '|', color: '#facc15' },
    vFront: '#fb923c',
    vBack: '#fde047',
  },
  aurora: {
    front: { ch: '#', color: '#2dd4bf' },
    back: { ch: '+', color: '#a855f7' },
    connect: { ch: '|', color: '#38bdf8' },
    vFront: '#5eead4',
    vBack: '#c084fc',
  },
  synthwave: {
    front: { ch: '#', color: '#f43f5e' },
    back: { ch: '+', color: '#8b5cf6' },
    connect: { ch: '|', color: '#06b6d4' },
    vFront: '#fb7185',
    vBack: '#a78bfa',
  },
  monochrome: {
    front: { ch: '#', color: '#f8fafc' },
    back: { ch: '+', color: '#64748b' },
    connect: { ch: '|', color: '#94a3b8' },
    vFront: '#ffffff',
    vBack: '#cbd5e1',
  },
};

export function createRotatingCube(preElement, themeId = 'cyber') {
  const theme = CUBE_THEMES[themeId] || CUBE_THEMES.cyber;
  const edgeConfigs = [
    theme.front, theme.front, theme.front, theme.front,
    theme.back, theme.back, theme.back, theme.back,
    theme.connect, theme.connect, theme.connect, theme.connect,
  ];

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
      const cfg = edgeConfigs[i];
      drawLine(grid, x0, y0, x1, y1, cfg.ch, cfg.color);
    });

    // Draw vertex markers with theme colors
    proj.forEach(([px, py], i) => {
      if (px >= 0 && px < W && py >= 0 && py < H) {
        grid[py][px] = { ch: '@', color: i < 4 ? theme.vFront : theme.vBack };
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
