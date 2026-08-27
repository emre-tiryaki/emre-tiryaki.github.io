import { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiShare2 } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

const SOCIAL_LINKS = [
  {
    id: 'github',
    href: 'https://github.com/emre-tiryaki',
    label: 'GitHub',
    Icon: FiGithub,
    hoverClass: 'hover:text-white hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/emre-tiryaki-7448b6290',
    label: 'LinkedIn',
    Icon: FiLinkedin,
    hoverClass: 'hover:text-sky-400 hover:border-sky-400/40 hover:bg-sky-500/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]',
  },
  {
    id: 'email',
    href: 'mailto:tiryakiemre18@gmail.com',
    label: 'Email',
    Icon: FiMail,
    hoverClass: 'hover:text-orange-400 hover:border-orange-400/40 hover:bg-orange-500/10 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  },
];

export default function ContactCard() {
  const { t } = useTranslation();
  const [hoveredSocial, setHoveredSocial] = useState(null);

  return (
    <div
      className="relative rounded-2xl flex flex-col items-center justify-start overflow-visible transition-all duration-300"
      style={{
        width: '135px',
        padding: '0.85rem 1rem',
        gap: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-neutral-400">
        <FiShare2 className="text-orange-400 text-xs" />
        <span className="text-xs font-bold uppercase tracking-widest">
          {t('about.contactTitle')}
        </span>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 place-items-center">
        {SOCIAL_LINKS.map((item) => (
          <div
            key={item.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredSocial(item.id)}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <a
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={item.label}
              className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] text-neutral-300 transition-all duration-200 hover:scale-110 active:scale-95 ${item.hoverClass}`}
            >
              <item.Icon size={18} />
            </a>

            {/* Tooltip */}
            <span
              className="absolute bottom-full mb-1 left-1/2 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-neutral-200 whitespace-nowrap pointer-events-none transition-all duration-150 z-30 shadow-lg"
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                opacity: hoveredSocial === item.id ? 1 : 0,
                transform: `translateX(-50%) translateY(${hoveredSocial === item.id ? '0px' : '2px'})`,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
