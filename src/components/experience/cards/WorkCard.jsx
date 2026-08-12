import { useTranslation } from '../../../hooks/useTranslation';

export default function WorkCard({ company, title, location, startDate, endDate }) {
  const { t, tData } = useTranslation();
  const endText = tData(endDate);
  const isOngoing = endText.toLowerCase().includes('devam') || endText.toLowerCase().includes('present');

  return (
    <div className="glass-card p-5 border-l-4 border-l-blue-500 hover:border-r hover:border-r-blue-500/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            💼 {t('experience.types.work')}
          </span>
          <h3 className="text-xl font-bold text-neutral-100">{company}</h3>
          <p className="text-base font-medium text-neutral-300">{tData(title)}</p>
        </div>

        {isOngoing && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {t('experience.ongoing')}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-y-1 gap-x-4 text-xs text-neutral-400 border-t border-neutral-800/60 pt-3">
        <span>📅 {tData(startDate)} – {endText}</span>
        {location && <span>📍 {tData(location)}</span>}
      </div>
    </div>
  );
}
