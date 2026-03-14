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
import SkillCard from "./SkillCard";

const SKILLS_COPY = {
    en: {
        heading: "Technical Arsenal",
        subtitle: "Specialized toolsets for end-to-end engineering.",
        categories: {
            backend: "Backend",
            devops: "DevOps",
            database: "Database",
        },
    },
    tr: {
        heading: "Teknik Yetenekler",
        subtitle: "Uctan uca muhendislik icin ozellesmis arac setleri.",
        categories: {
            backend: "Backend",
            devops: "DevOps",
            database: "Veritabani",
        },
    },
    es: {
        heading: "Arsenal Tecnico",
        subtitle:
            "Conjuntos de herramientas especializadas para ingenieria de extremo a extremo.",
        categories: {
            backend: "Backend",
            devops: "DevOps",
            database: "Base de Datos",
        },
    },
};

function SkillsSection({ language = "en" }) {
    const copy = SKILLS_COPY[language] ?? SKILLS_COPY.en;

    const skills = [
        {
            title: copy.categories.backend,
            Icon: FaCodeBranch,
            items: [
                { label: "FastAPI", Icon: SiFastapi },
                { label: "ExpressJS", Icon: SiExpress },
                { label: "Go(Gin)", Icon: SiGo },
                { label: "Rust(Axum)", Icon: SiRust },
                { label: "API Development", Icon: FaCodeBranch },
            ],
        },
        {
            title: copy.categories.devops,
            Icon: FaDocker,
            items: [
                { label: "Docker", Icon: FaDocker },
                { label: "CI/CD Pipelines", Icon: SiGithubactions },
                { label: "Github Actions", Icon: VscGithubAction },
            ],
        },
        {
            title: copy.categories.database,
            Icon: FaDatabase,
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
                {copy.heading}
            </h2>
            <p className="mt-3 text-center text-sm text-slate-400 light:text-slate-600">
                {copy.subtitle}
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {skills.map(({ title, items, Icon }) => (
                    <SkillCard
                        key={title}
                        title={title}
                        items={items}
                        Icon={Icon}
                    />
                ))}
            </div>
        </section>
    );
}

export default SkillsSection;
