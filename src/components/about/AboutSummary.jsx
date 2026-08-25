import { FiUser } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

export default function AboutSummary() {
  const { t } = useTranslation();

  return (
    <div
      className="relative flex flex-col justify-start overflow-visible transition-all duration-300 w-full"
      style={{
        padding: '1.25rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2.5 text-neutral-400">
        <FiUser className="text-orange-400 text-xs" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest">
          {t('about.summaryTitle') || 'ABOUT ME'}
        </span>
      </div>
      <p className="text-sm text-neutral-200 leading-relaxed text-left">
        {t('about.summary')}
      </p>
    </div>
  );
}
