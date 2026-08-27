/**
 * Spinning Globe ASCII Animation with Randomized Planetary Themes
 * Features Earth, Mars, Jupiter, Neptune, Venus, Kepler-186f, and Cybertron!
 */

const W = 64;
const H = 22;
const DENSITY = '.:-=+*#%@';

const PLANETS = [
  {
    id: 'earth',
    name: 'Earth 3D',
    getColor: (phi, theta, lum) => {
      const isPole = phi < 0.35 || phi > Math.PI - 0.35;
      const isEquator = Math.abs(phi - Math.PI / 2) < 0.08;
      const landNoise = Math.sin(theta * 3 + Math.cos(phi * 4)) * Math.cos(phi * 2);
      if (isPole) return '#e0f2fe'; // Ice Caps
      if (isEquator) return '#f59e0b'; // Equator
      if (landNoise > 0.15) return lum > 0.2 ? '#22c55e' : '#15803d'; // Continents
      return lum > 0.1 ? '#38bdf8' : '#0284c7'; // Oceans
    },
  },
  {
    id: 'mars',
    name: 'Mars 3D',
    getColor: (phi, theta, lum) => {
      const isPole = phi < 0.3 || phi > Math.PI - 0.3;
      const rift = Math.abs(theta - Math.PI) < 0.25 && Math.abs(phi - Math.PI / 2) < 0.2;
      const landNoise = Math.sin(theta * 4 + phi * 3);
      if (isPole) return '#fef3c7'; // Polar dry ice
      if (rift) return '#fb923c'; // Valles Marineris canyon
      if (landNoise > 0.2) return lum > 0.2 ? '#ef4444' : '#b91c1c'; // Rust Highlands
      return lum > 0.1 ? '#9a3412' : '#7c2d12'; // Basalt plains
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter 3D',
    getColor: (phi, theta, lum) => {
      const band = Math.sin(phi * 12);
      const isRedSpot = Math.abs(theta - 2.5) < 0.35 && Math.abs(phi - (Math.PI / 2 + 0.3)) < 0.18;
      if (isRedSpot) return '#ef4444'; // Great Red Spot
      if (band > 0.4) return '#fdba74'; // Amber storm belt
      if (band > -0.2) return '#fde047'; // Gold atmospheric zone
      return lum > 0.2 ? '#fed7aa' : '#c2410c'; // Dark equatorial band
    },
  },
  {
    id: 'neptune',
    name: 'Neptune 3D',
    getColor: (phi, theta, lum) => {
      const isStorm = Math.abs(theta - 1.8) < 0.3 && Math.abs(phi - Math.PI / 2) < 0.2;
      const cirrus = Math.sin(phi * 8 + theta * 2) > 0.6;
      if (isStorm) return '#1e1b4b'; // Great Dark Spot
      if (cirrus) return '#ffffff'; // White high-altitude methane clouds
      if (phi < 0.3 || phi > Math.PI - 0.3) return '#67e8f9'; // Bright polar vortex
      return lum > 0.2 ? '#06b6d4' : '#0284c7'; // Cyan/Azure atmosphere
    },
  },
  {
    id: 'venus',
    name: 'Venus 3D',
    getColor: (phi, theta, lum) => {
      const isLava = Math.sin(theta * 5 + Math.cos(phi * 6)) > 0.55;
      const isHighland = Math.cos(phi * 4 + theta * 2) > 0.2;
      if (isLava) return '#ea580c'; // Glowing magma / thermal anomaly
      if (isHighland) return '#facc15'; // Sulfuric highlands
      return lum > 0.2 ? '#eab308' : '#a16207'; // Dense sulfuric cloud layers
    },
  },
  {
    id: 'kepler',
    name: 'Kepler-186f 3D',
    getColor: (phi, theta, lum) => {
      const isPole = phi < 0.35 || phi > Math.PI - 0.35;
      const isFlora = Math.sin(theta * 3 + phi * 3) > 0.1;
      if (isPole) return '#a5f3fc'; // Cyan Ice
      if (isFlora) return lum > 0.2 ? '#a855f7' : '#7e22ce'; // Red-dwarf purple vegetation
      return lum > 0.1 ? '#3b82f6' : '#1d4ed8'; // Indigo oceans
    },
  },
  {
    id: 'cybertron',
    name: 'Cybertron 3D',
    getColor: (phi, theta, lum) => {
      const isConduit = Math.abs(Math.sin(theta * 8)) < 0.15 || Math.abs(Math.sin(phi * 8)) < 0.15;
      const isCoreCity = Math.sin(theta * 4 + phi * 4) > 0.4;
      if (isConduit) return '#00f0ff'; // Neon Cyan energy conduits
      if (isCoreCity) return '#ff007f'; // Neon Magenta cyber city
      return lum > 0.2 ? '#6366f1' : '#312e81'; // Metallic techno-crust
    },
  },
];

export function createSpinningGlobe(preElement, planetId = 'earth') {
  const planet = PLANETS.find((p) => p.id === planetId) || PLANETS[0];

  let angle = 0;
  let animFrameId = null;
  let lastTime = 0;

  function frame(timestamp) {
    if (timestamp - lastTime < 55) {
      animFrameId = requestAnimationFrame(frame);
      return;
    }
    lastTime = timestamp;

    const grid = Array.from({ length: H }, () =>
      Array.from({ length: W }, () => ({ ch: ' ', color: null }))
    );
    const zbuf = Array.from({ length: H }, () => new Array(W).fill(-Infinity));

    const R = 8.5;
    const scaleX = 1.9;
    const scaleY = 1.05;
    const offsetX = W / 2;
    const offsetY = H / 2;
    const fov = 18;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const tilt = 0.35;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    for (let phi = 0; phi < Math.PI; phi += 0.055) {
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.035) {
        const sx = R * Math.sin(phi) * Math.cos(theta);
        const sy = R * Math.sin(phi) * Math.sin(theta);
        const sz = R * Math.cos(phi);

        // Rotate around Y axis
        const rx = sx * cosA - sy * sinA;
        const ry_raw = sx * sinA + sy * cosA;
        // Apply tilt
        const ry = ry_raw * cosT - sz * sinT;
        const rz = ry_raw * sinT + sz * cosT;

        const d = fov + rz;
        if (d <= 0) continue;

        const px = Math.floor(offsetX + (rx / d) * fov * scaleX);
        const py = Math.floor(offsetY - (ry / d) * fov * scaleY);

        if (px < 0 || px >= W || py < 0 || py >= H) continue;

        // Lighting calculation
        const lightX = 0.6;
        const lightY = -0.6;
        const lightZ = 0.5;
        const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
        const nx = sx / len;
        const ny = sy / len;
        const nz = sz / len;

        const rnx = nx * cosA - ny * sinA;
        const rny_raw = nx * sinA + ny * cosA;
        const rny = rny_raw * cosT - nz * sinT;
        const rnz = rny_raw * sinT + nz * cosT;

        const lum = rnx * lightX + rny * lightY + rnz * lightZ;
        const charIdx = Math.max(0, Math.min(DENSITY.length - 1, Math.floor((lum + 1) / 2 * DENSITY.length)));

        // Color mapped to selected planet's geography & atmosphere
        const color = planet.getColor(phi, theta, lum);

        if (d > zbuf[py][px]) {
          zbuf[py][px] = d;
          grid[py][px] = {
            ch: DENSITY[charIdx],
            color,
          };
        }
      }
    }

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

    angle += 0.035;
    animFrameId = requestAnimationFrame(frame);
  }

  animFrameId = requestAnimationFrame(frame);
  return () => { if (animFrameId) cancelAnimationFrame(animFrameId); };
}
