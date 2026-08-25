import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiDownload, FiMaximize2, FiMinimize2, FiFileText } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import trCv from '../../assets/cv/tr_cv.pdf';
import enCv from '../../assets/cv/en_cv.pdf';

export default function CvModal({ isOpen, onClose }) {
  const { lang, t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCvUrl = lang === 'tr' ? trCv : enCv;
  const fileName = lang === 'tr' ? 'Emre_Tiryaki_CV_TR.pdf' : 'Emre_Tiryaki_CV_EN.pdf';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(249, 115, 22, 0.15)',
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
          {/* Left: Only CV filename */}
          <div className="flex items-center">
            <span className="text-xs sm:text-sm font-mono font-medium text-neutral-300">
              {fileName}
            </span>
          </div>

          {/* Right: Actions (Download, Maximize, Close) */}
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <a
              href={currentCvUrl}
              download={fileName}
              className="group relative inline-flex items-center justify-center rounded-lg text-xs font-bold text-white transition-all duration-200 shadow-md hover:brightness-110 active:scale-95 cursor-pointer overflow-hidden"
              style={{
                height: '2rem', // 32px
                padding: '0 18px',
                gap: '8px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              }}
            >
              <FiDownload size={13} className="shrink-0" />
              <span className="whitespace-nowrap">{t('about.downloadCv')}</span>
            </a>

            {/* Maximize / Restore Button */}
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              aria-label="Toggle Fullscreen"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-neutral-100 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-150 active:scale-95"
            >
              {isMaximized ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-150 active:scale-95"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* ── Modal Body / PDF Viewer ── */}
        <div className="relative flex-1 w-full h-full bg-[#111111] overflow-auto">
          <iframe
            src={`${currentCvUrl}#toolbar=1&navpanes=0`}
            title="CV Document Viewer"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
