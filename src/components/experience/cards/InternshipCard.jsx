import { useTranslation } from '../../../hooks/translation';

export default function InternshipCard({ company, title, location, startDate, endDate }) {
  const { t, tData } = useTranslation();
  const endText = tData(endDate);
  const isOngoing = endText.toLowerCase().includes('devam') || endText.toLowerCase().includes('present');

  return (
    <div className="glass-card rounded-xl border-l-4 border-l-orange-500 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
      style={{ padding: '0.75rem 1rem', maxWidth: '520px' }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 mb-1.5 uppercase tracking-wider">
            {t('experience.types.internship')}
          </span>
          <h3 className="text-sm font-extrabold text-neutral-100 leading-tight">{company}</h3>
          <p className="text-xs font-semibold text-neutral-400 mt-0.5">{tData(title)}</p>
        </div>
        {isOngoing && (
          <span className="self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {t('experience.ongoing')}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2">
        <span>📅 {tData(startDate)} – {endText}</span>
        {location && <span>📍 {tData(location)}</span>}
      </div>
    </div>
  );
}
