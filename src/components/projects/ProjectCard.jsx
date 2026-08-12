import { FiGithub, FiExternalLink, FiLock } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

const previewModules = import.meta.glob(
  '../../assets/project_previews/**/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

function resolvePreview(previewPath) {
  if (!previewPath) return null;
  const match = Object.entries(previewModules).find(([key]) => key.includes(previewPath));
  return match ? match[1] : null;
}

export default function ProjectCard({ project }) {
  const { t, tData } = useTranslation();
  const title = tData(project.title);
  const description = tData(project.description);
  const achievements = project.achievements ? tData(project.achievements) : null;
  const previewSrc = resolvePreview(project.preview);

  return (
    <article className="glass-card flex flex-col md:flex-row overflow-hidden h-full min-h-[420px] max-w-4xl mx-auto w-full border border-neutral-800 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10">
      {/* Image container */}
      <div className="md:w-1/2 h-56 md:h-auto shrink-0 bg-neutral-950 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-neutral-600">
            <FiGithub size={48} />
            <span className="text-xs font-mono">No Preview Available</span>
          </div>
        )}

        {/* Private badge overlay */}
        {project.isPrivate && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-400 text-xs font-medium backdrop-blur-md">
            <FiLock size={12} />
            <span>{t('projects.privateRepo')}</span>
          </div>
        )}
      </div>

      {/* Content container */}
      <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Achievements badge */}
          {achievements && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <span>🏆</span>
              <span>{achievements}</span>
            </div>
          )}

          <h3 className="text-2xl font-bold text-neutral-100 leading-snug">{title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-xs font-mono text-orange-400"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links Section (Only rendered if links exist to prevent empty space) */}
          {(project.sourceCode || project.liveDemo) && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-800/80">
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-neutral-200 hover:text-white transition-all"
                >
                  <FiGithub size={14} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-xs font-medium text-white shadow-lg shadow-orange-500/20 transition-all"
                >
                  <FiExternalLink size={14} />
                  <span>{t('projects.liveDemo')}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
