import PhotoCarousel from '../components/about/PhotoCarousel';
import AboutSummary from '../components/about/AboutSummary';
import ContactCard from '../components/about/ContactCard';
import ResumeCard from '../components/about/ResumeCard';
import WorkWithMeCard from '../components/about/WorkWithMeCard';
import LanguagesCard from '../components/about/LanguagesCard';
import GitHubActivity from '../components/about/GitHubActivity';
import LocationBadge from '../components/about/LocationBadge';
import { useTranslation } from '../hooks/translation';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '72rem',
  margin: '0 auto',
  paddingLeft: 'max(clamp(1rem, 4vw, 1.5rem), env(safe-area-inset-left))',
  paddingRight: 'max(clamp(1rem, 4vw, 1.5rem), env(safe-area-inset-right))',
  paddingTop: 'clamp(1rem, 4vw, 2.5rem)',
  paddingBottom: '3rem',
  display: 'block',
  overflowX: 'clip', // carousel'in yan fotoğrafları dar ekranda yatay kaydırma yaratmasın
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
          <div className="flex flex-col justify-center gap-6 text-center lg:text-left px-2 lg:px-4">
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight select-none">
                  Emre Tiryaki
                </h1>
                <LocationBadge />
              </div>
              <p className="text-lg font-bold select-none"
                style={{ background: 'linear-gradient(90deg,#fb923c,#f97316,#ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('about.roleTitle')}
              </p>
            </div>
            <AboutSummary />
            {/* Telefon: [İletişim | Diller] üstte, CV + Benimle Çalışın tam genişlik altta.
                sm ve üstü: önceki tek satır düzen. */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-between sm:items-stretch sm:gap-4 w-full">
              <ContactCard />
              <div className="col-span-2 order-last sm:order-none flex flex-col justify-between items-stretch gap-2.5">
                <ResumeCard />
                <WorkWithMeCard />
              </div>
              <LanguagesCard />
            </div>
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
