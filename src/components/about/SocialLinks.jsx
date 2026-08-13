import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const links = [
  {
    id: 'github',
    href: 'https://github.com/emre-tiryaki',
    label: 'GitHub',
    Icon: FiGithub,
    color: 'hover:text-white hover:border-white/40 hover:bg-white/10',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/emre-tiryaki-7448b6290',
    label: 'LinkedIn',
    Icon: FiLinkedin,
    color: 'hover:text-sky-400 hover:border-sky-400/40 hover:bg-sky-500/10',
  },
  {
    id: 'x',
    href: 'https://x.com/MrTiryaki',
    label: 'X / Twitter',
    Icon: FiTwitter,
    color: 'hover:text-sky-300 hover:border-sky-300/40 hover:bg-sky-400/10',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/emre._.tiryaki/',
    label: 'Instagram',
    Icon: FiInstagram,
    color: 'hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-500/10',
  },
  {
    id: 'email',
    href: 'mailto:tiryakiemre18@gmail.com',
    label: 'tiryakiemre18@gmail.com',
    Icon: FiMail,
    color: 'hover:text-orange-400 hover:border-orange-400/40 hover:bg-orange-500/10',
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {links.map(({ id, href, label, Icon, color }) => {
        const IconComp = Icon;
        return (
          <a
            key={id}
            id={`link-${id}`}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-pill text-xs sm:text-sm font-semibold text-neutral-300 transition-all duration-200 ${color} hover:scale-105 shadow-md`}
          >
            <IconComp size={16} />
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
