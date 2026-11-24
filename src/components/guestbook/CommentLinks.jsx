import { Link } from 'react-router-dom';
import { FiBriefcase, FiMail } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { LINK_KEYS, LINK_TYPES, teamExperiences, teamLinks } from '../../lib/guestbookLinks';

const { text, surface } = THEME_COLORS;

/** Yorumcunun linkleri (takım arkadaşıysa team.json linkleri eksikleri tamamlar) + herkese açık e-postası, ikon satırı. Yeni sekme, nofollow. */
export default function CommentLinks({ links = {}, publicEmail = null, teamMemberId = null, size = 16 }) {
  const { t } = useTranslation();
  links = { ...teamLinks(teamMemberId), ...links };
  const entries = LINK_KEYS.filter((k) => links[k]);
  const experiences = teamExperiences(teamMemberId);
  if (entries.length === 0 && !publicEmail && experiences.length === 0) return null;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.9rem',
    height: '1.9rem',
    borderRadius: '50%',
    color: text.secondary,
    border: `1px solid ${surface.white10}`,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
      {entries.map((key) => {
        const Icon = LINK_TYPES[key].icon;
        return (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            aria-label={t(`guestbook.linkTypes.${key}`)}
            title={t(`guestbook.linkTypes.${key}`)}
            style={style}
          >
            <Icon aria-hidden="true" size={size} />
          </a>
        );
      })}
      {experiences.map((e) => (
        <Link
          key={e.id}
          to={`/experience?exp=${encodeURIComponent(e.id)}`}
          title={e.company}
          style={{ ...style, width: 'auto', borderRadius: '999px', padding: '0 0.65rem', gap: '0.35rem', fontSize: '0.75rem' }}
        >
          <FiBriefcase aria-hidden="true" size={size - 3} />
          {e.company}
        </Link>
      ))}
      {publicEmail && (
        <a href={`mailto:${publicEmail}`} aria-label={publicEmail} title={publicEmail} style={style}>
          <FiMail aria-hidden="true" size={size} />
        </a>
      )}
    </div>
  );
}
