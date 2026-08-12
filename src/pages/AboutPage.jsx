import PhotoCarousel from '../components/about/PhotoCarousel';
import SocialLinks from '../components/about/SocialLinks';
import LanguagesSection from '../components/about/LanguagesSection';
import GitHubActivity from '../components/about/GitHubActivity';
import { useTranslation } from '../hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Section: Photo Carousel Left, Bio & Links Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Photo Carousel */}
        <div className="lg:col-span-5 flex justify-center">
          <PhotoCarousel />
        </div>

        {/* Right Column: Name, Headline, Summary, Social Links */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-neutral-100 mb-2">Emre Tiryaki</h1>
            <p className="text-xl font-medium text-orange-400 mb-1">Backend Developer | Software Engineer</p>
            <p className="text-sm text-neutral-400">📍 {t('about.location')}</p>
          </div>

          <p className="text-base text-neutral-300 leading-relaxed bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800/80">
            {t('about.summary')}
          </p>

          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              {t('about.contactTitle')}
            </h3>
            <SocialLinks />
          </div>

          <LanguagesSection />
        </div>
      </div>

      {/* Bottom Section: GitHub Activity */}
      <div className="pt-6 border-t border-neutral-800/80">
        <GitHubActivity />
      </div>
    </div>
  );
}
