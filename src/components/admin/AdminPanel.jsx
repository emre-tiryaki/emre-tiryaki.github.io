import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { useAdminBlog } from '../../hooks/useBlog';
import PostComposer from '../blog/PostComposer';
import CommentModerationRow from '../blog/CommentModeration';

const PAGE_STYLE = {
  width: '100%', maxWidth: '56rem', margin: '0 auto',
  paddingLeft: '1.5rem', paddingRight: '1.5rem',
  display: 'flex', flexDirection: 'column', height: '100%',
  overflow: 'hidden', boxSizing: 'border-box',
};

export default function AdminPanel() {
  const { t, user } = useTranslation();
  const { logout, isAdmin } = useAuth();
  const {
    posts, comments, loading,
    createPost, updatePost, deletePost, publishPost,
    approveComment, deleteComment,
  } = useAdminBlog();

  const [tab, setTab] = useState('posts'); // posts | comments
  const [editing, setEditing] = useState(null); // post objesi | 'new' | null
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return (
      <div style={PAGE_STYLE} className="flex items-center justify-center">
        <p className="text-amber-400 text-sm">{t('blog.admin.notAdmin')}</p>
      </div>
    );
  }

  const a = t('blog.admin');

  async function handleSavePost(data) {
    setSaving(true);
    try {
      if (editing === 'new') {
        await createPost(data);
      } else if (editing?.id) {
        await updatePost(editing.id, data);
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(id, published) {
    await publishPost(id, published);
  }
  async function handleDeletePost(id) {
    if (confirm('Silinsin mi?')) await deletePost(id);
  }
  async function handleApprove(id, approve) {
    await approveComment(id, user.uid, approve);
  }
  async function handleDeleteComment(id) {
    if (confirm('Yorum silinsin mi?')) await deleteComment(id);
  }

  return (
    <div style={PAGE_STYLE}>
      <div className="flex items-center justify-between mb-4 flexShrink-0">
        <h1 className="text-2xl font-extrabold text-slate-100">{a.title}</h1>
        <button onClick={logout}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-300 border border-white/15 hover:bg-white/5">
          {a.logout}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flexShrink-0">
        <button onClick={() => setTab('posts')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'posts' ? 'bg-orange-500/20 text-orange-400' : 'text-neutral-400 hover:text-neutral-200'}`}>
          {a.tabPosts} ({posts.length})
        </button>
        <button onClick={() => setTab('comments')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === 'comments' ? 'bg-orange-500/20 text-orange-400' : 'text-neutral-400 hover:text-neutral-200'}`}>
          {a.tabComments} ({comments.length})
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        {tab === 'posts' && (
          <div className="space-y-4">
            <button onClick={() => setEditing('new')}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
              {a.newPost}
            </button>

            {editing && (
              <PostComposer
                key={editing === 'new' ? 'new' : editing.id}
                initial={editing === 'new' ? null : editing}
                onSave={handleSavePost}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            )}

            {loading && <p className="text-neutral-500 text-sm">…</p>}

            {posts.map((p) => (
              <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-100 text-sm truncate">
                    {p.title?.tr || p.title?.en || '(başlıksız)'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {p.published ? '✅ ' + a.publish : '📝 taslak'}
                    {p.images?.length > 0 ? ` · ${p.images.length} 🖼️` : ''}
                  </p>
                </div>
                <button onClick={() => handlePublish(p.id, !p.published)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: p.published ? '#475569' : '#22c55e' }}>
                  {p.published ? a.unpublish : a.publish}
                </button>
                <button onClick={() => setEditing(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-200 border border-white/15 hover:bg-white/5">
                  {a.editPost}
                </button>
                <button onClick={() => handleDeletePost(p.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-300 border border-red-500/40 hover:bg-red-500/10">
                  {a.delete}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'comments' && (
          <div className="space-y-3">
            {loading && <p className="text-neutral-500 text-sm">…</p>}
            {comments.length === 0 && (
              <p className="text-neutral-500 text-sm">{t('blog.noComments')}</p>
            )}
            {comments.map((c) => (
              <CommentModerationRow
                key={c.id}
                comment={c}
                onApprove={(id) => handleApprove(id, true)}
                onReject={(id) => handleApprove(id, false)}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
