function SiteFooter() {
    return (
        <footer
            id="contact"
            className="border-t border-white/10 py-10 light:border-slate-300/70"
        >
            <div className="section-wrap text-center">
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white light:text-slate-950">
                    Connect
                </h3>
                <div className="mx-auto mt-4 max-w-xl space-y-2 text-sm">
                    <a
                        className="block text-slate-300 transition hover:text-sky-400 light:text-slate-700"
                        href="mailto:tiryakiemre18@gmail.com"
                    >
                        tiryakiemre18@gmail.com
                    </a>
                    <a
                        className="block text-slate-300 transition hover:text-sky-400 light:text-slate-700"
                        href="https://github.com/emre-tiryaki"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://github.com/emre-tiryaki
                    </a>
                    <a
                        className="block text-slate-300 transition hover:text-sky-400 light:text-slate-700"
                        href="https://www.linkedin.com/in/emre-tiryaki-7448b6290/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://www.linkedin.com/in/emre-tiryaki-7448b6290/
                    </a>
                </div>

                <p className="font-['Space_Grotesk'] text-lg font-bold">ET.</p>
                <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                    © 2026 Emre Tiryaki. Built with precision and passion.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-xs uppercase tracking-[0.16em] text-slate-400 light:text-slate-500">
                    <a href="#" className="transition hover:text-sky-400">
                        Twitter
                    </a>
                    <a href="#" className="transition hover:text-sky-400">
                        LinkedIn
                    </a>
                    <a href="#" className="transition hover:text-sky-400">
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default SiteFooter;
