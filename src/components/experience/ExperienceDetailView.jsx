import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBriefcase,
  FiZap,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiFolder,
  FiImage,
  FiCheckCircle,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGithub,
  FiExternalLink,
  FiLock,
  FiMaximize2,
  FiUsers,
  FiUser,
  FiLinkedin,
  FiGlobe,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

const TYPE_THEME = {
  internship: {
    color: '#f97316',
    border: 'rgba(249, 115, 22, 0.4)',
    bg: 'rgba(249, 115, 22, 0.1)',
    badgeText: '#fb923c',
    icon: FiBriefcase,
  },
  hackathon: {
    color: '#10b981',
    border: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.1)',
    badgeText: '#34d399',
    icon: FiZap,
  },
  competition: {
    color: '#eab308',
    border: 'rgba(234, 179, 8, 0.4)',
    bg: 'rgba(234, 179, 8, 0.1)',
    badgeText: '#facc15',
    icon: FiAward,
  },
  work: {
    color: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.4)',
    bg: 'rgba(59, 130, 246, 0.1)',
    badgeText: '#60a5fa',
    icon: FiBriefcase,
  },
};

const experiencePhotosModules = import.meta.glob(
  '../../assets/experience/**/*.{jpg,jpeg,png,webp,PNG,JPG,JPEG,gif,GIF,avif,AVIF,svg,SVG}',
  { eager: true, import: 'default' }
);

const projectPreviewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png,webp,PNG,JPG,JPEG,gif,GIF,avif,AVIF,svg,SVG}',
  { eager: true, import: 'default' }
);

function pseudoRandomShuffle(array, seedStr = 'seed') {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function resolveExperiencePhotos(experience) {
  if (!experience) return [];
  const rawList = Array.isArray(experience.photos) ? experience.photos : [];
  const resolved = [];

  if (rawList.length > 0) {
    rawList.forEach((item) => {
      const match = Object.entries(experiencePhotosModules).find(([key]) =>
        key.toLowerCase().includes(item.toLowerCase())
      );
      if (match) resolved.push({ path: match[0], url: match[1] });
    });
  }

  // Auto-detect all photos in the folder matching experience id
  if (resolved.length === 0 && experience.id) {
    const idClean = experience.id.toLowerCase();
    Object.entries(experiencePhotosModules).forEach(([path, module]) => {
      const lower = path.toLowerCase();
      if (lower.includes(`/${idClean}/`) && !lower.endsWith('.gitkeep')) {
        resolved.push({ path, url: module });
      }
    });
  }

  const sorted = resolved
    .sort((a, b) =>
      (a.path || '').localeCompare(b.path || '', undefined, { numeric: true, sensitivity: 'base' })
    )
    .map((r) => r.url);

  return pseudoRandomShuffle(sorted, (experience.id || 'exp') + '_shuffle_seed');
}

function resolveProjectImages(project) {
  if (!project) return [];
  const rawList = Array.isArray(project.previews)
    ? project.previews
    : (Array.isArray(project.images) ? project.images : (project.preview ? [project.preview] : []));

  const resolved = [];

  if (rawList.length === 0 || (rawList.length === 1 && !rawList[0].includes('.'))) {
    const targetFolder = (rawList[0] || project.id || '').toLowerCase();
    Object.entries(projectPreviewModules).forEach(([path, module]) => {
      const lower = path.toLowerCase();
      if (lower.includes(`/${targetFolder}/`) || lower.includes(`/${project.id.toLowerCase()}/`)) {
        if (!lower.endsWith('.gitkeep')) {
          resolved.push({ path, url: module });
        }
      }
    });
  } else {
    rawList.forEach((item) => {
      if (!item) return;
      const match = Object.entries(projectPreviewModules).find(([key]) =>
        key.toLowerCase().includes(item.toLowerCase())
      );
      if (match) {
        resolved.push({ path: match[0], url: match[1] });
      }
    });
  }

  if (resolved.length === 0 && project.id) {
    const idClean = project.id.replace(/[-_]/g, '').toLowerCase();
    Object.entries(projectPreviewModules).forEach(([path, module]) => {
      const pathClean = path.replace(/[-_]/g, '').toLowerCase();
      if (pathClean.includes(`/${idClean}/`) && !pathClean.endsWith('.gitkeep')) {
        resolved.push({ path, url: module });
      }
    });
  }

  return resolved
    .sort((a, b) =>
      (a.path || '').localeCompare(b.path || '', undefined, { numeric: true, sensitivity: 'base' })
    )
    .map((r) => r.url);
}

/** Fullscreen Gallery Lightbox with Keyboard + Bottom Thumbnail Strip */
function GalleryLightbox({ images, activeIndex, onClose, onSelectIndex, title }) {
  const total = images.length;
  const [[page, _direction], setPage] = useState([activeIndex, 0]);

  const paginate = useCallback(
    (newDir) => {
      setPage(([curr]) => {
        const next = (curr + newDir + total) % total;
        onSelectIndex(next);
        return [next, newDir];
      });
    },
    [total, onSelectIndex]
  );

  const goTo = useCallback(
    (idx) => {
      setPage(([curr]) => {
        const dir = idx > curr ? 1 : -1;
        onSelectIndex(idx);
        return [idx, dir];
      });
    },
    [onSelectIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, paginate]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
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
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{title}</span>
          {total > 1 && (
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                color: '#fb923c',
                fontWeight: 700,
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#f8fafc';
          }}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Main Image Area with Aspect Ratio Preservation */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0.5rem 0',
        }}
        onClick={(e) => e.stopPropagation()}
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
          >
            <FiChevronLeft size={26} />
          </button>
        )}

        <motion.img
          key={page}
          src={images[page]}
          alt=""
          style={{
            maxWidth: '92vw',
            maxHeight: total > 1 ? '70vh' : '78vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '0.85rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />

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
          >
            <FiChevronRight size={26} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (When multiple photos exist) */}
      {total > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '85vw',
            overflowX: 'auto',
            padding: '0.5rem 0.75rem',
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, idx) => {
            const isCurr = idx === page;
            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                style={{
                  width: '52px',
                  height: '42px',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  padding: 0,
                  border: isCurr ? '2px solid #fb923c' : '1px solid rgba(255, 255, 255, 0.15)',
                  opacity: isCurr ? 1 : 0.5,
                  cursor: 'pointer',
                  background: '#0a0a0f',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
}

/** Bespoke Embedded Project Card Tailored for Experience View */
function EmbeddedProjectCard({ project }) {
  const { t, tData } = useTranslation();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = useMemo(() => resolveProjectImages(project), [project]);
  const totalPhotos = images.length;
  const hasImages = totalPhotos > 0;

  const title = tData(project.title);
  const description = tData(project.description);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem',
        borderRadius: '1.15rem',
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.35)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── Top Header: Title & Action Links ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <h4
            style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '-0.01em',
              userSelect: 'text',
              cursor: 'text',
              lineHeight: 1.35,
            }}
          >
            {title}
          </h4>
        </div>

        {/* Action Links — Always stays pinned to the top-right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: 'auto' }}>
          {project.sourceCode && (
            <a
              href={project.sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
                e.currentTarget.style.color = '#fb923c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#f8fafc';
              }}
            >
              <FiGithub size={13} />
              <span>{t('projects.sourceCode')}</span>
            </a>
          )}

          {project.isPrivate && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                userSelect: 'none',
              }}
            >
              <FiLock size={12} />
              <span>{t('projects.privateRepo')}</span>
            </span>
          )}

          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                color: '#fb923c',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <FiExternalLink size={13} />
              <span>{t('projects.liveDemo')}</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Main Body: Side-by-Side Preview & Content ── */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'stretch',
          flexWrap: 'wrap',
        }}
      >
        {/* Screenshot Slider / Preview Container */}
        {hasImages ? (
          <div
            style={{
              width: '280px',
              maxWidth: '100%',
              aspectRatio: '16/10',
              borderRadius: '0.85rem',
              overflow: 'hidden',
              position: 'relative',
              background: '#09090d',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}
          >
            <img
              src={images[photoIndex]}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => setLightboxOpen(true)}
            />

            {/* Maximize Zoom Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              style={{
                position: 'absolute',
                top: '0.45rem',
                right: '0.45rem',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.45rem',
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5,
              }}
            >
              <FiMaximize2 size={11} />
            </button>

            {/* Slider Navigation Arrows */}
            {totalPhotos > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  style={{
                    position: 'absolute',
                    left: '0.4rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.85rem',
                    height: '1.85rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 5,
                  }}
                >
                  <FiChevronLeft size={13} />
                </button>
                <button
                  onClick={nextPhoto}
                  style={{
                    position: 'absolute',
                    right: '0.4rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.85rem',
                    height: '1.85rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 5,
                  }}
                >
                  <FiChevronRight size={13} />
                </button>

                {/* Slider Indicator Dots */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.45rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.25rem',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 5,
                  }}
                >
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      style={{
                        width: idx === photoIndex ? '0.85rem' : '0.35rem',
                        height: '0.35rem',
                        borderRadius: '999px',
                        background: idx === photoIndex ? '#fb923c' : 'rgba(255, 255, 255, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Right Info: Description + Tech Stack & Tags */}
        <div
          style={{
            flex: 1,
            minWidth: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: '0.88rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>

          {/* Bottom Chips: Techs & Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {/* Tech Stack */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(project.techStack || []).map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '0.18rem 0.55rem',
                    borderRadius: '0.4rem',
                    background: 'rgba(249, 115, 22, 0.12)',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                    fontSize: '0.73rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#fdba74',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.18rem 0.55rem',
                      borderRadius: '0.35rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      fontSize: '0.73rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#c4b5fd',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for Project Photos */}
      {lightboxOpen && hasImages && (
        <GalleryLightbox
          images={images}
          activeIndex={photoIndex}
          onClose={() => setLightboxOpen(false)}
          onSelectIndex={setPhotoIndex}
          title={title}
        />
      )}
    </div>
  );
}

export default function ExperienceDetailView({ experience, projectsData = [] }) {
  const { t, tData } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const galleryScrollRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryScrollRef.current) {
      const scrollAmount = direction * 350;
      galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Resolve related projects from projects.json by ID (Zero duplication!)
  const relatedProjects = useMemo(() => {
    if (!experience) return [];
    const ids = Array.isArray(experience.projectIds) ? experience.projectIds : [];
    return ids
      .map((id) => projectsData.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase()))
      .filter(Boolean);
  }, [experience, projectsData]);

  // Resolve photos
  const photos = useMemo(() => {
    if (!experience) return [];
    return resolveExperiencePhotos(experience);
  }, [experience]);

  // Resolve team members with deterministic random shuffle
  const teamMembers = useMemo(() => {
    if (!experience || !Array.isArray(experience.team)) return [];
    return pseudoRandomShuffle(experience.team, (experience.id || 'exp') + '_team_shuffle_v1');
  }, [experience]);

  if (!experience) {
    return null;
  }

  const theme = TYPE_CONFIG_THEME(experience.type);
  const Icon = theme.icon;

  const titleText = tData(experience.title);
  const locationText = experience.location ? tData(experience.location) : null;
  const achievementText = experience.achievement ? tData(experience.achievement) : null;
  const storyText = experience.story ? tData(experience.story) : null;
  const durationText = experience.duration ? tData(experience.duration) : null;
  const endText = experience.endDate ? tData(experience.endDate) : null;
  const isOngoing =
    endText &&
    (endText.toLowerCase().includes('devam') || endText.toLowerCase().includes('present'));

  const dateDisplay =
    experience.startDate && endText
      ? `${tData(experience.startDate)} – ${endText}`
      : experience.date
      ? tData(experience.date)
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={experience.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          padding: '1.75rem 2rem',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.025)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
      >
        {/* ── 1. HEADER HERO: Company, Role, Badges & Date ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Top Row: Type Pill + Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  color: theme.badgeText,
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <Icon size={13} />
                <span>{t(`experience.types.${experience.type}`)}</span>
              </span>

              {isOngoing && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '0.45rem',
                      height: '0.45rem',
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 6px #34d399',
                    }}
                  />
                  <span>{t('experience.ongoing')}</span>
                </span>
              )}

              {achievementText && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.28rem 0.75rem',
                    borderRadius: '999px',
                    background: 'rgba(234, 179, 8, 0.14)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    color: '#fef08a',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    boxShadow: '0 0 12px rgba(234, 179, 8, 0.15)',
                  }}
                >
                  <FiAward size={13} style={{ color: '#facc15' }} />
                  <span>{achievementText}</span>
                </span>
              )}
            </div>

            {/* Date & Duration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {dateDisplay && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#e2e8f0', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  <FiCalendar size={13} style={{ color: theme.color }} />
                  <span>{dateDisplay}</span>
                </div>
              )}
              {durationText && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <FiClock size={12} />
                  <span>{durationText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Title Row: Company on the Left | Role/Title & Location on the Far Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {experience.url ? (
              <a
                href={experience.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textDecoration: 'none',
                  color: '#f8fafc',
                  transition: 'all 0.2s ease',
                  userSelect: 'text',
                  cursor: 'pointer',
                  maxWidth: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#fb923c';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#f8fafc';
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.6rem, 2.3vw, 2.1rem)',
                    fontWeight: 800,
                    color: 'inherit',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(251, 146, 60, 0.4)',
                    textUnderlineOffset: '6px',
                  }}
                >
                  {experience.company}
                </h2>
                <FiExternalLink size={20} style={{ color: '#fb923c', flexShrink: 0, marginTop: '0.15rem' }} />
              </a>
            ) : (
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.6rem, 2.3vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#f8fafc',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  userSelect: 'text',
                  cursor: 'text',
                }}
              >
                {experience.company}
              </h2>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                textAlign: 'right',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(1.15rem, 1.4vw, 1.35rem)',
                  fontWeight: 700,
                  color: '#fb923c',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                {titleText}
              </span>
              {locationText && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#94a3b8',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    userSelect: 'text',
                    cursor: 'text',
                  }}
                >
                  <FiMapPin size={13} style={{ color: theme.color, userSelect: 'none' }} />
                  <span>{locationText}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. MODULAR SECTION: STORY / OVERVIEW ── */}
        {storyText && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#fb923c', fontSize: '0.9rem' }}>✦</span>
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#94a3b8',
                }}
              >
                {t('experience.details.overviewTitle')}
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.94rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '1.1rem 1.35rem',
                borderRadius: '0.9rem',
              }}
            >
              {storyText}
            </p>
          </div>
        )}

        {/* ── 3. MODULAR SECTION: RELATED PROJECTS (Referenced from projects.json) ── */}
        {relatedProjects.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <FiFolder size={15} style={{ color: '#fb923c' }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#94a3b8',
                }}
              >
                {t('experience.details.projectsTitle')}
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  color: '#fb923c',
                  fontWeight: 700,
                }}
              >
                {relatedProjects.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {relatedProjects.map((project) => (
                <EmbeddedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* ── MODULAR SECTION: TEAM MEMBERS / TEŞEKKÜR & KİŞİLER ── */}
        {Array.isArray(experience.team) && experience.team.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <FiUsers size={15} style={{ color: '#fb923c' }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#94a3b8',
                }}
              >
                {t('experience.details.teamTitle')}
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  color: '#fb923c',
                  fontWeight: 700,
                }}
              >
                {teamMembers.length}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              {teamMembers.map((member, idx) => {
                const portfolioUrl = member.portfolio || member.url;
                const linkedinUrl = member.linkedin;
                const githubUrl = member.github;
                const hasAnyLink = Boolean(portfolioUrl || linkedinUrl || githubUrl);

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.42rem 0.65rem 0.42rem 0.5rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {/* Avatar Icon */}
                    <div
                      style={{
                        width: '1.65rem',
                        height: '1.65rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        flexShrink: 0,
                      }}
                    >
                      <FiUser size={12} />
                    </div>

                    {/* Member Name */}
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#e2e8f0',
                        userSelect: 'text',
                        marginRight: hasAnyLink ? '0.15rem' : 0,
                      }}
                    >
                      {member.name}
                    </span>

                    {/* Action Link Icons: Portfolio, LinkedIn, GitHub */}
                    {hasAnyLink && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {/* Portfolio Button */}
                        {portfolioUrl && (
                          <a
                            href={portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t('experience.portfolioLink')}
                            aria-label={`${member.name} ${t('experience.portfolioLink')}`}
                            style={{
                              width: '1.6rem',
                              height: '1.6rem',
                              borderRadius: '0.45rem',
                              background: 'rgba(249, 115, 22, 0.12)',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                              color: '#fb923c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.25)';
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.65)';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(249, 115, 22, 0.4)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.12)';
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.color = '#fb923c';
                            }}
                          >
                            <FiGlobe size={11} />
                          </a>
                        )}

                        {/* LinkedIn Button */}
                        {linkedinUrl && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t('experience.linkedinProfile')}
                            aria-label={`${member.name} ${t('experience.linkedinProfile')}`}
                            style={{
                              width: '1.6rem',
                              height: '1.6rem',
                              borderRadius: '0.45rem',
                              background: 'rgba(10, 102, 194, 0.15)',
                              border: '1px solid rgba(10, 102, 194, 0.35)',
                              color: '#60a5fa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(10, 102, 194, 0.3)';
                              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.7)';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.45)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(10, 102, 194, 0.15)';
                              e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.35)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.color = '#60a5fa';
                            }}
                          >
                            <FiLinkedin size={11} />
                          </a>
                        )}

                        {/* GitHub Button */}
                        {githubUrl && (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t('experience.githubProfile')}
                            aria-label={`${member.name} ${t('experience.githubProfile')}`}
                            style={{
                              width: '1.6rem',
                              height: '1.6rem',
                              borderRadius: '0.45rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.18)',
                              color: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.color = '#e2e8f0';
                            }}
                          >
                            <FiGithub size={11} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 4. MODULAR SECTION: PHOTOS / GALLERY (Horizontal Strip, Equal Height, Natural Widths) ── */}
        {photos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <FiImage size={15} style={{ color: '#fb923c' }} />
                <h3
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#94a3b8',
                  }}
                >
                  {t('experience.details.galleryTitle')}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    fontWeight: 600,
                  }}
                >
                  {photos.length}
                </span>
              </div>

              {/* Navigation Scroll Buttons */}
              {photos.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => scrollGallery(-1)}
                    aria-label={t('experience.scrollLeft')}
                    style={{
                      width: '1.85rem',
                      height: '1.85rem',
                      borderRadius: '0.45rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                      e.currentTarget.style.color = '#fb923c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => scrollGallery(1)}
                    aria-label={t('experience.scrollRight')}
                    style={{
                      width: '1.85rem',
                      height: '1.85rem',
                      borderRadius: '0.45rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                      e.currentTarget.style.color = '#fb923c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Horizontal Scrollable Gallery Strip with Edge Fade Mask */}
            <div
              ref={galleryScrollRef}
              className="scroll-mask-x"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                paddingBottom: '0.65rem',
                paddingTop: '0.25rem',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(249, 115, 22, 0.35) transparent',
              }}
            >
              {photos.map((src, index) => (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  role="button"
                  tabIndex={0}
                  style={{
                    height: '240px',
                    flexShrink: 0,
                    borderRadius: '0.9rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0a0a0f',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{
                      height: '100%',
                      width: 'auto',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Hover expand overlay badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.5rem',
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '0.45rem',
                      background: 'rgba(0, 0, 0, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <FiMaximize2 size={11} />
                  </div>
                </div>
              ))}
            </div>

            {lightboxIndex !== null && (
              <GalleryLightbox
                images={photos}
                activeIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onSelectIndex={setLightboxIndex}
                title={`${experience.company} - ${t('experience.details.galleryTitle')}`}
              />
            )}
          </div>
        )}

        {/* ── 5. MODULAR CUSTOM SECTIONS (Highlights, Learnings, Custom Blocks) ── */}
        {Array.isArray(experience.customSections) &&
          experience.customSections.map((sec) => {
            const secTitle = tData(sec.title);
            return (
              <div key={sec.id || secTitle} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCheckCircle size={14} style={{ color: '#fb923c' }} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                    }}
                  >
                    {secTitle}
                  </h3>
                </div>

                {Array.isArray(sec.items) && (
                  <ul
                    style={{
                      margin: 0,
                      padding: '0.85rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      listStyleType: 'none',
                    }}
                  >
                    {sec.items.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.55rem',
                          color: '#cbd5e1',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: '#fb923c', marginTop: '0.15rem' }}>▸</span>
                        <span>{tData(item)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </motion.div>
    </AnimatePresence>
  );
}

function TYPE_CONFIG_THEME(type) {
  return TYPE_THEME[type] || TYPE_THEME.internship;
}
