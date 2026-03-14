const FOOTER_COPY = {
    en: {
        connect: "Connect",
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn",
        copyright: "Built with precision and passion.",
    },
    tr: {
        connect: "Baglanti",
        email: "E-posta",
        github: "GitHub",
        linkedin: "LinkedIn",
        copyright: "Ozen ve tutkuyla gelistirildi.",
    },
    es: {
        connect: "Contacto",
        email: "Correo",
        github: "GitHub",
        linkedin: "LinkedIn",
        copyright: "Creado con precision y pasion.",
    },
};

function SiteFooter({ language = "en" }) {
    const copy = FOOTER_COPY[language] ?? FOOTER_COPY.en;

    return (
        <footer
            id="contact"
            className="border-t border-white/10 py-10 light:border-slate-300/70"
        >
            <div className="section-wrap grid gap-10 md:grid-cols-2 md:items-start">
                <div className="text-center md:text-left">
                    <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white light:text-slate-950">
                        {copy.connect}
                    </h3>
                    <div className="mt-4 space-y-2 text-sm">
                        <a
                            className="flex items-center justify-center gap-2 text-slate-300 transition hover:text-sky-400 light:text-slate-700 md:justify-start"
                            href="mailto:tiryakiemre18@gmail.com"
                        >
                            <span aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M4 6h16v12H4z" />
                                    <path d="m4 7 8 6 8-6" />
                                </svg>
                            </span>
                            <span>{copy.email}: tiryakiemre18@gmail.com</span>
                        </a>
                        <a
                            className="flex items-center justify-center gap-2 text-slate-300 transition hover:text-sky-400 light:text-slate-700 md:justify-start"
                            href="https://github.com/emre-tiryaki"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.05 0-1.11.39-2.01 1.03-2.72-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.04A9.32 9.32 0 0 1 12 6.8c.85 0 1.71.12 2.51.36 1.9-1.32 2.74-1.04 2.74-1.04.55 1.43.21 2.48.11 2.74.64.71 1.03 1.61 1.03 2.72 0 3.92-2.34 4.79-4.57 5.04.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.85 0 .27.18.6.69.49A10.22 10.22 0 0 0 22 12.22C22 6.58 17.52 2 12 2z" />
                                </svg>
                            </span>
                            <span>
                                {copy.github}: https://github.com/emre-tiryaki
                            </span>
                        </a>
                        <a
                            className="flex items-center justify-center gap-2 text-slate-300 transition hover:text-sky-400 light:text-slate-700 md:justify-start"
                            href="https://www.linkedin.com/in/emre-tiryaki-7448b6290/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4"
                                    fill="currentColor"
                                >
                                    <path d="M6.94 8.5a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44zM5.4 9.74h3.08V19H5.4zm4.9 0h2.95v1.26h.04c.41-.78 1.42-1.6 2.92-1.6 3.12 0 3.7 2.09 3.7 4.82V19h-3.08v-4.25c0-1.02-.02-2.33-1.4-2.33-1.41 0-1.62 1.12-1.62 2.26V19H10.3z" />
                                </svg>
                            </span>
                            <span>
                                {copy.linkedin}:
                                https://www.linkedin.com/in/emre-tiryaki-7448b6290/
                            </span>
                        </a>
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <p className="font-['Space_Grotesk'] text-lg font-bold">
                        Emre Tiryaki
                    </p>
                    <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                        © 2026 Emre Tiryaki. {copy.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default SiteFooter;
