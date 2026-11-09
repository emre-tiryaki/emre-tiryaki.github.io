import { FiMessageSquare, FiCompass, FiCode, FiSend } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import SectionHeader from './SectionHeader';

const STEP_ICONS = {
  '01': FiMessageSquare,
  '02': FiCompass,
  '03': FiCode,
  '04': FiSend,
};

export default function WorkWithMeProcess() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { process } = data;

  return (
    <section id="process" className="pwm-section">
      <div className="pwm-container">
        <SectionHeader tag={process.tag} title={process.title} subtitle={process.subtitle} />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {process.steps.map((step) => {
            const Icon = STEP_ICONS[step.step] || FiCode;
            return (
              <li key={step.step} className="pwm-card">
                <div className="flex items-center justify-between mb-6">
                  <span className="pwm-icon-tile">
                    <Icon size={20} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {process.stepLabel} {step.step}
                  </span>
                </div>
                <h3 className="pwm-h3">{step.title}</h3>
                <p className="pwm-body">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
