import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SkillGroup from '../components/skills/SkillGroup';
import skillsData from '../data/skills.json';
import { useTranslation } from '../hooks/translation';
import { useScrollMask } from '../hooks/useScrollMask';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { GAP, computeSkillsLayout } from '../lib/skillsLayout';

const PADDING_TOP = 12;    // 0.75rem
const PADDING_BOTTOM = 32; // 2rem

export default function SkillsPage() {
  const { t, lang } = useTranslation();
  const [scrollRef, maskStyle] = useScrollMask('vertical', 24);
  const viewportW = useWindowWidth();

  // Kaydırma alanının (dolgu hariç) ölçüleri
  const [size, setSize] = useState({ w: 0, h: 0 });
  // DOM'dan ölçülmüş grup yükseklikleri: `${id}|${genişlik}|${dil}` → px
  const measuredRef = useRef(new Map());
  const [measureVersion, setMeasureVersion] = useState(0);
  const groupRefs = useRef(new Map());

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const update = () => {
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = el.clientHeight - PADDING_TOP - PADDING_BOTTOM;
      setSize((prev) => (Math.round(prev.w) === Math.round(w) && Math.round(prev.h) === Math.round(h)
        ? prev
        : { w, h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollRef]);

  // Dil değişince başlıklar farklı uzunlukta olur → ölçümler geçersiz
  const measured = useMemo(() => {
    const map = new Map();
    for (const [key, value] of measuredRef.current) {
      if (key.endsWith(`|${lang}`)) map.set(key.slice(0, -(lang.length + 1)), value);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, measureVersion]);

  const layout = useMemo(
    () => computeSkillsLayout(skillsData, Math.floor(size.w), size.h, viewportW, measured),
    [size.w, size.h, viewportW, measured],
  );

  // Yerleşim sonrası gerçek yükseklikleri ölç; tahminden farklıysa yeniden yerleştir
  useLayoutEffect(() => {
    if (!layout) return;
    let changed = false;
    for (const item of layout.items) {
      const node = groupRefs.current.get(item.id);
      if (!node) continue;
      const height = node.offsetHeight;
      const key = `${item.id}|${Math.round(item.width)}|${lang}`;
      if (measuredRef.current.get(key) !== height) {
        measuredRef.current.set(key, height);
        changed = true;
      }
    }
    if (changed) setMeasureVersion((v) => v + 1);
  }, [layout, lang]);

  const byId = useMemo(() => new Map(skillsData.map((g) => [g.id, g])), []);

  const unitCalc = layout ? `(100% - ${(layout.T - 1) * GAP}px) / ${layout.T}` : '100%';

  return (
    <PageLayout
      title={t('skills.title')}
      subtitle={t('skills.subtitle')}
      maxWidth="90rem"
      fullHeight
    >
      {/* Kaydırma alanı: yerleşim sığıyorsa kaydırma çıkmaz, sığmıyorsa dikey kaydırılır */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          scrollbarGutter: 'stable both-edges',
          paddingTop: PADDING_TOP,
          paddingBottom: PADDING_BOTTOM,
          ...maskStyle,
        }}
      >
        {layout && (
          <div
            style={{
              position: 'relative',
              height: layout.height,
              // Kaydırma gerekmiyorsa içeriği dikey ortala
              marginTop: layout.fits ? Math.max(0, Math.floor((size.h - layout.height) / 2)) : 0,
            }}
          >
            {layout.items.map((item) => (
              <div
                key={item.id}
                ref={(node) => {
                  if (node) groupRefs.current.set(item.id, node);
                  else groupRefs.current.delete(item.id);
                }}
                style={{
                  position: 'absolute',
                  top: item.y,
                  left: `calc(${unitCalc} * ${item.x} + ${item.x * GAP}px)`,
                  width: `calc(${unitCalc} * ${item.span} + ${(item.span - 1) * GAP}px)`,
                }}
              >
                <SkillGroup {...byId.get(item.id)} columns={item.span} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
