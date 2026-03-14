function RightSideNav() {
  const links = [
    ['About', '#about'],
    ['Skills', '#skills'],
    ['Projects', '#projects'],
    ['Experience', '#experience'],
    ['Contact', '#contact'],
  ]

  return (
    <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block">
      <nav className="p-1">
        <ul className="space-y-2">
          {links.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                className="block px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300 transition hover:text-sky-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.75)] light:text-slate-700 light:hover:text-sky-700 light:hover:drop-shadow-[0_0_8px_rgba(3,105,161,0.55)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default RightSideNav
