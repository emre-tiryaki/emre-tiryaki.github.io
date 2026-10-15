import { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGithub,
  FiExternalLink,
  FiLock,
  FiZap,
  FiAward,
  FiImage,
  FiCode,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiTerminal,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { useScrollMask } from '../../hooks/useScrollMask';
import { PROJECT_CATEGORY_CONFIG } from '../../theme';
import { getProjectCategoryKey } from './ProjectListCard';

/* ── Asset resolution (copied from ProjectCard / ExperienceDetailView) ── */
const previewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png,webp,PNG,JPG,JPEG,gif,GIF,avif,AVIF,svg,SVG}',
  { eager: true, import: 'default' }
);

const previewLookup = Object.fromEntries(
  Object.entries(previewModules).map(([path, url]) => {
    const idx = path.indexOf('project_previews/');
    const key = idx >= 0 ? path.slice(idx + 'project_previews/'.length) : path;
    return [key, url];
  })
);

function resolveProjectImages(project) {
  if (!project) return [];
  const rawList = Array.isArray(project.previews)
    ? project.previews
    : project.preview
    ? [project.preview]
    : [];
  if (rawList.length === 0) return [];
  const resolved = [];
  for (const item of rawList) {
    if (!item) continue;
    const url = previewLookup[item] || previewLookup[item.replace(/^\/+/, '')];
    if (url) resolved.push(url);
  }
  return resolved;
}

/* ── Fullscreen Gallery Lightbox ── */
function GalleryLightbox({ images, activeIndex, onClose, onSelectIndex, title }) {
  const total = images.length;
  const [[page], setPage] = useState([activeIndex, 0]);

  const paginate = useCallback(
    (dir) => {
      setPage(([curr]) => {
        const next = (curr + dir + total) % total;
        onSelectIndex(next);
        return [next, dir];
      });
    },
    [total, onSelectIndex]
  );

  const goTo = useCallback(
    (idx) => {
      setPage(([curr]) => {
        onSelectIndex(idx);
        return [idx, idx > curr ? 1 : -1];
      });
    },
    [onSelectIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{title}</span>
          {total > 1 && (
            <span
              style={{
                fontSize: '0.8rem',
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
            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#f8fafc'; }}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Main image + arrows */}
      <div
        style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem 0' }}
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            onClick={() => paginate(-1)}
            style={{ position: 'absolute', left: '1.5rem', width: '3.25rem', height: '3.25rem', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.65)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20, transition: 'all 0.18s ease' }}
          >
            <FiChevronLeft size={26} />
          </button>
        )}
        <motion.img
          key={page}
          src={images[page]}
          alt=""
          style={{ maxWidth: '92vw', maxHeight: total > 1 ? '70vh' : '78vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '0.85rem', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)' }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
        {total > 1 && (
          <button
            onClick={() => paginate(1)}
            style={{ position: 'absolute', right: '1.5rem', width: '3.25rem', height: '3.25rem', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.65)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20, transition: 'all 0.18s ease' }}
          >
            <FiChevronRight size={26} />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '85vw', overflowX: 'auto', padding: '0.5rem 0.75rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', zIndex: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              style={{ width: '52px', height: '42px', borderRadius: '0.5rem', overflow: 'hidden', padding: 0, border: idx === page ? '2px solid #fb923c' : '1px solid rgba(255, 255, 255, 0.15)', opacity: idx === page ? 1 : 0.5, cursor: 'pointer', background: '#0a0a0f', flexShrink: 0, transition: 'all 0.15s ease' }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────
   Section Header (reusable) — same style as ExperienceDetailView
───────────────────────────────────────────────────────── */
function SectionHeader({ icon, label, count, iconColor = '#fb923c' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
      {icon && <span style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <h3
        style={{
          margin: 0,
          fontSize: '0.9rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#94a3b8',
        }}
      >
        {label}
      </h3>
      {count != null && (
        <span
          style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#e2e8f0',
            fontWeight: 600,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ t }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: '#475569',
        userSelect: 'none',
        padding: '2rem',
        textAlign: 'center',
        margin: 'auto 0',
      }}
    >
      <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>📂</span>
      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.6 }}>
        {t('projects.selectPrompt')}
      </p>
    </div>
  );
}

/* ── Authentic Bash Syntax Highlighter ── */
function tokenizeBashCommand(cmdText) {
  const tokens = [];
  // Regex to match:
  // 1. Quoted strings: "..." or '...'
  // 2. Shell operators: &&, ||, |, ;, >>, >, <
  // 3. Env var assignments: VAR=value or VAR="value"
  // 4. Flags: -f, --flag
  // 5. Whitespace
  // 6. Words/arguments
  const regex = /("[^"]*"|'[^']*'|&&|\|\||>>|>|<|\||;|[A-Z_][A-Z0-9_]*=(?:'[^']*'|"[^"]*"|[^\s]+)|--?[a-zA-Z0-9_.-]+|\s+|[^\s"']+)/g;
  let match;
  let isCommandPosition = true;

  while ((match = regex.exec(cmdText)) !== null) {
    const text = match[0];

    if (/^\s+$/.test(text)) {
      tokens.push({ type: 'space', text });
      continue;
    }

    if (text === '&&' || text === '||' || text === '|' || text === ';' || text === '>' || text === '>>' || text === '<') {
      tokens.push({ type: 'operator', text });
      isCommandPosition = true;
      continue;
    }

    if (text.startsWith('"') || text.startsWith("'")) {
      tokens.push({ type: 'string', text });
      isCommandPosition = false;
    } else if (/^[A-Z_][A-Z0-9_]*=/.test(text)) {
      const eqIdx = text.indexOf('=');
      tokens.push({
        type: 'env',
        varName: text.slice(0, eqIdx),
        value: text.slice(eqIdx + 1),
      });
      // Remains in command position because env var can precede command (e.g. ANI_CLI_EXACT=1 ani-cli)
    } else if (text.startsWith('-')) {
      tokens.push({ type: 'flag', text });
      isCommandPosition = false;
    } else if (isCommandPosition) {
      tokens.push({ type: 'command', text });
      isCommandPosition = false;
    } else {
      tokens.push({ type: 'arg', text });
    }
  }

  return tokens;
}

function renderBashLine(line, lineIndex) {
  const trimmed = line.trim();

  // Blank line
  if (!trimmed) {
    return <div key={lineIndex} style={{ height: '0.85rem' }} />;
  }

  // Comment line
  if (trimmed.startsWith('#')) {
    const commentBody = line.replace(/^\s*#\s?/, '');
    return (
      <div
        key={lineIndex}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.55rem',
          color: '#64748b',
          fontStyle: 'italic',
          lineHeight: '1.65',
        }}
      >
        <span
          style={{
            userSelect: 'none',
            color: '#475569',
            fontWeight: 700,
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}
        >
          #
        </span>
        <span style={{ color: '#71717a' }}>{commentBody}</span>
      </div>
    );
  }

  // Executable bash command line
  const tokens = tokenizeBashCommand(line);

  return (
    <div
      key={lineIndex}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.55rem',
        lineHeight: '1.7',
      }}
    >
      {/* Shell prompt symbol */}
      <span
        style={{
          userSelect: 'none',
          color: '#10b981',
          fontWeight: 700,
          fontSize: '0.82rem',
          fontFamily: 'monospace',
          opacity: 0.9,
        }}
      >
        $
      </span>

      {/* Token stream */}
      <span style={{ display: 'inline', wordBreak: 'break-all' }}>
        {tokens.map((tok, tIdx) => {
          if (tok.type === 'space') {
            return <span key={tIdx}>{tok.text}</span>;
          }
          if (tok.type === 'operator') {
            return (
              <span key={tIdx} style={{ color: '#f43f5e', fontWeight: 600 }}>
                {tok.text}
              </span>
            );
          }
          if (tok.type === 'env') {
            return (
              <span key={tIdx}>
                <span style={{ color: '#c084fc', fontWeight: 600 }}>{tok.varName}</span>
                <span style={{ color: '#94a3b8' }}>=</span>
                <span style={{ color: '#fb923c' }}>{tok.value}</span>
              </span>
            );
          }
          if (tok.type === 'command') {
            return (
              <span key={tIdx} style={{ color: '#38bdf8', fontWeight: 600 }}>
                {tok.text}
              </span>
            );
          }
          if (tok.type === 'string') {
            return (
              <span key={tIdx} style={{ color: '#facc15' }}>
                {tok.text}
              </span>
            );
          }
          if (tok.type === 'flag') {
            return (
              <span key={tIdx} style={{ color: '#a78bfa' }}>
                {tok.text}
              </span>
            );
          }
          return (
            <span key={tIdx} style={{ color: '#e2e8f0' }}>
              {tok.text}
            </span>
          );
        })}
      </span>
    </div>
  );
}

/* ── Code / Usage Example Block ── */
function UsageBlock({ usage, t, tData }) {
  const [copied, setCopied] = useState(false);

  // Multilingual code resolution
  const rawCode = useMemo(() => {
    if (!usage?.code) return '';
    if (typeof usage.code === 'object') {
      return tData(usage.code) || '';
    }
    return String(usage.code);
  }, [usage?.code, tData]);

  const handleCopy = () => {
    if (!rawCode) return;
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const noteText = usage.note ? tData(usage.note) : null;
  const lines = useMemo(() => rawCode.split('\n'), [rawCode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SectionHeader
          icon={<FiTerminal size={15} />}
          label={t('projects.details.usageTitle')}
          iconColor="#34d399"
        />
      </div>

      <div
        style={{
          borderRadius: '0.85rem',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          background: '#090d16',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Authentic Terminal Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0.95rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', background: '#ff5f56' }} />
            <span style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', background: '#27c93f' }} />
            <span
              style={{
                marginLeft: '0.4rem',
                fontSize: '0.72rem',
                color: '#64748b',
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: '0.02em',
              }}
            >
              bash
            </span>
          </div>

          <button
            onClick={handleCopy}
            type="button"
            title={copied ? t('projects.details.copied') : t('projects.details.copy')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '0.4rem',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: copied ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: copied ? '#34d399' : '#cbd5e1',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
            <span>{copied ? t('projects.details.copied') : t('projects.details.copy')}</span>
          </button>
        </div>

        {/* Terminal Content with Syntax Highlighting */}
        <div
          style={{
            margin: 0,
            padding: '1rem 1.25rem',
            fontFamily:
              "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: '0.84rem',
            overflowX: 'auto',
          }}
        >
          {lines.map((line, idx) => renderBashLine(line, idx))}
        </div>
      </div>

      {noteText && (
        <p
          style={{
            margin: 0,
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.55,
            paddingLeft: '0.65rem',
            borderLeft: '2px solid rgba(52, 211, 153, 0.5)',
          }}
        >
          {noteText}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Export: ProjectDetailView
════════════════════════════════════════════════════════ */
export default function ProjectDetailView({ project }) {
  const { t, tData } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryScrollRef, galleryMaskStyle] = useScrollMask('horizontal', 24);

  // Reset lightbox when project changes
  useEffect(() => {
    setLightboxIndex(null);
  }, [project?.id]);

  const images = useMemo(() => resolveProjectImages(project), [project]);
  const hasImages = images.length > 0;

  const scrollGallery = (direction) => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: direction * 350, behavior: 'smooth' });
    }
  };

  if (!project) {
    return <EmptyState t={t} />;
  }

  const catKey = getProjectCategoryKey(project);
  const cfg = PROJECT_CATEGORY_CONFIG[catKey] || PROJECT_CATEGORY_CONFIG.personal;
  const title = tData(project.title);
  const description = tData(project.description);
  const achievements = project.achievements ? tData(project.achievements) : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
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
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        {/* ── 1. HERO HEADER ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Top row: Category/Hackathon badge + achievement/private + action buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {/* Category badge (only for special categories: hackathon, openSource) */}
              {catKey !== 'project' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: cfg.bgActive,
                    border: `1px solid ${cfg.borderActive}`,
                    color: cfg.textActive,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <span>{cfg.symbol}</span>
                  <span>{t(`projects.categories.${catKey}`)}</span>
                </span>
              )}

              {/* Achievement badge */}
              {achievements && (
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
                  <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>🏆</span>
                  <span>{achievements}</span>
                </span>
              )}

              {/* Hackathon badge (if not already shown by category) */}
              {project.isHackathon && catKey !== 'hackathon' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.28rem 0.75rem',
                    borderRadius: '999px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#e9d5ff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                  }}
                >
                  <FiZap size={12} style={{ color: '#c084fc' }} />
                  <span>{t('projects.hackathonBadge')}</span>
                </span>
              )}

            </div>

            {/* Right: Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {project.sourceCode ? (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.35rem 0.9rem', borderRadius: '0.55rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#f8fafc', fontSize: '0.8rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.18)'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'; e.currentTarget.style.color = '#fb923c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#f8fafc'; }}
                >
                  <FiGithub size={14} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              ) : project.isPrivate ? (
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.35rem 0.9rem', borderRadius: '0.55rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600,
                    userSelect: 'none',
                  }}
                >
                  <FiLock size={13} style={{ color: '#71717a' }} />
                  <span>{t('projects.privateRepo')}</span>
                </div>
              ) : null}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.35rem 0.9rem', borderRadius: '0.55rem',
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    color: '#fb923c', fontSize: '0.8rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.28)'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)'; }}
                >
                  <FiExternalLink size={14} />
                  <span>{t('projects.liveDemo')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              userSelect: 'text',
            }}
          >
            {title}
          </h2>

          {/* ── TECH STACK & TAGS (Immediately below title) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
            {/* Tech Stack */}
            {(project.techStack || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#94a3b8',
                    marginRight: '0.25rem',
                  }}
                >
                  <FiCode size={13} style={{ color: '#fb923c' }} />
                  <span>{t('projects.details.techTitle')}:</span>
                </span>
                {(project.techStack || []).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.45rem',
                      background: 'rgba(249, 115, 22, 0.12)',
                      border: '1px solid rgba(249, 115, 22, 0.25)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#fdba74',
                      letterSpacing: '0.01em',
                      userSelect: 'text',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {(project.tags || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#94a3b8',
                    marginRight: '0.25rem',
                  }}
                >
                  <FiTag size={13} style={{ color: '#a78bfa' }} />
                  <span>{t('projects.details.tagsTitle')}:</span>
                </span>
                {(project.tags || []).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.4rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#c4b5fd',
                      letterSpacing: '0.01em',
                      userSelect: 'text',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 2. DESCRIPTION (Above photos/gallery) ── */}
        {description && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#fb923c', fontSize: '0.9rem' }}>✦</span>
              <h3
                style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}
              >
                {t('projects.details.descriptionTitle')}
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
                userSelect: 'text',
              }}
            >
              {description}
            </p>
          </div>
        )}

        {/* Hackathon Notice Banner */}
        {project.isHackathon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.65rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(168, 85, 247, 0.07)',
              border: '1px dashed rgba(168, 85, 247, 0.3)',
              color: '#d8b4fe',
              fontSize: '0.82rem',
              lineHeight: 1.5,
            }}
          >
            <FiZap size={14} style={{ color: '#c084fc', flexShrink: 0 }} />
            <span>{t('projects.hackathonNotice')}</span>
          </div>
        )}

        {/* ── USAGE / COMMAND EXAMPLE ── */}
        {project.usage && (
          <UsageBlock usage={project.usage} t={t} tData={tData} />
        )}

        {/* ── 3. PHOTO GALLERY (Below description & usage) ── */}
        {hasImages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionHeader
                icon={<FiImage size={15} />}
                label={t('projects.details.galleryTitle')}
                count={images.length}
              />
              {images.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {[
                    { dir: -1, Icon: FiChevronLeft },
                    { dir: 1, Icon: FiChevronRight },
                  ].map(({ dir, Icon }) => (
                    <button
                      key={dir}
                      onClick={() => scrollGallery(dir)}
                      style={{ width: '1.85rem', height: '1.85rem', borderRadius: '0.45rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)'; e.currentTarget.style.color = '#fb923c'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#cbd5e1'; }}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Horizontal scroll gallery */}
            <div
              ref={galleryScrollRef}
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
                ...galleryMaskStyle,
              }}
            >
              {images.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(idx)}
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
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{ height: '100%', width: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                  <div
                    style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', width: '1.75rem', height: '1.75rem', borderRadius: '0.45rem', background: 'rgba(0, 0, 0, 0.65)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
                  >
                    <FiMaximize2 size={11} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && hasImages && (
          <GalleryLightbox
            images={images}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onSelectIndex={setLightboxIndex}
            title={title}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
