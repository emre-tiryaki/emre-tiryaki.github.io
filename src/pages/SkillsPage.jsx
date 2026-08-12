import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/useTranslation';

export default function SkillsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">{t('skills.title')}</h1>
        <p className="text-sm sm:text-base text-neutral-400">{t('skills.subtitle')}</p>
      </div>

      {/* Dynamic Bento Grid Layout with masonry-like auto-fit columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {skillsData.map((group) => (
          <SkillGroup key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
}
