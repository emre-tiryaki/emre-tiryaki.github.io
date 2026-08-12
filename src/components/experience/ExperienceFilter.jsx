import { useTranslation } from '../../hooks/useTranslation';

export default function ExperienceFilter({ types, activeType, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      {types.map((type) => {
        const isActive = activeType === type;
        const labelKey = `experience.types.${type}`;
        const label = t(labelKey);

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 border border-orange-400'
                : 'glass-card text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
