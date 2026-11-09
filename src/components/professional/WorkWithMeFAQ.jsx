import { useState } from 'react';
import { FiPlus, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { EASE_OUT, stagger } from './motionPresets';

export default function WorkWithMeFAQ() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { faq } = data;
  const [openIndex, setOpenIndex] = useState(null);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="faq" className="pwm-section border-t border-slate-200">
      <div className="pwm-container pwm-container--narrow">
        <SectionHeader center tag={faq.tag} title={faq.title} subtitle={faq.subtitle} />

        <div className="flex flex-col gap-3">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;

            return (
              <Reveal
                key={item.question}
                delay={stagger(index, 0.06)}
                y={16}
                className={`rounded-xl border bg-white transition-colors ${
                  isOpen ? 'border-blue-200 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between gap-6 px-5 sm:px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="text-base sm:text-[17px] font-semibold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiPlus size={16} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        exit={{ y: -8 }}
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                        className="px-5 sm:px-6 pb-6 -mt-1"
                      >
                        <p className="pwm-body max-w-2xl">{item.answer}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>

        {/* Still have questions */}
        <Reveal className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4">
            <span className="pwm-icon-tile">
              <FiMessageCircle size={20} />
            </span>
            <div>
              <div className="font-semibold text-slate-900">
                {lang === 'tr' ? 'Farklı bir sorunuz mu var?' : 'Have a different question?'}
              </div>
              <div className="text-sm text-slate-500">
                {lang === 'tr'
                  ? 'Aklınıza takılan her konuyu çekinmeden sorabilirsiniz.'
                  : 'Feel free to reach out anytime to discuss your project.'}
              </div>
            </div>
          </div>
          <a href="#contact" onClick={handleScrollToContact} className="pwm-btn pwm-btn--secondary pwm-btn--sm">
            {lang === 'tr' ? 'Bana Ulaşın' : 'Get in Touch'}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
