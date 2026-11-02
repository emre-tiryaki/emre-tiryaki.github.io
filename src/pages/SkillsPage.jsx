import { useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';
import { useWindowWidth } from '../hooks/useWindowWidth';

/**
 * Estimate relative height of a skill group based on its item count
 * so we can distribute groups across columns evenly.
 */
function estimateHeight(group) {
  const headerHeight = 3;           // category header
  const rows = Math.ceil(group.items.length / 3); // 3 items per row inside each group
  return headerHeight + rows * 4;   // rough unit height per row
}

/**
 * Distribute groups into N columns using a greedy shortest-column algorithm.
 */
function distributeIntoColumns(groups, colCount) {
  const columns = Array.from({ length: colCount }, () => []);
  const heights = new Array(colCount).fill(0);

  for (const group of groups) {
    const h = estimateHeight(group);
    // find shortest column
    let minIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (heights[i] < heights[minIdx]) minIdx = i;
    }
    columns[minIdx].push(group);
    heights[minIdx] += h;
  }
  return columns;
}

export default function SkillsPage() {
  const { t } = useTranslation();
  const [scrollRef, maskStyle] = useScrollMask('vertical', 24);
  const width = useWindowWidth();

  const colCount = width <= 550 ? 1 : width <= 900 ? 2 : width <= 1100 ? 3 : 4;

  const columns = useMemo(
    () => distributeIntoColumns(skillsData, colCount),
    [colCount],
  );

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
          display: 'grid',
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: '1.25rem',
          alignItems: 'start',
        }}>
          {columns.map((col, colIdx) => (
            <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {col.map((group) => (
                <SkillGroup key={group.id} {...group} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
