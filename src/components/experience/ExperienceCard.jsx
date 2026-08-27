import { FiBriefcase, FiZap, FiAward, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

const TYPE_CONFIG = {
  internship: {
    icon: FiBriefcase,
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.12)',
    badgeBorder: 'rgba(249, 115, 22, 0.3)',
    badgeText: '#fb923c',
    hoverBorder: 'rgba(249, 115, 22, 0.45)',
    hoverBg: 'rgba(249, 115, 22, 0.05)',
    hoverShadow: 'rgba(249, 115, 22, 0.08)',
    titleHover: '#fdba74',
  },
  hackathon: {
    icon: FiZap,
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    badgeText: '#34d399',
    hoverBorder: 'rgba(16, 185, 129, 0.45)',
    hoverBg: 'rgba(16, 185, 129, 0.05)',
    hoverShadow: 'rgba(16, 185, 129, 0.08)',
    titleHover: '#6ee7b7',
  },
  competition: {
    icon: FiAward,
    color: '#f59e0b',
    badgeBg: 'rgba(234, 179, 8, 0.12)',
    badgeBorder: 'rgba(234, 179, 8, 0.3)',
    badgeText: '#facc15',
    hoverBorder: 'rgba(234, 179, 8, 0.45)',
    hoverBg: 'rgba(234, 179, 8, 0.05)',
    hoverShadow: 'rgba(234, 179, 8, 0.08)',
    titleHover: '#fde047',
  },
  work: {
    icon: FiBriefcase,
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeBorder: 'rgba(59, 130, 246, 0.3)',
    badgeText: '#60a5fa',
    hoverBorder: 'rgba(59, 130, 246, 0.45)',
    hoverBg: 'rgba(59, 130, 246, 0.05)',
    hoverShadow: 'rgba(59, 130, 246, 0.08)',
    titleHover: '#93c5fd',
  },
};

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
  const { t, tData } = useTranslation();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.internship;
  const Icon = config.icon;

  const endText = endDate ? tData(endDate) : null;
  const isOngoing = endText && (endText.toLowerCase().includes('devam') || endText.toLowerCase().includes('present'));
  const achievementText = achievement ? tData(achievement) : null;
  const durationText = duration ? tData(duration) : null;

  // Format date display
  const dateDisplay = startDate && endText
    ? `${tData(startDate)} – ${endText}`
    : date
      ? tData(date)
      : null;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="group relative flex flex-col justify-between gap-3.5 rounded-2xl transition-all duration-250"
      style={{
        padding: '1.25rem 1.45rem',
        borderRadius: '1.15rem',
        width: '100%',
        background: isSelected
          ? (config.hoverBg || 'rgba(249, 115, 22, 0.08)')
          : 'rgba(255, 255, 255, 0.03)',
        border: isSelected
          ? `1.5px solid ${config.color}`
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? `0 12px 36px rgba(0, 0, 0, 0.55), 0 0 20px ${config.color}30, inset 0 0 16px ${config.color}12`
          : 'none',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = config.hoverBorder;
          e.currentTarget.style.background = config.hoverBg;
          e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${config.hoverShadow}`;
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* ── Top Header: Type Badge + (Ongoing / Achievement / Duration Pills) ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
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

      {/* ── Main Content Row: Left (Company & Title) | Far Right (Date & Location) ── */}
      <div className="flex items-start justify-between gap-4 pt-0.5">
        {/* Left: Company & Title */}
        <div className="min-w-0 flex-1">
          <h3
            className="text-base font-extrabold text-slate-100 transition-colors leading-tight"
            style={{ transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = config.titleHover}
            onMouseLeave={e => e.currentTarget.style.color = '#f1f5f9'}
          >
            {company}
          </h3>
          <p className="text-sm font-semibold text-neutral-400 mt-1 select-none">
            {tData(title)}
          </p>
        </div>

        {/* Far Right: Date & Location */}
        <div className="flex flex-col items-end text-right shrink-0">
          {dateDisplay && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 select-none">
              <FiCalendar size={12} style={{ color: config.color }} className="shrink-0" />
              <span>{dateDisplay}</span>
            </div>
          )}

          {location && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 mt-1">
              <FiMapPin size={11} className="text-neutral-500 shrink-0" />
              <span>{tData(location)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
