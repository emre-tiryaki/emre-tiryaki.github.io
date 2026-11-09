import { useState } from 'react';
import { FiMail, FiSend, FiCheck, FiClock } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { EASE_OUT } from './motionPresets';
import { PORTRAIT_PHOTO } from '../../lib/media';

export default function WorkWithMeCTA() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { cta } = data;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    // Select fields store option indexes so a choice survives a TR/EN switch.
    projectType: 0,
    budget: 0,
    timeline: 0,
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const projectType = cta.projectTypes[formData.projectType];
  const budget = cta.budgetRanges[formData.budget];
  const timeline = cta.timelines[formData.timeline];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct mailto link
    const subject = encodeURIComponent(
      `[${lang === 'tr' ? 'Proje Başvurusu' : 'Project Inquiry'}] ${formData.name} - ${projectType}`
    );

    const bodyText = `${cta.labels.name}: ${formData.name}
${cta.labels.company}: ${formData.company || (lang === 'tr' ? 'Belirtilmedi' : 'Not specified')}
${cta.labels.email}: ${formData.email}
${cta.labels.projectType}: ${projectType}
${cta.labels.budget}: ${budget}
${cta.labels.timeline}: ${timeline}

${cta.labels.details}:
${formData.details}
`;

    const body = encodeURIComponent(bodyText);
    const mailtoUrl = `mailto:${cta.email}?subject=${subject}&body=${body}`;

    // Trigger user mail client
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });
  const updateIndex = (field) => (e) => setFormData({ ...formData, [field]: Number(e.target.value) });

  return (
    <section id="contact" className="pwm-section pwm-section--muted">
      <div className="pwm-container pwm-container--narrow">
        <SectionHeader center tag={cta.tag} title={cta.title} subtitle={cta.subtitle} />

        <Reveal className="pwm-card pwm-cta-intro -mt-4 mb-8">
          <img
            src={PORTRAIT_PHOTO}
            alt={cta.intro.name}
            width={112}
            height={112}
            loading="lazy"
            className="pwm-cta-intro__photo"
          />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-slate-900 leading-tight">{cta.intro.name}</p>
            <p className="text-sm font-medium text-blue-600 mb-3">{cta.intro.role}</p>
            <p className="pwm-body mb-4">{cta.intro.note}</p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a href={`mailto:${cta.email}`} className="pwm-btn pwm-btn--secondary pwm-btn--sm">
                <FiMail size={16} className="text-blue-600" />
                <span className="truncate">{cta.emailBtn} {cta.email}</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                <FiClock size={14} className="text-emerald-600" />
                {cta.intro.response}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal className="pwm-card pwm-card--form" delay={0.1}>
          <div className="mb-8 pb-6 border-b border-slate-100">
            <h3 className="pwm-h3 pwm-h3--lg">{cta.formTitle}</h3>
            <p className="pwm-body">{cta.formSubtitle}</p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div
              key="success"
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
              >
                <FiCheck size={26} />
              </motion.div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">{cta.successTitle}</h4>
              <p className="pwm-body max-w-md mx-auto mb-6">{cta.successDesc}</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer"
              >
                {cta.successReset}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="pwm-name" className="pwm-label">
                    {cta.labels.name} <span className="text-blue-600">*</span>
                  </label>
                  <input id="pwm-name" type="text" required placeholder={cta.placeholders.name}
                    value={formData.name} onChange={update('name')} className="pwm-input" />
                </div>
                <div>
                  <label htmlFor="pwm-company" className="pwm-label">{cta.labels.company}</label>
                  <input id="pwm-company" type="text" placeholder={cta.placeholders.company}
                    value={formData.company} onChange={update('company')} className="pwm-input" />
                </div>
                <div>
                  <label htmlFor="pwm-email" className="pwm-label">
                    {cta.labels.email} <span className="text-blue-600">*</span>
                  </label>
                  <input id="pwm-email" type="email" required placeholder={cta.placeholders.email}
                    value={formData.email} onChange={update('email')} className="pwm-input" />
                </div>
                <div>
                  <label htmlFor="pwm-type" className="pwm-label">{cta.labels.projectType}</label>
                  <select id="pwm-type" value={formData.projectType} onChange={updateIndex('projectType')} className="pwm-select">
                    {cta.projectTypes.map((type, i) => <option key={type} value={i}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="pwm-budget" className="pwm-label">{cta.labels.budget}</label>
                  <select id="pwm-budget" value={formData.budget} onChange={updateIndex('budget')} className="pwm-select">
                    {cta.budgetRanges.map((b, i) => <option key={b} value={i}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="pwm-timeline" className="pwm-label">{cta.labels.timeline}</label>
                  <select id="pwm-timeline" value={formData.timeline} onChange={updateIndex('timeline')} className="pwm-select">
                    {cta.timelines.map((tl, i) => <option key={tl} value={i}>{tl}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="pwm-details" className="pwm-label">
                  {cta.labels.details} <span className="text-blue-600">*</span>
                </label>
                <textarea id="pwm-details" required rows={5} placeholder={cta.placeholders.details}
                  value={formData.details} onChange={update('details')} className="pwm-textarea" />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs sm:text-sm text-slate-500">{cta.labels.privacy}</p>
                <button type="submit" className="pwm-btn pwm-btn--primary">
                  <span>{cta.labels.submit}</span>
                  <FiSend size={16} />
                </button>
              </div>
            </motion.form>
          )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
