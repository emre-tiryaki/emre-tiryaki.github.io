import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ExperienceCard from '../components/experience/ExperienceCard';
import TimelineNode from '../components/experience/TimelineNode';
import ExperienceDetailView from '../components/experience/ExperienceDetailView';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';
import { EXPERIENCE_TYPE_CONFIG } from '../theme';
import Button from '../components/ui/Button';
import FilterChips from '../components/ui/FilterChips';
import MobileSheet from '../components/ui/MobileSheet';
import { useMediaQuery, MEDIA } from '../hooks/useMediaQuery';

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
  return year ? year * 100 + month : 0;
}

export default function ExperiencePage() {
  const { t } = useTranslation();
  const isCompact = useMediaQuery(MEDIA.COMPACT);
  const isPhone = useMediaQuery(MEDIA.PHONE);
  const [activeType, setActiveType] = useState('all');
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(() => searchParams.get('exp'));

  const [timelineRef, timelineMaskStyle] = useScrollMask('vertical', 24);
  const [detailRef, detailMaskStyle] = useScrollMask('vertical', 28);

  const TYPE_DOT_COLOR = useMemo(
    () => ({
      internship: EXPERIENCE_TYPE_CONFIG.internship.dotColor,
      hackathon: EXPERIENCE_TYPE_CONFIG.hackathon.dotColor,
      competition: EXPERIENCE_TYPE_CONFIG.competition.dotColor,
      work: EXPERIENCE_TYPE_CONFIG.work.dotColor,
    }),
    []
  );

  const availableTypes = useMemo(
    () => ['all', 'internship', 'hackathon', 'competition', 'work'],
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

  const timelineItems = (
    filtered.map((item, index) => {
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
            gap: isPhone ? '0.75rem' : '1.25rem',
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
            <TimelineNode color={dotColor} selected={isSelected} style={{ marginTop: '1.2rem' }} />

            {/* Dynamic Gradient Connector line to the next dot */}
            {nextColor && (
              <div
                style={{
                  position: 'absolute',
                  top: '3.45rem',
                  bottom: isCompact ? '-2.2rem' : '-2.45rem',
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
    })
  );

  const typeChipOptions = availableTypes.map((type) => ({
    key: type,
    label: t(`experience.types.${type}`),
    color: TYPE_DOT_COLOR[type] || null,
  }));

  /* ── Dar ekran (lg altı): filtre çipleri + tam genişlik liste + tam ekran detay ── */
  if (isCompact) {
    return (
      <PageLayout
        title={t('experience.title')}
        subtitle={t('experience.subtitle')}
        maxWidth="48rem"
        fullHeight
      >
        <FilterChips
          label={t('experience.filter')}
          options={typeChipOptions}
          active={activeType}
          onChange={setActiveType}
        />
        <div
          ref={timelineRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            paddingTop: '0.75rem',
            paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
            paddingLeft: isPhone ? '0.15rem' : '0.5rem',
            paddingRight: isPhone ? '0.15rem' : '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            userSelect: 'none',
            ...timelineMaskStyle,
          }}
        >
          {timelineItems}
        </div>

        <MobileSheet
          open={Boolean(activeExperience)}
          onClose={() => setSelectedId(null)}
          title={activeExperience?.company || t('experience.title')}
        >
          <ExperienceDetailView experience={activeExperience} projectsData={projectsData} />
        </MobileSheet>
      </PageLayout>
    );
  }

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
            ref={timelineRef}
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
              ...timelineMaskStyle,
            }}
          >
            {timelineItems}
          </div>
        </div>

        {/* ── MIDDLE: Scrollable Experience Detail View ── */}
        <div
          ref={detailRef}
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
            ...detailMaskStyle,
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
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: 0,
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            {t('experience.filter')}
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
