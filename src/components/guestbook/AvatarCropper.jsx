import { useRef, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import { cropToDataUrl } from '../../lib/guestbook';

const { text, accent } = THEME_COLORS;
const MAX_ZOOM = 4;
const KEY_STEP = 0.04; // ok tuşu: kırpma karesinin oranı

/**
 * Yuvarlak avatar kırpıcı. `src` bir data URL. Sürükleyerek konumlandır, kaydırıcıyla yakınlaştır;
 * onaylayınca 96x96 WebP data URL ile `onConfirm` çağrılır.
 * Konum "görüntü uzayında" tutulur (cx, cy = görünüm merkezinin resimdeki noktası), böylece boyuttan bağımsızdır.
 */
export default function AvatarCropper({ src, onConfirm, onCancel }) {
  const { t } = useTranslation();
  const imgRef = useRef(null);
  const viewRef = useRef(null);
  const drag = useRef(null);
  const [dims, setDims] = useState(null); // { w, h } doğal boyut
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false);

  const side = dims ? Math.min(dims.w, dims.h) / zoom : 1;

  const clamp = (c, z = zoom, d = dims) => {
    if (!d) return c;
    const s = Math.min(d.w, d.h) / z;
    return {
      x: Math.min(Math.max(c.x, s / 2), d.w - s / 2),
      y: Math.min(Math.max(c.y, s / 2), d.h - s / 2),
    };
  };

  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setDims({ w, h });
    setCenter({ x: w / 2, y: h / 2 });
  };

  const changeZoom = (z) => {
    setZoom(z);
    setCenter((c) => clamp(c, z));
  };

  const onPointerDown = (e) => {
    if (!dims) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, c: center };
  };

  const onPointerMove = (e) => {
    if (!drag.current || !viewRef.current) return;
    const scale = viewRef.current.getBoundingClientRect().width / side; // ekran px / resim px
    setCenter(
      clamp({
        x: drag.current.c.x - (e.clientX - drag.current.x) / scale,
        y: drag.current.c.y - (e.clientY - drag.current.y) / scale,
      }),
    );
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onKeyDown = (e) => {
    const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const m = moves[e.key];
    if (!m || !dims) return;
    e.preventDefault();
    setCenter((c) => clamp({ x: c.x + m[0] * side * KEY_STEP, y: c.y + m[1] * side * KEY_STEP }));
  };

  const confirm = () => {
    try {
      onConfirm(cropToDataUrl(imgRef.current, center.x - side / 2, center.y - side / 2, side));
    } catch {
      setFailed(true);
    }
  };

  // Görünüm kutusu 1:1; resim, kırpma karesi kutuyu dolduracak şekilde ölçeklenir ve konumlanır
  const imgStyle = dims
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${(dims.w / side) * 100}%`,
        height: `${(dims.h / side) * 100}%`,
        transform: `translate(${(-(center.x - side / 2) / dims.w) * 100}%, ${(-(center.y - side / 2) / dims.h) * 100}%)`,
        maxWidth: 'none',
        userSelect: 'none',
        pointerEvents: 'none',
      }
    : { position: 'absolute', opacity: 0, width: 1, height: 1 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'center' }}>
      <p style={{ margin: 0, fontSize: '0.82rem', color: text.muted, textAlign: 'center' }}>{t('guestbook.crop.help')}</p>

      <div
        ref={viewRef}
        data-autofocus
        tabIndex={0}
        role="group"
        aria-label={t('guestbook.crop.area')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        style={{
          position: 'relative',
          width: 'min(100%, 18rem)',
          aspectRatio: '1',
          overflow: 'hidden',
          borderRadius: '0.75rem',
          background: '#000',
          cursor: dims ? 'grab' : 'default',
          touchAction: 'none', // dokunmatikte sayfa kaymasın, sürükleme çalışsın
          outlineOffset: 2,
        }}
      >
        <img ref={imgRef} src={src} alt="" draggable={false} onLoad={handleLoad} onError={() => setFailed(true)} style={imgStyle} />
        {/* Daire maskesi: dışı karartılır */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.65)',
            border: `2px solid ${accent.lighter}`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: 'min(100%, 18rem)', fontSize: '0.78rem', color: text.muted }}>
        {t('guestbook.crop.zoom')}
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(e) => changeZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: accent.primary }}
        />
      </label>

      {failed && (
        <span role="alert" style={{ fontSize: '0.78rem', color: THEME_COLORS.status.dangerSoft }}>
          {t('guestbook.errors.photo')}
        </span>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <FiX aria-hidden="true" /> {t('guestbook.crop.cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={confirm} disabled={!dims}>
          <FiCheck aria-hidden="true" /> {t('guestbook.crop.confirm')}
        </Button>
      </div>
    </div>
  );
}
