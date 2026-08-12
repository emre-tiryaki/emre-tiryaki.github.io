import ProjectSlider from '../components/projects/ProjectSlider';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/useTranslation';

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">{t('projects.title')}</h1>
        <p className="text-sm sm:text-base text-neutral-400">{t('projects.subtitle')}</p>
      </div>

      {/* Horizontal Project Slider */}
      <ProjectSlider projects={projectsData} />
    </div>
  );
}
