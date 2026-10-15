import { useState, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import ProjectListCard from '../components/projects/ProjectListCard';
import ProjectDetailView from '../components/projects/ProjectDetailView';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';
import { PROJECT_CATEGORY_CONFIG } from '../theme';
import Button from '../components/ui/Button';

/* Category key → dot color lookup */
const CATEGORY_DOT_COLOR = {
  all:         '#f97316',
  competition: PROJECT_CATEGORY_CONFIG.competition.color,
  hackathon:   PROJECT_CATEGORY_CONFIG.hackathon.color,
  openSource:  PROJECT_CATEGORY_CONFIG.openSource.color,
};

const AVAILABLE_CATEGORIES = ['all', 'competition', 'hackathon', 'openSource'];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const [listRef, listMaskStyle]     = useScrollMask('vertical', 24);
  const [detailRef, detailMaskStyle] = useScrollMask('vertical', 28);

  /* ── Filtered project list ── */
  const filtered = useMemo(() => {
    switch (activeCategory) {
      case 'competition': return projectsData.filter((p) => p.isCompetition);
      case 'hackathon':   return projectsData.filter((p) => p.isHackathon);
      case 'openSource':  return projectsData.filter((p) => p.isOpenSource);
      default:            return projectsData;
    }
  }, [activeCategory]);

  /* ── Active project (persists selection if still visible after filter change) ── */
  const activeProject = useMemo(() => {
    if (!selectedId) return null;
    return filtered.find((p) => p.id === selectedId) || null;
  }, [selectedId, filtered]);

  const handleCardClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    // keep selected project only if it is still in the filtered list
    // (the activeProject memo handles deselection automatically)
  };

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      maxWidth="100%"
      fullHeight
    >
      {/* ── 3-Column Body ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '1.5rem',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none',
        }}
      >
        {/* ══ LEFT: Scrollable project list ══ */}
        <div
          style={{
            width: '400px',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            ref={listRef}
            style={{
              height: '100%',
              overflowY: 'auto',
              paddingTop: '1.25rem',
              paddingBottom: '2.5rem',
              paddingLeft: '1.25rem',
              paddingRight: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(249, 115, 22, 0.3) transparent',
              ...listMaskStyle,
            }}
          >
            {filtered.length === 0 ? (
              <p
                style={{
                  margin: '2rem auto',
                  fontSize: '0.88rem',
                  color: '#475569',
                  textAlign: 'center',
                }}
              >
                {t('projects.noResults')}
              </p>
            ) : (
              filtered.map((project) => (
                <ProjectListCard
                  key={project.id}
                  project={project}
                  isSelected={activeProject?.id === project.id}
                  onClick={() => handleCardClick(project.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ══ MIDDLE: Scrollable project detail ══ */}
        <div
          ref={detailRef}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '1rem',
            paddingRight: '0.65rem',
            paddingBottom: '2.5rem',
            boxSizing: 'border-box',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(249, 115, 22, 0.35) transparent',
            ...detailMaskStyle,
          }}
        >
          <ProjectDetailView project={activeProject} />
        </div>

        {/* ══ RIGHT: Category filter sidebar ══ */}
        <div
          style={{
            width: '180px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.5rem',
            minHeight: 0,
          }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
            }}
          >
            {t('projects.filter')}
          </p>

          {AVAILABLE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const dotColor = CATEGORY_DOT_COLOR[cat] || null;
            return (
              <Button
                key={cat}
                variant="secondary"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '0.65rem',
                  background: isActive
                    ? dotColor
                      ? `${dotColor}20`
                      : 'rgba(249, 115, 22, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                  boxShadow:
                    isActive && dotColor
                      ? `inset 0 0 0 1.5px ${dotColor}70, 0 0 12px ${dotColor}25`
                      : 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
                  color: isActive ? dotColor || '#f97316' : '#94a3b8',
                  transition: 'all 0.18s ease',
                }}
              >
                {dotColor && (
                  <span
                    style={{
                      width: '0.55rem',
                      height: '0.55rem',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: dotColor,
                      boxShadow: isActive ? `0 0 8px ${dotColor}` : 'none',
                    }}
                  />
                )}
                <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.82rem' }}>
                  {t(`projects.categories.${cat}`)}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
