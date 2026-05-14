const HEADER_COPY = {
    en: {
        nav: [
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Projects", "#projects"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
        ],
        languageLabel: "Language",
    },
    tr: {
        nav: [
            ["Hakkımda", "#about"],
            ["Yetenekler", "#skills"],
            ["Projeler", "#projects"],
            ["Deneyim", "#experience"],
            ["İletişim", "#contact"],
        ],
        languageLabel: "Dil",
    },
    es: {
        nav: [
            ["Sobre Mi", "#about"],
            ["Habilidades", "#skills"],
            ["Proyectos", "#projects"],
            ["Experiencia", "#experience"],
            ["Contacto", "#contact"],
        ],
        languageLabel: "Idioma",
    },
};

export default function SiteHeader({ language = "en", setLanguage }) {
    const copy = HEADER_COPY[language] ?? HEADER_COPY.en;
    const navLinks = copy.nav;

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

                <div className="ml-auto flex items-center gap-2 md:ml-0">
                    <span
                        aria-hidden="true"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-300 light:border-slate-300 light:bg-white light:text-slate-700"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M3 12h18" />
                            <path d="M12 3a15 15 0 0 1 0 18" />
                            <path d="M12 3a15 15 0 0 0 0 18" />
                        </svg>
                    </span>
                    <label
                        htmlFor="language-select"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 light:text-slate-600"
                    >
                        {copy.languageLabel}
                    </label>
                    <div className="relative">
                        <select
                            id="language-select"
                            value={language}
                            onChange={(event) =>
                                setLanguage?.(event.target.value)
                            }
                            className="appearance-none rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 pr-8 text-xs font-semibold text-slate-100 outline-none transition focus:border-sky-400 light:border-slate-300 light:bg-white light:text-slate-900"
                        >
                            <option value="en">EN - English</option>
                            <option value="tr">TR - Türkçe</option>
                            <option value="es">ES - Español</option>
                        </select>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-2 inline-flex items-center text-slate-400 light:text-slate-600"
                        >
                            <svg
                                viewBox="0 0 20 20"
                                className="h-4 w-4"
                                fill="currentColor"
                            >
                                <path d="M5.6 7.2a.75.75 0 0 1 1.06 0L10 10.54l3.34-3.34a.75.75 0 1 1 1.06 1.06l-3.87 3.87a.75.75 0 0 1-1.06 0L5.6 8.26a.75.75 0 0 1 0-1.06Z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
