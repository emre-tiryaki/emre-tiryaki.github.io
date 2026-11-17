import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiDownload, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';

const { accent } = THEME_COLORS;

// Shared PDF viewer modal. Mount it only while open; unmounting closes it.
export default function PdfModal({ onClose, pdfUrl, title, downloadName, viewerTitle }) {
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);

  // Lock background scroll while mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pdfUrl) return null;

  const fileName = downloadName || (title ? `${title.replace(/[\s/\\?%*:|"<>]+/g, '_')}.pdf` : 'document.pdf');

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'w-[98vw] h-[95vh]'
            : 'w-full max-w-4xl h-[85vh]'
        }`}
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px ${accent.a15}`,
        }}
      >
        {/* ── Modal Header ── */}
        <div
          className="flex items-center justify-between gap-4 border-b border-white/[0.08]"
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Left: Certificate Title */}
          <div className="flex items-center min-w-0 pr-2">
            <span className="text-xs sm:text-sm font-medium text-neutral-300 truncate">
              {title || fileName}
            </span>
          </div>

          {/* Right: Actions (Download, Maximize, Close) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Download Button */}
            <a
              href={pdfUrl}
              download={fileName}
              className="group relative inline-flex items-center justify-center rounded-lg text-xs font-bold text-white transition-all duration-200 shadow-md hover:brightness-110 active:scale-95 cursor-pointer overflow-hidden"
              style={{
                height: '2rem',
                padding: '0 18px',
                gap: '8px',
                background: accent.gradient,
                boxShadow: `0 4px 12px ${accent.borderSubtle}`,
              }}
            >
              <FiDownload size={13} className="shrink-0" />
              <span className="whitespace-nowrap">{t('about.downloadCv')}</span>
            </a>

            {/* Maximize / Restore Button */}
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              aria-label={isMaximized ? t('common.minimize') : t('common.maximize')}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-neutral-100 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-150 active:scale-95"
            >
              {isMaximized ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-150 active:scale-95"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* ── Modal Body / PDF Viewer ── */}
        <div className="relative flex-1 w-full h-full bg-[#111111] overflow-auto">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title={viewerTitle || title || 'PDF Document Viewer'}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
