import { FiGlobe } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

const LANGUAGES = [
  {
    id: 'tr',
    flag: '🇹🇷',
    name: 'Türkçe',
    proficiency: { tr: 'Ana Dil', en: 'Native' },
  },
  {
    id: 'en',
    flag: '🇬🇧',
    name: 'English',
    proficiency: { tr: 'İleri Seviye (C1)', en: 'Advanced (C1)' },
  },
];

export default function LanguagesCard() {
  const { t, tData } = useTranslation();

  return (
    <div
      className="relative rounded-2xl flex flex-col items-center justify-start self-stretch overflow-visible transition-all duration-300"
      style={{
        minWidth: 0,
        flex: '0 1 auto',
        padding: '0.85rem 0.85rem',
        gap: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-neutral-400">
        <FiGlobe className="text-orange-400 text-xs" />
        <span className="text-xs font-bold uppercase tracking-widest">
          {t('about.languages')}
        </span>
      </div>

      {/* Dil listesi */}
      <div className="flex-1 flex flex-col justify-center gap-2 w-full">
        {LANGUAGES.map((l) => (
          <div key={l.id} className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-white/[0.03] border border-white/[0.08] text-lg select-none">
              {l.flag}
            </div>
            <div className="flex flex-col items-start min-w-0 leading-tight">
              <span className="text-sm font-bold text-neutral-100 truncate max-w-full">
                {l.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 break-words">
                {tData(l.proficiency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
