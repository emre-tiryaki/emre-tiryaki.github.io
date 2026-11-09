import { FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import SectionHeader from './SectionHeader';

import clearSkyImg from '../../assets/project_previews/ClearSky/Screenshot 2026-07-30 at 14-16-26 Clear Sky.png';
import okurImg from '../../assets/project_previews/OKUR/OKUR.jpeg';

const PROJECT_IMAGE_MAP = {
  clearsky: clearSkyImg,
  okur: okurImg,
};

export default function WorkWithMeWork() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { selectedWork } = data;

  return (
    <section id="work" className="pwm-section pwm-section--muted">
      <div className="pwm-container">
        <SectionHeader tag={selectedWork.tag} title={selectedWork.title} subtitle={selectedWork.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedWork.items.map((project) => {
            const projectImg = PROJECT_IMAGE_MAP[project.id] || null;

            return (
              <article key={project.id} className="pwm-card pwm-card--hover pwm-card--flush group">
                {/* Preview */}
                <div className="relative aspect-[16/9] bg-slate-100 border-b border-slate-200 overflow-hidden">
                  {projectImg ? (
                    <img
                      src={projectImg}
                      alt={project.alt || project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        {selectedWork.projectBadge}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-700 border border-slate-200 shadow-sm">
                    {project.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-7 sm:p-8">
                  <h3 className="pwm-h3 pwm-h3--lg">{project.title}</h3>
                  <p className="pwm-body">{project.clientSummary}</p>

                  <div className="mt-6 flex gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                    <FiCheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm leading-relaxed text-slate-700">
                      <span className="block font-semibold text-slate-900 mb-0.5">{selectedWork.problemLabel}</span>
                      {project.outcome}
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      {selectedWork.techLabel}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="pwm-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
