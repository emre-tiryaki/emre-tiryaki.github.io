import { FiBriefcase } from 'react-icons/fi';
import ExperienceMiniCard from './ExperienceMiniCard';
import TimelineNode from '../experience/TimelineNode';
import { THEME_COLORS, EXPERIENCE_TYPE_CONFIG } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { useScrollMask } from '../../hooks/useScrollMask';

const { accent } = THEME_COLORS;
const FALLBACK_COLOR = '#f97316';
const ITEM_WIDTH = '9.5rem';
const GAP = '1.25rem';

const colorOf = (type) => EXPERIENCE_TYPE_CONFIG[type]?.dotColor || FALLBACK_COLOR;

/** Deneyim sayfasındaki zaman çizelgesinin yatay, kaydırılabilir hali (guestbook detay görünümü). */
export default function ExperienceTimeline({ experiences = [] }) {
  const { t } = useTranslation();
  const [scrollRef] = useScrollMask('horizontal', 24);
  if (experiences.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0, width: '100%' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: accent.light }}>
        <FiBriefcase aria-hidden="true" size={12} />
        {t('guestbook.experienceTitle')}
      </span>
      <ul
        ref={scrollRef}
        style={{
          listStyle: 'none',
          margin: 0,
          // Düğüm parlaması kırpılmasın diye iç boşluk
          padding: '0.9rem 0.75rem 0.5rem',
          display: 'flex',
          gap: GAP,
          alignItems: 'flex-start',
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '0.75rem',
          overscrollBehaviorX: 'contain',
          scrollbarWidth: 'thin',
        }}
      >
        {experiences.map((exp, i) => {
          const color = colorOf(exp.type);
          const next = experiences[i + 1];
          return (
            <li
              key={exp.id}
              style={{ width: ITEM_WIDTH, flexShrink: 0, scrollSnapAlign: 'start', position: 'relative' }}
            >
              <div style={{ position: 'relative', height: '2.25rem', marginBottom: '0.6rem' }}>
                <TimelineNode color={color} />
                {next && (
                  // Düğüm merkezinden sonraki düğümün merkezine
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 'calc(50% - 1px)',
                      left: '1.125rem',
                      width: `calc(${ITEM_WIDTH} + ${GAP})`,
                      height: '2px',
                      background: `linear-gradient(to right, ${color} 0%, ${colorOf(next.type)} 100%)`,
                      boxShadow: `0 0 8px ${color}40`,
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-2px -2px',
                        background: `linear-gradient(to right, ${color}50 0%, ${colorOf(next.type)}50 100%)`,
                        filter: 'blur(3px)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                )}
              </div>
              <ExperienceMiniCard id={exp.id} company={exp.company} type={exp.type} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
