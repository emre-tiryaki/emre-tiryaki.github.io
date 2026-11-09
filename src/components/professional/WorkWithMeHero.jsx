import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FiArrowRight, FiCheck, FiChevronLeft, FiChevronRight, FiLayout, FiGrid, FiMessageCircle, FiZap,
  FiCoffee, FiUser, FiShoppingBag, FiCalendar,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { WORK_WITH_ME_DATA } from '../../data/professional';
import WorkWithMeMockup from './WorkWithMeMockup';

// How long each showcase stays on screen before auto-advancing.
const SLIDE_DURATION_MS = 7000;

const TAB_ICONS = {
  website: FiLayout,
  menu: FiCoffee,
  personal: FiUser,
  store: FiShoppingBag,
  booking: FiCalendar,
  dashboard: FiGrid,
  ai: FiMessageCircle,
  automation: FiZap,
};

/**
 * Stacks every variant in one grid cell (invisibly) so the box is always as
 * big as the longest one, then fades the active variant in on top.
 * Prevents the headline/subtitle from resizing the hero on every change.
 */
function TextRotator({ items, index, className = '' }) {
  return (
    <span className={`pwm-rotator ${className}`}>
      {items.map((text, i) => (
        <span key={i} className="pwm-rotator__sizer" aria-hidden="true">{text}</span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function WorkWithMeHero() {
  const { lang } = useTranslation();
  const data = WORK_WITH_ME_DATA[lang] || WORK_WITH_ME_DATA.tr;
  const { hero } = data;
  const { showcases } = hero;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoplay = !reduceMotion && showcases.length > 1;
  const current = showcases[active] || showcases[0];

  // Keep the active tab visible when the tab row scrolls horizontally (mobile).
  // Scrolls only the tab row, never the page.
  const tabsRef = useRef(null);
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.children[active];
    if (!row || !tab) return;
    const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    row.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  // Which ends of the tab row have hidden tabs (drives edge fades + arrows).
  const [edges, setEdges] = useState({ left: false, right: false });
  const updateEdges = useCallback(() => {
    const row = tabsRef.current;
    if (!row) return;
    const left = row.scrollLeft > 4;
    const right = row.scrollLeft + row.clientWidth < row.scrollWidth - 4;
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);
  useEffect(() => {
    const row = tabsRef.current;
    if (!row) return undefined;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(row);
    return () => observer.disconnect();
  }, [updateEdges, lang]);

  const scrollTabs = (dir) => {
    const row = tabsRef.current;
    row?.scrollBy({ left: dir * row.clientWidth * 0.6, behavior: 'smooth' });
  };

  const goNext = () => setActive((i) => (i + 1) % showcases.length);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="pwm-section pwm-section--hero overflow-hidden">
      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-blue-100/50 blur-3xl pointer-events-none"
      />

      <div className="pwm-container relative">
        {/* Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-14 items-end">
          <div className="min-w-0">
            <div className="pwm-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="pwm-h1 pwm-h1--hero">
              {hero.headlineLead}
              {/* The ending rides along inside the rotator so any reserved
                  space lands after the sentence, not in the middle of it. */}
              <TextRotator
                items={showcases.map((s) => (
                  <>
                    <span className="text-blue-600">{s.highlight}</span> {hero.headlineEnd}
                  </>
                ))}
                index={active}
              />
            </h1>
          </div>

          <div className="min-w-0 lg:pb-2">
            <p className="pwm-lead">
              <TextRotator items={showcases.map((s) => s.description)} index={active} />
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="pwm-btn pwm-btn--primary"
              >
                <span>{hero.primaryCta}</span>
                <FiArrowRight size={17} />
              </a>
              <a
                href="#services"
                onClick={(e) => handleScrollTo(e, '#services')}
                className="pwm-btn pwm-btn--secondary"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        {/* Showcase: tabs + rotating wide mockup. Hover/focus pauses autoplay. */}
        <div
          className="mt-12 lg:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={(e) => e.target.matches(':focus-visible') && setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative">
            {/* Arrows are a mouse convenience only; keyboard users tab through the tabs,
                which scrolls them into view on its own. */}
            {edges.left && (
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => scrollTabs(-1)}
                className="pwm-showcase-arrow pwm-showcase-arrow--left">
                <FiChevronLeft size={18} />
              </button>
            )}
            {edges.right && (
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => scrollTabs(1)}
                className="pwm-showcase-arrow pwm-showcase-arrow--right">
                <FiChevronRight size={18} />
              </button>
            )}
            <div
              ref={tabsRef}
              role="tablist"
              aria-label={hero.showcaseLabel}
              onScroll={updateEdges}
              className={`pwm-showcase-tabs${edges.left ? ' has-more-left' : ''}${edges.right ? ' has-more-right' : ''}`}
            >
              {showcases.map((s, i) => {
                const Icon = TAB_ICONS[s.id] || FiLayout;
                const selected = i === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(i)}
                    className={`pwm-showcase-tab${selected ? ' is-active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{s.tab}</span>
                    {selected && autoplay && (
                      <span
                        key={active}
                        aria-hidden="true"
                        className="pwm-showcase-tab__progress"
                        style={{
                          animationDuration: `${SLIDE_DURATION_MS}ms`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                        onAnimationEnd={goNext}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <WorkWithMeMockup showcase={current} />
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {hero.trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiCheck size={12} strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
