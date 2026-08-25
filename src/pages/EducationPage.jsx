import PageLayout from '../components/layout/PageLayout';
import EducationCard from '../components/education/EducationCard';
import educationData from '../data/education.json';
import { useTranslation } from '../hooks/translation';

export default function EducationPage() {
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t('education.title')}
      subtitle={t('education.subtitle')}
      maxWidth="64rem"
      fullHeight={true}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto 0' }}>
        {educationData.map((item) => (
          <EducationCard key={item.id} {...item} />
        ))}
      </div>
    </PageLayout>
  );
}
