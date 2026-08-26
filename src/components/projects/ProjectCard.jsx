import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiGithub, FiExternalLink, FiLock, FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/translation';

const previewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png,webp,PNG,JPG,JPEG}',
  { eager: true, import: 'default' }
);

function resolveProjectImages(project) {
  const rawList = Array.isArray(project.previews)
    ? project.previews
    : (Array.isArray(project.images) ? project.images : (project.preview ? [project.preview] : []));

  const resolved = [];

  if (rawList.length === 0 || (rawList.length === 1 && !rawList[0].includes('.'))) {
    const targetFolder = (rawList[0] || project.id || '').toLowerCase();
    Object.entries(previewModules).forEach(([path, module]) => {
      const lower = path.toLowerCase();
      if (lower.includes(`/${targetFolder}/`) || lower.includes(`/${project.id.toLowerCase()}/`)) {
        resolved.push({ path, url: module });
      }
    });
  } else {
    rawList.forEach(item => {
      if (!item) return;
      const match = Object.entries(previewModules).find(([key]) => key.toLowerCase().includes(item.toLowerCase()));
      if (match) {
        resolved.push({ path: match[0], url: match[1] });
      }
    });
  }

  if (resolved.length === 0 && project.id) {
    const idClean = project.id.replace(/[-_]/g, '').toLowerCase();
    Object.entries(previewModules).forEach(([path, module]) => {
      const pathClean = path.replace(/[-_]/g, '').toLowerCase();
      if (pathClean.includes(`/${idClean}/`)) {
        resolved.push({ path, url: module });
      }
    });
  }

  return resolved.sort((a, b) => a.path.localeCompare(b.path)).map(r => r.url);
}

const slideVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

/** Fullscreen Lightbox Modal */
function ImageLightbox({ images, activeIndex, onClose, onSelectIndex, title }) {
  const total = images.length;
  const [[page, direction], setPage] = useState([activeIndex, 0]);

  const paginate = useCallback((newDir) => {
    setPage(([curr]) => {
      const next = (curr + newDir + total) % total;
      onSelectIndex(next);
      return [next, newDir];
    });
  }, [total, onSelectIndex]);

  const goToIndex = useCallback((targetIndex) => {
    setPage(([curr]) => {
      const dir = targetIndex > curr ? 1 : -1;
      onSelectIndex(targetIndex);
      return [targetIndex, dir];
    });
  }, [onSelectIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') paginate(-1);
    if (e.key === 'ArrowRight') paginate(1);
  }, [onClose, paginate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{title}</span>
          {total > 1 && (
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                color: '#fb923c',
              }}
            >
              {page + 1} / {total}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#f8fafc'; }}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Center Image with Prev/Next and Slide Animation */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '1rem 0',
        }}
        onClick={e => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            onClick={() => paginate(-1)}
            style={{
              position: 'absolute',
              left: '1.5rem',
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <FiChevronLeft size={26} />
          </button>
        )}

        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.img
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.22 },
              }}
              src={images[page]}
              alt={`${title} - ${page + 1}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '0.75rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                userSelect: 'none',
              }}
            />
          </AnimatePresence>
        </div>

        {total > 1 && (
          <button
            onClick={() => paginate(1)}
            style={{
              position: 'absolute',
              right: '1.5rem',
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <FiChevronRight size={26} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {total > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            maxWidth: '90vw',
            paddingTop: '0.5rem',
            zIndex: 10,
          }}
          onClick={e => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              style={{
                width: '4.5rem',
                height: '2.8rem',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                border: i === page ? '2px solid #f97316' : '1px solid rgba(255, 255, 255, 0.2)',
                opacity: i === page ? 1 : 0.5,
                background: '#000',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => { if (i !== page) e.currentTarget.style.opacity = '0.5'; }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

export default function ProjectCard({ project }) {
  const { t, tData } = useTranslation();
  const title        = tData(project.title);
  const description  = tData(project.description);
  const achievements = project.achievements ? tData(project.achievements) : null;
  const images       = resolveProjectImages(project);

  const [[photoPage, photoDirection], setPhotoPage] = useState([0, 0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const totalPhotos = images.length;

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setPhotoPage(([curr]) => [(curr - 1 + totalPhotos) % totalPhotos, -1]);
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setPhotoPage(([curr]) => [(curr + 1) % totalPhotos, 1]);
  };

  const handleThumbnailClick = (e, index) => {
    e.stopPropagation();
    setPhotoPage(([curr]) => [index, index > curr ? 1 : -1]);
  };

  return (
    <article
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: '1.25rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.035)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(249, 115, 22, 0.06)';
        setIsHovered(true);
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.4)';
        setIsHovered(false);
      }}
    >
      {/* LEFT — Multi-Photo Interactive Gallery (50% width) */}
      <div
        style={{
          width: '50%',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(10, 10, 14, 0.6)',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: totalPhotos > 0 ? 'pointer' : 'default',
        }}
        onClick={() => { if (totalPhotos > 0) setLightboxOpen(true); }}
      >
        {totalPhotos > 0 ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Active Image with Slide Animation */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <AnimatePresence custom={photoDirection} initial={false} mode="popLayout">
                <motion.img
                  key={photoPage}
                  custom={photoDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
                    opacity: { duration: 0.22 },
                  }}
                  src={images[photoPage]}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Top Badges: Private / Photo Counter / Fullscreen */}
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                left: '0.85rem',
                right: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {project.isPrivate ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#d4d4d8',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <FiLock size={12} style={{ color: '#fb923c' }} />
                  <span>{t('projects.privateRepo')}</span>
                </div>
              ) : <div />}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', pointerEvents: 'auto' }}>
                {totalPhotos > 1 && (
                  <span
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f1f5f9',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {photoPage + 1} / {totalPhotos}
                  </span>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                  aria-label="Tam Ekran"
                  style={{
                    width: '1.85rem',
                    height: '1.85rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fb923c'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  <FiMaximize2 size={11} />
                </button>
              </div>
            </div>

            {/* Prev / Next Arrows (visible when multiple photos exist) */}
            {totalPhotos > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  aria-label="Önceki Fotoğraf"
                  style={{
                    position: 'absolute',
                    left: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)'; e.currentTarget.style.opacity = isHovered ? '1' : '0.6'; }}
                >
                  <FiChevronLeft size={18} />
                </button>

                <button
                  onClick={handleNextPhoto}
                  aria-label="Sonraki Fotoğraf"
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)'; e.currentTarget.style.opacity = isHovered ? '1' : '0.6'; }}
                >
                  <FiChevronRight size={18} />
                </button>

                {/* Bottom Interactive Thumbnail Strip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 10,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleThumbnailClick(e, idx)}
                      style={{
                        width: idx === photoPage ? '1.5rem' : '0.5rem',
                        height: '0.5rem',
                        borderRadius: '999px',
                        background: idx === photoPage ? '#f97316' : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: idx === photoPage ? '0 0 8px rgba(249, 115, 22, 0.8)' : 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.25s ease',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#52525b', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiGithub size={40} />
            </div>
            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>No Preview</span>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && totalPhotos > 0 && (
        <ImageLightbox
          images={images}
          activeIndex={photoPage}
          onClose={() => setLightboxOpen(false)}
          onSelectIndex={(idx) => setPhotoPage([idx, 0])}
          title={title}
        />
      )}

      {/* RIGHT — Project details */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 3rem',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Achievement badge */}
          {achievements && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
              background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.35)',
              color: '#fcd34d', fontSize: '0.85rem', fontWeight: 700,
              alignSelf: 'flex-start',
            }}>
              <span style={{ fontSize: '1rem' }}>🏆</span>
              <span>{achievements}</span>
            </div>
          )}

          {/* Title */}
          <h3 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            color: '#94a3b8',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tech Stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '0.6rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600,
                  color: '#fb923c',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action links */}
          {(project.sourceCode || project.liveDemo) && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0',
                    textDecoration: 'none', transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; }}
                >
                  <FiGithub size={17} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '999px',
                    background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                    fontSize: '0.875rem', fontWeight: 700, color: '#fff',
                    textDecoration: 'none', boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(249,115,22,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.3)'; }}
                >
                  <FiExternalLink size={17} />
                  <span>{t('projects.liveDemo')}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
