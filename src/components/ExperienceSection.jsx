import experiences from "../data/experiences.json";

const EXPERIENCE_COPY = {
    en: {
        heading: "Experience",
        participationLabel: "Participation:",
        codePrivate: "Source code is private",
    },
    tr: {
        heading: "Deneyim",
        participationLabel: "Katılım:",
        codePrivate: "Kaynak kodlar gizlidir",
    },
    es: {
        heading: "Experiencia",
        participationLabel: "Participacion:",
        codePrivate: "El codigo fuente es privado",
    },
};

const PARTICIPATION_COPY = {
    en: {
        participant: "Participant",
        participant_competitor: "Participant / Competitor",
    },
    tr: {
        participant: "Katılımcı",
        participant_competitor: "Katılımcı / Yarışmacı",
    },
    es: {
        participant: "Participante",
        participant_competitor: "Participante / Competidor",
    },
};

const DESCRIPTION_COPY = {
    en: {
        inufest:
            "At Inufest, we built an AI system that grades handwritten student answers based on the teacher's instructions, rather than acting as an optical reader.",
        tua_astro_backend:
            "I participated in TUA Astro Hackathon and developed the backend system of the project.",
        aa_hackathon_frontend:
            "We collaborated in a high-intensity environment to develop a gamified new-page frontend.",
    },
    tr: {
        inufest:
            "İnüfest'te optik okuyucu olarak çalışan bir sistem değil, öğretmenin verdiği yönergeler doğrultusunda el yazısıyla yazılmış öğrenci cevaplarını notlandıran yapay zeka sistemi geliştirdik.",
        tua_astro_backend:
            "TUA Astro Hackathon'da katılımcıydım ve projenin backend sistemini yaptım.",
        aa_hackathon_frontend:
            "Yüksek tempolu bir ortamda, oyunlaştırılmış bir yeni sayfa arayüzü geliştirmek için ekip olarak çalıştık.",
    },
    es: {
        inufest:
            "En Inufest desarrollamos un sistema de IA que califica respuestas escritas a mano por estudiantes segun las instrucciones del profesor, en lugar de funcionar como un lector optico.",
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

function getLinkLabel(url) {
    if (!url) {
        return "";
    }

    return url.replace(/^https?:\/\//, "");
}

function GithubIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
        >
            <path d="M12 2C6.477 2 2 6.485 2 12.017c0 4.425 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.53 1.03 1.53 1.03.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.485 17.523 2 12 2z" />
        </svg>
    );
}

function ExternalLinkIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 3h7v7" />
            <path d="M10 14L21 3" />
            <path d="M21 14v7h-7" />
            <path d="M3 10V3h7" />
            <path d="M3 21l7-7" />
        </svg>
    );
}

function ExperienceSection({ language = "en" }) {
    const copy = EXPERIENCE_COPY[language] ?? EXPERIENCE_COPY.en;

    return (
        <section id="experience" className="section-wrap py-20">
            <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                {copy.heading}
            </h2>
            <div className="relative mx-auto mt-14 max-w-5xl">
                <span
                    aria-hidden="true"
                    className="absolute left-4 top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-sky-400 via-sky-300 to-slate-200 md:left-1/2 md:-translate-x-1/2"
                />
                <div className="space-y-10 md:space-y-14">
                    {experiences.map((experience, index) => {
                        const isRightSide = index % 2 === 1;

                        return (
                            <div
                                key={`${experience.year}-${experience.title}`}
                                className="relative grid grid-cols-1 md:grid-cols-2 md:gap-14"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute left-4 top-8 z-10 h-3.5 w-3.5 -translate-x-[5px] rounded-full border-2 border-slate-950 bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.25)] light:border-white md:left-1/2 md:-translate-x-1/2"
                                />
                                <article
                                    className={`ml-10 p-2 md:ml-0 ${
                                        isRightSide
                                            ? "md:col-start-2"
                                            : "md:col-start-1"
                                    }`}
                                >
                                    <p className="font-['Space_Grotesk'] text-5xl font-bold leading-none text-sky-400">
                                        {experience.year}
                                    </p>
                                    <h3 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                                        {experience.title}
                                    </h3>
                                    <p className="mt-2 text-lg font-medium text-slate-300 light:text-slate-700">
                                        {copy.participationLabel}{" "}
                                        {getLocalizedValue(
                                            PARTICIPATION_COPY,
                                            experience.participationKey,
                                            language,
                                        )}
                                    </p>
                                    <p className="mt-5 text-base leading-8 text-slate-300 light:text-slate-700">
                                        {getLocalizedValue(
                                            DESCRIPTION_COPY,
                                            experience.descriptionKey,
                                            language,
                                        )}
                                    </p>
                                    {experience.sourceCode ? (
                                        <a
                                            href={experience.sourceCode}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200 light:text-sky-700 light:hover:text-sky-800"
                                        >
                                            <GithubIcon />
                                            <span>
                                                {getLinkLabel(
                                                    experience.sourceCode,
                                                )}
                                            </span>
                                        </a>
                                    ) : experience.codePrivate ? (
                                        <span className="mt-5 inline-flex text-sm font-semibold text-slate-400 light:text-slate-600">
                                            {copy.codePrivate}
                                        </span>
                                    ) : null}
                                    {experience.liveSite && (
                                        <a
                                            href={experience.liveSite}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200 light:text-emerald-700 light:hover:text-emerald-800"
                                        >
                                            <ExternalLinkIcon />
                                            <span>
                                                {getLinkLabel(
                                                    experience.liveSite,
                                                )}
                                            </span>
                                        </a>
                                    )}
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection;
