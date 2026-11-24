import { FiClock } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { isSafeAvatar } from '../../lib/guestbook';
import { teamExperiences, teamLinks } from '../../lib/guestbookLinks';
import CommentLinks from './CommentLinks';
import TeamBadge from './TeamBadge';

const { accent, surface, text, status } = THEME_COLORS;

/**
 * Tek yorum kartı. İçerik düz metin olarak render edilir (HTML yorumlanmaz).
 * `comment.fallbackAvatar` fotoğrafı olmayan yorumlar için sayfa açılışında seçilir.
 */
export default function CommentCard({ comment, pending = false, large = false }) {
  const avatar = large ? 112 : 44;
  const { t, lang } = useTranslation();
  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;
  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const hasLinks =
    Object.keys(comment.links || {}).length > 0 ||
    !!comment.publicEmail ||
    Object.keys(teamLinks(comment.teamMemberId)).length > 0 ||
    teamExperiences(comment.teamMemberId).length > 0;

  return (
    <article
      style={{
        display: 'flex',
        flexWrap: large ? 'wrap' : undefined,
        gap: large ? '1.5rem' : '0.9rem',
        padding: large ? '2rem' : '1rem 1.1rem',
        borderRadius: '1rem',
        background: THEME_COLORS.card.bg,
        border: `1px solid ${pending ? accent.borderSubtle : THEME_COLORS.card.border}`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={avatar}
          height={avatar}
          loading="lazy"
          decoding="async"
          style={{
            width: `${avatar / 16}rem`,
            height: `${avatar / 16}rem`,
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
            width: `${avatar / 16}rem`,
            height: `${avatar / 16}rem`,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accent.a15,
            color: accent.light,
            fontWeight: 700,
            fontSize: large ? '1.5rem' : undefined,
          }}
        >
          {comment.name.trim().charAt(0).toUpperCase()}
        </span>
      )}

      <div style={{ minWidth: 0, flex: large ? '2 1 20rem' : 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.25rem 0.6rem' }}>
          <strong style={{ color: text.primary, fontSize: large ? '1.25rem' : '0.95rem', overflowWrap: 'anywhere' }}>
            {comment.name}
          </strong>
          <TeamBadge id={comment.teamMemberId} />
          {pending ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: large ? '0.85rem' : '0.7rem',
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
            date && <span style={{ color: text.muted, fontSize: large ? '0.9rem' : '0.75rem' }}>{date}</span>
          )}
        </div>
        <p
          style={{
            margin: large ? '0.6rem 0 0' : '0.35rem 0 0',
            color: text.secondary,
            fontSize: large ? '1.15rem' : '0.9rem',
            lineHeight: large ? 1.7 : 1.6,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {comment.message}
        </p>
        {!large && (
          <CommentLinks links={comment.links} publicEmail={comment.publicEmail} teamMemberId={comment.teamMemberId} />
        )}
      </div>
      {large && hasLinks && (
        <aside
          style={{ flex: '1 1 15rem', maxWidth: '100%', minWidth: 0, alignSelf: 'flex-start' }}
        >
          <CommentLinks column links={comment.links} publicEmail={comment.publicEmail} teamMemberId={comment.teamMemberId} />
        </aside>
      )}
    </article>
  );
}
