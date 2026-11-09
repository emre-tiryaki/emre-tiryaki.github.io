import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { EASE_OUT } from './motionPresets';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';

const LANGS = ['tr', 'en'];

function LangToggle({ lang, setLanguage }) {
  return (
    <div className="pwm-lang-toggle" role="group" aria-label="Language / Dil">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLanguage(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function WorkWithMeHeader() {
  const { lang, setLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { navigation, hero } = data;

  // The page scrolls inside .work-with-me-page, not the window.
  useEffect(() => {
    const scroller = headerRef.current?.closest('.work-with-me-page');
    if (!scroller) return undefined;
    const onScroll = () => setScrolled(scroller.scrollTop > 8);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isRaised = scrolled || mobileMenuOpen;

  return (
    <motion.header
      ref={headerRef}
      className={`pwm-header ${isRaised ? 'pwm-header--scrolled' : ''}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="pwm-container h-full flex items-center justify-between gap-6">
        {/* Brand (text only) */}
        <a
          href="#top"
          onClick={(e) => handleScrollTo(e, '#top')}
          className="flex items-center no-underline shrink-0"
        >
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold text-slate-900 tracking-tight">Emre Tiryaki</span>
            <span className="text-xs text-slate-500">Software Engineer</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleScrollTo(e, item.href)}
              className="pwm-nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <LangToggle lang={lang} setLanguage={setLanguage} />
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="pwm-btn pwm-btn--primary pwm-btn--sm"
          >
            <span>{hero.primaryCta}</span>
            <FiArrowRight size={15} />
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <LangToggle lang={lang} setLanguage={setLanguage} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={lang === 'tr' ? 'Menüyü aç/kapat' : 'Toggle menu'}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          key="mobile-menu"
          className="pwm-mobile-menu lg:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <nav className="pwm-container py-4 flex flex-col">
            {navigation.map((item, i) => (
              <motion.a
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.05 + i * 0.04 }}
                key={item.href}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="py-3 text-base font-medium text-slate-700 hover:text-slate-900 border-b border-slate-100 last:border-b-0"
              >
                {item.label}
              </motion.a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="pwm-btn pwm-btn--primary w-full mt-4"
            >
              <span>{hero.primaryCta}</span>
              <FiArrowRight size={16} />
            </a>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  );
}
