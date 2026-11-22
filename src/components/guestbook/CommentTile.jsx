import { useRef } from 'react';
import { FiClock } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { isSafeAvatar } from '../../lib/guestbook';

const { accent, text, status, surface } = THEME_COLORS;

/**
 * Butonun etrafındaki küçük yorum kartı. Konum/dönüş/katman `comment.layout`'tan gelir
 * (CSS değişkenleri; stiller src/index.css `.gb-tile`). Tıklayınca tam yorum açılır.
 */
const DRAG_THRESHOLD = 6; // px; altındaki hareket tıklama sayılır

export default function CommentTile({ comment, pending, extra, place, dragging, onDrag, onDrop, onOpen }) {
  const { t } = useTranslation();
  const { layout } = comment;
  const gesture = useRef(null);
  const suppress = useRef(false); // sürükleme sonrası gelen click'i yut

  // Basılı tutup sürükleme: sahneye göre piksel konumu üretir; eşik aşılmadıysa normal tıklama
  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const stage = e.currentTarget.offsetParent.getBoundingClientRect();
    const tile = e.currentTarget.getBoundingClientRect();
    gesture.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: tile.left + tile.width / 2 - stage.left - e.clientX,
      oy: tile.top + tile.height / 2 - stage.top - e.clientY,
      stage,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const pointAt = (g, e) => ({
    x: Math.min(g.stage.width, Math.max(0, e.clientX - g.stage.left + g.ox)),
    y: Math.min(g.stage.height, Math.max(0, e.clientY - g.stage.top + g.oy)),
  });
  const onPointerMove = (e) => {
    const g = gesture.current;
    if (!g) return;
    if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < DRAG_THRESHOLD) return;
    g.moved = true;
    const p = pointAt(g, e);
    onDrag(p.x, p.y);
  };
  const onPointerUp = (e) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g?.moved) return;
    const p = pointAt(g, e);
    onDrop(p.x, p.y);
    suppress.current = true;
  };
  const handleClick = () => {
    if (suppress.current) {
      suppress.current = false;
      return;
    }
    onOpen(comment);
  };

  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        gesture.current = null;
        if (dragging) onDrop(place.x, place.y);
      }}
      className={`gb-tile${extra ? ' gb-tile--extra' : ''}${dragging ? ' gb-tile--drag' : ''}`}
      aria-label={`${comment.name}${pending ? `, ${t('guestbook.pending')}` : ''}`}
      style={{
        '--x': place ? `${place.x}px` : layout.x,
        '--y': place ? `${place.y}px` : layout.y,
        '--r': `${layout.rotate}deg`,
        '--z': layout.z,
        '--d': `${layout.delay}ms`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        padding: '0.8em 0.95em',
        fontSize: 'calc(1rem * var(--gb-k, 1))',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: '1.1em',
        background: 'rgba(18, 18, 18, 0.92)',
        border: `1px solid ${pending ? accent.borderSubtle : surface.white12}`,
        boxShadow: THEME_COLORS.card.shadow,
        font: 'inherit',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6em', minWidth: 0 }}>
        {src ? (
          <img
            src={src}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            style={{ width: '2.4em', height: '2.4em', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: '2.4em',
              height: '2.4em',
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: accent.a15,
              color: accent.light,
              fontSize: '1em',
              fontWeight: 700,
            }}
          >
            {comment.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <strong
          style={{
            color: text.primary,
            fontSize: '0.95em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {comment.name}
        </strong>
        {pending && <FiClock aria-hidden="true" size={14} color={status.warningSoft} style={{ flexShrink: 0 }} />}
      </span>
      <span
        style={{
          color: text.secondary,
          fontSize: '0.88em',
          lineHeight: 1.45,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflowWrap: 'anywhere',
        }}
      >
        {comment.message}
      </span>
    </button>
  );
}
