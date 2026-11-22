import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import Button from '../ui/Button';
import Flag from '../ui/Flag';
import siteConfig from '../../data/siteConfig.json';

const { accent, surface, text } = THEME_COLORS;
const NAV_ITEMS = [
  { path: '/',               key: 'home'           },
  { path: '/about',          key: 'about'          },
  { path: '/skills',         key: 'skills'         },
  { path: '/education',      key: 'education'      },
  { path: '/experience',    key: 'experience'    },
  { path: '/projects',      key: 'projects'      },
  ...(siteConfig.showGuestbook ? [{ path: '/guestbook', key: 'guestbook' }] : []),
  { path: '/certifications', key: 'certifications' },
];

const LOGO_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'var(--font-mono)',
  fontSize: '1.3rem',
  fontStyle: 'italic',
  fontWeight: 800,
  color: accent.primary,
  letterSpacing: '-0.06em',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export default function Navbar() {
  const { t, lang, setLanguage } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const [menuPath, setMenuPath] = useState(pathname);

  // Rota değişince (örn. tarayıcı geri tuşu) menü açık kalmasın
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // Escape ile kapat
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className="fixed left-0 right-0 z-50 flex justify-center select-none"
      style={{
        top: 'calc(1rem + env(safe-area-inset-top))',
        // px-4 global reset tarafından ezildiği için kenar boşluğu inline verilir
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <nav
        style={{
          // Menü açıkken arka plan örtüsünün (z-40) üstünde kalsın; kapatma (X) butonu görünür olsun
          position: 'relative',
          zIndex: 50,
          width: '100%',
          maxWidth: '72rem',
          height: '3.75rem',          /* 60px — taller bar */
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 'clamp(0.75rem, 3vw, 1.25rem)',
          paddingRight: 'clamp(0.5rem, 3vw, 1.25rem)',
          borderRadius: '1rem',
          background: surface.nav,
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: `1px solid ${surface.white09}`,
          boxShadow: `0 8px 32px ${surface.black60}, inset 0 1px 0 ${surface.white06}`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* ── Desktop layout: [logo] [nav links centered] [lang button] ── */}
        <div className="hidden lg:flex items-center" style={{ flex: 1 }}>
          {/* Sol logo — flex:1 ile sağ taraf dengelenir, linkler gerçekten ortada kalır */}
          <NavLink to="/" aria-label={t('nav.home')} style={LOGO_STYLE}>
            ET.
          </NavLink>
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
                    color: isActive ? accent.light : text.secondary,
                    background: isActive ? accent.a12 : 'transparent',
                    border: isActive ? `1px solid ${accent.a35}` : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#f1f5f9';
                      e.currentTarget.style.background = surface.white07;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = text.secondary;
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
            <Flag code={lang} />
            <span>{lang.toUpperCase()}</span>
          </Button>
        </div>

        {/* ── Mobile layout: logo left, controls right ── */}
        <div className="lg:hidden flex items-center justify-between w-full" style={{ gap: '0.5rem' }}>
          <NavLink
            to="/"
            aria-label={t('nav.home')}
            style={{ ...LOGO_STYLE, minHeight: '2.75rem', minWidth: 0, paddingRight: '0.5rem' }}
          >
            ET.
          </NavLink>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLanguage(lang === 'tr' ? 'en' : 'tr')}
              aria-label={t('nav.changeLanguage')}
              style={{ minHeight: '2.5rem' }}
            >
              <Flag code={lang} />
              <span>{lang.toUpperCase()}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={t('nav.menu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              className="!p-2"
              style={{ width: '2.75rem', height: '2.75rem' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <motion.nav
              id="mobile-nav-menu"
              aria-label={t('nav.menu')}
              className="fixed z-50 flex flex-col gap-1"
              style={{
                top: 'calc(5.25rem + env(safe-area-inset-top))',
                left: 'max(1rem, env(safe-area-inset-left))',
                right: 'max(1rem, env(safe-area-inset-right))',
                padding: '0.75rem',
                // Yatay telefonda (kısa ekran) menü taşmasın, kaydırılabilsin
                maxHeight: 'calc(100dvh - 6.25rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                background: surface.navMobile,
                backdropFilter: 'blur(24px)',
                border: `1px solid ${surface.white10}`,
                boxShadow: `0 20px 60px ${surface.black70}`,
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
                      color: isActive ? accent.light : '#cbd5e1',
                      background: isActive ? accent.a12 : 'transparent',
                      border: isActive ? `1px solid ${accent.a30}` : '1px solid transparent',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}>
                      <span>{t(`nav.${key}`)}</span>
                      <span aria-hidden="true" style={{ color: '#475569', fontSize: '0.75rem' }}>→</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
