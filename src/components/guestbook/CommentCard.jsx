import { FiClock } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { isSafeAvatar } from '../../lib/guestbook';

const { accent, surface, text, status } = THEME_COLORS;

/**
 * Tek yorum kartı. İçerik düz metin olarak render edilir (HTML yorumlanmaz).
 * `comment.fallbackAvatar` fotoğrafı olmayan yorumlar için sayfa açılışında seçilir.
 */
export default function CommentCard({ comment, pending = false }) {
  const { t, lang } = useTranslation();
  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;
  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <article
      style={{
        display: 'flex',
        gap: '0.9rem',
        padding: '1rem 1.1rem',
        borderRadius: '1rem',
        background: THEME_COLORS.card.bg,
        border: `1px solid ${pending ? accent.borderSubtle : THEME_COLORS.card.border}`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: `1px solid ${surface.white10}`,
          }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accent.a15,
            color: accent.light,
            fontWeight: 700,
          }}
        >
          {comment.name.trim().charAt(0).toUpperCase()}
        </span>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.25rem 0.6rem' }}>
          <strong style={{ color: text.primary, fontSize: '0.95rem', overflowWrap: 'anywhere' }}>
            {comment.name}
          </strong>
          {pending ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                color: status.warningSoft,
                background: accent.a12,
                border: `1px solid ${accent.borderSubtle}`,
              }}
            >
              <FiClock aria-hidden="true" size={11} />
              {t('guestbook.pending')}
            </span>
          ) : (
            date && <span style={{ color: text.muted, fontSize: '0.75rem' }}>{date}</span>
          )}
        </div>
        <p
          style={{
            margin: '0.35rem 0 0',
            color: text.secondary,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {comment.message}
        </p>
      </div>
    </article>
  );
}
