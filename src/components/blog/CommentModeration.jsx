import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { fetchCommentEmail } from '../../hooks/useAdminBlog';
import Button from '../ui/Button';

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    pending: { label: t('blog.admin.pending'), color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    approved: { label: t('blog.admin.approved'), color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    rejected: { label: t('blog.admin.rejected'), color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

// Admin: tek yorumu onayla/ret/sil + gizli maili göster
export default function CommentModerationRow({ comment, onApprove, onReject, onDelete, busy }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  async function toggleEmail() {
    if (email === null) {
      const e = await fetchCommentEmail(comment.id);
      setEmail(e || '');
    }
    setShowEmail((v) => !v);
  }

  return (
    <div className="glass-card rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-neutral-100 text-sm">{comment.authorName}</span>
        <StatusBadge status={comment.status} />
        <span className="text-xs text-neutral-500 font-mono">
          {comment.createdAt?.toDate?.().toLocaleString() || ''}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={toggleEmail}
          className="ml-auto"
        >
          {t('blog.admin.commentEmail')}
        </Button>
      </div>

      {showEmail && (
        <p className="text-xs text-neutral-400 font-mono">
          {email ? email : t('blog.admin.noEmail')}
        </p>
      )}

      <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>

      {comment.postId && (
        <a href={`/blog/${comment.postId}`} className="text-xs text-orange-400 hover:underline">
          {t('blog.admin.viewPost')} →
        </a>
      )}

      <div className="flex gap-2 pt-1">
        {comment.status !== 'approved' && (
          <Button variant="success" size="sm" onClick={() => onApprove(comment.id)} disabled={busy}>
            {t('blog.admin.approve')}
          </Button>
        )}
        {comment.status !== 'rejected' && (
          <Button variant="warning" size="sm" onClick={() => onReject(comment.id)} disabled={busy}>
            {t('blog.admin.reject')}
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={() => onDelete(comment.id)} disabled={busy}>
          {t('blog.admin.delete')}
        </Button>
      </div>
    </div>
  );
}
