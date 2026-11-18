import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';

const { surface } = THEME_COLORS;

/** Bu sheet'ten sonra body'ye eklenmiş başka bir overlay (lightbox, PDF modal) var mı? */
function hasOverlayAbove(node) {
  let el = node?.nextElementSibling;
  while (el) {
    if (el.tagName !== 'SCRIPT') return true;
    el = el.nextElementSibling;
  }
  return false;
}

/**
 * Dar ekranlarda (lg altı) master/detail sayfalarının detay panelini
 * tam ekran bir katman olarak gösterir.
 * - Geri butonu, Escape ve tarayıcının/Android'in geri tuşu ile kapanır.
 * - Açılınca odağı geri butonuna taşır, kapanınca tetikleyen elemana döndürür.
 * - Çentikli cihazlar için safe-area boşluklarına uyar.
 */
export default function MobileSheet({ open, onClose, title, children }) {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const backRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    backRef.current?.focus({ preventScroll: true });

    // Tarayıcı geri tuşu sheet'i kapatsın, sayfadan çıkmasın.
    window.history.pushState({ ...window.history.state, mobileSheet: true }, '');
    let poppedByUser = false;
    const onPop = () => {
      poppedByUser = true;
      onCloseRef.current();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && !hasOverlayAbove(rootRef.current)) onCloseRef.current();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      if (!poppedByUser && window.history.state?.mobileSheet) window.history.back();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(8, 8, 10, 0.97)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
              paddingBottom: '0.75rem',
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
              borderBottom: `1px solid ${surface.white08}`,
              background: surface.nav,
            }}
          >
            <button
              ref={backRef}
              type="button"
              onClick={onClose}
              className="btn btn--secondary btn--sm"
              style={{ minHeight: '2.75rem', flexShrink: 0 }}
            >
              <FiArrowLeft size={16} aria-hidden="true" />
              <span>{t('common.back')}</span>
            </button>
            <p
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              paddingTop: '1rem',
              paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}
          >
            <div style={{ width: '100%', maxWidth: '48rem', margin: '0 auto' }}>
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
