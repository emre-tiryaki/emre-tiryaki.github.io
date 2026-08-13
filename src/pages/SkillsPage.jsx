import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/useTranslation';

export default function SkillsPage() {
  const { t } = useTranslation();

  return (
    <div style={{
      width: '100%',
      maxWidth: '90rem',
      margin: '0 auto',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      display: 'flex',
      flexDirection: 'column',
      /* height:100% fills the space left inside main after paddingTop/Bottom */
      height: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Page title — fixed, always just below navbar */}
      <div style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '1.25rem', flexShrink: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('skills.title')}</h1>
        <p className="text-base text-neutral-400 mt-1">{t('skills.subtitle')}</p>
      </div>

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
    </div>
  );
}
