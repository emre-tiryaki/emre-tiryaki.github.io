import { useCallback, useEffect, useState } from 'react';
import { FiInbox, FiLogOut } from 'react-icons/fi';
import AdminCard from './AdminCard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import { deleteComment, fetchByStatus, setApproved, setTeamMember, signOut } from '../../lib/admin';

const { text, card, status, surface } = THEME_COLORS;

const TABS = ['pending', 'approved'];

function Skeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" style={{ display: 'grid', gap: '0.9rem' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: '6.5rem', borderRadius: '1.1rem', border: `1px solid ${card.border}` }} />
      ))}
    </div>
  );
}

export default function Dashboard() {
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

  const notice = (color, bg, border) => ({
    margin: 0,
    padding: '0.65rem 0.9rem',
    borderRadius: '0.75rem',
    fontSize: '0.85rem',
    color,
    background: bg,
    border: `1px solid ${border}`,
  });

  return (
    <div style={{ width: '100%', maxWidth: '44rem', margin: '0 auto', display: 'grid', gap: '1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div
          role="group"
          aria-label={t('admin.subtitle')}
          style={{
            display: 'inline-flex',
            padding: '0.25rem',
            gap: '0.25rem',
            borderRadius: '999px',
            background: surface.white04,
            border: `1px solid ${card.border}`,
          }}
        >
          {TABS.map((key) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                className="admin-tab"
                aria-pressed={active}
                onClick={() => setTab(key)}
              >
                {t(`admin.tabs.${key}`)}
                {active && !loading && !error && <span className="admin-tab__count">{items.length}</span>}
              </button>
            );
          })}
        </div>
        <Button size="sm" variant="ghost" onClick={signOut}>
          <FiLogOut aria-hidden="true" size={13} />
          {t('admin.logout')}
        </Button>
      </div>

      {actionError && (
        <p role="alert" style={notice(status.dangerSoft, status.dangerBg, status.dangerBorder)}>
          {t('admin.actionError')}
        </p>
      )}

      {loading ? (
        <Skeleton />
      ) : error ? (
        <div role="alert" style={{ ...notice(status.dangerSoft, status.dangerBg, status.dangerBorder), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span>{t('admin.loadError')}</span>
          <Button size="sm" onClick={load}>{t('admin.retry')}</Button>
        </div>
      ) : items.length === 0 ? (
        <div role="status" style={{ display: 'grid', justifyItems: 'center', gap: '0.6rem', padding: '3rem 1rem', color: text.muted, borderRadius: '1.1rem', border: `1px dashed ${card.border}` }}>
          <FiInbox aria-hidden="true" size={28} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('admin.empty')}</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.9rem' }}>
          {items.map((c) => (
            <li key={c.id}>
              <AdminCard
                comment={c}
                approved={approved}
                busy={busyId === c.id}
                onToggle={(badge) => run(c, () => setApproved(c.id, !approved, approved ? undefined : badge))}
                onBadge={async (badge) => {
                  setActionError(false);
                  try {
                    await setTeamMember(c.id, badge);
                    setItems((list) => list.map((x) => (x.id === c.id ? { ...x, teamMemberId: badge } : x)));
                  } catch (err) {
                    console.error('admin badge failed:', err?.code || err);
                    setActionError(true);
                  }
                }}
                onDelete={() => setToDelete(c)}
              />
            </li>
          ))}
        </ul>
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
