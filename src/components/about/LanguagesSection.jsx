import { useTranslation } from '../../hooks/useTranslation';

const FLAG_MAP = {
  Türkçe: '🇹🇷',
  İngilizce: '🇬🇧',
};

const languages = [
  { name: 'Türkçe', proficiency: { tr: 'Ana Dil', en: 'Native' } },
  { name: 'İngilizce', proficiency: { tr: 'İleri Seviye (C1)', en: 'Advanced (C1)' } },
];

export default function LanguagesSection() {
  const { t, tData } = useTranslation();

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-neutral-200 mb-3">{t('about.languages')}</h2>
      <div className="flex flex-wrap gap-3">
        {languages.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card"
          >
            <span className="text-xl">{FLAG_MAP[l.name] || '🌐'}</span>
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t(`about.languageNames.${l.name}`) || l.name}
              </p>
              <p className="text-xs text-neutral-500">{tData(l.proficiency)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
