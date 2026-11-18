import { FiCalendar, FiMapPin, FiClock, FiAward } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { getExperienceTypeConfig } from '../../theme';
import { resolveDate, formatDateRange } from '../../lib/date';

export default function ExperienceCard({
  company,
  title,
  location,
  startDate,
  endDate,
  date,
  duration,
  achievement,
  type = 'internship',
  isSelected = false,
  onClick,
}) {
  const { t, lang, tData } = useTranslation();
  const config = getExperienceTypeConfig(type);
  const Icon = config.icon;

  const achievementText = achievement ? tData(achievement) : null;
  const durationText = duration ? tData(duration) : null;

  // Format date display from ISO strings in data layer
  const dateDisplay = startDate && endDate
    ? formatDateRange(startDate, endDate, lang)
    : date
      ? resolveDate(date, lang)
      : null;
  // Ongoing only when a range was started but not ended; single-date events (hackathons/competitions) are never ongoing
  const isOngoing = Boolean(startDate) && !endDate;

  const idleBg = 'linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%)';
  const idleBorder = 'rgba(255, 255, 255, 0.08)';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className="group relative flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        padding: '1.2rem clamp(1rem, 4vw, 1.4rem) 1rem clamp(1.15rem, 4.5vw, 1.6rem)',
        borderRadius: '1.15rem',
        width: '100%',
        background: isSelected
          ? `linear-gradient(135deg, ${config.bg} 0%, ${config.hoverBg} 100%)`
          : idleBg,
        border: isSelected ? `1.5px solid ${config.color}` : `1px solid ${idleBorder}`,
        boxShadow: isSelected
          ? `0 12px 36px rgba(0, 0, 0, 0.55), 0 0 20px ${config.color}30, inset 0 0 16px ${config.color}12`
          : 'none',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = config.hoverBorder;
          e.currentTarget.style.background = `linear-gradient(135deg, ${config.hoverBg} 0%, rgba(255, 255, 255, 0.02) 100%)`;
          e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${config.hoverShadow}`;
        }
      }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = idleBorder;
          e.currentTarget.style.background = idleBg;
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Left accent bar in the type color */}
      <span
        aria-hidden
        className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
        style={{ background: `linear-gradient(180deg, ${config.color}, ${config.color}00)` }}
      />

      {/* Cursor-following spotlight (position via --mx/--my set on mousemove) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), ${config.color}26, transparent 70%)`,
        }}
      />

      {/* ── Header: Type Badge + (Ongoing / Achievement / Duration Pills) ── */}
      <div className="relative flex items-center justify-between gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
          style={{
            padding: '0.25rem 0.65rem',
            background: config.badgeBg,
            border: `1px solid ${config.badgeBorder}`,
            color: config.badgeText,
          }}
        >
          <Icon size={12} />
          <span>{t(`experience.types.${type}`)}</span>
        </span>

        {/* Ongoing Live Status */}
        {isOngoing && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold"
            style={{
              padding: '0.22rem 0.65rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('experience.ongoing')}</span>
          </span>
        )}

        {/* Competition Achievement Badge */}
        {achievementText && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
            style={{
              padding: '0.22rem 0.7rem',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              color: '#fef08a',
              boxShadow: '0 0 12px rgba(234, 179, 8, 0.15)',
            }}
          >
            <FiAward size={12} className="text-amber-400" />
            <span>{achievementText}</span>
          </span>
        )}

        {/* Duration Pill (for Hackathons/Competitions without ongoing badge) */}
        {!achievementText && !isOngoing && durationText && (
          <span
            className="inline-flex items-center gap-1 rounded-md text-[11px] text-neutral-300"
            style={{
              padding: '0.2rem 0.55rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <FiClock size={11} className="text-emerald-400" />
            <span>{durationText}</span>
          </span>
        )}
      </div>

      {/* ── Company & Title ── */}
      <div className="relative min-w-0">
        <h3
          className="text-[1.05rem] font-extrabold leading-tight tracking-tight transition-colors duration-200"
          style={{ color: isSelected ? config.titleHover : '#f1f5f9' }}
        >
          {company}
        </h3>
        <p className="text-sm font-semibold text-neutral-400 mt-1">
          {tData(title)}
        </p>
      </div>

      {/* ── Footer: Location (left) | Date (bottom-right) ── */}
      {(dateDisplay || location) && (
        <div
          className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2.5 mt-0.5"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          {location ? (
            <div
              className="flex flex-1 items-center gap-1.5 text-[11px] font-medium text-neutral-400 min-w-0"
              title={tData(location)}
            >
              <FiMapPin size={11} className="text-neutral-500 shrink-0" />
              <span className="truncate min-w-0">{tData(location)}</span>
            </div>
          ) : <span />}

          {dateDisplay && (
            <div
              className="ml-auto inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-slate-200 shrink-0 whitespace-nowrap"
              style={{
                padding: '0.2rem 0.55rem',
                background: config.badgeBg,
                border: `1px solid ${config.badgeBorder}`,
              }}
            >
              <FiCalendar size={11} style={{ color: config.color }} className="shrink-0" />
              <span>{dateDisplay}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
