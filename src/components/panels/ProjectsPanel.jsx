import { useState, useMemo } from 'react';
import projects from '../../data/projects.json';
import ProjectFilter from '../ui/ProjectFilter';
import { VscGithubInverted, VscLinkExternal, VscLock, VscClose } from 'react-icons/vsc';

const previewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png}',
  { eager: true, import: 'default' }
);

function resolvePreview(previewPath) {
  if (!previewPath) return null;
  const match = Object.entries(previewModules).find(([key]) => key.includes(previewPath));
  return match ? match[1] : null;
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const previewSrc = resolvePreview(project.preview);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Kapat">
          <VscClose />
        </button>

        {previewSrc && (
          <img className="modal-image" src={previewSrc} alt={project.title} />
        )}

        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>

          {project.achievements && (
            <div className="project-card-achievement">🏆 {project.achievements}</div>
          )}

          <p className="modal-desc">{project.description}</p>

          <div className="modal-section">
            <h3 className="modal-section-title">Teknoloji Yığını</h3>
            <div className="project-tech-stack">
              {project.techStack.map(tech => (
                <span className="tech-badge" key={tech}>{tech}</span>
              ))}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title">Etiketler</h3>
              <div className="project-tech-stack">
                {project.tags.map(tag => (
                  <span className="tech-badge tag-badge" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-links">
            {project.sourceCode && (
              <a href={project.sourceCode} target="_blank" rel="noreferrer" className="project-link">
                <VscGithubInverted /> Kaynak Kod
              </a>
            )}
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noreferrer" className="project-link demo">
                <VscLinkExternal /> Canlı Demo
              </a>
            )}
            {project.isPrivate && !project.sourceCode && (
              <span className="project-private">
                <VscLock /> Kaynak kod gizlidir
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsPanel() {
  const allTags = useMemo(() => {
    const tagSet = new Set();
    projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return ['Tümü', ...Array.from(tagSet).sort()];
  }, []);

  const [activeTag, setActiveTag] = useState('Tümü');
  const [selectedProject, setSelectedProject] = useState(null);

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
            <article
              className="project-card"
              key={project.id}
              id={`project-${project.id}`}
              onClick={() => setSelectedProject(project)}
            >
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
                    <a href={project.sourceCode} target="_blank" rel="noreferrer" className="project-link" onClick={e => e.stopPropagation()}>
                      <VscGithubInverted /> GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="project-link demo" onClick={e => e.stopPropagation()}>
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

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default ProjectsPanel;
