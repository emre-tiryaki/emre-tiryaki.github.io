import { FiAward, FiExternalLink, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import { getAuthorityLogo } from '../../lib/media';

const { surface, certCard } = THEME_COLORS;

export default function CertificationCard({ name, authority, authorityKey, date, url }) {
  const { t, tData } = useTranslation();
  const certName = tData(name);
  const authName = tData(authority);
  const certDate = tData(date);
  const logo = getAuthorityLogo(authorityKey);

  const Tag = url ? 'a' : 'div';
  const extraProps = url
    ? {
        href: url,
        target: '_blank',
        rel: 'noreferrer',
        title: `${certName} — ${t('certifications.verify')}`,
      }
    : {};

  return (
    <Tag
      {...extraProps}
      className="group relative flex flex-col justify-between gap-3 rounded-2xl transition-all duration-250 overflow-hidden"
      style={{
        padding: '1.25rem 1.35rem',
        borderRadius: certCard.radius,
        background: certCard.bg,
        border: `1px solid ${certCard.border}`,
        textDecoration: 'none',
        cursor: url ? 'pointer' : 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = certCard.borderHover;
        e.currentTarget.style.background = certCard.bgHover;
        e.currentTarget.style.boxShadow = certCard.shadowHover;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = certCard.border;
        e.currentTarget.style.background = certCard.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── Top Row: Logo + (Authority Name & Date Pill & Status) ── */}
      <div className="flex items-center gap-3">
        {/* Logo Badge */}
        <div
          style={{
            width: '2.85rem',
            height: '2.85rem',
            borderRadius: '0.75rem',
            background: surface.white04,
            border: `1px solid ${surface.white08}`,
            padding: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}
          className="group-hover:scale-105"
        >
          {logo ? (
            <img
              src={logo}
              alt={authName}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.35rem' }}
            />
          ) : (
            <FiAward className="text-orange-400" size={20} />
          )}
        </div>

        {/* Authority Info + Date */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-200 group-hover:text-orange-400 transition-colors">
              {authName}
            </span>
            <span className="text-neutral-600 text-xs select-none">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 select-none">
              <FiCalendar size={11} className="text-orange-400/80 shrink-0" />
              <span>{certDate}</span>
            </span>
          </div>

          {/* Verified Status */}
          <div className="flex items-center gap-1.5 mt-0.5 select-none">
            {url ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <FiCheckCircle size={11} />
                <span>{t('certifications.verified')}</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-neutral-500">
                {t('certifications.official')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Center / Bottom: Certification Name + Verify Button on Far Right ── */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <h4 className="text-[0.92rem] font-bold text-slate-100 group-hover:text-orange-300 transition-colors leading-snug line-clamp-2 flex-1">
          {certName}
        </h4>

        {/* Verify Action Button at Far Right */}
        {url && (
          <span
            className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-neutral-300 group-hover:text-orange-400 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 transition-all duration-200 shrink-0 whitespace-nowrap select-none"
            style={{
              padding: '0.45rem 0.9rem',
              background: surface.white035,
              border: `1px solid ${surface.white10}`,
            }}
          >
            <span>{t('certifications.verify')}</span>
            <FiExternalLink size={12} className="text-neutral-400 group-hover:text-orange-400 transition-colors" />
          </span>
        )}
      </div>
    </Tag>
  );
}
