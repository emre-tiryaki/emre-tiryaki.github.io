import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import VisitorTracker from "./components/layout/VisitorTracker";
import StarfieldBackground from './components/layout/StarfieldBackground';
import PageTransition from './components/layout/PageTransition';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import EducationPage from './pages/EducationPage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import JsonEndpointPage from './pages/JsonEndpointPage';
import WorkWithMePage from './pages/WorkWithMePage';
import { startBackgroundPreload, boostRoute } from './lib/preload';

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
        {/* JSON endpoint: token ile korunur, ham JSON yanıtı döner (sayfa değil) */}
        <Route path="/json" element={<JsonEndpointPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  return (
    <main
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        height: "100dvh" /* mobil tarayıcı adres çubuğunu hesaba katar */,
        paddingTop: "calc(5rem + env(safe-area-inset-top))" /* clears floating navbar */,
        paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <VisitorTracker />
      <AnimatedRoutes />
    </main>
  );
}

function AppContent() {
  const location = useLocation();
  const isWorkWithMe = location.pathname === '/work-with-me';

  // Görselleri ve GitHub verisini arka planda, öncelik sırasıyla ön yükle
  useEffect(() => {
    if (!isWorkWithMe) startBackgroundPreload(location.pathname);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Kullanıcı bir sayfaya geçince o sayfanın bekleyen yüklemeleri öne alınır
  useEffect(() => {
    boostRoute(location.pathname);
  }, [location.pathname]);

  if (isWorkWithMe) {
    return <WorkWithMePage />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      <StarfieldBackground />
      <Navbar />
      <MainLayout />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* İşletim sisteminde "hareketi azalt" açıksa framer-motion animasyonları sadeleşir */}
      <MotionConfig reducedMotion="user">
        <AppContent />
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
