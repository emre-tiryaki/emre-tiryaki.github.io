import EducationCard from '../components/education/EducationCard';
import educationData from '../data/education.json';
import { useTranslation } from '../hooks/useTranslation';

export default function EducationPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[calc(100vh-8rem)] flex flex-col justify-center">
      {/* Header */}
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">{t('education.title')}</h1>
        <p className="text-sm sm:text-base text-neutral-400">{t('education.subtitle')}</p>
      </div>

      {/* Education Cards List */}
      <div className="space-y-6">
        {educationData.map((item) => (
          <EducationCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
