import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
const NAV_ITEMS = [
  { path: '/',               key: 'home'           },
  { path: '/about',          key: 'about'          },
  { path: '/skills',         key: 'skills'         },
  { path: '/education',      key: 'education'      },
  { path: '/experience',     key: 'experience'     },
  { path: '/blog',           key: 'blog'           },
  { path: '/projects',       key: 'projects'       },
  { path: '/certifications', key: 'certifications' },
];

export default function Navbar() {
  const { t, lang, setLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 select-none">
      <nav
        style={{
          width: '100%',
          maxWidth: '72rem',
          height: '3.75rem',          /* 60px — taller bar */
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          borderRadius: '1rem',
          background: 'rgba(12, 12, 12, 0.90)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* ── Desktop layout: [spacer] [nav links centered] [lang button] ── */}
        <div className="hidden lg:flex" style={{ flex: 1 }}>
          {/* Left spacer — same width as lang button so links end up truly centered */}
          <div style={{ width: '6rem' }} />
        </div>

        {/* Center: nav links */}
        <div className="hidden lg:flex items-center" style={{ gap: '0.25rem' }}>
          {NAV_ITEMS.map(({ path, key }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className="relative"
              style={{ textDecoration: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
            >
              {({ isActive }) => (
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '0.65rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive ? '#fb923c' : '#94a3b8',
                    background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(249,115,22,0.35)' : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#f1f5f9';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {t(`nav.${key}`)}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right spacer + lang button */}
        <div className="hidden lg:flex items-center justify-end" style={{ flex: 1 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLanguage(lang === 'tr' ? 'en' : 'tr')}
            aria-label={t('nav.changeLanguage')}
            className="!w-24 justify-center"
          >
            <span>{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
            <span style={{ fontFamily: 'monospace' }}>{lang.toUpperCase()}</span>
          </Button>
        </div>

        {/* ── Mobile layout: logo left, controls right ── */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fb923c', letterSpacing: '-0.01em', userSelect: 'none', WebkitUserSelect: 'none' }}>ET.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(lang === 'tr' ? 'en' : 'tr')}
              aria-label={t('nav.changeLanguage')}
            >
              <span>{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
              <span style={{ fontFamily: 'monospace' }}>{lang.toUpperCase()}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={t('nav.menu')}
              className="!p-2"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed left-4 right-4 z-50 p-3 flex flex-col gap-1"
              style={{
                top: '5.25rem',
                background: 'rgba(14,14,14,0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                borderRadius: '1rem',
                userSelect: 'none',
                WebkitUserSelect: 'none',
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
                  style={{ textDecoration: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  {({ isActive }) => (
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.9rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      minHeight: '3rem',
                      color: isActive ? '#fb923c' : '#cbd5e1',
                      background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}>
                      <span>{t(`nav.${key}`)}</span>
                      <span style={{ color: '#475569', fontSize: '0.75rem' }}>→</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
