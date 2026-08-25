import { useState } from 'react';
import { FiFileText, FiEye, FiDownload } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import CvModal from './CvModal';

export default function ResumeCard() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group relative self-center inline-flex items-center justify-center gap-2.5 rounded-full select-none cursor-pointer transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 hover:scale-105"
        style={{
          padding: '0.65rem 1.4rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.45)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
          <FiFileText size={14} />
        </div>
        <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-neutral-200 group-hover:text-white transition-colors">
          {t('about.cvTitle')}
        </span>
      </button>

      {/* Embedded CV Modal */}
      <CvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
