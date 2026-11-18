import { useRef } from 'react';

/**
 * Yatay kaydırma (swipe) hareketlerini algılar.
 * Döndürülen handler'lar bir elemana yayılır: <div {...useSwipe({ onLeft, onRight })}>
 * Dikey kaydırmayı engellemez; sadece belirgin yatay hareketleri yakalar.
 */
export function useSwipe({ onLeft, onRight, threshold = 40 }) {
  const start = useRef(null);

  return {
    onTouchStart: (e) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) onLeft?.();
      else onRight?.();
    },
  };
}

export default useSwipe;
