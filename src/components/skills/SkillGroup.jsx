import SkillCard from './SkillCard';
import { useTranslation } from '../../hooks/useTranslation';

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export default function SkillGroup({ category, categoryIcon, items }) {
  const { tData } = useTranslation();
  const title = tData(category);

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
          {categoryIcon && (
            <img
              src={`${DEVICON_BASE}${categoryIcon}.svg`}
              alt={title}
              width={24}
              height={24}
              className="object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <h3 className="text-base font-bold text-neutral-200 uppercase tracking-wider">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <SkillCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
