import ProjectSlider from '../components/projects/ProjectSlider';
import projectsData from '../data/projects.json';
import { useTranslation } from '../hooks/translation';

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Title — fixed at top, directly below navbar */}
      <div style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '1.25rem', flexShrink: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('projects.title')}</h1>
        <p className="text-base text-neutral-400 mt-1">{t('projects.subtitle')}</p>
      </div>

      {/* Slider — fills all remaining height */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ProjectSlider projects={projectsData} />
      </div>
    </div>
  );
}
