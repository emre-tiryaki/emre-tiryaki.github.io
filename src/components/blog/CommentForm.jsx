import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { submitComment } from '../../hooks/useBlog';

export default function CommentForm({ postId, parentId = null, onDone }) {
  const { t, lang } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const isReply = !!parentId;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return setError(t('blog.commentForm.emptyContent'));
    if (!name.trim()) return setError(t('blog.commentForm.emptyName'));

    setStatus('sending');
    setError('');
    try {
      await submitComment({ postId, parentId, authorName: name, content, email });
      setStatus('sent');
      setName('');
      setEmail('');
      setContent('');
      onDone?.();
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Hata');
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="rounded-xl p-4 text-sm"
        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}
      >
        <p className="font-semibold">✓ {t('blog.commentForm.success')}</p>
        <p className="mt-1 text-neutral-300">{t('blog.commentForm.pendingNote')}</p>
        <p className="mt-1 text-neutral-400 text-xs">{t('blog.commentForm.pendingNoteEmail')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('blog.commentForm.namePlaceholder')}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('blog.commentForm.emailPlaceholder')}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50"
        />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('blog.commentForm.contentPlaceholder')}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50 resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">{t('blog.commentForm.loginRequired')}</span>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-5 py-2 rounded-lg text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', opacity: status === 'sending' ? 0.6 : 1 }}
        >
          {status === 'sending'
            ? t('blog.commentForm.submitting')
            : isReply
            ? t('blog.commentForm.replySubmit')
            : t('blog.commentForm.submit')}
        </button>
      </div>
    </form>
  );
}
