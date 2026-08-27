import PageLayout from '../components/layout/PageLayout';
import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';

export default function SkillsPage() {
  const { t } = useTranslation();
  const [scrollRef, maskStyle] = useScrollMask('vertical', 24);

  return (
    <PageLayout
      title={t('skills.title')}
      subtitle={t('skills.subtitle')}
      maxWidth="90rem"
      fullHeight
    >
      {/* Masonry container — flex:1 makes it fill EVERY pixel from title bottom to screen bottom */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingTop: '0.75rem',
          paddingBottom: '2rem',
          ...maskStyle,
        }}
      >
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
