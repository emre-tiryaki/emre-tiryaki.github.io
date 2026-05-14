import { useRef } from "react";
import ProjectCard from "./ProjectCard";
import okurPreview from "../assets/project_previews/OKUR/OKUR.jpeg";
import projectToolkitPreview from "../assets/project_previews/project_toolkit/project_toolkit.png";
import typingGamePreview from "../assets/project_previews/typing_game/typing_game.png";

const PROJECTS_COPY = {
    en: {
        heading: "Featured Work",
        subtitle: "Selected projects demonstrating architecture and logic.",
        allGithub: "View All Github",
        prevProjects: "Scroll projects left",
        nextProjects: "Scroll projects right",
        codePrivate: "Source code is private",
    },
    tr: {
        heading: "Öne Çıkan Çalışmalar",
        subtitle: "Mimari ve iş mantığını gösteren seçili projeler.",
        allGithub: "Tüm GitHub Projeleri",
        prevProjects: "Projeleri sola kaydır",
        nextProjects: "Projeleri sağa kaydır",
        codePrivate: "Kaynak kodlar gizlidir",
    },
    es: {
        heading: "Trabajos Destacados",
        subtitle:
            "Proyectos seleccionados que demuestran arquitectura y logica.",
        allGithub: "Ver Todo en GitHub",
        prevProjects: "Desplazar proyectos a la izquierda",
        nextProjects: "Desplazar proyectos a la derecha",
        codePrivate: "El codigo fuente es privado",
    },
};

function ProjectsSection({ language = "en" }) {
    const copy = PROJECTS_COPY[language] ?? PROJECTS_COPY.en;
    const railRef = useRef(null);

    const getLocalizedDescription = (description) => {
        if (typeof description === "string") {
            return description;
        }

        return description?.[language] ?? description?.en ?? "";
    };

    const projects = [
        {
            image: `url(${okurPreview})`,
            name: "OKUR - AI Exam Grader",
            description: {
                en: "An AI platform that grades handwritten student answers according to teacher-defined instructions and rubrics. Source code is private and there is no public demo.",
                tr: "Öğretmen tarafından verilen yönerge ve rubriklere göre el yazısı öğrenci cevaplarını notlandıran yapay zeka platformu. Kaynak kodlar gizlidir ve herkese açık demosu yoktur.",
                es: "Una plataforma de IA que califica respuestas manuscritas de estudiantes segun instrucciones y rubricas definidas por el profesor. El codigo fuente es privado y no hay demo publica.",
            },
            githubLink: "",
            siteLink: "",
            codePrivate: true,
        },
        {
            image: `url(${projectToolkitPreview})`,
            name: "Project-Toolkit",
            description:
                "A comprehensive suite of CI tools and libraries designed to automate the initial setup of microservices architectures, including Docker configuration and CI/CD templates.",
            githubLink: "https://github.com/emre-tiryaki/project-toolkit",
            siteLink: "",
        },
        {
            image: `url(${typingGamePreview})`,
            name: "Typing Game",
            description:
                "A high-performance web-based typing tutor featuring real-time WPM calculation, accuracy tracking, and a global leaderboard backend with Redis caching.",
            githubLink: "https://github.com/emre-tiryaki/typing-game",
            siteLink: "https://typing-game-92pq.onrender.com/",
        },
    ];

    const scrollProjects = (direction) => {
        if (!railRef.current) {
            return;
        }

        const firstCard = railRef.current.querySelector("[data-project-card]");
        const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
        const track = railRef.current.firstElementChild;
        const gapValue = track
            ? Number.parseFloat(window.getComputedStyle(track).columnGap || 0)
            : 0;
        const scrollAmount = (cardWidth + gapValue) * direction;

        if (!scrollAmount) {
            return;
        }

        railRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const handleRailWheel = (event) => {
        if (
            !railRef.current ||
            Math.abs(event.deltaY) <= Math.abs(event.deltaX)
        ) {
            return;
        }

        railRef.current.scrollLeft += event.deltaY;
        event.preventDefault();
    };

    return (
        <section
            id="projects"
            className="border-y border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60"
        >
            <div className="section-wrap">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                            {copy.heading}
                        </h2>
                        <p className="mt-3 text-sm text-slate-400 light:text-slate-600">
                            {copy.subtitle}
                        </p>
                    </div>
                    <a
                        href="#"
                        className="text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700"
                    >
                        {copy.allGithub} →
                    </a>
                </div>
            </div>
            <div className="relative mt-10 left-1/2 w-screen -translate-x-1/2">
                <div
                    ref={railRef}
                    onWheel={handleRailWheel}
                    className="no-scrollbar overflow-x-auto overflow-y-hidden px-6 md:px-10"
                >
                    <div className="mx-auto flex w-max gap-6 snap-x snap-mandatory">
                        {projects.map((project) => (
                            <div
                                key={project.name}
                                data-project-card
                                className="w-[min(88vw,560px)] shrink-0 snap-start"
                            >
                                <ProjectCard
                                    image={project.image}
                                    name={project.name}
                                    description={getLocalizedDescription(
                                        project.description,
                                    )}
                                    githubLink={project.githubLink}
                                    siteLink={project.siteLink}
                                    codePrivate={project.codePrivate}
                                    language={language}
                                    codePrivateLabel={copy.codePrivate}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => scrollProjects(-1)}
                    aria-label={copy.prevProjects}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-[#05070b]/85 px-3 py-2 text-lg font-bold text-slate-100 backdrop-blur transition hover:border-sky-400 hover:text-sky-300 light:border-slate-400 light:bg-white/90 light:text-slate-800"
                >
                    ←
                </button>
                <button
                    type="button"
                    onClick={() => scrollProjects(1)}
                    aria-label={copy.nextProjects}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-[#05070b]/85 px-3 py-2 text-lg font-bold text-slate-100 backdrop-blur transition hover:border-sky-400 hover:text-sky-300 light:border-slate-400 light:bg-white/90 light:text-slate-800"
                >
                    →
                </button>
            </div>
        </section>
    );
}

export default ProjectsSection;
