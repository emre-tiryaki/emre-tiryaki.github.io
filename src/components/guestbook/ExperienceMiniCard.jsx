import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS, getExperienceTypeConfig } from '../../theme';

const { surface, text } = THEME_COLORS;

/** Zaman çizelgesi için küçük deneyim kartı: yalnızca ad + tür rengi, tıklayınca deneyim sayfasına gider. */
export default function ExperienceMiniCard({ id, company, type = 'internship' }) {
  const { t } = useTranslation();
  const config = getExperienceTypeConfig(type);
  const Icon = config.icon;

  const idleBg = surface.white04;
  const idleBorder = surface.white10;

  return (
    <Link
      to={`/experience?exp=${encodeURIComponent(id)}`}
      aria-label={`${company} — ${t('guestbook.viewExperience')}`}
      className="group relative flex items-center gap-1.5 overflow-hidden transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        padding: '0.55rem 0.75rem',
        borderRadius: '0.75rem',
        width: '100%',
        boxSizing: 'border-box',
        background: idleBg,
        border: `1px solid ${idleBorder}`,
        color: text.primary,
        fontSize: '0.85rem',
        fontWeight: 700,
        textDecoration: 'none',
        outlineColor: config.color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = config.hoverBorder;
        e.currentTarget.style.background = config.hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = idleBorder;
        e.currentTarget.style.background = idleBg;
      }}
    >
      {/* Üstte tür renginde vurgu çubuğu */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[3px] opacity-60 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}00)` }}
      />
      <Icon aria-hidden size={12} color={config.color} style={{ flexShrink: 0 }} />
      <span className="min-w-0 truncate" title={company}>
        {company}
      </span>
    </Link>
  );
}
