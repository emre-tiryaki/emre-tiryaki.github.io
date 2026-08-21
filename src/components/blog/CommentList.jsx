import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
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
    <div className="space-y-6">
      {roots.map((c) => {
        const replies = repliesOf(c.id);
        return (
          <div key={c.id} className="space-y-3">
            {/* Ana yorum */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-neutral-100 text-sm">{c.authorName}</span>
                <span className="text-xs text-neutral-500 font-mono">
                  {formatDate(c.createdAt, lang)}
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
              <button
                onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                className="mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
              >
                {t('blog.commentForm.reply')}
              </button>
            </div>

            {/* Yanıtlar (1-level) */}
            {replies.length > 0 && (
              <div className="ml-6 space-y-2 border-l border-white/10 pl-4">
                {replies.map((r) => (
                  <div key={r.id} className="glass-card rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
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
              <div className="ml-6">
                <CommentForm postId={postId} parentId={c.id} onDone={() => setReplyingTo(null)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
