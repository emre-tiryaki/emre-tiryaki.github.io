import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import StarfieldBackground from './components/layout/StarfieldBackground';
import PageTransition from './components/layout/PageTransition';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import EducationPage from './pages/EducationPage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';

// These pages get full-width stretch (no horizontal centering constraint)
const FULL_WIDTH_PAGES = ['/experience', '/projects'];

// Pages with a visible header title — content starts from top, not vertically centered
const TOP_ALIGNED_PAGES = ['/skills', '/education', '/experience', '/projects', '/certifications'];


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/skills" element={<PageTransition><SkillsPage /></PageTransition>} />
        <Route path="/education" element={<PageTransition><EducationPage /></PageTransition>} />
        <Route path="/experience" element={<PageTransition><ExperiencePage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><CertificationsPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const location = useLocation();
  const isFullWidth  = FULL_WIDTH_PAGES.includes(location.pathname);
  const isTopAligned = TOP_ALIGNED_PAGES.includes(location.pathname);

  return (
    <main
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100vh',
        paddingTop: '5rem',    /* clears floating navbar */
        paddingBottom: '1.5rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems:     isFullWidth  ? 'stretch' : 'center',
        justifyContent: isTopAligned ? 'flex-start' : 'center',
        boxSizing: 'border-box',
      }}
    >
      <AnimatedRoutes />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <StarfieldBackground />
        <Navbar />
        <MainLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
