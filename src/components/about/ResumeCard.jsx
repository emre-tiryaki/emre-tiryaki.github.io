import { useState } from 'react';
import { FiFileText, FiArrowUpRight } from 'react-icons/fi';
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
        className="group relative self-center inline-flex items-center justify-between gap-3.5 rounded-2xl select-none cursor-pointer transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 overflow-hidden"
        style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.45)';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(249, 115, 22, 0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Left: Glowing Icon Badge */}
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
          <FiFileText size={16} />
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex flex-col items-start leading-none">
          <span className="text-sm font-bold tracking-wider text-neutral-100 group-hover:text-white transition-colors">
            {t('about.cvTitle')}
          </span>
          <span className="text-[10px] text-neutral-400 group-hover:text-orange-400 transition-colors mt-0.5">
            PDF
          </span>
        </div>

        {/* Right: Static Arrow Action */}
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.06] text-neutral-400 group-hover:text-orange-400 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all duration-300">
          <FiArrowUpRight size={13} />
        </div>
      </button>

      {/* Embedded CV Modal */}
      <CvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
