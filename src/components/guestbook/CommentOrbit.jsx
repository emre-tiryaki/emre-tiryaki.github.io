import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FiAlertTriangle, FiMessageSquare } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import CommentTile from './CommentTile';
import { packTiles } from '../../lib/guestbookLayout';

const { text, status } = THEME_COLORS;
const MOBILE_VISIBLE = 10; // dar ekranda fazlası gizlenir (üst üste binmesin)

/**
 * Sayfanın tamamını kaplayan, kaydırılmayan sahne: ortada "yorum bırak" butonu,
 * çevresinde rastgele katmanlanmış yorum kartları. Durum mesajları butonun altında görünür.
 */
export default function CommentOrbit({ pending, comments, loading, error, onRetry, onCompose, onOpen }) {
  const { t } = useTranslation();
  const all = [...pending.map((c) => ({ c, isPending: true })), ...comments.map((c) => ({ c, isPending: false }))];
  const stageRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Kartlar çakışmayacak şekilde yerleştirilir; sığmazsa ölçek küçülür. Dar ekranda gizlenenler hesaba girmez.
  const narrow = size.w <= 640;
  const { scale, positions } = useMemo(() => {
    if (!size.w || !size.h) return { scale: 1, positions: [] };
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const visible = narrow ? Math.min(all.length, MOBILE_VISIBLE) : all.length;
    const seeds = all.map(({ c }) => c.layout.seed);
    const packed = packTiles(seeds.slice(0, visible), size.w, size.h, rem);
    return { scale: packed.scale, positions: packed.positions };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, narrow, pending, comments]);
  const showEmpty = !loading && !error && all.length === 0;

  return (
    <section
      aria-label={t('guestbook.commentsTitle')}
      className="gb-stage"
      ref={stageRef}
      style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', '--gb-k': scale }}
    >
      {!loading && !error &&
        all.map(({ c, isPending }, i) => (
          <CommentTile
            key={c.id}
            comment={c}
            pending={isPending}
            extra={i >= MOBILE_VISIBLE}
            place={positions[i]}
            onOpen={onOpen}
          />
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
