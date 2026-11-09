import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';

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
      <div className="pwm-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-[10px] bg-slate-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
              ET
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{footer.brand}</span>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-500">{footer.title}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-md">{footer.tagline}</p>
            </div>
          </div>

          <Link to="/" className="pwm-btn pwm-btn--dark pwm-btn--sm self-start md:self-auto group">
            <span>{footer.developerPortfolioLink}</span>
            <FiArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
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
      </div>
    </footer>
  );
}
