import { useState, useEffect, useRef } from 'react';
import { createSpinningDonut } from './ascii/SpinningDonut';
import { createRotatingCube } from './ascii/RotatingCube';
import { createMatrixRain } from './ascii/MatrixRain';
import { createSpinningGlobe } from './ascii/SpinningGlobe';
import { createFireworks } from './ascii/Fireworks';
import { createStarfield } from './ascii/Starfield';

const ANIMATIONS = [
  { id: 'donut', create: createSpinningDonut, color: '#22c55e', label: 'Torus Donut 3D' },
  { id: 'cube', create: createRotatingCube, color: '#06b6d4', label: 'Rotating Cube 3D' },
  { id: 'matrix', create: createMatrixRain, color: '#22c55e', label: 'Matrix Digital Rain' },
  { id: 'globe', create: createSpinningGlobe, color: '#f97316', label: 'Rotating Sphere 3D' },
  { id: 'fireworks', create: createFireworks, color: '#fb923c', label: 'ASCII Fireworks' },
  { id: 'starfield', create: createStarfield, color: '#a78bfa', label: 'ASCII Starfield' },
];

export default function AsciiAnimation() {
  const preRef = useRef(null);
  // Tek seferlik rastgele seçim → lazy initializer (render dışında, saf)
  const [chosen] = useState(
    () => ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
  );

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
        <span className="text-[11px] font-mono text-neutral-400 text-center flex-1">
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
            color: chosen.color,
            userSelect: 'none',
            letterSpacing: '0.04em',
            textShadow: `0 0 10px ${chosen.color}60`,
          }}
        />
      </div>
    </div>
  );
}
