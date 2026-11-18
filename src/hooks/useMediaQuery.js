import { useSyncExternalStore } from 'react';

/**
 * Ortak breakpoint sorguları. Tailwind'in sm/md/lg eşikleriyle hizalıdır.
 * - PHONE:   < 640px  (sm altı)
 * - NARROW:  < 768px  (md altı) — telefon dikey + yatay
 * - COMPACT: < 1024px (lg altı) — 3 kolonlu master/detail düzenleri burada tek kolona iner
 */
export const MEDIA = {
  PHONE: '(max-width: 639.98px)',
  NARROW: '(max-width: 767.98px)',
  COMPACT: '(max-width: 1023.98px)',
};

/**
 * matchMedia tabanlı hook: sadece eşik geçildiğinde yeniden render eder
 * (useWindowWidth gibi her resize'da değil).
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default useMediaQuery;
