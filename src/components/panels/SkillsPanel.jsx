import skills from '../../data/skills.json';
import { VscCode, VscServer, VscDatabase, VscTerminalBash, VscBook, VscSymbolMisc } from 'react-icons/vsc';
import { FaBrain, FaLayerGroup } from 'react-icons/fa';

const ICON_MAP = {
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

function SkillsPanel() {
  return (
    <div id="panel-skills">
      <h1 className="panel-title">Teknik Yetenekler</h1>
      <p className="panel-subtitle">Alan bazlı kategorize edilmiş yetkinlik haritası</p>

      <div className="skills-masonry">
        {skills.map((category, idx) => {
          const Icon = ICON_MAP[category.icon] || VscSymbolMisc;
          const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];

          return (
            <div
              className="skill-card-v2"
              key={category.id}
              id={`skill-${category.id}`}
              style={{ '--card-accent': accentColor }}
            >
              <div className="skill-card-v2-header">
                <div className="skill-card-v2-icon">
                  <Icon />
                </div>
                <div>
                  <div className="skill-card-v2-title">{category.category}</div>
                  <div className="skill-card-v2-count">{category.items.length} teknoloji</div>
                </div>
              </div>

              <div className="skill-card-v2-items">
                {category.items.map(item => (
                  <span className="skill-chip" key={item}>{item}</span>
                ))}
              </div>

              <div className="skill-card-v2-bar">
                <div className="skill-card-v2-bar-fill" style={{ width: `${Math.min(category.items.length * 14, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsPanel;
