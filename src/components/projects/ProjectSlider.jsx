import { useState, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useTranslation } from '../../hooks/translation';

const variants = {
  enter: (dir) => ({ x: dir >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function ProjectSlider({ projects }) {
  const { t } = useTranslation();
  const [[page, direction], setPage] = useState([0, 0]);
  const total = projects.length;

  /* Circular navigation */
  const paginate = useCallback((dir) => {
    setPage(([p]) => {
      const next = (p + dir + total) % total;   // wraps around
      return [next, dir];
    });
  }, [total]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      overflow: 'hidden',
    }}>
      {/* Card viewport — fills all available height */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', borderRadius: '1.25rem' }}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.32, ease: [0.25, 1, 0.5, 1] },
              opacity: { duration: 0.25 },
            }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <ProjectCard project={projects[page]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', flexShrink: 0, paddingBottom: '0.5rem',
      }}>
        {/* Prev */}
        <button
          onClick={() => paginate(-1)}
          aria-label={t('projects.prev')}
          style={{
            width: '2.75rem', height: '2.75rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.5)',
            color: '#fb923c', cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.3)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; e.currentTarget.style.transform = ''; }}
        >
          <FiChevronLeft size={22} />
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(([p]) => [i, i > p ? 1 : -1])}
              aria-label={t('projects.projectN', { n: i + 1 })}
              style={{
                width: i === page ? '1.75rem' : '0.625rem',
                height: '0.625rem',
                borderRadius: '999px',
                background: i === page ? '#f97316' : 'rgba(255,255,255,0.18)',
                boxShadow: i === page ? '0 0 10px rgba(249,115,22,0.6)' : 'none',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => paginate(1)}
          aria-label={t('projects.next')}
          style={{
            width: '2.75rem', height: '2.75rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.5)',
            color: '#fb923c', cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.3)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; e.currentTarget.style.transform = ''; }}
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {/* Counter */}
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', flexShrink: 0, marginTop: '-0.5rem', paddingBottom: '0.25rem' }}>
        {page + 1} / {total}
      </p>
    </div>
  );
}
