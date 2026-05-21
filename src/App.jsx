import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import AboutPanel from "./components/panels/AboutPanel";
import SkillsPanel from "./components/panels/SkillsPanel";
import ProjectsPanel from "./components/panels/ProjectsPanel";
import ExperiencePanel from "./components/panels/ExperiencePanel";
import CertificationsPanel from "./components/panels/CertificationsPanel";

const TABS = [
    { id: "about", label: "hakkimda.md", icon: "📄" },
    { id: "skills", label: "yetenekler.json", icon: "📄" },
    { id: "projects", label: "projeler.ts", icon: "📄" },
    { id: "experience", label: "deneyim.log", icon: "📄" },
    { id: "certifications", label: "sertifikalar.cert", icon: "📄" },
];

const THEME_KEY = "portfolio-theme";

function getInitialTheme() {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

function App() {
    const [activeTab, setActiveTab] = useState("about");
    const [theme, setTheme] = useState(getInitialTheme);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const handleTabSelect = (tabId) => {
        setActiveTab(tabId);
        setSidebarOpen(false);
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const renderPanel = () => {
        switch (activeTab) {
            case "about":
                return <AboutPanel />;
            case "skills":
                return <SkillsPanel />;
            case "projects":
                return <ProjectsPanel />;
            case "experience":
                return <ExperiencePanel />;
            case "certifications":
                return <CertificationsPanel />;
            default:
                return <AboutPanel />;
        }
    };

    return (
        <div className="app-layout">
            {sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                tabs={TABS}
                activeTab={activeTab}
                onSelect={handleTabSelect}
                theme={theme}
                onToggleTheme={toggleTheme}
                isOpen={sidebarOpen}
            />

            <div className="panel-area">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    id="mobile-menu"
                >
                    ☰
                </button>
                <div className="panel-content" key={activeTab}>
                    {renderPanel()}
                </div>
            </div>

            <StatusBar activeTab={activeTab} theme={theme} />
        </div>
    );
}

export default App;
