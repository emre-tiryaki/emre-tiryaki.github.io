import { useTranslation } from '../../../hooks/useTranslation';

export default function CompetitionCard({ company, title, location, date, duration, achievement }) {
  const { t, tData } = useTranslation();
  const achievementText = achievement ? tData(achievement) : null;

  return (
    <div className="glass-card p-5 border-l-4 border-l-amber-500 hover:border-r hover:border-r-amber-500/30 transition-all duration-300 relative overflow-hidden">
      {achievementText && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-inner">
          <span>🏆</span>
          <span>{achievementText}</span>
        </div>
      )}

      <div>
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
          {t('experience.types.competition')}
        </span>
        <h3 className="text-xl font-bold text-neutral-100">{company}</h3>
        <p className="text-base font-medium text-neutral-300">{tData(title)}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-y-1 gap-x-4 text-xs text-neutral-400 border-t border-neutral-800/60 pt-3">
        {date && <span>📅 {tData(date)} {duration ? `(${tData(duration)})` : ''}</span>}
        {location && <span>📍 {tData(location)}</span>}
      </div>
    </div>
  );
}
