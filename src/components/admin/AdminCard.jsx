import { useEffect, useState } from 'react';
import { FiCheck, FiClock, FiMail, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import Button from '../ui/Button';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import { isSafeAvatar } from '../../lib/guestbook';
import { fetchPrivateEmail } from '../../lib/admin';

const { text, accent, card, surface, status } = THEME_COLORS;

const AVATAR = '2.75rem';

/** Moderasyon kartı: yorum + e-posta + aksiyonlar tek yüzeyde. */
export default function AdminCard({ comment, approved, busy, onToggle, onDelete }) {
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchPrivateEmail(comment.id).then((v) => alive && setEmail(v));
    return () => {
      alive = false;
    };
  }, [comment.id]);

  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;
  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString(lang === 'en' ? 'en-GB' : 'tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const avatarBox = {
    width: AVATAR,
    height: AVATAR,
    borderRadius: '50%',
    flexShrink: 0,
    border: `1px solid ${surface.white10}`,
  };

  return (
    <article
      aria-busy={busy}
      style={{
        borderRadius: '1.1rem',
        background: card.bg,
        border: `1px solid ${card.border}`,
        // Onay bekleyen kartlarda sol kenarda accent şerit: durum renk dışında sekmeyle de belli
        borderLeft: `3px solid ${approved ? status.success : accent.primary}`,
        overflow: 'hidden',
        opacity: busy ? 0.6 : 1,
        transition: 'opacity 160ms ease',
      }}
    >
      <div style={{ display: 'flex', gap: '0.9rem', padding: '1rem 1.15rem' }}>
        {src ? (
          <img src={src} alt="" width={44} height={44} loading="lazy" decoding="async" style={{ ...avatarBox, objectFit: 'cover' }} />
        ) : (
          <span
            aria-hidden="true"
            style={{
              ...avatarBox,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: accent.light,
              background: accent.a15,
            }}
          >
            {comment.name.trim().charAt(0).toUpperCase()}
          </span>
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.15rem 0.7rem' }}>
            <strong style={{ color: text.primary, fontSize: '0.95rem', overflowWrap: 'anywhere' }}>{comment.name}</strong>
            {date && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: text.muted, fontSize: '0.75rem' }}>
                <FiClock aria-hidden="true" size={11} />
                {date}
              </span>
            )}
          </div>
          <p
            style={{
              margin: '0.4rem 0 0',
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
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem 0.75rem',
          padding: '0.65rem 1.15rem',
          background: surface.white02,
          borderTop: `1px solid ${card.border}`,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            minWidth: 0,
            marginRight: 'auto',
            color: text.muted,
            fontSize: '0.78rem',
            overflowWrap: 'anywhere',
          }}
        >
          {email && (
            <>
              <FiMail aria-hidden="true" size={13} style={{ flexShrink: 0 }} />
              <span className="sr-only">{t('admin.email')}:</span>
              {email}
            </>
          )}
        </span>
        <Button size="sm" variant={approved ? 'secondary' : 'success'} disabled={busy} onClick={onToggle}>
          {approved ? <FiRotateCcw aria-hidden="true" size={13} /> : <FiCheck aria-hidden="true" size={13} />}
          {approved ? t('admin.unapprove') : t('admin.approve')}
        </Button>
        <Button size="sm" variant="danger" disabled={busy} onClick={onDelete}>
          <FiTrash2 aria-hidden="true" size={13} />
          {t('admin.delete')}
        </Button>
      </div>
    </article>
  );
}
