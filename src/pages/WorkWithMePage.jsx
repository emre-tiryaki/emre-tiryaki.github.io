import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { useTranslation } from '../hooks/translation';
import { WORK_WITH_ME_DATA } from '../data/professional';
import WorkWithMeHeader from '../components/professional/WorkWithMeHeader';
import WorkWithMeHero from '../components/professional/WorkWithMeHero';
import WorkWithMeServices from '../components/professional/WorkWithMeServices';
import WorkWithMeWhyMe from '../components/professional/WorkWithMeWhyMe';
import WorkWithMeProcess from '../components/professional/WorkWithMeProcess';
import WorkWithMeFAQ from '../components/professional/WorkWithMeFAQ';
import WorkWithMeCTA from '../components/professional/WorkWithMeCTA';
import WorkWithMeFooter from '../components/professional/WorkWithMeFooter';
import '../styles/professional.css';

export default function WorkWithMePage() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { meta } = data;

  useEffect(() => {
    // Set page SEO metadata dynamically based on selected language
    const originalTitle = document.title;
    document.title = meta.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    let createdDesc = false;
    let originalDesc = '';

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      createdDesc = true;
    } else {
      originalDesc = metaDesc.content;
    }
    metaDesc.content = meta.description;

    return () => {
      document.title = originalTitle;
      if (createdDesc && metaDesc.parentNode) {
        metaDesc.parentNode.removeChild(metaDesc);
      } else if (metaDesc) {
        metaDesc.content = originalDesc;
      }
    };
  }, [lang, meta]);

  return (
    // reducedMotion="user": honour the OS "reduce motion" setting (opacity only, no movement).
    <MotionConfig reducedMotion="user">
    <div className="work-with-me-page">
      <WorkWithMeHeader />
      <main>
        <WorkWithMeHero />
        <WorkWithMeServices />
        <WorkWithMeWhyMe />
        <WorkWithMeProcess />
        <WorkWithMeFAQ />
        <WorkWithMeCTA />
      </main>
      <WorkWithMeFooter />
    </div>
    </MotionConfig>
  );
}
