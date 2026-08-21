import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';
import { useAdminBlog } from '../../hooks/useAdminBlog';
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

  const [tab, setTab] = useState('published'); // published | drafts | comments
  const [editing, setEditing] = useState(null); // post objesi | 'new' | null
  const [saving, setSaving] = useState(false); // false | 'draft' | 'publish'

  if (!isAdmin) {
    return (
      <div style={PAGE_STYLE} className="flex items-center justify-center">
        <p className="text-amber-400 text-sm">{t('blog.admin.notAdmin')}</p>
      </div>
    );
  }

  const a = t('blog.admin');

  // data: {title, body, images} | publish: boolean
  async function handleSavePost(data, publish) {
    setSaving(publish ? 'publish' : 'draft');
    try {
      if (editing === 'new') {
        await createPost(data, publish);
      } else if (editing?.id) {
        await updatePost(editing.id, data);
        if (publish) await publishPost(editing.id, true);
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

  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);

  function renderPostList(list) {
    if (loading) return <p className="text-neutral-500 text-sm">{a.loading}</p>;
    if (list.length === 0)
      return <p className="text-neutral-500 text-sm">{a.emptyList}</p>;
    return list.map((p) => (
      <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-100 text-sm truncate">
            {p.title?.tr || p.title?.en || '(başlıksız)'}
          </p>
          <p className="text-xs text-neutral-500">
            {p.published ? '✅ ' + a.published : '📝 ' + a.draft}
            {p.images?.length > 0 ? ` · ${p.images.length} 🖼️` : ''}
          </p>
        </div>
        {!p.published && (
          <button onClick={() => handlePublish(p.id, true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#22c55e' }}>
            {a.publish}
          </button>
        )}
        {p.published && (
          <button onClick={() => handlePublish(p.id, false)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#475569' }}>
            {a.unpublish}
          </button>
        )}
        <button onClick={() => setEditing(p)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-200 border border-white/15 hover:bg-white/5">
          {a.editPost}
        </button>
        <button onClick={() => handleDeletePost(p.id)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-300 border border-red-500/40 hover:bg-red-500/10">
          {a.delete}
        </button>
      </div>
    ));
  }

  const tabs = [
    { id: 'published', label: a.tabPublished, count: publishedPosts.length },
    { id: 'drafts', label: a.tabDrafts, count: draftPosts.length },
    { id: 'comments', label: a.tabComments, count: comments.length },
  ];

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
      <div className="flex gap-2 mb-4 flexShrink-0 flex-wrap">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === tb.id ? 'bg-orange-500/20 text-orange-400' : 'text-neutral-400 hover:text-neutral-200'}`}>
            {tb.label} ({tb.count})
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        {tab !== 'comments' && (
          <div className="mb-4">
            <button onClick={() => setEditing('new')}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
              {a.newPost}
            </button>
            {editing && (
              <div className="mt-4">
                <PostComposer
                  key={editing === 'new' ? 'new' : editing.id}
                  initial={editing === 'new' ? null : editing}
                  onSave={handleSavePost}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'published' && <div className="space-y-3">{renderPostList(publishedPosts)}</div>}
        {tab === 'drafts' && <div className="space-y-3">{renderPostList(draftPosts)}</div>}

        {tab === 'comments' && (
          <div className="space-y-3">
            {loading && <p className="text-neutral-500 text-sm">{a.loading}</p>}
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
