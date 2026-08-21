import { useRef, useState, useEffect } from 'react';

/**
 * ImageCarousel — fixed-height, horizontal snap-scroll carousel.
 *
 * Tasarım kararı: konteyner YÜKSEKLİĞİ sabittir (height prop).
 * Her görsel kendi en-boy oranını korur (object-contain / h-full w-auto),
 * yani NE ince (dikey) NE de kalın (yatay) görsel kırpılmaz:
 *   - dikey görsel  → yükseklik konteynere sığar, genişliği doğal olur
 *   - yatay görsel  → yükseklik konteynere sığar, genişliği taşar → yana kaydırılır
 * Her iki durumda da görselin tamamı görünür (crop yok).
 *
 * Props:
 *   images:  string[]  — görsel URL'leri
 *   height?: number    — konteyner yüksekliği (px), varsayılan 280
 *   rounded?: string   — tailwind rounded sınıfı, varsayılan "rounded-2xl"
 */
export default function ImageCarousel({ images, height = 280, rounded = 'rounded-2xl' }) {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  // Sürükleme (drag) tespiti: gerçek tıklama navigate etsin, sadece
  // kaydırma sonrası tıklama engellensin.
  const dragStartX = useRef(0);
  const movedRef = useRef(false);

  // Aktif nokta + snap hesabı: gerçek slide genişliğini ölçtüğü için
  // ince/kalın görsel karışımında da sapma olmaz.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const compute = () => {
      const first = track.querySelector('[data-slide]');
      if (!first) return;
      const slideW = first.getBoundingClientRect().width + 8; // +gap(2=8px)
      if (slideW <= 0) return;
      setActiveIdx(Math.round(track.scrollLeft / slideW));
    };

    track.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    compute();
    return () => {
      track.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [images]);

  if (!images || images.length === 0) return null;

  const scrollTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('[data-slide]');
    const slideW = first ? first.getBoundingClientRect().width + 8 : track.clientWidth;
    track.scrollTo({ left: i * slideW, behavior: 'smooth' });
  };

  const onWheel = (e) => {
    // Dikey scroll'u yatay kaydırmaya çevir (mouse/trackpad dostu)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const track = trackRef.current;
      if (track && track.scrollWidth > track.clientWidth + 2) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${rounded} border border-white/[0.06] bg-black/20`}
      style={{ height }}
      // Sürükle-kaydırma bittiyse tıklamayı engelle (Link'e gitmesin);
      // ama düz tıklama (görsele basmak) navigate etsin.
      onPointerDown={(e) => {
        dragStartX.current = e.clientX;
        movedRef.current = false;
      }}
      onPointerMove={(e) => {
        if (Math.abs(e.clientX - dragStartX.current) > 6) movedRef.current = true;
      }}
      onClick={(e) => {
        if (movedRef.current) e.preventDefault();
      }}
    >
      <div
        ref={trackRef}
        onWheel={onWheel}
        className="flex h-full snap-x snap-mandatory overflow-x-auto gap-2 px-2 no-scrollbar items-center"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            data-slide
            className="relative h-full shrink-0 snap-center snap-always flex items-center justify-center"
          >
            <img
              src={src}
              alt={`Fotoğraf ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="h-full w-auto max-w-none rounded-xl object-contain"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollTo(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-5 bg-white shadow-md' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Fotoğraf ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
