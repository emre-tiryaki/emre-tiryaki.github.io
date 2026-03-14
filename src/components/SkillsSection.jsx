import { FaCodeBranch, FaDatabase, FaDocker } from "react-icons/fa";
import {
    SiExpress,
    SiFastapi,
    SiGithubactions,
    SiGo,
    SiMongodb,
    SiPostgresql,
    SiRedis,
    SiRust,
} from "react-icons/si";
import { VscGithubAction } from "react-icons/vsc";

function SkillsSection() {
    const skills = [
        {
            title: "Backend",
            items: [
                { label: "FastAPI", Icon: SiFastapi },
                { label: "ExpressJS", Icon: SiExpress },
                { label: "Go(Gin)", Icon: SiGo },
                { label: "Rust(Axum)", Icon: SiRust },
                { label: "API Development", Icon: FaCodeBranch },
            ],
        },
        {
            title: "DevOps",
            items: [
                { label: "Docker", Icon: FaDocker },
                { label: "CI/CD Pipelines", Icon: SiGithubactions },
                { label: "Github Actions", Icon: VscGithubAction },
            ],
        },
        {
            title: "Database",
            items: [
                { label: "PostgreSQL", Icon: SiPostgresql },
                { label: "MongoDB", Icon: SiMongodb },
                { label: "Redis", Icon: SiRedis },
                { label: "Caching", Icon: FaDatabase },
            ],
        },
    ];

    return (
        <section id="skills" className="section-wrap py-20">
            <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                Technical Arsenal
            </h2>
            <p className="mt-3 text-center text-sm text-slate-400 light:text-slate-600">
                Specialized toolsets for end-to-end engineering.
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {skills.map(({ title, items }) => (
                    <article key={title} className="glass-card p-6">
                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white light:text-slate-900">
                            {title}
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-400 light:text-slate-600">
                            {items.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex items-center gap-2"
                                >
                                    <item.Icon
                                        className="h-4 w-4 text-sky-300"
                                        aria-hidden="true"
                                    />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default SkillsSection;
