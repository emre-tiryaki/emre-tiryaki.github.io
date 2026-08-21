import { useState, useMemo } from 'react';
import ExperienceCardFactory from '../components/experience/ExperienceCardFactory';
import experienceData from '../data/experience.json';
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

  return (
    /* Full viewport height column — no outer scroll */
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '1rem 2rem 0',
      boxSizing: 'border-box',
    }}>
      {/* Page Header — fixed height */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem', flexShrink: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('experience.title')}</h1>
        <p className="text-base text-neutral-400 mt-1">{t('experience.subtitle')}</p>
      </div>

      {/* Body: fills remaining height, no overflow */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '2rem',
        overflow: 'hidden',
        minHeight: 0,   /* critical for flex children to shrink below content size */
      }}>

        {/* LEFT: Scrollable experience timeline */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          {/* Gradient vertical line */}
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, rgba(249,115,22,0.7), rgba(249,115,22,0.03))',
            pointerEvents: 'none',
          }} />

          {/* Scrollable list */}
          <div style={{
            height: '100%',
            overflowY: 'auto',
            paddingBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {filtered.map((item) => {
              const dotColor = TYPE_DOT_COLOR[item.type] || '#f97316';
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', position: 'relative' }}>
                  {/* Dot on the line */}
                  <div style={{ flexShrink: 0, marginTop: '1.25rem', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${dotColor}20`,
                      border: `2px solid ${dotColor}`,
                      boxShadow: `0 0 12px ${dotColor}55`,
                    }}>
                      <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: dotColor }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <ExperienceCardFactory item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Filter sidebar — fixed width, no scroll */}
        <div style={{
          width: '200px',
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
    </div>
  );
}
