import { useEffect, useRef, useState } from 'react'

function SiteHeader({ isLight, onToggleTheme }) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingUp = currentScrollY < lastScrollYRef.current

      if (currentScrollY <= 12) {
        setIsVisible(true)
      } else {
        setIsVisible(isScrollingUp)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-20 border-b border-white/10 bg-[#05070b]/80 backdrop-blur transition-transform duration-300 light:border-slate-300/70 light:bg-[#ecf3fa]/80 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="section-wrap flex h-16 items-center justify-between">
          <a className="font-['Space_Grotesk'] text-lg font-bold tracking-wide" href="#top">
            ET.
          </a>
          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] md:flex">
            <a href="#about" className="text-slate-300 transition hover:text-white light:text-slate-700 light:hover:text-slate-900">About</a>
            <a href="#skills" className="text-slate-300 transition hover:text-white light:text-slate-700 light:hover:text-slate-900">Skills</a>
            <a href="#projects" className="text-slate-300 transition hover:text-white light:text-slate-700 light:hover:text-slate-900">Projects</a>
            <a href="#experience" className="text-slate-300 transition hover:text-white light:text-slate-700 light:hover:text-slate-900">Experience</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200 transition hover:border-sky-400 hover:text-white light:border-slate-400 light:text-slate-700 light:hover:border-sky-600"
            >
              {isLight ? 'Dark' : 'Light'}
            </button>
            <a
              href="#contact"
              className="rounded-full bg-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-sky-400"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </header>

      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed left-1/2 top-0 z-30 -translate-x-1/2 rounded-b-lg border border-t-0 border-white/20 bg-[#05070b]/90 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200 backdrop-blur transition hover:border-sky-400 hover:text-white light:border-slate-400 light:bg-[#ecf3fa]/95 light:text-slate-700 light:hover:border-sky-600"
          aria-label="Show header"
        >
          Menu
        </button>
      )}
    </>
  )
}

export default SiteHeader
