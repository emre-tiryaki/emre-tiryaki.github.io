import { useState, useEffect } from 'react';

const CAROUSEL_KEY = 'portfolio-carousel-index';

const photoModules = import.meta.glob(
  '../../assets/personal_photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);

const photos = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function PhotoCarousel() {
  const [index, setIndex] = useState(() => {
    const saved = parseInt(localStorage.getItem(CAROUSEL_KEY), 10);
    return saved >= 0 && saved < photos.length ? saved : 0;
  });

  const total = photos.length;

  useEffect(() => {
    localStorage.setItem(CAROUSEL_KEY, String(index));
  }, [index]);

  if (total === 0) {
    return (
      <div className="carousel-container flex items-center justify-center">
        <span className="text-neutral-500 text-sm font-mono">No photos found</span>
      </div>
    );
  }

  const handlePrev = () => setIndex((p) => (p - 1 + total) % total);
  const handleNext = () => setIndex((p) => (p + 1) % total);

  const leftIndex = (index - 1 + total) % total;
  const rightIndex = (index + 1) % total;

  const getSlot = (i) => {
    if (i === index) return 'center';
    if (i === leftIndex) return 'left';
    if (i === rightIndex) return 'right';
    return 'hidden';
  };

  return (
    <div className="carousel-container" id="photo-carousel">
      <div className="carousel-stage">
        {photos.map((photo, i) => {
          const slot = getSlot(i);
          return (
            <div
              key={photo}
              className={`carousel-slide carousel-slide--${slot}`}
            >
              <img
                src={photo}
                alt={`Emre Tiryaki — foto ${i + 1}`}
                draggable="false"
              />
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            className="carousel-arrow carousel-arrow--prev"
            onClick={handlePrev}
            aria-label="Önceki fotoğraf"
          >
            ‹
          </button>
          <button
            className="carousel-arrow carousel-arrow--next"
            onClick={handleNext}
            aria-label="Sonraki fotoğraf"
          >
            ›
          </button>
          <div className="carousel-indicators">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`carousel-indicator${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Fotoğraf ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
