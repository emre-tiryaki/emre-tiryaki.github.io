import skills from '../../data/skills.json';
import { VscCode, VscServer, VscDatabase, VscTerminalBash, VscBook, VscSymbolMisc } from 'react-icons/vsc';
import { FaBrain, FaLayerGroup } from 'react-icons/fa';

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
  'var(--accent)',
  'var(--accent-green)',
  'var(--accent-peach)',
  'var(--accent-mauve)',
  'var(--accent-red)',
  'var(--accent-yellow)',
  'var(--accent)',
];

/**
 * Map skill name → devicon path slug.
 * URL: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{slug}.svg
 */
const DEVICON = {
  'Java': 'java/java-original',
  'JavaScript': 'javascript/javascript-original',
  'TypeScript': 'typescript/typescript-original',
  'Python': 'python/python-original',
  'Rust': 'rust/rust-original',
  'Go': 'go/go-original-wordmark',
  'React': 'react/react-original',
  'Vue': 'vuejs/vuejs-original',
  'HTML': 'html5/html5-original',
  'Tailwind CSS': 'tailwindcss/tailwindcss-original',
  'Spring Boot': 'spring/spring-original',
  'Node.js': 'nodejs/nodejs-original',
  'Express.js': 'express/express-original',
  'NestJS': 'nestjs/nestjs-original',
  'FastAPI': 'fastapi/fastapi-original',
  'Axum (Rust)': 'rust/rust-original',
  'PostgreSQL': 'postgresql/postgresql-original',
  'MySQL': 'mysql/mysql-original',
  'MongoDB': 'mongodb/mongodb-original',
  'Redis': 'redis/redis-original',
  'SQL Server': 'microsoftsqlserver/microsoftsqlserver-plain',
  'Docker': 'docker/docker-original',
  'Git': 'git/git-original',
  'GitHub Actions': 'github/github-original',
  'Linux': 'linux/linux-original',
  'NumPy': 'numpy/numpy-original',
};

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

function SkillIcon({ name }) {
  const slug = DEVICON[name];
  if (slug) {
    return (
      <img
        className="skill-col-icon"
        src={`${DEVICON_BASE}${slug}.svg`}
        alt={name}
        loading="lazy"
        width="20"
        height="20"
      />
    );
  }
  // Fallback: monogram
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
      <p className="panel-subtitle">Alan bazlı kategorize edilmiş yetkinlik haritası</p>

      <div className="skills-columns-wrap">
        <div className="skills-columns">
          {skills.map((category, idx) => {
            const CatIcon = CATEGORY_ICON_MAP[category.icon] || VscSymbolMisc;
            const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];

            return (
              <div className="skill-column" key={category.id} id={`skill-${category.id}`}>
                <div className="skill-column-header" style={{ color: accent }}>
                  <CatIcon className="skill-column-cat-icon" />
                  <span className="skill-column-title">{category.category.toUpperCase()}</span>
                </div>

                <div className="skill-column-items">
                  {category.items.map(item => (
                    <div className="skill-column-item" key={item}>
                      <SkillIcon name={item} />
                      <span className="skill-column-name">{item}</span>
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
