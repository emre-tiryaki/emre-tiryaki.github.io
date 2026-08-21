import EducationCard from '../components/education/EducationCard';
import educationData from '../data/education.json';
import { useTranslation } from '../hooks/translation';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '52rem',
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  display: 'block',
};

export default function EducationPage() {
  const { t } = useTranslation();

  return (
    <div style={PAGE_STYLE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('education.title')}</h1>
          <p className="text-base text-neutral-400">{t('education.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {educationData.map((item) => (
            <EducationCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
