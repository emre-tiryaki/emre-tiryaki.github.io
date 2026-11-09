import {
  FiLayout, FiGrid, FiDatabase, FiCpu, FiRefreshCw, FiTool,
  FiCoffee, FiUser, FiShoppingBag, FiCalendar,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import SectionHeader from './SectionHeader';

const SERVICE_ICONS = {
  layout: FiLayout,
  app: FiGrid,
  database: FiDatabase,
  cpu: FiCpu,
  workflow: FiRefreshCw,
  wrench: FiTool,
  coffee: FiCoffee,
  user: FiUser,
  bag: FiShoppingBag,
  calendar: FiCalendar,
};

export default function WorkWithMeServices() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { services } = data;

  return (
    <section id="services" className="pwm-section border-t border-slate-200">
      <div className="pwm-container">
        <SectionHeader tag={services.tag} title={services.title} subtitle={services.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.items.map((item) => {
            const Icon = SERVICE_ICONS[item.icon] || FiLayout;
            return (
              <article key={item.id} className="pwm-card pwm-card--hover">
                <span className="pwm-icon-tile mb-6">
                  <Icon size={20} />
                </span>
                <h3 className="pwm-h3">{item.title}</h3>
                <p className="pwm-body">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
