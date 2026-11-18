import { useState, useEffect, useCallback } from 'react';

/**
 * Hem fare hem dokunmatik için tooltip görünürlüğü.
 * - Fare: hover ile açılır/kapanır (önceki davranış korunur).
 * - Dokunmatik: dokunuşla aç/kapa; dışarı dokununca veya kaydırınca kapanır.
 * - Klavye: odaklanınca açılır, odak kaybında kapanır.
 *
 * @param {React.RefObject} anchorRef Tooltip'in bağlı olduğu eleman
 * @returns {[boolean, object]} [open, handlers] — handlers anchor elemana yayılır
 */
export function useTapTooltip(anchorRef) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'pointerdown' && anchorRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', close, true);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', close, true);
      window.removeEventListener('scroll', close, true);
    };
  }, [open, anchorRef]);

  const onPointerEnter = useCallback((e) => { if (e.pointerType === 'mouse') setOpen(true); }, []);
  const onPointerLeave = useCallback((e) => { if (e.pointerType === 'mouse') setOpen(false); }, []);
  const onPointerUp = useCallback((e) => { if (e.pointerType !== 'mouse') setOpen((v) => !v); }, []);
  const onFocus = useCallback(() => setOpen(true), []);
  const onBlur = useCallback(() => setOpen(false), []);

  return [open, { onPointerEnter, onPointerLeave, onPointerUp, onFocus, onBlur }];
}

export default useTapTooltip;
