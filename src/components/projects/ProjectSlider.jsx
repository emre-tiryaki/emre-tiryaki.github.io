import { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProjectSlider({ projects }) {
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const clientWidth = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 1) scrollToIndex(currentIndex + 1);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-12 py-4">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none space-x-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-full shrink-0 snap-center flex items-center justify-center"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          aria-label={t('projects.prev')}
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-orange-400 hover:border-orange-500 flex items-center justify-center transition-all z-20 backdrop-blur-md shadow-xl"
        >
          <FiChevronLeft size={24} />
        </button>
      )}

      {currentIndex < projects.length - 1 && (
        <button
          onClick={handleNext}
          aria-label={t('projects.next')}
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-orange-400 hover:border-orange-500 flex items-center justify-center transition-all z-20 backdrop-blur-md shadow-xl"
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-orange-500 scale-125 shadow-md shadow-orange-500/50'
                : 'bg-neutral-800 hover:bg-neutral-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
