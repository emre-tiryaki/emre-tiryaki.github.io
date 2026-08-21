import { useTranslation } from '../../../hooks/translation';

export default function HackathonCard({ company, title, location, date, duration }) {
  const { t, tData } = useTranslation();

  return (
    <div className="glass-card rounded-xl border-l-4 border-l-emerald-500 border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
      style={{ padding: '0.75rem 1rem', maxWidth: '520px' }}>
      <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1.5 uppercase tracking-wider">
        ⚡ {t('experience.types.hackathon')}
      </span>
      <h3 className="text-sm font-extrabold text-neutral-100 leading-tight">{company}</h3>
      <p className="text-xs font-semibold text-neutral-400 mt-0.5">{tData(title)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2">
        {date && <span>📅 {tData(date)} {duration ? `(${tData(duration)})` : ''}</span>}
        {location && <span>📍 {tData(location)}</span>}
      </div>
    </div>
  );
}
