import SkillCard from './SkillCard';
import { useTranslation } from '../../hooks/translation';

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export default function SkillGroup({ category, categoryIcon, items }) {
  const { tData } = useTranslation();
  const title = tData(category);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1rem',
        padding: '1.5rem',        /* generous inner padding */
        transition: 'border-color 0.25s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {categoryIcon && (
          <img
            src={`${DEVICON_BASE}${categoryIcon}.svg`}
            alt={title}
            width={26}
            height={26}
            style={{ objectFit: 'contain' }}
            onError={e => e.currentTarget.style.display = 'none'}
          />
        )}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1 }}>
          {title}
        </span>
        <span style={{
          fontSize: '0.7rem', fontFamily: 'monospace', color: '#f97316',
          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
          padding: '0.15rem 0.5rem', borderRadius: '999px',
        }}>
          {items.length}
        </span>
      </div>

      {/* Skill cards — 3 per row, generous gap */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
      }}>
        {items.map((item) => (
          <SkillCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
