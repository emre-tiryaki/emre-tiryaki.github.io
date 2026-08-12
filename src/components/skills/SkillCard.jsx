import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

const ollamaIcon = new URL('../../assets/skills/ollama.png', import.meta.url).href;

function SkillIcon({ icon, name }) {
  if (icon === 'custom:ollama') {
    return (
      <img
        src={ollamaIcon}
        alt={name}
        width={32}
        height={32}
        className="object-contain rounded-sm"
      />
    );
  }

  if (icon) {
    return (
      <img
        src={`${DEVICON_BASE}${icon}.svg`}
        alt={name}
        width={32}
        height={32}
        loading="lazy"
        className="object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return null;
}

function Monogram({ name }) {
  return (
    <div
      className="w-8 h-8 rounded-md bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300"
      style={{ display: 'none' }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function SkillCard({ name, icon, comment }) {
  const [hovered, setHovered] = useState(false);
  const { tData } = useTranslation();
  const commentText = comment ? tData(comment) : null;

  return (
    <div
      className="relative group flex flex-col items-center gap-2 p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 cursor-default transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/60 hover:scale-105 hover:shadow-lg hover:shadow-black/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered((v) => !v)}
    >
      <div className="flex items-center justify-center w-8 h-8 shrink-0">
        <SkillIcon icon={icon} name={name} />
        <Monogram name={name} />
      </div>
      <span className="text-xs font-medium text-neutral-300 text-center leading-tight">
        {name}
      </span>

      {/* Hover tooltip with comment — only if comment exists */}
      {commentText && hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 z-20 pointer-events-none">
          <div className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-600 shadow-xl text-xs text-neutral-300 leading-relaxed">
            {commentText}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-600" />
          </div>
        </div>
      )}
    </div>
  );
}
