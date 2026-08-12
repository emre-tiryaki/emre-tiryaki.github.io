import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

const NAV_ITEMS = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/skills', key: 'skills' },
  { path: '/education', key: 'education' },
  { path: '/experience', key: 'experience' },
  { path: '/projects', key: 'projects' },
  { path: '/certifications', key: 'certifications' },
];

export default function Navbar() {
  const { t, lang, setLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md ${
      isActive
        ? 'text-orange-400'
        : 'text-neutral-400 hover:text-neutral-100'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        style={{
          background: 'rgba(10, 10, 10, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(38, 38, 38, 0.6)',
        }}
      >
        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, key }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={navLinkClass}
            >
              {({ isActive }) => (
                <>
                  {t(`nav.${key}`)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-400 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Spacer on mobile */}
        <div className="lg:hidden flex-1" />

        {/* Language toggle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 text-sm font-medium text-neutral-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200"
            aria-label="Dil değiştir / Switch language"
          >
            <span>{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
            <span className="text-xs font-mono uppercase">{lang}</span>
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-2 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-50 flex flex-col gap-1 p-4"
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(38, 38, 38, 0.8)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {NAV_ITEMS.map(({ path, key }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 min-h-[48px] flex items-center ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100'
                    }`
                  }
                >
                  {t(`nav.${key}`)}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
