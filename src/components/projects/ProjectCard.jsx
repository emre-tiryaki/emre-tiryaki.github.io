import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiGithub, FiExternalLink, FiLock, FiChevronLeft, FiChevronRight, FiMaximize2, FiX, FiTerminal } from 'react-icons/fi';
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

  return resolved
    .sort((a, b) => (a.path || '').localeCompare(b.path || ''))
    .map(r => r.url);
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
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
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

export default function ProjectCard({
  project,
  index = 0,
  selectedTechs = [],
  selectedTags = [],
  onToggleTech,
  onToggleTag,
}) {
  const { t, tData } = useTranslation();
  const title        = tData(project.title);
  const description  = tData(project.description);
  const achievements = project.achievements ? tData(project.achievements) : null;
  const images       = resolveProjectImages(project);

  const isEvenRow = index % 2 === 1; // 1-based: row 1 (index 0) = left, row 2 (index 1) = right

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

  // If the project has NO photos/preview at all (e.g. HEGS Haber)
  if (totalPhotos === 0) {
    return (
      <article
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '1.75rem 2rem',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.035)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.25s ease',
          boxSizing: 'border-box',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
          e.currentTarget.style.boxShadow =
            '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(249, 115, 22, 0.06)';
          setIsHovered(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.4)';
          setIsHovered(false);
        }}
      >
        {/* Top Header Row: Title on Left, Action Buttons on Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <h3
            style={{
              flex: 1,
              minWidth: '260px',
              fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              margin: 0,
              textAlign: 'left',
            }}
          >
            {title}
          </h3>

          {/* Action Links & Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0, flexWrap: 'wrap' }}>
            {achievements && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  color: '#fcd34d',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>🏆</span>
                <span>{achievements}</span>
              </div>
            )}

            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(249, 115, 22, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.35)';
                }}
              >
                <FiExternalLink size={15} />
                <span>{t('projects.liveDemo')}</span>
              </a>
            )}

            {project.isPrivate ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#71717a',
                  cursor: 'not-allowed',
                  userSelect: 'none',
                }}
              >
                <FiLock size={14} style={{ color: '#71717a' }} />
                <span>{t('projects.privateRepo')}</span>
              </div>
            ) : (
              project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#e2e8f0';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <FiGithub size={15} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              )
            )}
          </div>
        </div>

        {/* Middle: Full-width Description */}
        <p
          style={{
            fontSize: '0.96rem',
            color: '#94a3b8',
            lineHeight: 1.7,
            fontWeight: 400,
            margin: 0,
            textAlign: 'left',
          }}
        >
          {description}
        </p>

        {/* Bottom Row: Tech Stack on Left, Tags on Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
            {(project.techStack || []).map((tech) => {
              const isSelected = selectedTechs.includes(tech);
              return (
                <span
                  key={tech}
                  onClick={onToggleTech ? () => onToggleTech(tech) : undefined}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '0.5rem',
                    background: isSelected ? 'rgba(249, 115, 22, 0.22)' : 'rgba(255, 255, 255, 0.045)',
                    border: isSelected ? '1px solid rgba(249, 115, 22, 0.6)' : '1px solid rgba(255, 255, 255, 0.09)',
                    fontSize: '0.76rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: isSelected ? '#fb923c' : '#fdba74',
                    letterSpacing: '0.02em',
                    cursor: onToggleTech ? 'pointer' : 'default',
                    boxShadow: isSelected ? '0 0 10px rgba(249, 115, 22, 0.25)' : 'none',
                    transition: 'all 0.18s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (onToggleTech && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.45)';
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (onToggleTech && !isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
                    }
                  }}
                >
                  {tech}
                </span>
              );
            })}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              {project.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <span
                    key={tag}
                    onClick={onToggleTag ? () => onToggleTag(tag) : undefined}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '0.45rem',
                      background: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'rgba(139, 92, 246, 0.08)',
                      border: isSelected ? '1px solid rgba(167, 139, 250, 0.65)' : '1px solid rgba(139, 92, 246, 0.24)',
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: isSelected ? '#ddd6fe' : '#c4b5fd',
                      letterSpacing: '0.02em',
                      cursor: onToggleTag ? 'pointer' : 'default',
                      boxShadow: isSelected ? '0 0 12px rgba(139, 92, 246, 0.28)' : 'none',
                      transition: 'all 0.18s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (onToggleTag && !isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                        e.currentTarget.style.color = '#e9d5ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (onToggleTag && !isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.24)';
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                        e.currentTarget.style.color = '#c4b5fd';
                      }
                    }}
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: isEvenRow ? 'row-reverse' : 'row',
        flexWrap: 'wrap',
        gap: '2rem',
        padding: '1.65rem 2rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.035)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.25s ease',
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(249, 115, 22, 0.06)';
        setIsHovered(true);
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.4)';
        setIsHovered(false);
      }}
    >
      {/* ── PHOTO FRAME: Left or Right based on row (Rendered when project has photos) ── */}
      <div
        style={{
          flex: '0 0 440px',
          maxWidth: '100%',
          minWidth: '300px',
          height: '270px',
          position: 'relative',
          borderRadius: '1.1rem',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'radial-gradient(ellipse at center, rgba(30, 30, 42, 0.9) 0%, rgba(12, 12, 18, 0.98) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
        }}
        onClick={() => setLightboxOpen(true)}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Active Image with Directional Slide */}
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
                  x: { type: 'spring', stiffness: 280, damping: 30 },
                  opacity: { duration: 0.22 },
                }}
                src={images[photoPage]}
                alt={`${title} - ${photoPage + 1}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </AnimatePresence>
          </div>

          {/* Subtle Gradient Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 40%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Zoom / Lightbox Trigger Badge */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
            style={{
              position: 'absolute',
              top: '0.65rem',
              right: '0.65rem',
              width: '1.95rem',
              height: '1.95rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              opacity: isHovered ? 1 : 0.7,
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)'; e.currentTarget.style.opacity = isHovered ? '1' : '0.7'; }}
            aria-label="Enlarge image"
          >
            <FiMaximize2 size={12} />
          </button>

          {/* Slider Controls (Only if multiple photos) */}
          {totalPhotos > 1 && (
            <>
              {/* Prev Arrow */}
              <button
                onClick={handlePrevPhoto}
                style={{
                  position: 'absolute',
                  left: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2.1rem',
                  height: '2.1rem',
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
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)'; e.currentTarget.style.opacity = isHovered ? '1' : '0.6'; }}
              >
                <FiChevronLeft size={16} />
              </button>

              {/* Next Arrow */}
              <button
                onClick={handleNextPhoto}
                style={{
                  position: 'absolute',
                  right: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2.1rem',
                  height: '2.1rem',
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
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.85)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)'; e.currentTarget.style.opacity = isHovered ? '1' : '0.6'; }}
              >
                <FiChevronRight size={16} />
              </button>

              {/* Bottom Dots Indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.6rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 10,
                }}
                onClick={e => e.stopPropagation()}
              >
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleThumbnailClick(e, idx)}
                    style={{
                      width: idx === photoPage ? '1.25rem' : '0.45rem',
                      height: '0.45rem',
                      borderRadius: '999px',
                      background: idx === photoPage ? '#f97316' : 'rgba(255, 255, 255, 0.35)',
                      boxShadow: idx === photoPage ? '0 0 8px rgba(249, 115, 22, 0.8)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.22s ease',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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

      {/* ── PROJECT DETAILS: Text always left-aligned, footer controls direction-aware ── */}
      <div
        style={{
          flex: 1,
          minWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.25rem',
          textAlign: 'left',
        }}
      >
        {/* Top Info Group (Always left-aligned) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.65rem', textAlign: 'left' }}>
          {/* Title */}
          <h3
            style={{
              fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              margin: 0,
              textAlign: 'left',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '0.935rem',
              color: '#94a3b8',
              lineHeight: 1.65,
              fontWeight: 400,
              margin: 0,
              textAlign: 'left',
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom Group: Tech Stack + Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Tech Stack & Tags Row (Opposite sides based on row direction) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
              flexDirection: isEvenRow ? 'row-reverse' : 'row',
            }}
          >
            {/* Tech Stack Pills (Amber / Monospace Code Style) */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.45rem',
                alignItems: 'center',
                justifyContent: isEvenRow ? 'flex-end' : 'flex-start',
              }}
            >
              {(project.techStack || []).map((tech) => {
                const isSelected = selectedTechs.includes(tech);
                return (
                  <span
                    key={tech}
                    onClick={onToggleTech ? () => onToggleTech(tech) : undefined}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '0.5rem',
                      background: isSelected ? 'rgba(249, 115, 22, 0.22)' : 'rgba(255, 255, 255, 0.045)',
                      border: isSelected ? '1px solid rgba(249, 115, 22, 0.6)' : '1px solid rgba(255, 255, 255, 0.09)',
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: isSelected ? '#fb923c' : '#fdba74',
                      letterSpacing: '0.02em',
                      cursor: onToggleTech ? 'pointer' : 'default',
                      boxShadow: isSelected ? '0 0 10px rgba(249, 115, 22, 0.25)' : 'none',
                      transition: 'all 0.18s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={e => {
                      if (onToggleTech && !isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.45)';
                        e.currentTarget.style.background = 'rgba(249, 115, 22, 0.12)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (onToggleTech && !isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
                      }
                    }}
                  >
                    {tech}
                  </span>
                );
              })}
            </div>

            {/* Tags (Violet / Indigo Rounded Rectangle Style with inline #) */}
            {project.tags && project.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.45rem',
                  alignItems: 'center',
                  justifyContent: isEvenRow ? 'flex-start' : 'flex-end',
                }}
              >
                {project.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <span
                      key={tag}
                      onClick={onToggleTag ? () => onToggleTag(tag) : undefined}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '0.45rem',
                        background: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'rgba(139, 92, 246, 0.08)',
                        border: isSelected ? '1px solid rgba(167, 139, 250, 0.65)' : '1px solid rgba(139, 92, 246, 0.24)',
                        fontSize: '0.76rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: isSelected ? '#ddd6fe' : '#c4b5fd',
                        letterSpacing: '0.02em',
                        cursor: onToggleTag ? 'pointer' : 'default',
                        boxShadow: isSelected ? '0 0 12px rgba(139, 92, 246, 0.28)' : 'none',
                        transition: 'all 0.18s ease',
                        userSelect: 'none',
                      }}
                      onMouseEnter={e => {
                        if (onToggleTag && !isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                          e.currentTarget.style.color = '#e9d5ff';
                        }
                      }}
                      onMouseLeave={e => {
                        if (onToggleTag && !isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.24)';
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                          e.currentTarget.style.color = '#c4b5fd';
                        }
                      }}
                    >
                      #{tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Row: Action Buttons + Achievement Badge on the opposite side */}
          {(achievements || project.sourceCode || project.isPrivate || project.liveDemo) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexDirection: isEvenRow ? 'row-reverse' : 'row',
              }}
            >
              {/* Action Buttons */}
              {(project.sourceCode || project.isPrivate || project.liveDemo) && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  {/* Live Demo Button */}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 1.15rem',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(249, 115, 22, 0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.35)'; }}
                    >
                      <FiExternalLink size={15} />
                      <span>{t('projects.liveDemo')}</span>
                    </a>
                  )}

                  {/* Source Code Link or Private Repo Disabled Badge */}
                  {project.isPrivate ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 1.15rem',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#71717a',
                        cursor: 'not-allowed',
                        userSelect: 'none',
                      }}
                    >
                      <FiLock size={14} style={{ color: '#71717a' }} />
                      <span>{t('projects.privateRepo')}</span>
                    </div>
                  ) : (
                    project.sourceCode && (
                      <a
                        href={project.sourceCode}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.5rem 1.15rem',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          color: '#e2e8f0',
                          textDecoration: 'none',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                      >
                        <FiGithub size={15} />
                        <span>{t('projects.sourceCode')}</span>
                      </a>
                    )
                  )}
                </div>
              )}

              {/* Achievement Badge (rendered on the opposite side) */}
              {achievements && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    background: 'rgba(234, 179, 8, 0.12)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    color: '#fcd34d',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>🏆</span>
                  <span>{achievements}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
