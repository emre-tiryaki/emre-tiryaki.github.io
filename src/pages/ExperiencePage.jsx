import { useState, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import ExperienceCard from '../components/experience/ExperienceCard';
import ExperienceDetailView from '../components/experience/ExperienceDetailView';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';
import Button from '../components/ui/Button';

const MONTHS = {
  ocak: 0, subat: 1, şubat: 1, mart: 2, nisan: 3, mayis: 4, mayıs: 4,
  haziran: 5, temmuz: 6, agustos: 7, ağustos: 7, eylul: 8, eylül: 8,
  ekim: 9, kasim: 10, kasım: 10, aralik: 11, aralık: 11,
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function normalizeText(val) {
  if (!val) return '';
  return String(val).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function getSortValue(item) {
  const raw = typeof item.startDate === 'object' ? item.startDate.tr : (item.startDate || item.date?.tr || item.date || '');
  const n = normalizeText(raw);
  const parts = n.split(/\s+/);
  let year = null; let month = 0;
  for (const p of parts) {
    const num = parseInt(p, 10);
    if (num > 1900 && num < 2100) year = num;
    if (MONTHS[p] !== undefined) month = MONTHS[p];
  }
  return year !== null ? year * 12 + month : -Infinity;
}

const TYPE_DOT_COLOR = {
  internship:  '#f97316',
  hackathon:   '#22c55e',
  competition: '#eab308',
  work:        '#3b82f6',
};

export default function ExperiencePage() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const availableTypes = useMemo(
    () => ['all', ...Array.from(new Set(experienceData.map(e => e.type)))],
    []
  );

  const sorted = useMemo(
    () => [...experienceData].sort((a, b) => getSortValue(b) - getSortValue(a)),
    []
  );

  const filtered = useMemo(
    () => activeType === 'all' ? sorted : sorted.filter(e => e.type === activeType),
    [activeType, sorted]
  );

  const activeExperience = useMemo(() => {
    if (!selectedId) return null;
    return filtered.find(e => e.id === selectedId) || null;
  }, [selectedId, filtered]);

  const handleCardClick = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  return (
    <PageLayout
      title={t('experience.title')}
      subtitle={t('experience.subtitle')}
      maxWidth="100%"
      fullHeight
    >
      {/* Body: 3-column layout filling remaining height */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '1.5rem',
        overflow: 'hidden',
        minHeight: 0,
        userSelect: 'none',
      }}>

        {/* ── LEFT: Scrollable experience timeline ── */}
        <div style={{
          width: '470px',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Scrollable list with generous padding so glows and shadows are never clipped */}
          <div
            className="scroll-mask-y"
            style={{
              height: '100%',
              overflowY: 'auto',
              paddingTop: '1.25rem',
              paddingBottom: '2.5rem',
              paddingLeft: '1.25rem',
              paddingRight: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(249, 115, 22, 0.3) transparent',
            }}
          >
            {filtered.map((item, index) => {
              const dotColor = TYPE_DOT_COLOR[item.type] || '#f97316';
              const nextItem = filtered[index + 1];
              const nextColor = nextItem ? (TYPE_DOT_COLOR[nextItem.type] || '#f97316') : null;
              const isSelected = activeExperience?.id === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '1.25rem',
                    position: 'relative',
                  }}
                >
                  {/* Left Column: Node + Connector to next node */}
                  <div
                    style={{
                      width: '2.25rem',
                      flexShrink: 0,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* Glowing Concentric Jewel Node on the line */}
                    <div
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        marginTop: '1.2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'radial-gradient(circle at center, rgba(26,26,32,0.98) 0%, rgba(10,10,14,0.98) 100%)',
                        border: isSelected ? `2px solid ${dotColor}` : `1.5px solid ${dotColor}`,
                        boxShadow: isSelected
                          ? `0 0 22px ${dotColor}, 0 0 8px ${dotColor}, inset 0 0 10px ${dotColor}`
                          : `0 0 14px ${dotColor}55, 0 0 6px ${dotColor}80, inset 0 0 8px ${dotColor}25`,
                        position: 'relative',
                        zIndex: 3,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '1.15rem',
                          height: '1.15rem',
                          borderRadius: '50%',
                          background: `${dotColor}18`,
                          border: `1px solid ${dotColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '0.45rem',
                            height: '0.45rem',
                            borderRadius: '50%',
                            background: dotColor,
                            boxShadow: `0 0 8px ${dotColor}`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Dynamic Gradient Connector line to the next dot */}
                    {nextColor && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '3.45rem',
                          bottom: '-2.45rem',
                          width: '2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: `linear-gradient(to bottom, ${dotColor} 0%, ${nextColor} 100%)`,
                          boxShadow: `0 0 8px ${dotColor}40`,
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: '-2px -2px',
                            background: `linear-gradient(to bottom, ${dotColor}50 0%, ${nextColor}50 100%)`,
                            filter: 'blur(3px)',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <ExperienceCard
                      {...item}
                      isSelected={isSelected}
                      onClick={() => handleCardClick(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MIDDLE: Scrollable Experience Detail View ── */}
        <div
          className="scroll-mask-y"
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            overflowY: 'auto',
            paddingTop: '1rem',
            paddingRight: '0.65rem',
            paddingBottom: '2.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(249, 115, 22, 0.35) transparent',
          }}
        >
          <ExperienceDetailView
            experience={activeExperience}
            projectsData={projectsData}
          />
        </div>

        {/* ── RIGHT: Filter sidebar ── */}
        <div style={{
          width: '180px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          paddingTop: '0.25rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Filtrele
          </p>
          {availableTypes.map((type) => {
            const isActive = activeType === type;
            const dotColor = TYPE_DOT_COLOR[type] || null;
            return (
              <Button
                key={type}
                variant="secondary"
                onClick={() => setActiveType(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  justifyContent: 'flex-start', width: '100%',
                  background: isActive ? (dotColor ? `${dotColor}20` : 'rgba(249,115,22,0.15)') : 'rgba(255,255,255,0.04)',
                  boxShadow: isActive && dotColor ? `inset 0 0 0 1px ${dotColor}60` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                  color: isActive ? (dotColor || '#f97316') : '#94a3b8',
                }}
              >
                {dotColor && (
                  <span style={{
                    width: '0.55rem', height: '0.55rem', borderRadius: '50%', flexShrink: 0,
                    background: dotColor,
                    boxShadow: isActive ? `0 0 8px ${dotColor}` : 'none',
                  }} />
                )}
                {t(`experience.types.${type}`)}
              </Button>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
