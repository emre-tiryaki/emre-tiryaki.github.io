import { FiMail } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { LINK_KEYS, LINK_TYPES } from '../../lib/guestbookLinks';

const { text, surface } = THEME_COLORS;

/** Yorumcunun linkleri + herkese açık e-postası, ikon satırı. Yeni sekme, nofollow. */
export default function CommentLinks({ links = {}, publicEmail = null, size = 16 }) {
  const { t } = useTranslation();
  const entries = LINK_KEYS.filter((k) => links[k]);
  if (entries.length === 0 && !publicEmail) return null;

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
      {publicEmail && (
        <a href={`mailto:${publicEmail}`} aria-label={publicEmail} title={publicEmail} style={style}>
          <FiMail aria-hidden="true" size={size} />
        </a>
      )}
    </div>
  );
}
