import PageLayout from '../components/layout/PageLayout';
import ProjectSlider from '../components/projects/ProjectSlider';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      maxWidth="100%"
      fullHeight
    >
      {/* Slider — fills all remaining height */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ProjectSlider projects={projectsData} />
      </div>
    </PageLayout>
  );
}
