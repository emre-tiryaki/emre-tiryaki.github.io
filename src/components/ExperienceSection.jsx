import experiences from "../data/experiences.json";

const EXPERIENCE_COPY = {
    en: {
        heading: "Experience",
        participationLabel: "Participation:",
        sourceCodes: "Source Codes:",
        liveSite: "Live Site:",
    },
    tr: {
        heading: "Deneyim",
        participationLabel: "Katilim:",
        sourceCodes: "Kaynak Kodlar:",
        liveSite: "Canli Site:",
    },
    es: {
        heading: "Experiencia",
        participationLabel: "Participacion:",
        sourceCodes: "Codigo Fuente:",
        liveSite: "Sitio en Vivo:",
    },
};

const PARTICIPATION_COPY = {
    en: {
        participant: "Participant",
        participant_competitor: "Participant / Competitor",
    },
    tr: {
        participant: "Katilimci",
        participant_competitor: "Katilimci / Yarismaci",
    },
    es: {
        participant: "Participante",
        participant_competitor: "Participante / Competidor",
    },
};

const DESCRIPTION_COPY = {
    en: {
        tua_astro_backend:
            "I participated in TUA Astro Hackathon and developed the backend system of the project.",
        aa_hackathon_frontend:
            "We collaborated in a high-intensity environment to develop a gamified new-page frontend.",
    },
    tr: {
        tua_astro_backend:
            "TUA Astro Hackathon'da katilimciydim ve projenin backend sistemini yaptim.",
        aa_hackathon_frontend:
            "Yuksek tempolu bir ortamda, oyunlastirilmis bir yeni sayfa arayuzu gelistirmek icin ekip olarak calistik.",
    },
    es: {
        tua_astro_backend:
            "Participe en TUA Astro Hackathon y desarrolle el sistema backend del proyecto.",
        aa_hackathon_frontend:
            "Colaboramos en un entorno de alta intensidad para desarrollar un frontend de nueva pagina gamificado.",
    },
};

function getLocalizedValue(table, key, language) {
    if (!key) {
        return "";
    }

    const localizedTable = table[language] ?? table.en;
    return localizedTable?.[key] ?? table.en?.[key] ?? key;
}

function ExperienceSection({ language = "en" }) {
    const copy = EXPERIENCE_COPY[language] ?? EXPERIENCE_COPY.en;

    return (
        <section id="experience" className="section-wrap py-20">
            <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                {copy.heading}
            </h2>
            <div className="relative mx-auto mt-12 max-w-2xl border-l border-sky-500/40 pl-8 before:absolute before:-left-[5px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-sky-500 md:border-none md:pl-0">
                <div className="grid gap-8">
                    {experiences.map((experience) => (
                        <article
                            key={`${experience.year}-${experience.title}`}
                            className="glass-card p-6"
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400">
                                {experience.year}
                            </p>
                            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-white light:text-slate-950">
                                {experience.title}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-300 light:text-slate-700">
                                {copy.participationLabel}{" "}
                                {getLocalizedValue(
                                    PARTICIPATION_COPY,
                                    experience.participationKey,
                                    language,
                                )}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                                {getLocalizedValue(
                                    DESCRIPTION_COPY,
                                    experience.descriptionKey,
                                    language,
                                )}
                            </p>
                            {experience.sourceCode && (
                                <a
                                    href={experience.sourceCode}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700"
                                >
                                    {copy.sourceCodes} {experience.sourceCode}
                                </a>
                            )}
                            {experience.liveSite && (
                                <a
                                    href={experience.liveSite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 light:text-emerald-700"
                                >
                                    {copy.liveSite} {experience.liveSite}
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection;
