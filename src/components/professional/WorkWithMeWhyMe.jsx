import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { stagger } from './motionPresets';

export default function WorkWithMeWhyMe() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { whyMe } = data;

  return (
    <section id="why-me" className="pwm-section pwm-section--muted">
      <div className="pwm-container">
        <SectionHeader tag={whyMe.tag} title={whyMe.title} subtitle={whyMe.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {whyMe.points.map((point, i) => (
            <Reveal key={point.id} delay={stagger(i)}>
            <article className="pwm-card pwm-card--row">
              <span className="pwm-icon-tile font-mono text-sm font-bold">{point.number}</span>
              <div>
                <h3 className="pwm-h3">{point.title}</h3>
                <p className="pwm-body">{point.description}</p>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
