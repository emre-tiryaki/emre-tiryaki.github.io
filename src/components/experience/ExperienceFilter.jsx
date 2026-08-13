import { useTranslation } from '../../hooks/useTranslation';

export default function ExperienceFilter({ types, activeType, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
      {types.map((type) => {
        const isActive = activeType === type;
        const labelKey = `experience.types.${type}`;
        const label = t(labelKey);

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                : 'glass-pill text-neutral-400 hover:text-neutral-100 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
