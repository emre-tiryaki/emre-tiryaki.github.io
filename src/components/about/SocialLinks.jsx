import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const links = [
  {
    id: 'github',
    href: 'https://github.com/emre-tiryaki',
    Icon: FiGithub,
    color: 'hover:text-white hover:border-white/40 hover:bg-white/10',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/emre-tiryaki-7448b6290',
    Icon: FiLinkedin,
    color: 'hover:text-sky-400 hover:border-sky-400/40 hover:bg-sky-500/10',
  },
  {
    id: 'email',
    href: 'mailto:tiryakiemre18@gmail.com',
    Icon: FiMail,
    color: 'hover:text-orange-400 hover:border-orange-400/40 hover:bg-orange-500/10',
  },
];

export default function SocialLinks() {
  return (
    <div className="grid grid-cols-2 gap-2 place-items-center">
      {links.map(({ id, href, Icon, color }) => (
        <a
          key={id}
          id={`link-${id}`}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel="noreferrer"
          className={`flex items-center justify-center w-10 h-10 rounded-xl glass-pill text-neutral-300 transition-all duration-200 ${color} hover:scale-110 shadow-md`}
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
