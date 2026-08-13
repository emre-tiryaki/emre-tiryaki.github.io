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
    <article className="glass-card flex flex-col md:flex-row overflow-hidden rounded-3xl min-h-[440px] max-w-4xl mx-auto w-full border border-white/10 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10">
      {/* Left Column: Image / Preview */}
      <div className="md:w-1/2 h-64 md:h-auto shrink-0 bg-neutral-950/80 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-neutral-600 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
              <FiGithub size={32} />
            </div>
            <span className="text-xs font-mono">No Preview Image</span>
          </div>
        )}

        {/* Private repository badge overlay */}
        {project.isPrivate && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-neutral-700 text-neutral-300 text-xs font-mono backdrop-blur-md">
            <FiLock size={12} className="text-orange-400" />
            <span>{t('projects.privateRepo')}</span>
          </div>
        )}
      </div>

      {/* Right Column: Project Details */}
      <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Achievements Badge */}
          {achievements && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md">
              <span className="text-sm">🏆</span>
              <span>{achievements}</span>
            </div>
          )}

          <h3 className="text-2xl font-extrabold text-neutral-100 leading-snug tracking-tight">{title}</h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">{description}</p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono font-semibold text-orange-400"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links (Only rendered if present) */}
          {(project.sourceCode || project.liveDemo) && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800/80">
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-md"
                >
                  <FiGithub size={15} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all"
                >
                  <FiExternalLink size={15} />
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
