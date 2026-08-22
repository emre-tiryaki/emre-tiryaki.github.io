import { useState } from 'react';
import {
  FiFileText,
  FiEdit3,
  FiMessageSquare,
  FiLogOut,
  FiPlus,
  FiCheck,
  FiX,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';
import { useAdminBlog } from '../../hooks/useAdminBlog';
import PostComposer from '../blog/PostComposer';
import CommentItem from '../blog/CommentItem';
import Button from '../ui/Button';

// Layout: sol sidebar (nav + çıkış) + sağ içerik (istatistikler + liste)
// Tüm panel viewport'a sabitlenir; SADECE sağdaki liste alanı scroll olur.
// Böylece sekme/içerik değişince sidebar nav butonları yerinden oynamaz.
const ROOT_STYLE = {
  width: '100%',
  maxWidth: '72rem',
  height: '100dvh',
  margin: '0 auto',
  padding: '1.5rem',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'stretch',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const SIDEBAR_STYLE = {
  width: '15rem',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '1.25rem',
  borderRadius: '1.25rem',
  background: 'rgba(18,18,18,0.7)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const CONTENT_STYLE = {
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '7.5rem',
        padding: '1rem 1.25rem',
        borderRadius: '1rem',
        background: 'rgba(20,20,20,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
      }}
    >
      <p style={{ fontSize: '0.72rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          margin: '0.25rem 0 0',
          color: accent || '#f5f5f5',
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function AdminPanel() {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const {
    posts, comments, loading,
    createPost, updatePost, deletePost, publishPost,
    approveComment, deleteComment, addComment,
  } = useAdminBlog();

  const [tab, setTab] = useState('published'); // published | drafts | comments
  const [editing, setEditing] = useState(null); // post objesi | 'new' | null
  const [saving, setSaving] = useState(false); // false | 'draft' | 'publish'
  const [deletingPostId, setDeletingPostId] = useState(null); // inline confirm için
  const [commentFilter, setCommentFilter] = useState('all'); // all | pending | approved | rejected
  const [commentSearch, setCommentSearch] = useState('');
  const [replyOpenId, setReplyOpenId] = useState(null); // admin'den yanıt verilen yorum id'si

  if (!isAdmin) {
    return (
      <div style={{ ...ROOT_STYLE, justifyContent: 'center' }}>
        <p className="text-amber-400 text-sm">{t('blog.admin.notAdmin')}</p>
      </div>
    );
  }

  const a = t('blog.admin');

  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);
  const pendingComments = comments.filter((c) => c.status === 'pending').length;
  const filteredComments = comments.filter((c) => {
    if (commentFilter !== 'all' && c.status !== commentFilter) return false;
    const q = commentSearch.trim().toLowerCase();
    if (q && !(c.authorName || '').toLowerCase().includes(q) && !(c.content || '').toLowerCase().includes(q))
      return false;
    return true;
  });

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
    if (deletingPostId === id) {
      await deletePost(id);
      setDeletingPostId(null);
    } else {
      setDeletingPostId(id);
    }
  }
  async function handleApprove(id, approve) {
    await approveComment(id, user.uid, approve);
  }
  async function handleDeleteComment(id) {
    await deleteComment(id);
  }
  // Admin panelinden bir yoruma yanıt yaz (giriş yapılan adminin adı + mailiyle, doğrudan onaylı)
  async function handleAdminReply(parentId, data) {
    await addComment({
      authorName: user?.displayName || user?.email || 'Emre Tiryaki',
      authorEmail: user?.email || null,
      content: data.content,
      postId: data.postId,
      parentId,
      status: 'approved',
    });
    setReplyOpenId(null);
  }

  function renderPostList(list) {
    if (loading) return <p className="text-neutral-500 text-sm">{a.loading}</p>;
    if (list.length === 0)
      return (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            borderRadius: '1rem',
            border: '1px dashed rgba(255,255,255,0.1)',
            color: '#737373',
            fontSize: '0.875rem',
          }}
        >
          {a.emptyList}
        </div>
      );
    return list.map((p) => {
      const cover = p.images && p.images[0];
      return (
        <div
          key={p.id}
          className="glass-card rounded-xl"
          style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt=""
              style={{
                width: '3.5rem',
                height: '3.5rem',
                objectFit: 'cover',
                borderRadius: '0.6rem',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          ) : (
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '0.6rem',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
                color: '#525252',
              }}
            >
              <FiFileText size={20} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="font-semibold text-neutral-100 text-sm truncate">
              {p.title?.tr || p.title?.en || '(başlıksız)'}
            </p>
            <p className="text-xs text-neutral-500" style={{ marginTop: '0.2rem' }}>
              {p.published ? '✅ ' + a.published : '📝 ' + a.draft}
              {p.images?.length > 0 ? ` · ${p.images.length} 🖼️` : ''}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!p.published && (
              <Button variant="success" size="sm" onClick={() => handlePublish(p.id, true)}>
                <FiUpload size={14} style={{ marginRight: '0.3rem' }} />
                {a.publish}
              </Button>
            )}
            {p.published && (
              <Button variant="secondary" size="sm" onClick={() => handlePublish(p.id, false)}>
                {a.unpublish}
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setEditing(p)}>
              <FiEdit3 size={14} style={{ marginRight: '0.3rem' }} />
              {a.editPost}
            </Button>
            {deletingPostId === p.id ? (
              <>
                <Button variant="danger" size="sm" onClick={() => handleDeletePost(p.id)}>
                  <FiCheck size={14} style={{ marginRight: '0.3rem' }} />
                  {a.sureShort}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeletingPostId(null)}>
                  <FiX size={14} />
                </Button>
              </>
            ) : (
              <Button variant="danger" size="sm" onClick={() => handleDeletePost(p.id)}>
                <FiTrash2 size={14} />
              </Button>
            )}
          </div>
        </div>
      );
    });
  }

  const navItems = [
    { id: 'published', label: a.tabPublished, icon: FiFileText, count: publishedPosts.length },
    { id: 'drafts', label: a.tabDrafts, icon: FiEdit3, count: draftPosts.length },
    { id: 'comments', label: a.tabComments, icon: FiMessageSquare, count: comments.length, badge: pendingComments },
  ];

  return (
    <div style={ROOT_STYLE}>
      {/* ── Sidebar ── */}
      <aside style={SIDEBAR_STYLE}>
        <div>
          <p className="text-gradient-orange" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            {a.title}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#737373', margin: '0.25rem 0 0' }}>
            {user?.email || 'admin'}
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.7rem',
                  border: '1px solid',
                  borderColor: active ? 'rgba(249,115,22,0.5)' : 'transparent',
                  background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                  color: active ? '#fdba74' : '#d4d4d4',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={17} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge > 0 ? (
                  <span
                    style={{
                      background: '#f97316',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      padding: '0.1rem 0.45rem',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <span style={{ color: '#737373', fontSize: '0.75rem' }}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Button variant="secondary" size="sm" onClick={logout} style={{ width: '100%' }}>
            <FiLogOut size={14} style={{ marginRight: '0.3rem' }} />
            {a.logout}
          </Button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main style={CONTENT_STYLE}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
          <StatCard label={a.statPosts} value={posts.length} />
          <StatCard label={a.statPublished} value={publishedPosts.length} accent="#22c55e" />
          <StatCard label={a.statDrafts} value={draftPosts.length} accent="#eab308" />
          <StatCard label={a.statPending} value={pendingComments} accent={pendingComments > 0 ? '#f97316' : '#f5f5f5'} />
        </div>

        {/* Tab content header */}
        {tab !== 'comments' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
            <h2 className="text-xl font-bold text-slate-100">
              {tab === 'published' ? a.tabPublished : a.tabDrafts}
            </h2>
            <Button variant="primary" onClick={() => setEditing('new')}>
              <FiPlus size={15} style={{ marginRight: '0.35rem' }} />
              {a.newPost}
            </Button>
          </div>
        )}

        {tab !== 'comments' && editing && (
          <div className="glass-card rounded-2xl" style={{ padding: '1.25rem', flexShrink: 0 }}>
            <PostComposer
              key={editing === 'new' ? 'new' : editing.id}
              initial={editing === 'new' ? null : editing}
              onSave={handleSavePost}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        )}

        {/* Yalnızca bu alan scroll olur */}
        <div
          className="no-scrollbar"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.35rem' }}
        >
          {tab === 'published' && renderPostList(publishedPosts)}
          {tab === 'drafts' && renderPostList(draftPosts)}
          {tab === 'comments' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0 }}>
                <h2 className="text-xl font-bold text-slate-100" style={{ margin: 0 }}>
                  {a.tabComments}
                  {pendingComments > 0 && (
                    <span style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: 600, marginLeft: '0.5rem' }}>
                      · {pendingComments} {a.pendingLower}
                    </span>
                  )}
                </h2>
              </div>

              {/* Filtre + arama çubuğu (react-admin filters deseniine uygun) */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
                {[
                  { id: 'all', label: a.filterAll },
                  { id: 'pending', label: a.filterPending },
                  { id: 'approved', label: a.filterApproved },
                  { id: 'rejected', label: a.filterRejected },
                ].map((f) => {
                  const active = commentFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCommentFilter(f.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        border: '1px solid',
                        borderColor: active ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.12)',
                        background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                        color: active ? '#fdba74' : '#a3a3a3',
                        fontSize: '0.75rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
                <input
                  type="text"
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  placeholder={a.searchComments}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.6rem',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(20,20,20,0.6)',
                    color: '#e5e5e5',
                    fontSize: '0.8rem',
                    minWidth: '12rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {loading && <p className="text-neutral-500 text-sm">{a.loading}</p>}
              {!loading && filteredComments.length === 0 && (
                <p className="text-neutral-500 text-sm">{t('blog.noComments')}</p>
              )}
              {filteredComments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  postId={c.postId}
                  showEmail
                  statusBadge
                  onApprove={(id) => handleApprove(id, true)}
                  onReject={(id) => handleApprove(id, false)}
                  onDelete={handleDeleteComment}
                  onReply={(id) => setReplyOpenId(replyOpenId === id ? null : id)}
                  replyOpen={replyOpenId === c.id}
                  onReplyDone={(data) => handleAdminReply(c.id, data)}
                />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
