import PageLayout from '../components/layout/PageLayout';
import EducationCard from '../components/education/EducationCard';
import educationData from '../data/education.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';

export default function EducationPage() {
  const { t } = useTranslation();
  const [scrollRef, maskStyle] = useScrollMask('vertical', 24);

  return (
    <PageLayout
      title={t('education.title')}
      subtitle={t('education.subtitle')}
      maxWidth="64rem"
      fullHeight={true}
    >
      {/* Kaydırılabilir alan: kart ekrana sığmadığında (telefon, kısa ekran) alt kısım kesilmesin.
          İçerik sığıyorsa margin:auto ile dikeyde ortalanmaya devam eder. */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          ...maskStyle,
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto 0' }}>
          {educationData.map((item) => (
            <EducationCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
