import { useTranslation } from '../../../hooks/useTranslation';

export default function HackathonCard({ company, title, location, date, duration }) {
  const { t, tData } = useTranslation();

  return (
    <div className="glass-card p-5 border-l-4 border-l-emerald-500 hover:border-r hover:border-r-emerald-500/30 transition-all duration-300">
      <div>
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          ⚡ {t('experience.types.hackathon')}
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
