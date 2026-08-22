import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentList({ comments, postId }) {
  const { t } = useTranslation();
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
            <CommentItem
              comment={c}
              postId={postId}
              email={c.authorEmail}
              onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
              replyOpen={replyingTo === c.id}
              onReplyDone={() => setReplyingTo(null)}
            />

            {/* Yanıtlar (1-level) */}
            {replies.length > 0 && (
              <div
                className="border-l border-white/10"
                style={{ marginLeft: '1.5rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {replies.map((r) => (
                  <CommentItem key={r.id} comment={r} postId={postId} email={r.authorEmail} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
