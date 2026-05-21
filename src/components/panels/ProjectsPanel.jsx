import { useState, useMemo } from 'react';
import projects from '../../data/projects.json';
import ProjectFilter from '../ui/ProjectFilter';
import { VscGithubInverted, VscLinkExternal, VscLock } from 'react-icons/vsc';

const previewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png}',
  { eager: true, import: 'default' }
);

function resolvePreview(previewPath) {
  if (!previewPath) return null;
  const match = Object.entries(previewModules).find(([key]) => key.includes(previewPath));
  return match ? match[1] : null;
}

function ProjectsPanel() {
  const allTags = useMemo(() => {
    const tagSet = new Set();
    projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return ['Tümü', ...Array.from(tagSet).sort()];
  }, []);

  const [activeTag, setActiveTag] = useState('Tümü');

  const filtered = activeTag === 'Tümü'
    ? projects
    : projects.filter(p => p.tags.includes(activeTag));

  return (
    <div id="panel-projects">
      <h1 className="panel-title">Projeler</h1>
      <p className="panel-subtitle">Mimari ve iş mantığını gösteren seçili projeler</p>

      <ProjectFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />

      <div className="projects-grid">
        {filtered.map(project => {
          const previewSrc = resolvePreview(project.preview);

          return (
            <article className="project-card" key={project.id} id={`project-${project.id}`}>
              {previewSrc ? (
                <img className="project-card-image" src={previewSrc} alt={project.title} />
              ) : (
                <div className="project-card-placeholder">
                  <VscGithubInverted />
                </div>
              )}

              <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>

                {project.achievements && (
                  <div className="project-card-achievement">🏆 {project.achievements}</div>
                )}

                <div className="project-tech-stack">
                  {project.techStack.map(tech => (
                    <span className="tech-badge" key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.sourceCode && (
                    <a href={project.sourceCode} target="_blank" rel="noreferrer" className="project-link">
                      <VscGithubInverted /> GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="project-link demo">
                      <VscLinkExternal /> Demo
                    </a>
                  )}
                  {project.isPrivate && !project.sourceCode && (
                    <span className="project-private">
                      <VscLock /> Kaynak kod gizlidir
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectsPanel;
