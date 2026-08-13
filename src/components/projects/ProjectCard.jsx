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
  const title        = tData(project.title);
  const description  = tData(project.description);
  const achievements = project.achievements ? tData(project.achievements) : null;
  const previewSrc   = resolvePreview(project.preview);

  return (
    <article
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: '1.25rem',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)';
        e.currentTarget.style.boxShadow   = '0 0 40px rgba(249,115,22,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {/* LEFT — Preview image, half width */}
      <div style={{
        width: '50%',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(10,10,10,0.8)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#52525b', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiGithub size={40} />
            </div>
            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>No Preview</span>
          </div>
        )}

        {project.isPrivate && (
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.75rem', borderRadius: '999px',
            background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#d4d4d8', fontSize: '0.75rem', fontFamily: 'monospace',
            backdropFilter: 'blur(8px)',
          }}>
            <FiLock size={12} style={{ color: '#fb923c' }} />
            <span>{t('projects.privateRepo')}</span>
          </div>
        )}
      </div>

      {/* RIGHT — Project details */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 3rem',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Achievement badge */}
          {achievements && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
              background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.35)',
              color: '#fcd34d', fontSize: '0.85rem', fontWeight: 700,
              alignSelf: 'flex-start',
            }}>
              <span style={{ fontSize: '1rem' }}>🏆</span>
              <span>{achievements}</span>
            </div>
          )}

          {/* Title */}
          <h3 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            color: '#94a3b8',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tech Stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '0.6rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600,
                  color: '#fb923c',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action links */}
          {(project.sourceCode || project.liveDemo) && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0',
                    textDecoration: 'none', transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; }}
                >
                  <FiGithub size={17} />
                  <span>{t('projects.sourceCode')}</span>
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '999px',
                    background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                    fontSize: '0.875rem', fontWeight: 700, color: '#fff',
                    textDecoration: 'none', boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(249,115,22,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.3)'; }}
                >
                  <FiExternalLink size={17} />
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
