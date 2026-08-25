import { useState } from 'react';
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
  const [hoveredLang, setHoveredLang] = useState(null);

  return (
    <div
      className="relative rounded-2xl flex flex-col items-center justify-start overflow-visible transition-all duration-300"
      style={{
        width: '135px',
        padding: '0.85rem 1rem',
        gap: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-neutral-400">
        <FiGlobe className="text-orange-400 text-xs" />
        <span className="text-xs font-mono font-bold uppercase tracking-widest">
          {t('about.languages')}
        </span>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5 place-items-center">
        {LANGUAGES.map((l) => (
          <div
            key={l.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredLang(l.id)}
            onMouseLeave={() => setHoveredLang(null)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] text-2xl cursor-default transition-all duration-200 hover:scale-110 hover:border-orange-500/40 hover:bg-orange-500/10 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              {l.flag}
            </div>

            {/* Tooltip */}
            <span
              className="absolute bottom-full mb-1 left-1/2 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-neutral-200 whitespace-nowrap pointer-events-none transition-all duration-150 z-30 shadow-lg"
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                opacity: hoveredLang === l.id ? 1 : 0,
                transform: `translateX(-50%) translateY(${hoveredLang === l.id ? '0px' : '2px'})`,
              }}
            >
              {tData(l.proficiency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
