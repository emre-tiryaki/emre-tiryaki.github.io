import { FiAlertTriangle, FiMessageSquare } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import CommentCard from './CommentCard';

const { surface, text, status } = THEME_COLORS;

const listStyle = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' };

function Message({ icon: Icon, children, action, tone = text.muted, role = 'status' }) {
  return (
    <div
      role={role}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '2rem 1rem',
        textAlign: 'center',
        color: tone,
        fontSize: '0.9rem',
      }}
    >
      <Icon aria-hidden="true" size={26} />
      <p style={{ margin: 0 }}>{children}</p>
      {action}
    </div>
  );
}

/**
 * Bekleyen (yerel) ve onaylı (sunucu) yorumlar. Yükleniyor / hata / boş durumları burada.
 */
export default function CommentList({ pending, comments, loading, error, onRetry }) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="guestbook-comments-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <h2 id="guestbook-comments-title" style={{ margin: 0, fontSize: '1.1rem', color: text.primary }}>
        {t('guestbook.commentsTitle')}
      </h2>

      {pending.length > 0 && (
        <ul style={listStyle} aria-label={t('guestbook.pendingList')}>
          {pending.map((c) => (
            <li key={c.id}>
              <CommentCard comment={c} pending />
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div role="status" aria-busy="true" aria-label={t('guestbook.loading')} style={listStyle}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: '5.5rem', borderRadius: '1rem', background: surface.white04 }}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <Message
          icon={FiAlertTriangle}
          tone={status.dangerSoft}
          role="alert"
          action={
            <Button variant="secondary" size="sm" onClick={onRetry}>
              {t('guestbook.retry')}
            </Button>
          }
        >
          {t('guestbook.loadError')}
        </Message>
      )}

      {!loading && !error && comments.length === 0 && pending.length === 0 && (
        <Message icon={FiMessageSquare}>{t('guestbook.empty')}</Message>
      )}

      {!loading && !error && comments.length > 0 && (
        <ul style={listStyle}>
          {comments.map((c) => (
            <li key={c.id}>
              <CommentCard comment={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
