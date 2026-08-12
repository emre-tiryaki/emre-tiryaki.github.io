import { FiAward, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

const anthropicLogo = new URL('../../assets/certification_icons/antrophic_certification_logo.jpeg', import.meta.url).href;

const AUTHORITY_ICONS = {
  anthropic: anthropicLogo,
};

export default function CertificationCard({ name, authority, authorityKey, date, url }) {
  const { t, tData } = useTranslation();
  const certName = tData(name);
  const authName = tData(authority);
  const certDate = tData(date);
  const logo = AUTHORITY_ICONS[authorityKey];

  const Tag = url ? 'a' : 'div';
  const extraProps = url ? { href: url, target: '_blank', rel: 'noreferrer' } : {};

  return (
    <Tag
      {...extraProps}
      className="glass-card p-4 rounded-xl border border-neutral-800 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 flex items-start gap-4 group"
    >
      <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 p-2 shrink-0 flex items-center justify-center overflow-hidden">
        {logo ? (
          <img src={logo} alt={authName} className="w-full h-full object-contain rounded" />
        ) : (
          <FiAward className="text-orange-400" size={24} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-neutral-200 group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
          {certName}
        </h4>
        <p className="text-xs text-neutral-400 mt-1 font-medium">{authName}</p>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-2">
          <span>📅 {certDate}</span>
          {url && (
            <span className="flex items-center gap-1 text-orange-400/80 font-medium">
              • {t('certifications.verify')} <FiExternalLink size={10} />
            </span>
          )}
        </div>
      </div>
    </Tag>
  );
}
