import { FiCalendar, FiExternalLink, FiMapPin, FiBriefcase } from 'react-icons/fi';
import experienceData from '../../data/experience.json';
import { useTranslation } from '../../hooks/translation';
import { resolveDate, formatDateRange } from '../../lib/date';
import { THEME_COLORS } from '../../theme';

const { accent, surface, text } = THEME_COLORS;

export default function ProjectEventContext({ projectId }) {
  const { t, tData, lang } = useTranslation();
  const events = experienceData.filter((experience) =>
    ['hackathon', 'competition', 'internship'].includes(experience.type) &&
    experience.projectIds?.includes(projectId)
  );

  if (events.length === 0) return null;

  return (
    <section
      aria-label={t('projects.details.eventContextTitle')}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: text.secondary }}>
        {t('projects.details.eventContextTitle')}
      </h3>
      {events.map((event) => {
        const date = event.startDate && event.endDate
          ? formatDateRange(event.startDate, event.endDate, lang)
          : resolveDate(event.date, lang);
        const location = tData(event.location);
        const duration = tData(event.duration);

        return (
          <div key={event.id} style={{
            display: 'flex', flexDirection: 'column', gap: '0.6rem',
            padding: '1rem 1.25rem', borderRadius: '0.9rem',
            background: surface.white03, border: `1px solid ${accent.borderSubtle}`,
            userSelect: 'text',
          }}>
            {event.url ? (
              <a href={event.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: accent.light, fontWeight: 700, lineHeight: 1.5,
                overflowWrap: 'anywhere',
              }}>
                {tData(event.company)}
                <FiExternalLink size={14} style={{ flexShrink: 0 }} />
              </a>
            ) : (
              <span style={{ color: accent.light, fontWeight: 700 }}>{tData(event.company)}</span>
            )}
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: text.primary }}>
              {t(`projects.details.${event.type}Context`)}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.8rem', color: text.secondary }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiBriefcase size={13} /> {t('projects.details.workContext')}
              </span>
              {date && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FiCalendar size={13} /> {date}
                </span>
              )}
              {location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FiMapPin size={13} /> {location}
                </span>
              )}
              {duration && <span>{duration}</span>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
