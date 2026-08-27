import { useState } from 'react';
import { motion } from 'framer-motion';

const TRANSITIONS = [
  // 1. Fade & Blur (Cinematic Glass)
  {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, filter: 'blur(8px)' },
    transition: { duration: 0.24, ease: 'easeInOut' },
  },
  // 2. Scale In (Smooth Depth Zoom)
  {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 1.03 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
  // 3. Scale Out (Reverse Depth)
  {
    initial: { opacity: 0, scale: 1.04 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.96 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
  // 4. Slide Right to Left
  {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -28 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
  // 5. Slide Left to Right
  {
    initial: { opacity: 0, x: -28 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: 28 },
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
  // 6. Perspective Tilt
  {
    initial: { opacity: 0, rotateY: 4, scale: 0.98 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    exit:    { opacity: 0, rotateY: -4, scale: 0.98 },
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
];

function getNextTransition() {
  let lastIndex = -1;
  try {
    const stored = sessionStorage.getItem('last_page_transition');
    if (stored !== null) lastIndex = parseInt(stored, 10);
  } catch {
    // Ignored
  }

  let nextIndex = Math.floor(Math.random() * TRANSITIONS.length);
  if (nextIndex === lastIndex && TRANSITIONS.length > 1) {
    nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (TRANSITIONS.length - 1))) % TRANSITIONS.length;
  }

  try {
    sessionStorage.setItem('last_page_transition', String(nextIndex));
  } catch {
    // Ignored
  }

  return TRANSITIONS[nextIndex];
}

export default function PageTransition({ children }) {
  const [selected] = useState(() => getNextTransition());

  return (
    <motion.div
      initial={selected.initial}
      animate={selected.animate}
      exit={selected.exit}
      transition={selected.transition}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
