import { useRef } from 'react';
import SkillCard, { TooltipPortal } from './SkillCard';
import { useTranslation } from '../../hooks/translation';
import { useTapTooltip } from '../../hooks/useTapTooltip';
import { getCategoryIconSrc } from '../../lib/media';
import { getInnerColumns } from '../../lib/skillsLayout';

export default function SkillGroup({ category, categoryIcon, categoryComment, comment, items, columns }) {
  const { tData } = useTranslation();
  const title = tData(category);
  const commentText = tData(categoryComment || comment);
  const iconRef = useRef(null);
  const [iconHovered, iconTooltipHandlers] = useTapTooltip(iconRef);
  const iconSrc = categoryIcon ? getCategoryIconSrc(categoryIcon) : null;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1rem',
        padding: '1rem',                               /* skillsLayout.GROUP_PADDING ile aynı olmalı */
        transition: 'border-color 0.25s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        userSelect: 'none',
        cursor: 'default',
      }}>
        {categoryIcon && (
          <div
            ref={iconRef}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: commentText ? 'pointer' : 'default',
              userSelect: 'none',
              // 26px ikon için ~42px dokunma alanı; negatif margin düzeni değiştirmez
              padding: '0.5rem',
              margin: '-0.5rem',
              borderRadius: '0.6rem',
              transition: 'transform 0.18s ease',
              transform: iconHovered ? 'scale(1.15)' : 'scale(1)',
            }}
            {...(commentText ? {
              ...iconTooltipHandlers,
              role: 'button',
              tabIndex: 0,
              'aria-expanded': iconHovered,
              'aria-label': `${title}: ${commentText}`,
            } : {})}
          >
            <img
              src={iconSrc}
              alt={title}
              width={26}
              height={26}
              draggable={false}
              style={{ objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              onError={e => e.currentTarget.style.display = 'none'}
            />
            {iconHovered && commentText && (
              <TooltipPortal anchorRef={iconRef} name={title} text={commentText} />
            )}
          </div>
        )}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.08em', userSelect: 'none', cursor: 'default' }}>
          {title}
        </span>
      </div>

      {/* Skill cards — sütun sayısı düzen motorundan gelir (1 = dikey sıralama) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns ?? getInnerColumns(items.length)}, minmax(0, 1fr))`,
        gap: 'clamp(0.5rem, 2vw, 0.75rem)',
      }}>
        {items.map((item) => (
          <SkillCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
