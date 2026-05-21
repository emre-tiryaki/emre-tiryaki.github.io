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

function SkillsPanel() {
  return (
    <div id="panel-skills">
      <h1 className="panel-title">Teknik Yetenekler</h1>
      <p className="panel-subtitle">Alan bazlı kategorize edilmiş yetkinlik haritası</p>

      <div className="skills-grid">
        {skills.map(category => {
          const Icon = ICON_MAP[category.icon] || VscSymbolMisc;
          return (
            <div className="skill-card" key={category.id} id={`skill-${category.id}`}>
              <div className="skill-card-header">
                <div className="skill-card-icon"><Icon /></div>
                <div className="skill-card-title">{category.category}</div>
              </div>
              <div className="skill-items">
                {category.items.map(item => (
                  <span className="skill-badge" key={item}>{item}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsPanel;
