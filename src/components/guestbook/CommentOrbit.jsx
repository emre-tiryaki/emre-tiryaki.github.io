import { FiAlertTriangle, FiMessageSquare } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import CommentTile from './CommentTile';

const { text, status } = THEME_COLORS;
const MOBILE_VISIBLE = 10; // dar ekranda fazlası gizlenir (üst üste binmesin)
const FULL_SIZE_COUNT = 8; // bu sayıya kadar kartlar azami boyutta
const MIN_SCALE = 0.6; // çok kalabalıkta kartların inebileceği en küçük oran

/**
 * Sayfanın tamamını kaplayan, kaydırılmayan sahne: ortada "yorum bırak" butonu,
 * çevresinde rastgele katmanlanmış yorum kartları. Durum mesajları butonun altında görünür.
 */
export default function CommentOrbit({ pending, comments, loading, error, onRetry, onCompose, onOpen }) {
  const { t } = useTranslation();
  const all = [...pending.map((c) => ({ c, isPending: true })), ...comments.map((c) => ({ c, isPending: false }))];
  // Kart sayısı arttıkça kartlar küçülür (alan ~ 1/n → ölçek ~ 1/√n)
  const scale = Math.max(MIN_SCALE, Math.min(1, Math.sqrt(FULL_SIZE_COUNT / Math.max(all.length, 1))));
  const showEmpty = !loading && !error && all.length === 0;

  return (
    <section
      aria-label={t('guestbook.commentsTitle')}
      className="gb-stage"
      style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', '--gb-k': scale }}
    >
      {!loading && !error &&
        all.map(({ c, isPending }, i) => (
          <CommentTile key={c.id} comment={c} pending={isPending} extra={i >= MOBILE_VISIBLE} onOpen={onOpen} />
        ))}

      <div className="gb-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <Button
          variant="primary"
          onClick={onCompose}
          style={{
            width: '7.5rem',
            height: '7.5rem',
            borderRadius: '50%',
            flexDirection: 'column',
            gap: '0.35rem',
            textAlign: 'center',
            lineHeight: 1.2,
            boxShadow: `0 0 40px ${THEME_COLORS.accent.glowStrong}`,
          }}
        >
          <FiMessageSquare aria-hidden="true" size={24} />
          {t('guestbook.open')}
        </Button>

        <div
          role={error ? 'alert' : 'status'}
          aria-busy={loading}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '16rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: error ? status.dangerSoft : text.muted,
            background: 'rgba(10, 10, 10, 0.75)',
            borderRadius: '0.75rem',
            padding: loading || error || showEmpty ? '0.4rem 0.75rem' : 0,
          }}
        >
          {loading && t('guestbook.loading')}
          {error && (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiAlertTriangle aria-hidden="true" /> {t('guestbook.loadError')}
              </span>
              <Button variant="secondary" size="sm" onClick={onRetry}>
                {t('guestbook.retry')}
              </Button>
            </>
          )}
          {showEmpty && t('guestbook.empty')}
        </div>
      </div>
    </section>
  );
}
