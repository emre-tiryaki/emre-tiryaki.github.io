import { useEffect, useRef, useMemo } from 'react';
import { createSpinningDonut } from './ascii/SpinningDonut';
import { createRotatingCube } from './ascii/RotatingCube';
import { createMatrixRain } from './ascii/MatrixRain';
import { createSpinningGlobe } from './ascii/SpinningGlobe';

const ANIMATIONS = [
  { id: 'donut', create: createSpinningDonut, color: '#22c55e', label: 'Donut' },
  { id: 'cube', create: createRotatingCube, color: '#06b6d4', label: 'Cube' },
  { id: 'matrix', create: createMatrixRain, color: '#22c55e', label: 'Matrix' },
  { id: 'globe', create: createSpinningGlobe, color: '#f97316', label: 'Globe' },
];

export default function AsciiAnimation() {
  const preRef = useRef(null);
  // Pick a random animation once on mount (stable for this page visit)
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
    <div className="flex flex-col items-center">
      <pre
        ref={preRef}
        aria-hidden="true"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(7px, 1.1vw, 13px)',
          lineHeight: '1.2',
          color: chosen.color,
          userSelect: 'none',
          minHeight: '200px',
          letterSpacing: '0.05em',
        }}
      />
      <span className="mt-2 text-xs font-mono text-neutral-600 uppercase tracking-widest">
        {chosen.label}
      </span>
    </div>
  );
}
