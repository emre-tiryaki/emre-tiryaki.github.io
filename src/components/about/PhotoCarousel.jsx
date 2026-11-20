import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useSwipe } from '../../hooks/useSwipe';
import { PERSONAL_PHOTOS } from '../../lib/media';

const CAROUSEL_KEY = 'portfolio-carousel-index';

const photos = PERSONAL_PHOTOS;

export default function PhotoCarousel() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(() => {
    const saved = parseInt(localStorage.getItem(CAROUSEL_KEY), 10);
    return saved >= 0 && saved < photos.length ? saved : 0;
  });

  const total = photos.length;
  const handlePrev = () => setIndex((p) => (p - 1 + total) % total);
  const handleNext = () => setIndex((p) => (p + 1) % total);
  const swipeHandlers = useSwipe({ onLeft: handleNext, onRight: handlePrev });

  useEffect(() => {
    localStorage.setItem(CAROUSEL_KEY, String(index));
  }, [index]);

  if (total === 0) {
    return (
      <div className="carousel-container flex items-center justify-center">
        <span className="text-neutral-500 text-sm">{t('about.noPhotos')}</span>
      </div>
    );
  }

  const leftIndex = (index - 1 + total) % total;
  const rightIndex = (index + 1) % total;

  const getSlot = (i) => {
    if (i === index) return 'center';
    if (i === leftIndex) return 'left';
    if (i === rightIndex) return 'right';
    return 'hidden';
  };

  return (
    <div
      className="carousel-container"
      id="photo-carousel"
      {...(total > 1 ? swipeHandlers : {})}
    >
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
                alt={t('about.photoAlt', { n: i + 1 })}
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
            aria-label={t('about.carouselPrev')}
          >
            ‹
          </button>
          <button
            className="carousel-arrow carousel-arrow--next"
            onClick={handleNext}
            aria-label={t('about.carouselNext')}
          >
            ›
          </button>
          <div className="carousel-indicators">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`carousel-indicator${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={t('about.carouselPhotoN', { n: i + 1 })}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
