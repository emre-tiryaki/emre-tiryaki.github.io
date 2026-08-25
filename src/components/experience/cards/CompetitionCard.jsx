import { FiAward, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useTranslation } from '../../../hooks/translation';

export default function CompetitionCard({ company, title, location, date, duration, achievement }) {
  const { t, tData } = useTranslation();
  const achievementText = achievement ? tData(achievement) : null;

  return (
    <div className="glass-card rounded-xl border-l-4 border-l-amber-500 border border-white/10 hover:border-amber-500/30 transition-all duration-300"
      style={{ padding: '0.75rem 1rem', maxWidth: '520px' }}>
      {achievementText && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
          <FiAward size={12} className="text-amber-400" />
          <span>{achievementText}</span>
        </div>
      )}
      <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-1.5 uppercase tracking-wider">
        {t('experience.types.competition')}
      </span>
      <h3 className="text-sm font-extrabold text-neutral-100 leading-tight">{company}</h3>
      <p className="text-xs font-semibold text-neutral-400 mt-0.5">{tData(title)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2">
        {date && (
          <span className="inline-flex items-center gap-1">
            <FiCalendar size={11} className="text-neutral-400" />
            {tData(date)} {duration ? `(${tData(duration)})` : ''}
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1">
            <FiMapPin size={11} className="text-neutral-400" />
            {tData(location)}
          </span>
        )}
      </div>
    </div>
  );
}
