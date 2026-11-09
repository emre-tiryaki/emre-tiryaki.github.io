import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import Reveal from './Reveal';

export default function WorkWithMeFooter() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { footer } = data;

  const socials = [
    { href: 'https://github.com/emre-tiryaki', label: 'GitHub', Icon: FiGithub, external: true },
    { href: 'https://linkedin.com/in/emretiryaki', label: 'LinkedIn', Icon: FiLinkedin, external: true },
    { href: 'mailto:tiryakiemre18@gmail.com', label: lang === 'tr' ? 'E-posta' : 'Email', Icon: FiMail },
  ];

  return (
    <footer className="py-12 bg-white">
      <Reveal className="pwm-container" y={16}>
        <div className="pb-8 border-b border-slate-200">
          <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{footer.brand}</span>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-500">{footer.title}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-md">{footer.tagline}</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-6">
            {socials.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-2 hover:text-slate-900 transition-colors"
              >
                <Icon size={15} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
