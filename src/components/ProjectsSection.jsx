import ProjectCard from "./ProjectCard";
import projectToolkitPreview from "../assets/project_previews/project_toolkit.png";
import typingGamePreview from "../assets/project_previews/typing_game.png";

function ProjectsSection() {
    const projects = [
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

    return (
        <section
            id="projects"
            className="border-y border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60"
        >
            <div className="section-wrap">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                            Featured Work
                        </h2>
                        <p className="mt-3 text-sm text-slate-400 light:text-slate-600">
                            Selected projects demonstrating architecture and
                            logic.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700"
                    >
                        View All Github →
                    </a>
                </div>
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.name}
                            image={project.image}
                            name={project.name}
                            description={project.description}
                            githubLink={project.githubLink}
                            siteLink={project.siteLink}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProjectsSection;
