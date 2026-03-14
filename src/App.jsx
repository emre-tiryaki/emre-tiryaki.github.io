import { useEffect, useState } from "react";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import PhilosophySection from "./components/MindsetSection";
import ProjectsSection from "./components/ProjectsSection";
import RightSideNav from "./components/RightSideNav";
import SiteFooter from "./components/SiteFooter";
import SkillsSection from "./components/SkillsSection";

function App() {
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

    return (
        <div className="relative overflow-hidden bg-[#05070b] text-slate-100 transition-colors duration-300 light:bg-[#ecf3fa] light:text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.15),transparent_40%)] light:bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.16),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(2,132,199,0.12),transparent_38%)]" />

            <RightSideNav />

            <main id="top" className="relative z-10">
                <HeroSection />
                <PhilosophySection />
                <SkillsSection />
                <ProjectsSection />
                <ExperienceSection />
            </main>

            <SiteFooter />
        </div>
    );
}

export default App;
