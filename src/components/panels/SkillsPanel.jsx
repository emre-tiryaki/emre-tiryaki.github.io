import skills from "../../data/skills.json";
import ollamaIcon from '../../assets/skills/ollama.png';
import {
    VscCode,
    VscServer,
    VscDatabase,
    VscTerminalBash,
    VscBook,
    VscSymbolMisc,
} from "react-icons/vsc";
import { FaBrain, FaLayerGroup } from "react-icons/fa";

const CATEGORY_ICON_MAP = {
    code: VscCode,
    layout: FaLayerGroup,
    server: VscServer,
    brain: FaBrain,
    database: VscDatabase,
    terminal: VscTerminalBash,
    book: VscBook,
};

const ACCENT_COLORS = [
    "var(--accent)",
    "var(--accent-green)",
    "var(--accent-peach)",
    "var(--accent-mauve)",
    "var(--accent-red)",
    "var(--accent-yellow)",
    "var(--accent)",
];

/**
 * Map skill name → devicon path slug.
 * URL: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{slug}.svg
 */
const DEVICON = {
    // Programming Languages
    Java: "java/java-original",
    JavaScript: "javascript/javascript-original",
    TypeScript: "typescript/typescript-original",
    Python: "python/python-original",
    Rust: "rust/rust-original",
    Go: "go/go-original-wordmark",
    // Frontend
    React: "react/react-original",
    Vue: "vuejs/vuejs-original",
    HTML: "html5/html5-original",
    "Tailwind CSS": "tailwindcss/tailwindcss-original",
    // Backend
    "Spring Boot": "spring/spring-original",
    "Node.js": "nodejs/nodejs-original",
    "Express.js": "express/express-original",
    NestJS: "nestjs/nestjs-original",
    Axum: "rust/rust-original",
    FastAPI: "fastapi/fastapi-original",
    Gin: "go/go-original-wordmark",
    // Databases
    PostgreSQL: "postgresql/postgresql-original",
    MySQL: "mysql/mysql-original",
    MongoDB: "mongodb/mongodb-original",
    Redis: "redis/redis-original",
    "SQL Server": "microsoftsqlserver/microsoftsqlserver-plain",
    // DevOps
    Docker: "docker/docker-original",
    Git: "git/git-original",
    "GitHub Actions": "githubactions/githubactions-original",
    Linux: "linux/linux-original",
    // AI / ML
    NumPy: "numpy/numpy-original",
    SciPy: "python/python-original",
};

/**
 * React-icon SVG fallbacks for skills with no suitable devicon.
 * These render as inline SVG components.
 */
const ICON_FALLBACK = {
    Ollama: () => <img src={ollamaIcon} alt="Ollama" width="24" height="24" style={{ borderRadius: 4, objectFit: 'contain' }} />,
    "Image Processing": () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
    ),
    "Data Analysis": () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
    ),
    "Bash/Zsh Scripting": () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1zM6 12l1.5 1.5L6 15h2l1.5-1.5L8 12H6zm5 3h6v-1.5h-6V15z" />
        </svg>
    ),
    "CI/CD": () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
    ),
};

const DEVICON_BASE =
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

function SkillIcon({ name }) {
    // 1. React-icon fallback (custom SVGs)
    const FallbackIcon = ICON_FALLBACK[name];
    if (FallbackIcon) {
        return (
            <span className="skill-col-icon skill-col-icon--svg">
                <FallbackIcon />
            </span>
        );
    }

    // 2. Devicon
    const slug = DEVICON[name];
    if (slug) {
        return (
            <img
                className="skill-col-icon"
                src={`${DEVICON_BASE}${slug}.svg`}
                alt={name}
                loading="lazy"
                width="24"
                height="24"
            />
        );
    }

    // 3. Last-resort monogram
    return (
        <span className="skill-col-icon skill-col-icon--mono">
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

function SkillsPanel() {
    return (
        <div id="panel-skills">
            <h1 className="panel-title">Teknik Yetenekler</h1>
            <p className="panel-subtitle">
                Alan bazlı kategorize edilmiş yetkinlik haritası
            </p>

            <div className="skills-columns-wrap">
                <div className="skills-columns">
                    {skills.map((category, idx) => {
                        const CatIcon =
                            CATEGORY_ICON_MAP[category.icon] || VscSymbolMisc;
                        const accent =
                            ACCENT_COLORS[idx % ACCENT_COLORS.length];

                        return (
                            <div
                                className="skill-column"
                                key={category.id}
                                id={`skill-${category.id}`}
                            >
                                <div
                                    className="skill-column-header"
                                    style={{ color: accent }}
                                >
                                    <CatIcon className="skill-column-cat-icon" />
                                    <span className="skill-column-title">
                                        {category.category.toUpperCase()}
                                    </span>
                                </div>

                                <div className="skill-column-items">
                                    {category.items.map((item) => (
                                        <div
                                            className="skill-column-item"
                                            key={item}
                                        >
                                            <SkillIcon name={item} />
                                            <span className="skill-column-name">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SkillsPanel;
