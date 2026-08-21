import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';
import { useAdminBlog } from '../../hooks/useAdminBlog';
import PostComposer from '../blog/PostComposer';
import CommentModerationRow from '../blog/CommentModeration';
import Button from '../ui/Button';

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
          <Button variant="success" size="sm" onClick={() => handlePublish(p.id, true)}>
            {a.publish}
          </Button>
        )}
        {p.published && (
          <Button variant="secondary" size="sm" onClick={() => handlePublish(p.id, false)}>
            {a.unpublish}
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => setEditing(p)}>
          {a.editPost}
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDeletePost(p.id)}>
          {a.delete}
        </Button>
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
        <Button variant="secondary" size="sm" onClick={logout}>
          {a.logout}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flexShrink-0 flex-wrap">
        {tabs.map((tb) => (
          <Button
            key={tb.id}
            variant={tab === tb.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTab(tb.id)}
          >
            {tb.label} ({tb.count})
          </Button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        {tab !== 'comments' && (
          <div className="mb-4">
            <Button variant="primary" onClick={() => setEditing('new')}>
              {a.newPost}
            </Button>
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
