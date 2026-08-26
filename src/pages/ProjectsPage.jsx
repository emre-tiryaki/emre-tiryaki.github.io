import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiX, FiFilter } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/projects/ProjectCard';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';

function extractTechs(projects) {
  const set = new Set();
  projects.forEach(p => (p.techStack || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/* ─── Multi-select Dropdown ─── */
function TechFilterDropdown({ allTechs, selected, onChange, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (tech) => {
    onChange(selected.includes(tech)
      ? selected.filter(t => t !== tech)
      : [...selected, tech]);
  };

  const hasSelection = selected.length > 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '0.7rem',
          border: open || hasSelection
            ? '1px solid rgba(249, 115, 22, 0.55)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          background: open || hasSelection
            ? 'rgba(249, 115, 22, 0.1)'
            : 'rgba(255, 255, 255, 0.035)',
          color: hasSelection ? '#fb923c' : '#a1a1aa',
          fontSize: '0.78rem',
          fontWeight: 600,
          fontFamily: 'monospace',
          cursor: 'pointer',
          boxShadow: open || hasSelection ? '0 0 14px rgba(249,115,22,0.15)' : 'none',
          transition: 'all 0.18s ease',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        <FiFilter size={12} />
        <span>
          {hasSelection
            ? t('projects.filterSelected').replace('{n}', selected.length)
            : t('projects.filterLabel')}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FiChevronDown size={13} />
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.97 }}
            transition={{ duration: 0.17, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.4rem)',
              right: 0,
              zIndex: 400,
              minWidth: '210px',
              borderRadius: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(16, 16, 22, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem 0.4rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{
                fontSize: '0.68rem', color: '#71717a',
                fontFamily: 'monospace', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {t('projects.filterTitle')}
              </span>
              {hasSelection && (
                <button
                  onClick={() => onChange([])}
                  style={{
                    fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600,
                    color: '#f87171', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '0.1rem 0.35rem',
                    borderRadius: '0.35rem', transition: 'background 0.13s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {t('projects.filterClear')}
                </button>
              )}
            </div>

            {/* Tech list */}
            <div style={{
              maxHeight: '260px', overflowY: 'auto', padding: '0.35rem',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(249,115,22,0.3) transparent',
            }}>
              {allTechs.map(tech => {
                const isActive = selected.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => toggle(tech)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      width: '100%', padding: '0.42rem 0.65rem', borderRadius: '0.55rem',
                      border: 'none',
                      background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                      color: isActive ? '#fb923c' : '#d4d4d8',
                      fontSize: '0.8rem', fontFamily: 'monospace',
                      fontWeight: isActive ? 700 : 400,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.13s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{
                      width: '0.9rem', height: '0.9rem', borderRadius: '0.22rem', flexShrink: 0,
                      border: isActive ? '1.5px solid #f97316' : '1.5px solid rgba(255,255,255,0.2)',
                      background: isActive ? 'rgba(249,115,22,0.22)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.13s ease',
                    }}>
                      {isActive && (
                        <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3L3.5 5.5L8 1" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {tech}
                  </button>
                );
              })}
            </div>

            {/* Selected pills footer */}
            {hasSelection && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.3rem',
                padding: '0.5rem 0.7rem 0.6rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {selected.map(tech => (
                  <span key={tech} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                    padding: '0.18rem 0.5rem', borderRadius: '999px',
                    background: 'rgba(249,115,22,0.12)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    color: '#fb923c', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'monospace',
                  }}>
                    {tech}
                    <button
                      onClick={() => toggle(tech)}
                      style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#fb923c', padding: 0 }}
                    >
                      <FiX size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ProjectsPage() {
  const { t } = useTranslation();
  const [selectedTechs, setSelectedTechs] = useState([]);

  const allTechs = useMemo(() => extractTechs(projectsData), []);

  const filtered = useMemo(() => {
    if (selectedTechs.length === 0) return projectsData;
    return projectsData.filter(p =>
      selectedTechs.every(tech => (p.techStack || []).includes(tech))
    );
  }, [selectedTechs]);

  const filterDropdown = (
    <TechFilterDropdown
      allTechs={allTechs}
      selected={selectedTechs}
      onChange={setSelectedTechs}
      t={t}
    />
  );

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      headerAction={filterDropdown}
      maxWidth="72rem"
      fullHeight
    >
      {/* Scrollable Project List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '0.5rem',
          paddingBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(249,115,22,0.35) transparent',
          minHeight: 0,
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
