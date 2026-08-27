import { useState, useEffect } from 'react';
import { FiCornerDownRight, FiMail } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { fetchCommentEmail } from '../../hooks/useAdminBlog';
import { getPfp } from '../../lib/blog/avatar';
import Button from '../ui/Button';
import CommentForm from './CommentForm';

function formatDate(ts, lang) {
  if (!ts?.toDate) return '';
  try {
    return ts.toDate().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return '';
  }
}

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    pending: { label: t('blog.admin.pending'), color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    approved: { label: t('blog.admin.approved'), color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    rejected: { label: t('blog.admin.rejected'), color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        padding: '0.12rem 0.45rem',
        borderRadius: '9999px',
        fontSize: '0.62rem',
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

// Tek yorum kartı. Varyant yok — element düzeyinde koşullu:
//  • Herkeste ortak: avatar, isim, tarih, metin, (onReply varsa) yanıt formu
//  • Admin'e özel ek elementler (prop gelirse görünür):
//      - showEmail: ismin hemen sağında yorumcu maili
//      - statusBadge: durum rozeti
//      - onApprove/onReject/onDelete: aksiyon butonları (inline confirm)
export default function CommentItem({
  comment,
  postId,
  email: emailProp, // public taraftan gelen mail (yoksa undefined)
  onReply,
  replyOpen,
  onReplyDone,
  showEmail = false,
  statusBadge = false,
  onApprove,
  onReject,
  onDelete,
}) {
  const { t, lang } = useTranslation();
  const isAdmin = !!(onApprove || onReject || onDelete);
  const [confirming, setConfirming] = useState(null); // 'approve' | 'reject' | 'delete'
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const [email, setEmail] = useState(null); // null = henüz çekilmedi

  // Admin: ismin yanında mail gösterilsin isteniyorsa çek
  useEffect(() => {
    if (!showEmail || email !== null) return;
    let active = true;
    fetchCommentEmail(comment.id).then((e) => {
      if (active) setEmail(e || '');
    });
    return () => {
      active = false;
    };
  }, [showEmail, email, comment.id]);

  const initials = (comment.authorName || '?').trim().charAt(0).toUpperCase() || '?';
  // Email çözümü: admin içeride çeker (email state), public dışarıdan gelir
  const resolvedEmail = emailProp || email || null;
  const avatarSrc = getPfp(resolvedEmail, comment.id);

  async function doAction(kind) {
    setWorking(true);
    setError('');
    try {
      if (kind === 'approve') await onApprove(comment.id);
      else if (kind === 'reject') await onReject(comment.id);
      else if (kind === 'delete') await onDelete(comment.id);
      setConfirming(null);
    } catch (e) {
      setError(e?.message || e?.code || String(e));
    } finally {
      setWorking(false);
    }
  }

  const labelFor = (k) =>
    k === 'approve' ? t('blog.admin.approve') : k === 'reject' ? t('blog.admin.reject') : t('blog.admin.delete');

  return (
    <div
      style={{
        padding: '1.15rem 1.25rem',
        borderRadius: '1rem',
        background: 'rgba(255, 255, 255, 0.035)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box',
        transition: 'border-color 0.25s ease',
      }}
    >
      {/* ÜST SATIR — herkeste aynı; admin'e ek elementler eklenir */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={comment.authorName}
            width={40}
            height={40}
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              flexShrink: 0,
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        ) : (
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,#fb923c,#ea580c)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {initials}
          </div>
        )}

        <span style={{ fontWeight: 600, color: '#f5f5f5', fontSize: '0.9rem' }}>{comment.authorName}</span>

        {/* Admin: ismin sağında mail */}
        {showEmail && (
          <span style={{ fontSize: '0.72rem', color: '#a3a3a3', fontFamily: 'monospace' }}>
            {email === null ? '…' : email || t('blog.admin.noEmail')}
          </span>
        )}

        {/* Admin: durum rozeti */}
        {statusBadge && <StatusBadge status={comment.status} />}

        <span style={{ fontSize: '0.72rem', color: '#737373', fontFamily: 'monospace', marginLeft: 'auto' }}>
          {formatDate(comment.createdAt, lang)}
        </span>
      </div>

      {/* Yorum metni — herkeste aynı */}
      <p
        style={{
          fontSize: '0.875rem',
          color: '#d4d4d4',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: '0.5rem 0 0',
        }}
      >
        {comment.content}
      </p>

      {/* AKSYONLAR — sadece gelen prop kadar element */}
      {(onReply || isAdmin) && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '0.55rem',
            paddingTop: '0.55rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Sol grup: yanıtla (confirm açıkken gizli) */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {onReply && !confirming && (
              <Button variant="link" size="sm" onClick={() => onReply(comment.id)} style={{ paddingLeft: 0 }}>
                <FiCornerDownRight size={13} style={{ marginRight: '0.25rem' }} />
                {t('blog.commentForm.reply')}
              </Button>
            )}
          </div>

          {/* Sağ grup: onayla + sil (sağ altta, sil en sağda) — approve edilince reject edilemez, sadece silinebilir.
              Confirm ("Emin misiniz?") SADECE burada, asla solda görünmez. */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
              {confirming ? (
                <>
                  <span style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>{t('blog.admin.sure')}</span>
                  <Button
                    variant={confirming === 'approve' ? 'success' : confirming === 'reject' ? 'warning' : 'danger'}
                    size="sm"
                    onClick={() => doAction(confirming)}
                    disabled={working}
                  >
                    {working ? t('blog.admin.working') : labelFor(confirming)}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setConfirming(null)} disabled={working}>
                    {t('blog.admin.cancel')}
                  </Button>
                </>
              ) : (
                <>
                  {comment.status !== 'approved' && comment.status !== 'rejected' && (
                    <Button variant="success" size="sm" onClick={() => setConfirming('approve')} disabled={working}>
                      {t('blog.admin.approve')}
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirming('delete')}
                    disabled={working}
                  >
                    {t('blog.admin.delete')}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: '0.4rem 0 0' }}>{error}</p>}

      {/* Yanıt formu — hem public hem admin'de açılabilir */}
      {replyOpen && onReply && (
        <div style={{ marginTop: '0.6rem' }}>
          <CommentForm postId={postId} parentId={comment.id} onDone={onReplyDone} />
        </div>
      )}
    </div>
  );
}
