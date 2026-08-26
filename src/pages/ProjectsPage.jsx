import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/projects/ProjectCard';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';

function extractTechs(projects) {
  const set = new Set();
  projects.forEach(p => (p.techStack || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [activeTech, setActiveTech] = useState('all');

  const allTechs = useMemo(() => extractTechs(projectsData), []);

  const filtered = useMemo(() => {
    if (activeTech === 'all') return projectsData;
    return projectsData.filter(p =>
      (p.techStack || []).some(t => t === activeTech)
    );
  }, [activeTech]);

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      maxWidth="100%"
      fullHeight
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* ── Filter Bar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            paddingBottom: '1.25rem',
            flexShrink: 0,
          }}
        >
          {/* "All" pill */}
          <FilterPill
            label={t('projects.filterAll')}
            active={activeTech === 'all'}
            onClick={() => setActiveTech('all')}
          />
          {allTechs.map(tech => (
            <FilterPill
              key={tech}
              label={tech}
              active={activeTech === tech}
              onClick={() => setActiveTech(tech)}
            />
          ))}
        </div>

        {/* ── Scrollable Project List ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.5rem',
            paddingBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            /* custom scrollbar */
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(249,115,22,0.35) transparent',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                style={{
                  textAlign: 'center',
                  color: '#52525b',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  padding: '4rem 0',
                }}
              >
                {t('projects.noResults')}
              </motion.div>
            ) : (
              filtered.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                  style={{ minHeight: '380px' }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 1rem',
        borderRadius: '999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        fontFamily: 'monospace',
        cursor: 'pointer',
        border: active
          ? '1px solid rgba(249, 115, 22, 0.65)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        background: active
          ? 'rgba(249, 115, 22, 0.15)'
          : 'rgba(255, 255, 255, 0.035)',
        color: active ? '#fb923c' : '#a1a1aa',
        boxShadow: active
          ? '0 0 14px rgba(249, 115, 22, 0.2)'
          : 'none',
        transition: 'all 0.18s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.35)';
          e.currentTarget.style.color = '#d4d4d8';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = '#a1a1aa';
        }
      }}
    >
      {label}
    </button>
  );
}
