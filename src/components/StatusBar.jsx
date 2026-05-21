import profile from '../data/profile.json';

const TAB_LABELS = {
  about: 'hakkimda.md',
  skills: 'yetenekler.json',
  projects: 'projeler.ts',
  experience: 'deneyim.log',
  certifications: 'sertifikalar.cert',
};

function StatusBar({ activeTab, theme }) {
  return (
    <div className="statusbar" id="statusbar">
      <div className="statusbar-left">
        <span><span className="statusbar-dot" /> main</span>
        <span>{TAB_LABELS[activeTab] || activeTab}</span>
      </div>
      <div className="statusbar-right">
        <span>UTF-8</span>
        <span>{theme === 'dark' ? 'Dark+' : 'Light+'}</span>
        <span>React 19</span>
        <span>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</span>
      </div>
    </div>
  );
}

export default StatusBar;
