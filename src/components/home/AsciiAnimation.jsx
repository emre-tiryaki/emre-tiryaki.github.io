import { useEffect, useRef, useMemo } from 'react';
import { createSpinningDonut } from './ascii/SpinningDonut';
import { createRotatingCube } from './ascii/RotatingCube';
import { createMatrixRain } from './ascii/MatrixRain';
import { createSpinningGlobe } from './ascii/SpinningGlobe';

const ANIMATIONS = [
  { id: 'donut', create: createSpinningDonut, color: '#22c55e', label: 'Torus Donut 3D' },
  { id: 'cube', create: createRotatingCube, color: '#06b6d4', label: 'Rotating Cube 3D' },
  { id: 'matrix', create: createMatrixRain, color: '#22c55e', label: 'Matrix Digital Rain' },
  { id: 'globe', create: createSpinningGlobe, color: '#f97316', label: 'Rotating Sphere 3D' },
];

export default function AsciiAnimation() {
  const preRef = useRef(null);
  const chosen = useMemo(
    () => ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)],
    []
  );

  useEffect(() => {
    if (!preRef.current) return;
    const cleanup = chosen.create(preRef.current);
    return cleanup;
  }, [chosen]);

  return (
    <div className="w-full max-w-xl rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Terminal top bar — semi-transparent */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(20,20,20,0.6)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[11px] font-mono text-neutral-500">{chosen.label}</span>
        <div className="w-14" />
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
