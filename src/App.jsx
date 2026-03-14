import { useEffect, useState } from "react";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import PhilosophySection from "./components/MindsetSection";
import ProjectsSection from "./components/ProjectsSection";
import RightSideNav from "./components/RightSideNav";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import SkillsSection from "./components/SkillsSection";

const LANGUAGE_KEY = "language";
const SUPPORTED_LANGUAGES = ["en", "tr", "es"];

function App() {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY) ?? "en";
        return SUPPORTED_LANGUAGES.includes(savedLanguage)
            ? savedLanguage
            : "en";
    });

    const [theme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersLight =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: light)").matches;
        return savedTheme ?? (prefersLight ? "light" : "dark");
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(LANGUAGE_KEY, language);
    }, [language]);

    return (
        <div className="relative overflow-hidden bg-[#05070b] text-slate-100 transition-colors duration-300 light:bg-[#ecf3fa] light:text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.15),transparent_40%)] light:bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.16),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(2,132,199,0.12),transparent_38%)]" />

            <SiteHeader language={language} setLanguage={setLanguage} />

            <RightSideNav language={language} />

            <main id="top" className="relative z-10 pt-16">
                <HeroSection language={language} />
                <PhilosophySection language={language} />
                <SkillsSection language={language} />
                <ProjectsSection language={language} />
                <ExperienceSection language={language} />
            </main>

            <SiteFooter language={language} />
        </div>
    );
}

export default App;
