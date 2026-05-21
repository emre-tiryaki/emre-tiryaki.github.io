import { VscFiles, VscJson, VscCode, VscHistory, VscVerified, VscGithubInverted, VscMail } from 'react-icons/vsc';
import profile from '../data/profile.json';

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
        <span className="sidebar-logo">{profile.firstName} {profile.lastName}</span>
        <span className="sidebar-headline">{profile.headline}</span>
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

      <div className="sidebar-footer">
        <div className="sidebar-quick-links">
          <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="sidebar-link" title="GitHub">
            <VscGithubInverted />
          </a>
          <a href={`mailto:${profile.contact.email}`} className="sidebar-link" title="E-posta">
            <VscMail />
          </a>
          {profile.socialLinks.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="sidebar-link" title="LinkedIn">
              in
            </a>
          )}
          {profile.socialLinks.x && (
            <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" className="sidebar-link" title="X / Twitter">
              𝕏
            </a>
          )}
        </div>

        <button
          className="sidebar-theme-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
          id="theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
          <span className="sidebar-label">{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
