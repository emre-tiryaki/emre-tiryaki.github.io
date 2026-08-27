import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollMask
 * Dynamically applies gradient edge masks (fade) directly to the DOM element
 * only when the container is scrolled away from its boundaries.
 *
 * @param {'vertical' | 'horizontal'} direction
 * @param {number} fadeSize Fade area in px (default 24)
 * @param {React.RefObject} customRef Optional existing ref
 */
export function useScrollMask(direction = 'vertical', fadeSize = 24, customRef = null) {
  const innerRef = useRef(null);
  const ref = customRef || innerRef;

  const updateMask = useCallback((el) => {
    if (!el) return;

    if (direction === 'horizontal') {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const isScrollable = scrollWidth > clientWidth + 1;

      if (!isScrollable) {
        el.style.maskImage = 'none';
        el.style.webkitMaskImage = 'none';
        return;
      }

      const isAtLeft = scrollLeft <= 2;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth - 2;

      const leftStop = isAtLeft ? 'black 0px' : `transparent 0%, black ${fadeSize}px`;
      const rightStop = isAtRight ? 'black 100%' : `black calc(100% - ${fadeSize}px), transparent 100%`;
      const gradient = `linear-gradient(to right, ${leftStop}, ${rightStop})`;

      el.style.maskImage = gradient;
      el.style.webkitMaskImage = gradient;
    } else {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollable = scrollHeight > clientHeight + 1;

      if (!isScrollable) {
        el.style.maskImage = 'none';
        el.style.webkitMaskImage = 'none';
        return;
      }

      const isAtTop = scrollTop <= 2;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;

      const topStop = isAtTop ? 'black 0px' : `transparent 0%, black ${fadeSize}px`;
      const bottomStop = isAtBottom ? 'black 100%' : `black calc(100% - ${fadeSize}px), transparent 100%`;
      const gradient = `linear-gradient(to bottom, ${topStop}, ${bottomStop})`;

      el.style.maskImage = gradient;
      el.style.webkitMaskImage = gradient;
    }
  }, [direction, fadeSize]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => updateMask(el);
    const handleResize = () => updateMask(el);

    handleScroll();

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const ro = new ResizeObserver(() => {
      updateMask(el);
    });
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, [updateMask, ref]);

  return [ref, {}, updateMask];
}

export default useScrollMask;
