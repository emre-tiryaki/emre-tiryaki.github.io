import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/translation';

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const ollamaIcon = new URL('../../assets/skills/ollama.png', import.meta.url).href;

function SkillIcon({ icon, name }) {
  if (icon === 'custom:ollama') {
    return <img src={ollamaIcon} alt={name} width={40} height={40} style={{ objectFit: 'contain', borderRadius: '0.375rem' }} />;
  }
  if (icon) {
    return (
      <img
        src={`${DEVICON_BASE}${icon}.svg`}
        alt={name}
        width={40}
        height={40}
        loading="lazy"
        style={{ objectFit: 'contain' }}
        onError={e => e.currentTarget.style.display = 'none'}
      />
    );
  }
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '0.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '1rem', color: '#f97316',
      background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/** Portal tooltip — renders into document.body to escape all overflow:hidden containers */
function TooltipPortal({ anchorRef, name, text }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, showBelow: false, ready: false });

  useLayoutEffect(() => {
    if (!anchorRef.current || !tooltipRef.current) return;
    const anchor  = anchorRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const GAP = 10;
    const TOOLTIP_W = tooltip.width;
    const TOOLTIP_H = tooltip.height;

    // Prefer above; fall back to below if not enough room
    const showBelow = anchor.top - TOOLTIP_H - GAP < 8;
    const top = showBelow
      ? anchor.bottom + GAP
      : anchor.top - TOOLTIP_H - GAP;

    // Center horizontally, clamp within viewport
    let left = anchor.left + anchor.width / 2 - TOOLTIP_W / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_W - 8));

    setPos({ top, left, showBelow, ready: true });
  }, [anchorRef]);

  const arrowStyle = pos.showBelow
    ? { borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid rgba(249,115,22,0.5)', bottom: '100%', marginBottom: 0 }
    : { borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop:  '5px solid rgba(249,115,22,0.5)', top: '100%' };

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        width: '13rem',
        pointerEvents: 'none',
        opacity: pos.ready ? 1 : 0,
        transition: 'opacity 0.12s ease',
      }}
    >
      <div style={{
        padding: '0.75rem',
        borderRadius: '0.75rem',
        fontSize: '0.7rem',
        color: '#e2e8f0',
        lineHeight: 1.5,
        background: 'rgba(12,12,12,0.98)',
        border: '1px solid rgba(249,115,22,0.5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.1)',
      }}>
        <div style={{ fontWeight: 700, color: '#fb923c', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          💬 <span>{name}</span>
        </div>
        {text}
      </div>
      {/* Arrow */}
      <div style={{
        position: 'absolute', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        ...arrowStyle,
      }} />
    </div>,
    document.body
  );
}

export default function SkillCard({ name, icon, comment }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const { tData } = useTranslation();
  const commentText = comment ? tData(comment) : null;

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '1rem 0.5rem',
        borderRadius: '0.75rem',
        cursor: 'default',
        userSelect: 'none',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={e => {
        setHovered(true);
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.55)';
        e.currentTarget.style.background   = 'rgba(249,115,22,0.07)';
        e.currentTarget.style.transform    = 'scale(1.05) translateY(-2px)';
        e.currentTarget.style.boxShadow    = '0 6px 20px rgba(249,115,22,0.15)';
      }}
      onMouseLeave={e => {
        setHovered(false);
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.background   = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.transform    = '';
        e.currentTarget.style.boxShadow    = '';
      }}
    >
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SkillIcon icon={icon} name={name} />
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#cbd5e1', textAlign: 'center', lineHeight: 1.3 }}>
        {name}
      </span>

      {/* Portal tooltip — escapes overflow:hidden, always fully visible */}
      {hovered && commentText && (
        <TooltipPortal anchorRef={cardRef} name={name} text={commentText} />
      )}
    </div>
  );
}
