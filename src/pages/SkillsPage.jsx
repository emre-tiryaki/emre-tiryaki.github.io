import PageLayout from '../components/layout/PageLayout';
import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/translation';

export default function SkillsPage() {
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t('skills.title')}
      subtitle={t('skills.subtitle')}
      maxWidth="90rem"
      fullHeight
    >
      {/* Masonry container — flex:1 makes it fill EVERY pixel from title bottom to screen bottom */}
      <div style={{
        flex: 1,
        minHeight: 0,         /* allow shrinking below content size */
        overflowY: 'auto',
        paddingBottom: '1.5rem',
      }}>
        <div style={{
          columns: 'auto',
          columnWidth: '280px',
          columnGap: '1.25rem',
        }}>
          {skillsData.map((group) => (
            <div
              key={group.id}
              style={{
                breakInside: 'avoid',
                marginBottom: '1.25rem',
                display: 'inline-block',
                width: '100%',
              }}
            >
              <SkillGroup {...group} />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
