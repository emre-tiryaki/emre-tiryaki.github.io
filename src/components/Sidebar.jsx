import { VscFiles, VscJson, VscCode, VscHistory, VscVerified } from 'react-icons/vsc';

const ICON_MAP = {
  about: VscFiles,
  skills: VscJson,
  projects: VscCode,
  experience: VscHistory,
  certifications: VscVerified,
};

function Sidebar({ tabs, activeTab, onSelect, theme, onToggleTheme, isOpen }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">ET</span>
      </div>

      <nav className="sidebar-nav">
        {tabs.map(tab => {
          const Icon = ICON_MAP[tab.id] || VscFiles;
          return (
            <button
              key={tab.id}
              className={`sidebar-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onSelect(tab.id)}
              id={`sidebar-${tab.id}`}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <button
        className="sidebar-theme-btn"
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
        id="theme-toggle"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
        <span className="sidebar-label">{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
      </button>
    </aside>
  );
}

export default Sidebar;
