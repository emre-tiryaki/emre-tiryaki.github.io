const EXPERIENCE_COPY = {
    en: {
        heading: "Experience",
        role: "Participant / Competitor",
        description:
            "Collaborated in a high-intensity environment to develop a gamified new pages frontend.",
        sourceCodes: "Source Codes:",
    },
    tr: {
        heading: "Deneyim",
        role: "Katilimci / Yarismaci",
        description:
            "Yuksek tempolu bir ortamda, oyunlastirilmis bir yeni sayfa arayuzu gelistirmek icin ekip olarak calistik.",
        sourceCodes: "Kaynak Kodlar:",
    },
    es: {
        heading: "Experiencia",
        role: "Participante / Competidor",
        description:
            "Colabore en un entorno de alta intensidad para desarrollar un frontend de pagina nueva gamificado.",
        sourceCodes: "Codigo Fuente:",
    },
};

function ExperienceSection({ language = "en" }) {
    const copy = EXPERIENCE_COPY[language] ?? EXPERIENCE_COPY.en;

    return (
        <section id="experience" className="section-wrap py-20">
            <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                {copy.heading}
            </h2>
            <div className="relative mx-auto mt-12 max-w-2xl border-l border-sky-500/40 pl-8 before:absolute before:-left-[5px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-sky-500 md:border-none md:pl-0">
                <div className="grid gap-8">
                    <article className="glass-card p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400">
                            2025
                        </p>
                        <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-white light:text-slate-950">
                            Anadolu Ajansi Hackathon
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-300 light:text-slate-700">
                            {copy.role}
                        </p>
                        <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                            {copy.description}
                        </p>
                        <a
                            href="https://github.com/HEGS-HABER"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700"
                        >
                            {copy.sourceCodes} https://github.com/HEGS-HABER
                        </a>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection;
