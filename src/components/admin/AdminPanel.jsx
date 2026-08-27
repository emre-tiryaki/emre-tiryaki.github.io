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
  FiFeather,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';
import { useAdminBlog } from '../../hooks/useAdminBlog';
import PostComposer from '../blog/PostComposer';
import CommentItem from '../blog/CommentItem';
import Button from '../ui/Button';

const ROOT_STYLE = {
  width: '100%',
  maxWidth: '88rem',
  height: '100%',
  flex: 1,
  minHeight: 0,
  margin: '0 auto',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'stretch',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const SIDEBAR_STYLE = {
  width: '16rem',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '1.5rem 1.25rem',
  borderRadius: '1rem',
  background: 'rgba(255, 255, 255, 0.035)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'border-color 0.25s ease',
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
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        flex: 1,
        minWidth: '7.5rem',
        padding: '1.15rem 1.35rem',
        borderRadius: '1rem',
        background: hovered ? 'rgba(255, 255, 255, 0.045)' : 'rgba(255, 255, 255, 0.035)',
        border: hovered ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box',
        transition: 'all 0.22s ease',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontFamily: 'monospace' }}>
        {label}
      </p>
      <p
        style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          margin: '0.35rem 0 0',
          color: accent || '#f8fafc',
          lineHeight: 1,
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

  const [tab, setTab] = useState('published'); // 'published' | 'drafts' | 'editor' | 'comments'
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
      if (editing === 'new' || !editing?.id) {
        await createPost(data, publish);
      } else if (editing?.id) {
        await updatePost(editing.id, data);
        if (publish) await publishPost(editing.id, true);
      }
      setEditing(null);
      setTab(publish ? 'published' : 'drafts');
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
            background: 'rgba(255, 255, 255, 0.02)',
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
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.035)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
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
                borderRadius: '0.65rem',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />
          ) : (
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '0.65rem',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#64748b',
              }}
            >
              <FiFileText size={20} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="font-semibold text-slate-100 text-sm truncate" style={{ margin: 0 }}>
              {p.title?.tr || p.title?.en || '(başlıksız)'}
            </p>
            <p className="text-xs text-neutral-400" style={{ marginTop: '0.25rem', fontFamily: 'monospace' }}>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditing(p);
                setTab('editor');
              }}
            >
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
    { id: 'editor', label: a.tabEditor || 'Yazı Editörü', icon: FiFeather },
    { id: 'published', label: a.tabPublished, icon: FiFileText, count: publishedPosts.length },
    { id: 'drafts', label: a.tabDrafts, icon: FiEdit3, count: draftPosts.length },
    { id: 'comments', label: a.tabComments, icon: FiMessageSquare, count: comments.length, badge: pendingComments },
  ];

  return (
    <div style={ROOT_STYLE}>
      {/* ── Sidebar ── */}
      <aside style={SIDEBAR_STYLE}>
        <div>
          <p className="text-gradient-orange" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
            {a.title}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.3rem 0 0', fontFamily: 'monospace' }}>
            {user?.email || 'admin'}
          </p>
        </div>

        {/* Primary Action Button: "Yeni Yazı" placed at the top */}
        <Button
          variant="primary"
          onClick={() => {
            setEditing('new');
            setTab('editor');
          }}
          style={{ width: '100%' }}
        >
          <FiPlus size={16} style={{ marginRight: '0.2rem' }} />
          <span>{a.newPost}</span>
        </Button>

        {/* Sidebar Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'editor' && !editing) {
                    setEditing('new');
                  }
                  setTab(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.75rem',
                  border: '1px solid',
                  borderColor: active ? 'rgba(249,115,22,0.45)' : 'transparent',
                  background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                  color: active ? '#fb923c' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: active ? '0 0 16px rgba(249,115,22,0.1)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#f1f5f9';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
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
                  item.count !== undefined && (
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>{item.count}</span>
                  )
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
        {/* Stats Bar (visible on all tabs) */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
          <StatCard label={a.statPosts} value={posts.length} />
          <StatCard label={a.statPublished} value={publishedPosts.length} accent="#22c55e" />
          <StatCard label={a.statDrafts} value={draftPosts.length} accent="#eab308" />
          <StatCard label={a.statPending} value={pendingComments} accent={pendingComments > 0 ? '#f97316' : '#f8fafc'} />
        </div>

        {/* ── TAB 1: DEDICATED EDITOR & LIVE PREVIEW ── */}
        {tab === 'editor' && (
          <div
            className="no-scrollbar"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              paddingRight: '0.35rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <PostComposer
              key={editing === 'new' ? 'new' : (editing?.id || 'new')}
              initial={editing === 'new' ? null : editing}
              onSave={handleSavePost}
              onCancel={() => {
                setEditing(null);
                setTab('published');
              }}
              saving={saving}
            />
          </div>
        )}

        {/* ── TAB 2: PUBLISHED POSTS ── */}
        {tab === 'published' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
              <h2 className="text-xl font-bold text-slate-100" style={{ margin: 0 }}>
                {a.tabPublished} ({publishedPosts.length})
              </h2>
            </div>
            <div
              className="no-scrollbar"
              style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.35rem' }}
            >
              {renderPostList(publishedPosts)}
            </div>
          </>
        )}

        {/* ── TAB 3: DRAFTS ── */}
        {tab === 'drafts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
              <h2 className="text-xl font-bold text-slate-100" style={{ margin: 0 }}>
                {a.tabDrafts} ({draftPosts.length})
              </h2>
            </div>
            <div
              className="no-scrollbar"
              style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.35rem' }}
            >
              {renderPostList(draftPosts)}
            </div>
          </>
        )}

        {/* ── TAB 4: COMMENTS ── */}
        {tab === 'comments' && (
          <div
            className="no-scrollbar"
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.35rem' }}
          >
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

            {/* Filtre + arama çubuğu */}
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
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      border: '1px solid',
                      borderColor: active ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)',
                      background: active ? 'rgba(249,115,22,0.14)' : 'rgba(255,255,255,0.035)',
                      color: active ? '#fb923c' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: active ? 700 : 500,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      boxShadow: active ? '0 0 12px rgba(249,115,22,0.15)' : 'none',
                      transition: 'all 0.16s ease',
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
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.035)',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  minWidth: '13rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.16s ease',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 14px rgba(249,115,22,0.15)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
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
          </div>
        )}
      </main>
    </div>
  );
}
