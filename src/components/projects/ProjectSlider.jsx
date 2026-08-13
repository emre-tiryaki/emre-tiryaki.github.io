import { useState, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useTranslation } from '../../hooks/useTranslation';

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function ProjectSlider({ projects }) {
  const { t } = useTranslation();
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback((dir) => {
    setPage(([p]) => {
      const next = Math.min(Math.max(p + dir, 0), projects.length - 1);
      return [next, dir];
    });
  }, [projects.length]);

  const canPrev = page > 0;
  const canNext = page < projects.length - 1;

  return (
    <div className="w-full space-y-6">
      {/* Slider viewport — overflow-hidden, side peeks via negative mx */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 460 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="w-full"
          >
            <ProjectCard project={projects[page]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-6">
        {/* Prev */}
        <button
          onClick={() => paginate(-1)}
          disabled={!canPrev}
          aria-label={t('projects.prev')}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: canPrev ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${canPrev ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: canPrev ? '#fb923c' : '#4b5563',
            cursor: canPrev ? 'pointer' : 'default',
          }}
        >
          <FiChevronLeft size={22} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(([p]) => [i, i > p ? 1 : -1])}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === page ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: i === page ? '#f97316' : 'rgba(255,255,255,0.15)',
                boxShadow: i === page ? '0 0 10px rgba(249,115,22,0.6)' : 'none',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: 'none',
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => paginate(1)}
          disabled={!canNext}
          aria-label={t('projects.next')}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: canNext ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${canNext ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: canNext ? '#fb923c' : '#4b5563',
            cursor: canNext ? 'pointer' : 'default',
          }}
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {/* Indicator text */}
      <p className="text-center text-xs font-mono text-neutral-500">
        {page + 1} / {projects.length}
      </p>
    </div>
  );
}
