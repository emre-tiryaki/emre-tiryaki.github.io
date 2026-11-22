import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';

const { accent, text } = THEME_COLORS;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Erişilebilir modal (WAI-ARIA dialog): Escape / arka plan tıklaması kapatır, odak içeride kalır,
 * kapanınca odak açan öğeye döner. Sadece açıkken mount edin; unmount kapatır.
 */
export default function Modal({ title, onClose, children, maxWidth = '30rem', bare = false }) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    const panel = panelRef.current;
    (panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE))?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000, // navbar'ın üstünde
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left))',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={bare ? undefined : titleId}
        aria-label={bare ? title : undefined}
        style={bare ? {
          position: 'relative',
          width: '100%',
          maxWidth,
          maxHeight: '100%',
          overflowY: 'auto',
          borderRadius: '1rem',
          background: '#0d0d0d',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px ${accent.a15}`,
        } : {
          width: '100%',
          maxWidth,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1rem',
          background: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px ${accent.a15}`,
          overflow: 'hidden',
        }}
      >
        {bare ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="btn btn--ghost btn--sm"
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 1 }}
          >
            <FiX aria-hidden="true" />
          </button>
        ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 id={titleId} style={{ margin: 0, fontSize: '1rem', color: text.primary, overflowWrap: 'anywhere' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="btn btn--ghost btn--sm"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        )}
        {bare ? children : <div style={{ padding: '1rem', overflowY: 'auto' }}>{children}</div>}
      </div>
    </div>,
    document.body,
  );
}
