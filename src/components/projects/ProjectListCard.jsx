import { useTranslation } from '../../hooks/translation';
import { PROJECT_CATEGORY_CONFIG } from '../../theme';

export function getProjectCategoryKey(project) {
  if (project.isOpenSource) return 'openSource';
  if (project.isCompetition) return 'competition';
  if (project.isHackathon) return 'hackathon';
  return 'project';
}

const DEFAULT_PROJECT_THEME = {
  color: '#f97316',
  textActive: '#ffedd5',
  bgActive: 'rgba(249, 115, 22, 0.18)',
  bgInactive: 'rgba(249, 115, 22, 0.05)',
  borderActive: 'rgba(249, 115, 22, 0.65)',
  glow: 'rgba(249, 115, 22, 0.22)',
};

export default function ProjectListCard({ project, isSelected, onClick }) {
  const { t, tData } = useTranslation();
  const catKey = getProjectCategoryKey(project);
  const cfg = catKey === 'project' 
    ? DEFAULT_PROJECT_THEME 
    : (PROJECT_CATEGORY_CONFIG[catKey] || DEFAULT_PROJECT_THEME);
  
  const title = tData(project.title);
  const achievements = project.achievements ? tData(project.achievements) : null;
  const visibleTechs = (project.techStack || []).slice(0, 3);
  const extraCount = Math.max(0, (project.techStack || []).length - 3);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="group relative flex flex-col justify-between gap-3 rounded-2xl transition-all duration-200"
      style={{
        position: 'relative',
        padding: '1.1rem 1.35rem',
        borderRadius: '1.15rem',
        width: '100%',
        boxSizing: 'border-box',
        background: isSelected ? cfg.bgActive : 'rgba(255, 255, 255, 0.03)',
        border: isSelected
          ? `1.5px solid ${cfg.borderActive}`
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? `0 12px 36px rgba(0, 0, 0, 0.55), 0 0 20px ${cfg.glow}, inset 0 0 16px ${cfg.glow}`
          : 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = cfg.borderActive;
          e.currentTarget.style.background = cfg.bgInactive;
          e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 14px ${cfg.glow}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* ── Absolute Trophy Indicator (Never alters document flow / layout) ── */}
      {achievements && (
        <span
          title={achievements}
          style={{
            position: 'absolute',
            top: '0.95rem',
            right: '1.05rem',
            fontSize: '0.95rem',
            lineHeight: 1,
            cursor: 'help',
            userSelect: 'none',
            zIndex: 2,
          }}
        >
          🏆
        </span>
      )}

      {/* ── Category Badge (Only for special categories: competition, hackathon, openSource) ── */}
      {catKey !== 'project' && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '0.45rem',
              background: cfg.bgActive,
              border: `1px solid ${cfg.borderActive}`,
              color: cfg.textActive,
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>{cfg.symbol}</span>
            <span>{t(`projects.categories.${catKey}`)}</span>
          </span>
        </div>
      )}

      {/* ── Title ── */}
      <h3
        style={{
          margin: 0,
          fontSize: '0.93rem',
          fontWeight: 700,
          color: isSelected ? '#f8fafc' : '#e2e8f0',
          lineHeight: 1.35,
          transition: 'color 0.2s ease',
          paddingRight: achievements ? '1.6rem' : 0,
        }}
      >
        {title}
      </h3>

      {/* ── Tech Chips (first 3) ── */}
      {visibleTechs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibleTechs.map((tech) => (
            <span
              key={tech}
              style={{
                padding: '0.14rem 0.42rem',
                borderRadius: '0.35rem',
                background: 'rgba(249, 115, 22, 0.09)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                fontSize: '0.67rem',
                fontWeight: 600,
                color: '#fdba74',
                letterSpacing: '0.01em',
              }}
            >
              {tech}
            </span>
          ))}
          {extraCount > 0 && (
            <span style={{ fontSize: '0.67rem', color: '#64748b', fontWeight: 600 }}>
              +{extraCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
