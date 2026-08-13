import ProjectSlider from '../components/projects/ProjectSlider';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/useTranslation';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '64rem',
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  display: 'block',
};

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div style={PAGE_STYLE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('projects.title')}</h1>
          <p className="text-base text-neutral-400">{t('projects.subtitle')}</p>
        </div>

        <ProjectSlider projects={projectsData} />
      </div>
    </div>
  );
}
