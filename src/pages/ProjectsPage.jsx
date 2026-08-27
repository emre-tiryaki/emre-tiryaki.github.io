import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiCode, FiRotateCcw } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/projects/ProjectCard';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';
import { PROJECT_CATEGORY_CONFIG, FILTER_THEME_CONFIG } from '../theme';

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

/* ─── Main Page ─── */
export default function ProjectsPage() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState([]); // 'hackathon' | 'personal'
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [tagsScrollRef, tagsMaskStyle] = useScrollMask('vertical', 24);
  const [projectsScrollRef, projectsMaskStyle] = useScrollMask('vertical', 28);
  const [techsScrollRef, techsMaskStyle] = useScrollMask('vertical', 24);

  const allTechs = useMemo(() => extractTechs(projectsData), []);
  const allTags  = useMemo(() => extractTags(projectsData), []);

  const hackathonCount = useMemo(() => projectsData.filter(p => p.isHackathon).length, []);
  const personalCount  = useMemo(() => projectsData.filter(p => !p.isHackathon).length, []);

  const handleToggleCategory = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleToggleTech = (tech) => {
    setSelectedTechs(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTechs([]);
    setSelectedTags([]);
  };

  const filtered = useMemo(() => {
    return projectsData.filter(p => {
      // Category filter
      const matchCategory =
        selectedCategories.length === 0 ||
        (selectedCategories.includes('hackathon') && p.isHackathon) ||
        (selectedCategories.includes('personal') && !p.isHackathon);

      // Techs filter
      const matchTechs =
        selectedTechs.length === 0 ||
        selectedTechs.every(tech => (p.techStack || []).includes(tech));

      // Tags filter
      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => (p.tags || []).includes(tag));

      return matchCategory && matchTechs && matchTags;
    });
  }, [selectedCategories, selectedTechs, selectedTags]);

  const hasAnyFilter = selectedCategories.length > 0 || selectedTags.length > 0 || selectedTechs.length > 0;

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      maxWidth="100%"
      fullHeight
    >
      {/* ── 3-Column Layout: Left (Categories & Tags), Middle (Cards), Right (Tech) ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: '1.5rem',
          minHeight: 0,
          width: '100%',
          maxWidth: '118rem',
          margin: '0 auto',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          overflow: 'hidden',
        }}
      >
        {/* ── LEFT COLUMN: Project Categories & Tags (Desktop) ── */}
        <aside
          className="hidden lg:flex flex-col gap-2.5"
          style={{
            width: '210px',
            flexShrink: 0,
            height: '100%',
            minHeight: 0,
            paddingTop: '0.25rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: FILTER_THEME_CONFIG.tags.headerColor,
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <FiTag size={13} style={{ color: FILTER_THEME_CONFIG.tags.iconColor }} />
              <span>{t('projects.tags')}</span>
            </div>

            {(selectedCategories.length > 0 || selectedTags.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedTags([]);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '0.35rem',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {t('projects.filterClear')}
              </button>
            )}
          </div>

          {/* Scrollable Categories & Tags Container */}
          <div
            ref={tagsScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              paddingRight: '0.35rem',
              paddingBottom: '2.5rem',
              scrollbarWidth: 'thin',
              scrollbarColor: `${FILTER_THEME_CONFIG.tags.scrollbarColor} transparent`,
              minHeight: 0,
              ...tagsMaskStyle,
            }}
          >
            {/* 1. Category Filters: Hackathon & Personal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {/* Hackathon Projects Button */}
              {(() => {
                const isHackActive = selectedCategories.includes('hackathon');
                const cfg = PROJECT_CATEGORY_CONFIG.hackathon;
                return (
                  <button
                    type="button"
                    onClick={() => handleToggleCategory('hackathon')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '0.65rem',
                      border: '1px solid',
                      borderColor: isHackActive ? cfg.borderActive : cfg.borderInactive,
                      background: isHackActive ? cfg.bgActive : cfg.bgInactive,
                      color: isHackActive ? cfg.textActive : cfg.textInactive,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isHackActive ? `0 0 14px ${cfg.glow}` : 'none',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!isHackActive) {
                        e.currentTarget.style.background = cfg.bgActive;
                        e.currentTarget.style.borderColor = cfg.borderActive;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isHackActive) {
                        e.currentTarget.style.background = cfg.bgInactive;
                        e.currentTarget.style.borderColor = cfg.borderInactive;
                      }
                    }}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{cfg.symbol}</span>
                      <span>{t('projects.filterHackathon')}</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '999px',
                        background: isHackActive ? cfg.borderActive : 'rgba(255, 255, 255, 0.08)',
                        color: isHackActive ? '#fff' : cfg.color,
                        fontWeight: 700,
                        marginLeft: '0.3rem',
                        flexShrink: 0,
                      }}
                    >
                      {hackathonCount}
                    </span>
                  </button>
                );
              })()}

              {/* Personal Projects Button */}
              {(() => {
                const isPersonalActive = selectedCategories.includes('personal');
                const cfg = PROJECT_CATEGORY_CONFIG.personal;
                return (
                  <button
                    type="button"
                    onClick={() => handleToggleCategory('personal')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '0.65rem',
                      border: '1px solid',
                      borderColor: isPersonalActive ? cfg.borderActive : cfg.borderInactive,
                      background: isPersonalActive ? cfg.bgActive : cfg.bgInactive,
                      color: isPersonalActive ? cfg.textActive : cfg.textInactive,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isPersonalActive ? `0 0 14px ${cfg.glow}` : 'none',
                      transition: 'all 0.15s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!isPersonalActive) {
                        e.currentTarget.style.background = cfg.bgActive;
                        e.currentTarget.style.borderColor = cfg.borderActive;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPersonalActive) {
                        e.currentTarget.style.background = cfg.bgInactive;
                        e.currentTarget.style.borderColor = cfg.borderInactive;
                      }
                    }}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{cfg.symbol}</span>
                      <span>{t('projects.filterPersonal')}</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '999px',
                        background: isPersonalActive ? cfg.borderActive : 'rgba(255, 255, 255, 0.08)',
                        color: isPersonalActive ? '#fff' : cfg.color,
                        fontWeight: 700,
                        marginLeft: '0.3rem',
                        flexShrink: 0,
                      }}
                    >
                      {personalCount}
                    </span>
                  </button>
                );
              })()}
            </div>

            {/* Separator */}
            <div
              style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.07)',
                margin: '0.25rem 0 0.5rem',
              }}
            />

            {/* 2. Technical Tags */}
            {allTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              const cfg = FILTER_THEME_CONFIG.tags;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.42rem 0.75rem',
                    borderRadius: '0.6rem',
                    border: '1px solid',
                    borderColor: isActive ? cfg.borderActive : cfg.borderInactive,
                    background: isActive ? cfg.bgActive : cfg.bgInactive,
                    color: isActive ? cfg.textActive : cfg.textInactive,
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 12px ${cfg.glow}` : 'none',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#f4f4f5';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = cfg.bgInactive;
                      e.currentTarget.style.color = cfg.textInactive;
                      e.currentTarget.style.borderColor = cfg.borderInactive;
                    }
                  }}
                >
                  <span className="truncate">#{tag}</span>
                  {isActive && <FiX size={12} style={{ color: cfg.textActive, flexShrink: 0, marginLeft: '0.3rem' }} />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── MIDDLE: Scrollable Project Cards List ── */}
        <div
          ref={projectsScrollRef}
          style={{
            flex: '1 1 86rem',
            maxWidth: '86rem',
            minWidth: 0,
            height: '100%',
            overflowY: 'auto',
            paddingTop: '0.25rem',
            paddingRight: '0.5rem',
            paddingBottom: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(249,115,22,0.35) transparent',
            ...projectsMaskStyle,
          }}
        >
          {/* Mobile Filter Chips Bar (Visible only on small screens < lg) */}
          <div className="lg:hidden flex flex-col gap-2 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {t('projects.filterLabel')}
              </span>
              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-400 hover:underline"
                >
                  {t('projects.filterClear')}
                </button>
              )}
            </div>

            {/* Horizontal Scroll Categories and Tags on Mobile */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none' }}
            >
              <button
                type="button"
                onClick={() => handleToggleCategory('hackathon')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: selectedCategories.includes('hackathon') ? 700 : 500,
                  background: selectedCategories.includes('hackathon') ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.08)',
                  border: selectedCategories.includes('hackathon') ? '1px solid rgba(168, 85, 247, 0.7)' : '1px solid rgba(168, 85, 247, 0.25)',
                  color: selectedCategories.includes('hackathon') ? '#f3e8ff' : '#d8b4fe',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                ⚡ {t('projects.filterHackathon')}
              </button>
              <button
                type="button"
                onClick={() => handleToggleCategory('personal')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: selectedCategories.includes('personal') ? 700 : 500,
                  background: selectedCategories.includes('personal') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.08)',
                  border: selectedCategories.includes('personal') ? '1px solid rgba(59, 130, 246, 0.7)' : '1px solid rgba(59, 130, 246, 0.25)',
                  color: selectedCategories.includes('personal') ? '#eff6ff' : '#93c5fd',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                💻 {t('projects.filterPersonal')}
              </button>
              {allTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '0.45rem',
                      fontSize: '0.72rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(139, 92, 246, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                      border: isActive ? '1px solid rgba(167, 139, 250, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#e9d5ff' : '#a1a1aa',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Cards */}
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
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  padding: '4rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <p style={{ margin: 0 }}>{t('projects.noResults')}</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    background: 'rgba(249, 115, 22, 0.14)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    color: '#fb923c',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(249, 115, 22, 0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(249, 115, 22, 0.14)';
                  }}
                >
                  <FiRotateCcw size={13} />
                  <span>{t('projects.filterClear')}</span>
                </button>
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

        {/* ── RIGHT COLUMN: Technology Filters (Desktop) ── */}
        <aside
          className="hidden lg:flex flex-col gap-2.5"
          style={{
            width: '210px',
            flexShrink: 0,
            height: '100%',
            minHeight: 0,
            paddingTop: '0.25rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: FILTER_THEME_CONFIG.tech.headerColor,
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <FiCode size={13} style={{ color: FILTER_THEME_CONFIG.tech.iconColor }} />
              <span>{t('projects.techStack')}</span>
            </div>

            {selectedTechs.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTechs([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '0.35rem',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {t('projects.filterClear')}
              </button>
            )}
          </div>

          {/* Techs Scrollable List */}
          <div
            ref={techsScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              paddingRight: '0.35rem',
              paddingBottom: '2.5rem',
              scrollbarWidth: 'thin',
              scrollbarColor: `${FILTER_THEME_CONFIG.tech.scrollbarColor} transparent`,
              minHeight: 0,
              ...techsMaskStyle,
            }}
          >
            {allTechs.map((tech) => {
              const isActive = selectedTechs.includes(tech);
              const cfg = FILTER_THEME_CONFIG.tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleToggleTech(tech)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.42rem 0.75rem',
                    borderRadius: '0.6rem',
                    border: '1px solid',
                    borderColor: isActive ? cfg.borderActive : cfg.borderInactive,
                    background: isActive ? cfg.bgActive : cfg.bgInactive,
                    color: isActive ? cfg.textActive : cfg.textInactive,
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 12px ${cfg.glow}` : 'none',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#f4f4f5';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = cfg.bgInactive;
                      e.currentTarget.style.color = cfg.textInactive;
                      e.currentTarget.style.borderColor = cfg.borderInactive;
                    }
                  }}
                >
                  <span className="truncate">{tech}</span>
                  {isActive && <FiX size={12} style={{ color: cfg.iconColor, flexShrink: 0, marginLeft: '0.3rem' }} />}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
