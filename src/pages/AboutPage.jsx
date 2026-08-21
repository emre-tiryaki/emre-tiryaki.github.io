import PhotoCarousel from '../components/about/PhotoCarousel';
import SocialLinks from '../components/about/SocialLinks';
import LanguagesSection from '../components/about/LanguagesSection';
import GitHubActivity from '../components/about/GitHubActivity';
import { useTranslation } from '../hooks/translation';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '72rem',   /* max-w-5xl = 64rem, using 72rem */
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  paddingTop: '2.5rem',
  paddingBottom: '3rem',
  display: 'block',
};

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div style={PAGE_STYLE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* Two-column hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex justify-center">
            <PhotoCarousel />
          </div>
          <div className="flex flex-col justify-center space-y-9 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
                Emre Tiryaki
              </h1>
              <p className="text-lg font-bold"
                style={{ background: 'linear-gradient(90deg,#fb923c,#f97316,#ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Backend Developer · Software Engineer
              </p>
              <p className="text-sm text-neutral-400 flex items-center justify-center lg:justify-start gap-1.5">
                <span>📍</span><span>{t('about.location')}</span>
              </p>
            </div>
            <div
              className="rounded-2xl text-sm text-neutral-200 leading-loose"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 1.5rem' }}
            >
              {t('about.summary')}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest text-center lg:text-left">
                {t('about.contactTitle')}
              </p>
              <div className="flex justify-center lg:justify-start">
                <SocialLinks />
              </div>
            </div>
            <LanguagesSection />
          </div>
        </div>

        {/* GitHub Activity */}
        <div>
          <GitHubActivity />
        </div>
      </div>
    </div>
  );
}
