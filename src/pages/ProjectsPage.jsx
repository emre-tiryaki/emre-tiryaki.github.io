import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiX, FiTag, FiCode } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/projects/ProjectCard';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';

function extractTechs(projects) {
  const set = new Set();
  projects.forEach(p => (p.techStack || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function extractTags(projects) {
  const set = new Set();
  projects.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/* ─── Multi-select Dropdown ─── */
function FilterDropdown({
  label,
  selectedLabel,
  title,
  clearLabel,
  items,
  selected,
  onChange,
  accentColor = '#fb923c',
  accentBg = 'rgba(249, 115, 22, 0.1)',
  accentBorder = 'rgba(249, 115, 22, 0.55)',
  accentBadgeBg = 'rgba(249, 115, 22, 0.22)',
  icon: Icon,
  itemPrefix = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (item) => {
    onChange(selected.includes(item)
      ? selected.filter(t => t !== item)
      : [...selected, item]);
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
            ? `1px solid ${accentBorder}`
            : '1px solid rgba(255, 255, 255, 0.1)',
          background: open || hasSelection
            ? accentBg
            : 'rgba(255, 255, 255, 0.035)',
          color: hasSelection ? accentColor : '#a1a1aa',
          fontSize: '0.78rem',
          fontWeight: 600,
          fontFamily: 'monospace',
          cursor: 'pointer',
          boxShadow: open || hasSelection ? `0 0 14px ${accentBg}` : 'none',
          transition: 'all 0.18s ease',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        {Icon && <Icon size={12} />}
        <span>
          {hasSelection
            ? selectedLabel.replace('{n}', selected.length)
            : label}
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
              minWidth: '220px',
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
                {title}
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
                  {clearLabel}
                </button>
              )}
            </div>

            {/* List */}
            <div style={{
              maxHeight: '260px', overflowY: 'auto', padding: '0.35rem',
              scrollbarWidth: 'thin', scrollbarColor: `${accentColor}33 transparent`,
            }}>
              {items.map(item => {
                const isActive = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      width: '100%', padding: '0.42rem 0.65rem', borderRadius: '0.55rem',
                      border: 'none',
                      background: isActive ? accentBg : 'transparent',
                      color: isActive ? accentColor : '#d4d4d8',
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
                      border: isActive ? `1.5px solid ${accentColor}` : '1.5px solid rgba(255,255,255,0.2)',
                      background: isActive ? accentBadgeBg : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.13s ease',
                    }}>
                      {isActive && (
                        <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3L3.5 5.5L8 1" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {itemPrefix && <span>{itemPrefix}</span>}
                    {item}
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
                {selected.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                    padding: '0.2rem 0.55rem', borderRadius: '0.45rem',
                    background: accentBg,
                    border: `1px solid ${accentBorder}`,
                    color: accentColor, fontSize: '0.72rem', fontWeight: 600, fontFamily: 'monospace',
                  }}>
                    {itemPrefix}{item}
                    <button
                      onClick={() => toggle(item)}
                      style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: accentColor, padding: 0 }}
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
  const [selectedTags, setSelectedTags] = useState([]);

  const allTechs = useMemo(() => extractTechs(projectsData), []);
  const allTags  = useMemo(() => extractTags(projectsData), []);

  const handleToggleTech = (tech) => {
    setSelectedTechs(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => {
    return projectsData.filter(p => {
      const matchTechs = selectedTechs.length === 0 || selectedTechs.every(tech => (p.techStack || []).includes(tech));
      const matchTags  = selectedTags.length === 0 || selectedTags.every(tag => (p.tags || []).includes(tag));
      return matchTechs && matchTags;
    });
  }, [selectedTechs, selectedTags]);

  const filterActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
      <FilterDropdown
        label={t('projects.filterTagsLabel')}
        selectedLabel={t('projects.filterTagsSelected')}
        title={t('projects.filterTagsTitle')}
        clearLabel={t('projects.filterClear')}
        items={allTags}
        selected={selectedTags}
        onChange={setSelectedTags}
        accentColor="#a78bfa"
        accentBg="rgba(139, 92, 246, 0.12)"
        accentBorder="rgba(139, 92, 246, 0.5)"
        accentBadgeBg="rgba(139, 92, 246, 0.22)"
        icon={FiTag}
        itemPrefix="#"
      />
      <FilterDropdown
        label={t('projects.filterTechLabel')}
        selectedLabel={t('projects.filterTechSelected')}
        title={t('projects.filterTechTitle')}
        clearLabel={t('projects.filterClear')}
        items={allTechs}
        selected={selectedTechs}
        onChange={setSelectedTechs}
        accentColor="#fb923c"
        accentBg="rgba(249, 115, 22, 0.12)"
        accentBorder="rgba(249, 115, 22, 0.5)"
        accentBadgeBg="rgba(249, 115, 22, 0.22)"
        icon={FiCode}
      />
    </div>
  );

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      headerAction={filterActions}
      maxWidth="86rem"
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
          gap: '1.75rem',
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
            filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  selectedTechs={selectedTechs}
                  selectedTags={selectedTags}
                  onToggleTech={handleToggleTech}
                  onToggleTag={handleToggleTag}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
