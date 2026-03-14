export default function SiteHeader() {
    const navLinks = [
        ["About", "#about"],
        ["Skills", "#skills"],
        ["Projects", "#projects"],
        ["Experience", "#experience"],
        ["Contact", "#contact"],
    ];

    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#05070b]/80 backdrop-blur-md light:border-slate-300/70 light:bg-[#ecf3fa]/85">
            <div className="section-wrap flex h-16 items-center justify-between gap-4">
                <a
                    href="#top"
                    className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-white light:text-slate-950"
                >
                    Emre Tiryaki
                </a>

                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300 transition hover:text-sky-300 light:text-slate-700 light:hover:text-sky-700"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}
