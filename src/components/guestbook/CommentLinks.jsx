import { Link } from 'react-router-dom';
import { FiBriefcase, FiMail } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { LINK_KEYS, LINK_TYPES, teamExperiences, teamLinks } from '../../lib/guestbookLinks';

const { text, surface, accent } = THEME_COLORS;

/** Yorumcunun linkleri (takım arkadaşıysa team.json linkleri eksikleri tamamlar) + herkese açık e-postası, ikon satırı. Yeni sekme, nofollow. */
export default function CommentLinks({ links = {}, publicEmail = null, teamMemberId = null, size = 16, column = false }) {
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

  if (column) {
    const row = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.6rem 0.75rem',
      borderRadius: '0.65rem',
      color: text.primary,
      background: surface.white05,
      border: `1px solid ${surface.white10}`,
      textDecoration: 'none',
      minWidth: 0,
    };
    const icon = {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      borderRadius: '0.5rem',
      color: accent.light,
      background: accent.a15,
    };
    const hint = (url) => {
      try {
        const u = new URL(url);
        return (u.host + u.pathname).replace(/\/$/, '');
      } catch {
        return url;
      }
    };
    const body = (label, sub) => (
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
        {sub && (
          <span style={{ fontSize: '0.75rem', color: text.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sub}
          </span>
        )}
      </span>
    );
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {entries.map((key) => {
          const Icon = LINK_TYPES[key].icon;
          return (
            <li key={key} style={{ minWidth: 0 }}>
              <a href={links[key]} target="_blank" rel="noopener noreferrer nofollow ugc" style={row}>
                <span style={icon}><Icon aria-hidden="true" size={18} /></span>
                {body(t(`guestbook.linkTypes.${key}`), hint(links[key]))}
              </a>
            </li>
          );
        })}
        {experiences.map((e) => (
          <li key={e.id} style={{ minWidth: 0 }}>
            <Link to={`/experience?exp=${encodeURIComponent(e.id)}`} style={row}>
              <span style={icon}><FiBriefcase aria-hidden="true" size={18} /></span>
              {body(e.company, null)}
            </Link>
          </li>
        ))}
        {publicEmail && (
          <li style={{ minWidth: 0 }}>
            <a href={`mailto:${publicEmail}`} style={row}>
              <span style={icon}><FiMail aria-hidden="true" size={18} /></span>
              {body('E-mail', publicEmail)}
            </a>
          </li>
        )}
      </ul>
    );
  }

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
