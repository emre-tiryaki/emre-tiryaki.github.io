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

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="w-full max-w-5xl h-14 flex items-center justify-between px-5 rounded-2xl"
        style={{
          background: 'rgba(12, 12, 12, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, key }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-orange-400'
                    : 'text-neutral-400 hover:text-slate-100 hover:bg-white/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{t(`nav.${key}`)}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-orange-500/15 border border-orange-500/35"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile: logo/spacer */}
        <div className="lg:hidden text-sm font-bold text-orange-400 tracking-tight">ET.</div>

        {/* Right: Lang toggle + Hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-300 hover:text-orange-400 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Dil değiştir"
          >
            <span>{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
            <span className="font-mono">{lang.toUpperCase()}</span>
          </button>

          <button
            className="lg:hidden p-2 rounded-xl text-neutral-300 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl p-3 flex flex-col gap-1"
              style={{
                background: 'rgba(14,14,14,0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              {NAV_ITEMS.map(({ path, key }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-between min-h-[48px] ${
                      isActive
                        ? 'text-orange-400 bg-orange-500/15 border border-orange-500/30'
                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  <span>{t(`nav.${key}`)}</span>
                  <span className="text-neutral-600 text-xs">→</span>
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
