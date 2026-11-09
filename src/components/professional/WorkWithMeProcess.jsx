import { FiMessageSquare, FiCompass, FiCode, FiSend, FiUser, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { EASE_OUT } from './motionPresets';

const STEP_ICONS = {
  '01': FiMessageSquare,
  '02': FiCompass,
  '03': FiCode,
  '04': FiSend,
};

/*
 * Desktop wave: nodes sit at the centre of 4 equal, gap-less columns
 * (x = 12.5 / 37.5 / 62.5 / 87.5 %) and alternate between y = 36 and y = 108
 * inside a 144px band. The path below passes through exactly those points;
 * the CSS (.pwm-flow__node) uses the same numbers — keep them in sync.
 */
const WAVE_PATH =
  'M0 72 C60 72 70 36 125 36 C250 36 250 108 375 108 C500 108 500 36 625 36 C750 36 750 108 875 108 C930 108 940 72 1000 72';

export default function WorkWithMeProcess() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { process } = data;

  return (
    <section id="process" className="pwm-section">
      <div className="pwm-container">
        <SectionHeader tag={process.tag} title={process.title} subtitle={process.subtitle} />

        <div className="pwm-flow">
          <svg className="pwm-flow__wave" viewBox="0 0 1000 144" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pwm-flow-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#bfdbfe" />
              </linearGradient>
            </defs>
            {/* The wave draws itself left→right, then the flowing dots fade in. */}
            <motion.path
              d={WAVE_PATH}
              className="pwm-flow__track"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, ease: EASE_OUT }}
            />
            <motion.path
              d={WAVE_PATH}
              className="pwm-flow__dash"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            />
          </svg>

          <ol className="pwm-flow__list">
            {process.steps.map((step, i) => {
              const Icon = STEP_ICONS[step.step] || FiCode;
              return (
                <Reveal as="li" key={step.step} className="pwm-flow__step" tabIndex={0} delay={0.15 + i * 0.25}>
                  <div className="pwm-flow__node-slot">
                    <span className="pwm-flow__node">
                      <Icon size={22} />
                    </span>
                  </div>

                  {/* Flip card: front = title, back = details. Both faces share one grid
                      cell so the card is as tall as the taller face. On touch / small
                      screens there is no flip and both faces simply stack. */}
                  <div className="pwm-flow__card">
                    <div className="pwm-flow__face pwm-flow__face--front">
                      <span className="pwm-flow__num">{step.step}</span>
                      <h3 className="pwm-h3">{step.title}</h3>
                      <FiRefreshCw size={14} className="pwm-flow__flip-icon" aria-hidden="true" />
                    </div>

                    <div className="pwm-flow__face pwm-flow__face--back">
                      <p className="pwm-flow__back-title">
                        <span>{step.step}</span> {step.title}
                      </p>
                      <p className="pwm-flow__desc">{step.description}</p>

                      {step.client && (
                        <div className="mt-4">
                          <p className="pwm-flow__label">
                            <FiUser size={12} />
                            {process.clientLabel}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{step.client}</p>
                        </div>
                      )}

                      {step.deliverables?.length > 0 && (
                        <div className="mt-4">
                          <p className="pwm-flow__label">
                            <FiCheck size={12} />
                            {process.deliverablesLabel}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {step.deliverables.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="pwm-flow__check">
                                  <FiCheck size={10} strokeWidth={3} />
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
