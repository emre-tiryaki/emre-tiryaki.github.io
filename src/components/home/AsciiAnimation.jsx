import { useState, useEffect, useRef } from 'react';
import { createSpinningDonut } from './ascii/SpinningDonut';
import { createRotatingCube } from './ascii/RotatingCube';
import { createMatrixRain } from './ascii/MatrixRain';
import { createSpinningGlobe } from './ascii/SpinningGlobe';
import { createFireworks } from './ascii/Fireworks';
import { createStarfield } from './ascii/Starfield';

const ANIMATION_COMBINATIONS = [
  // ── Donut Themes ──
  { id: 'donut', theme: 'cyberpunk', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'cyberpunk') },
  { id: 'donut', theme: 'matrix', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'matrix') },
  { id: 'donut', theme: 'solar', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'solar') },
  { id: 'donut', theme: 'ocean', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'ocean') },
  { id: 'donut', theme: 'synthwave', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'synthwave') },
  { id: 'donut', theme: 'monochrome', label: 'Torus Donut 3D', create: (el) => createSpinningDonut(el, 'monochrome') },

  // ── Cube Themes ──
  { id: 'cube', theme: 'cyber', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'cyber') },
  { id: 'cube', theme: 'matrix', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'matrix') },
  { id: 'cube', theme: 'solar', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'solar') },
  { id: 'cube', theme: 'aurora', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'aurora') },
  { id: 'cube', theme: 'synthwave', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'synthwave') },
  { id: 'cube', theme: 'monochrome', label: 'Rotating Cube 3D', create: (el) => createRotatingCube(el, 'monochrome') },

  // ── Matrix Rain (Classic Pure Green) ──
  { id: 'matrix', theme: 'green', label: 'Matrix Digital Rain', create: (el) => createMatrixRain(el) },

  // ── Spinning Globe (Planets) ──
  { id: 'globe', theme: 'earth', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'earth') },
  { id: 'globe', theme: 'mars', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'mars') },
  { id: 'globe', theme: 'jupiter', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'jupiter') },
  { id: 'globe', theme: 'neptune', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'neptune') },
  { id: 'globe', theme: 'cybertron', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'cybertron') },
  { id: 'globe', theme: 'venus', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'venus') },
  { id: 'globe', theme: 'kepler', label: 'Rotating Sphere 3D', create: (el) => createSpinningGlobe(el, 'kepler') },

  // ── Fireworks Palettes ──
  { id: 'fireworks', theme: 'fire', label: 'ASCII Fireworks', create: (el) => createFireworks(el, 'fire') },
  { id: 'fireworks', theme: 'cyber', label: 'ASCII Fireworks', create: (el) => createFireworks(el, 'cyber') },
  { id: 'fireworks', theme: 'aurora', label: 'ASCII Fireworks', create: (el) => createFireworks(el, 'aurora') },
  { id: 'fireworks', theme: 'rainbow', label: 'ASCII Fireworks', create: (el) => createFireworks(el, 'rainbow') },
  { id: 'fireworks', theme: 'pastel', label: 'ASCII Fireworks', create: (el) => createFireworks(el, 'pastel') },

  // ── Starfield Themes ──
  { id: 'starfield', theme: 'multi-spectral', label: 'ASCII Starfield', create: (el) => createStarfield(el, 'multi-spectral') },
  { id: 'starfield', theme: 'blue-shift', label: 'ASCII Starfield', create: (el) => createStarfield(el, 'blue-shift') },
  { id: 'starfield', theme: 'solar-gold', label: 'ASCII Starfield', create: (el) => createStarfield(el, 'solar-gold') },
  { id: 'starfield', theme: 'emerald-nebula', label: 'ASCII Starfield', create: (el) => createStarfield(el, 'emerald-nebula') },
  { id: 'starfield', theme: 'cosmic-violet', label: 'ASCII Starfield', create: (el) => createStarfield(el, 'cosmic-violet') },
];

function selectNonRepeatingAnimation() {
  let lastKey = null;
  try {
    lastKey = sessionStorage.getItem('last_ascii_combination') || localStorage.getItem('last_ascii_combination');
  } catch {
    // Ignored in restricted environments
  }

  // Filter out the exact previous shape + color theme combination
  const validPool = ANIMATION_COMBINATIONS.filter(
    (item) => `${item.id}:${item.theme}` !== lastKey
  );

  const pool = validPool.length > 0 ? validPool : ANIMATION_COMBINATIONS;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  try {
    const newKey = `${selected.id}:${selected.theme}`;
    sessionStorage.setItem('last_ascii_combination', newKey);
    localStorage.setItem('last_ascii_combination', newKey);
  } catch {
    // Ignored
  }

  return selected;
}

export default function AsciiAnimation() {
  const preRef = useRef(null);
  // Ardışık aynı (şekil + renk) kombinasyonunun gelmesini engelleyen lazy initializer
  const [chosen] = useState(() => selectNonRepeatingAnimation());

  useEffect(() => {
    if (!preRef.current) return;
    const cleanup = chosen.create(preRef.current);
    return cleanup;
  }, [chosen]);

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem' }}>
      {/* Terminal top bar — semi-transparent */}
      <div
        style={{
          padding: '0 1rem',
          height: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(20,20,20,0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ width: '4rem' }} />
        <span className="text-[11px] font-mono text-neutral-400 text-center flex-1 select-none">
          {chosen.label}
        </span>
        <div
          style={{
            width: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.45rem',
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        </div>
      </div>

      {/* ASCII canvas — fully transparent background */}
      <div
        className="p-4 sm:p-6 flex items-center justify-center min-h-[280px] overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      >
        <pre
          ref={preRef}
          aria-hidden="true"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(9px, 1.3vw, 14px)',
            lineHeight: '1.2',
            color: '#e2e8f0',
            userSelect: 'none',
            letterSpacing: '0.04em',
            textShadow: '0 0 12px rgba(255,255,255,0.15)',
          }}
        />
      </div>
    </div>
  );
}
