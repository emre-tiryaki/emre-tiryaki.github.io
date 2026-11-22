import { FiClock } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { isSafeAvatar } from '../../lib/guestbook';

const { accent, text, status, surface } = THEME_COLORS;

/**
 * Butonun etrafındaki küçük yorum kartı. Konum/dönüş/katman `comment.layout`'tan gelir
 * (CSS değişkenleri; stiller src/index.css `.gb-tile`). Tıklayınca tam yorum açılır.
 */
export default function CommentTile({ comment, pending, extra, place, onOpen }) {
  const { t } = useTranslation();
  const { layout } = comment;
  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;

  return (
    <button
      type="button"
      onClick={() => onOpen(comment)}
      className={`gb-tile${extra ? ' gb-tile--extra' : ''}`}
      aria-label={`${comment.name}${pending ? `, ${t('guestbook.pending')}` : ''}`}
      style={{
        '--x': place ? `${place.x}px` : layout.x,
        '--y': place ? `${place.y}px` : layout.y,
        '--r': `${layout.rotate}deg`,
        '--z': layout.z,
        '--d': `${layout.delay}ms`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        padding: '0.8em 0.95em',
        fontSize: 'calc(1rem * var(--gb-k, 1))',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: '1.1em',
        background: 'rgba(18, 18, 18, 0.92)',
        border: `1px solid ${pending ? accent.borderSubtle : surface.white12}`,
        boxShadow: THEME_COLORS.card.shadow,
        font: 'inherit',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6em', minWidth: 0 }}>
        {src ? (
          <img
            src={src}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            style={{ width: '2.4em', height: '2.4em', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: '2.4em',
              height: '2.4em',
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: accent.a15,
              color: accent.light,
              fontSize: '1em',
              fontWeight: 700,
            }}
          >
            {comment.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <strong
          style={{
            color: text.primary,
            fontSize: '0.95em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {comment.name}
        </strong>
        {pending && <FiClock aria-hidden="true" size={14} color={status.warningSoft} style={{ flexShrink: 0 }} />}
      </span>
      <span
        style={{
          color: text.secondary,
          fontSize: '0.88em',
          lineHeight: 1.45,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflowWrap: 'anywhere',
        }}
      >
        {comment.message}
      </span>
    </button>
  );
}
