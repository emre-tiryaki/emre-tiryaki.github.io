import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import CommentForm from './CommentForm';
import Button from '../ui/Button';

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

export default function CommentList({ comments, postId }) {
  const { t, lang } = useTranslation();
  const [replyingTo, setReplyingTo] = useState(null);

  // Ana yorumlar (parentId null) + onlara ait yanıtlar (parentId == comment.id)
  const roots = comments.filter((c) => !c.parentId);
  const repliesOf = (id) => comments.filter((c) => c.parentId === id);

  if (!comments.length) {
    return <p className="text-sm text-neutral-500">{t('blog.noComments')}</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {roots.map((c) => {
        const replies = repliesOf(c.id);
        return (
          <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Ana yorum */}
            <div className="glass-card rounded-xl" style={{ padding: '1rem' }}>
              <div className="flex items-center" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="font-semibold text-neutral-100 text-sm">{c.authorName}</span>
                <span className="text-xs text-neutral-500 font-mono">
                  {formatDate(c.createdAt, lang)}
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
              >
                {t('blog.commentForm.reply')}
              </Button>
            </div>

            {/* Yanıtlar (1-level) */}
            {replies.length > 0 && (
              <div
                className="border-l border-white/10"
                style={{ marginLeft: '1.5rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {replies.map((r) => (
                  <div key={r.id} className="glass-card rounded-lg" style={{ padding: '0.75rem' }}>
                    <div className="flex items-center" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="font-semibold text-neutral-200 text-sm">{r.authorName}</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {formatDate(r.createdAt, lang)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Yanıt formu (sadece ana yoruma) */}
            {replyingTo === c.id && (
              <div style={{ marginLeft: '1.5rem' }}>
                <CommentForm postId={postId} parentId={c.id} onDone={() => setReplyingTo(null)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
