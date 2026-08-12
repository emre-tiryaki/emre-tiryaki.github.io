import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function AnimatedStars() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group ref={ref}>
      <Stars
        radius={100}
        depth={50}
        count={typeof window !== 'undefined' && window.innerWidth < 768 ? 2000 : 5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
}

export default function StarfieldBackground() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <AnimatedStars />
      </Canvas>
    </div>
  );
}
