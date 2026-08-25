import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';

const languages = [
  { name: 'Türkçe', flag: '🇹🇷', proficiency: { tr: 'Ana Dil', en: 'Native' } },
  { name: 'İngilizce', flag: '🇬🇧', proficiency: { tr: 'İleri Seviye (C1)', en: 'Advanced (C1)' } },
];

export default function LanguagesSection() {
  const { t, tData } = useTranslation();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-3 text-center">
        {t('about.languages')}
      </p>
      <div className="grid grid-cols-2 gap-2 place-items-center">
        {languages.map((l, i) => (
          <div
            key={l.name}
            className="relative flex items-center justify-center w-fit"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl glass-card text-2xl cursor-default transition-transform duration-200 hover:scale-110">
              {l.flag}
            </span>
            {/* Tooltip */}
            <span
              className="absolute bottom-full mb-1 left-1/2 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-neutral-200 whitespace-nowrap pointer-events-none transition-all duration-150 z-20 shadow-md"
              style={{
                background: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(249,115,22,0.35)',
                opacity: hoveredIdx === i ? 1 : 0,
                transform: `translateX(-50%) translateY(${hoveredIdx === i ? '0px' : '2px'})`,
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
