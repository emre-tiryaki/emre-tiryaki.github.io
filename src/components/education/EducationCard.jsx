import { useTranslation } from '../../hooks/useTranslation';

const inonuLogo = new URL('../../assets/education/inonu_university_logo.png', import.meta.url).href;

export default function EducationCard({ school, logo, degree, field, startDate, endDate, gpa, activities }) {
  const { t, tData } = useTranslation();

  return (
    <div className="glass-card p-6 sm:p-8 max-w-2xl w-full mx-auto transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-900 border border-neutral-700/80 p-3 flex items-center justify-center shadow-lg group">
            <img
              src={logo ? new URL(`../../assets/${logo}`, import.meta.url).href : inonuLogo}
              alt={tData(school)}
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300 -z-10" />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-neutral-100">{tData(school)}</h2>
          <p className="text-lg font-medium text-orange-400">
            {tData(degree)} — {tData(field)}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-neutral-400 pt-1">
            <span>📅 {tData(startDate)} – {tData(endDate)}</span>
            <span>🎓 {t('education.gpa')}: <strong className="text-neutral-200">{gpa}</strong></span>
          </div>

          {activities && activities.length > 0 && (
            <div className="pt-3 border-t border-neutral-800/80 mt-3">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {activities.map((act, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300"
                  >
                    🏢 {act.name} ({tData(act.role)})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
