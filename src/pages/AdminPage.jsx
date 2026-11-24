import { useCallback, useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CommentCard from '../components/guestbook/CommentCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useTranslation } from '../hooks/translation';
import { THEME_COLORS } from '../theme';
import {
  deleteComment,
  fetchByStatus,
  fetchPrivateEmail,
  isAdminAvailable,
  onAuthChange,
  setApproved,
  signIn,
  signOut,
} from '../lib/admin';

const { text, accent, card, status } = THEME_COLORS;

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.75rem',
  borderRadius: '0.6rem',
  border: `1px solid ${card.border}`,
  background: 'rgba(255,255,255,0.04)',
  color: text.primary,
  fontSize: '0.95rem',
};

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      await signIn(email.trim(), password, remember);
    } catch {
      setError(true); // tek genel mesaj: hesap varlığı sızdırılmaz
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '0.9rem', maxWidth: '22rem', width: '100%', margin: '0 auto' }}>
      <label style={{ display: 'grid', gap: '0.3rem', color: text.secondary, fontSize: '0.85rem' }}>
        {t('admin.login.email')}
        <input style={inputStyle} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label style={{ display: 'grid', gap: '0.3rem', color: text.secondary, fontSize: '0.85rem' }}>
        {t('admin.login.password')}
        <input style={inputStyle} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: text.secondary, fontSize: '0.85rem' }}>
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        {t('admin.login.remember')}
      </label>
      {error && (
        <p role="alert" style={{ margin: 0, color: status.dangerSoft, fontSize: '0.85rem' }}>
          {t('admin.login.error')}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={busy}>
        {busy ? t('admin.login.submitting') : t('admin.login.submit')}
      </Button>
    </form>
  );
}

function AdminCard({ comment, approved, busy, onToggle, onDelete }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchPrivateEmail(comment.id).then((v) => alive && setEmail(v));
    return () => {
      alive = false;
    };
  }, [comment.id]);

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <CommentCard comment={comment} />
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', padding: '0 0.25rem' }}>
        {email && (
          <span style={{ color: text.muted, fontSize: '0.8rem', marginRight: 'auto', wordBreak: 'break-all' }}>
            {t('admin.email')}: {email}
          </span>
        )}
        <span style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          <Button size="sm" variant={approved ? 'secondary' : 'success'} disabled={busy} onClick={onToggle}>
            {approved ? t('admin.unapprove') : t('admin.approve')}
          </Button>
          <Button size="sm" variant="danger" disabled={busy} onClick={onDelete}>
            {t('admin.delete')}
          </Button>
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const approved = tab === 'approved';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await fetchByStatus(approved, 50));
    } catch (err) {
      console.error('admin load failed:', err?.code || err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [approved]);

  useEffect(() => {
    load();
  }, [load]);

  // İyimser güncelleme: kart hemen listeden düşer, hata olursa geri gelir
  const run = async (comment, action) => {
    const before = items;
    setItems((list) => list.filter((c) => c.id !== comment.id));
    setBusyId(comment.id);
    setActionError(false);
    try {
      await action();
    } catch (err) {
      console.error('admin action failed:', err?.code || err);
      setItems(before);
      setActionError(true);
    } finally {
      setBusyId(null);
    }
  };

  const tabStyle = (active) => ({
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    border: `1px solid ${active ? accent.borderSubtle : card.border}`,
    background: active ? accent.bgSubtle : 'transparent',
    color: active ? accent.light : text.secondary,
    cursor: 'pointer',
    fontSize: '0.9rem',
  });

  return (
    <div style={{ width: '100%', maxWidth: '44rem', margin: '0 auto', display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button type="button" style={tabStyle(!approved)} aria-pressed={!approved} onClick={() => setTab('pending')}>
          {t('admin.tabs.pending')}
        </button>
        <button type="button" style={tabStyle(approved)} aria-pressed={approved} onClick={() => setTab('approved')}>
          {t('admin.tabs.approved')}
        </button>
        <Button size="sm" variant="ghost" style={{ marginLeft: 'auto' }} onClick={signOut}>
          {t('admin.logout')}
        </Button>
      </div>

      {actionError && (
        <p role="alert" style={{ margin: 0, color: status.dangerSoft, fontSize: '0.85rem' }}>
          {t('admin.actionError')}
        </p>
      )}

      {loading ? (
        <p role="status" style={{ textAlign: 'center', color: text.muted }}>{t('admin.loading')}</p>
      ) : error ? (
        <div role="alert" style={{ textAlign: 'center', color: status.dangerSoft }}>
          <p>{t('admin.loadError')}</p>
          <Button size="sm" onClick={load}>{t('admin.retry')}</Button>
        </div>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', color: text.muted }}>{t('admin.empty')}</p>
      ) : (
        items.map((c) => (
          <AdminCard
            key={c.id}
            comment={c}
            approved={approved}
            busy={busyId === c.id}
            onToggle={() => run(c, () => setApproved(c.id, !approved))}
            onDelete={() => setToDelete(c)}
          />
        ))
      )}

      {toDelete && (
        <Modal title={t('admin.deleteTitle')} onClose={() => setToDelete(null)} maxWidth="26rem">
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: text.secondary }}>
            {t('admin.deleteBody')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button data-autofocus onClick={() => setToDelete(null)}>{t('admin.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                const c = toDelete;
                setToDelete(null);
                run(c, () => deleteComment(c.id));
              }}
            >
              {t('admin.confirmDelete')}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState(undefined); // undefined: oturum durumu henüz bilinmiyor

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => (isAdminAvailable ? onAuthChange(setUser) : undefined), []);

  return (
    <PageLayout title={t('admin.title')} subtitle={t('admin.subtitle')}>
      {!isAdminAvailable ? (
        <p role="status" style={{ textAlign: 'center', color: text.muted }}>{t('admin.unavailable')}</p>
      ) : user === undefined ? (
        <p role="status" style={{ textAlign: 'center', color: text.muted }}>{t('admin.loading')}</p>
      ) : user ? (
        <Dashboard />
      ) : (
        <LoginForm />
      )}
    </PageLayout>
  );
}
