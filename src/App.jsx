import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import VisitorTracker from "./components/layout/VisitorTracker";
import PageTransition from './components/layout/PageTransition';
import HomePage from './pages/HomePage';
import siteConfig from './data/siteConfig.json';

// Sayfalar ve ağır bileşenler (three.js, framer-motion sayfaları) ilk pakette değil, ihtiyaç anında yüklenir
const pageLoaders = {
  about: () => import('./pages/AboutPage'),
  skills: () => import('./pages/SkillsPage'),
  education: () => import('./pages/EducationPage'),
  experience: () => import('./pages/ExperiencePage'),
  projects: () => import('./pages/ProjectsPage'),
  certifications: () => import('./pages/CertificationsPage'),
  json: () => import('./pages/JsonEndpointPage'),
  guestbook: () => import('./pages/GuestbookPage'),
  workWithMe: () => import('./pages/WorkWithMePage'),
};
const AboutPage = lazy(pageLoaders.about);
const SkillsPage = lazy(pageLoaders.skills);
const EducationPage = lazy(pageLoaders.education);
const ExperiencePage = lazy(pageLoaders.experience);
const ProjectsPage = lazy(pageLoaders.projects);
const CertificationsPage = lazy(pageLoaders.certifications);
const JsonEndpointPage = lazy(pageLoaders.json);
const GuestbookPage = lazy(pageLoaders.guestbook);
const WorkWithMePage = lazy(pageLoaders.workWithMe);
const StarfieldBackground = lazy(() => import('./components/layout/StarfieldBackground'));

import { startBackgroundPreload, boostRoute } from './lib/preload';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/skills" element={<PageTransition><SkillsPage /></PageTransition>} />
        <Route path="/education" element={<PageTransition><EducationPage /></PageTransition>} />
        <Route path="/experience" element={<PageTransition><ExperiencePage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><CertificationsPage /></PageTransition>} />
        {siteConfig.showGuestbook && (
          <Route path="/guestbook" element={<PageTransition><GuestbookPage /></PageTransition>} />
        )}
        {/* JSON endpoint: token ile korunur, ham JSON yanıtı döner (sayfa değil) */}
        <Route path="/json" element={<JsonEndpointPage />} />
      </Routes>
      </Suspense>
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
    if (isWorkWithMe) return;
    startBackgroundPreload(location.pathname);
    // Tarayıcı boştayken diğer sayfaların kodunu önceden indir (gezinme anında gecikme olmasın)
    const prefetch = () => {
      const { workWithMe, json, guestbook, ...pages } = pageLoaders; // eslint-disable-line no-unused-vars
      Object.values(pages).forEach((load) => load().catch(() => {}));
    };
    const id = typeof requestIdleCallback === 'function'
      ? requestIdleCallback(prefetch, { timeout: 4000 })
      : setTimeout(prefetch, 2500);
    return () => (typeof cancelIdleCallback === 'function' ? cancelIdleCallback(id) : clearTimeout(id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Kullanıcı bir sayfaya geçince o sayfanın bekleyen yüklemeleri öne alınır
  useEffect(() => {
    boostRoute(location.pathname);
  }, [location.pathname]);

  if (isWorkWithMe) {
    return (
      <Suspense fallback={null}>
        <WorkWithMePage />
      </Suspense>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Three.js ilk boyamayı bloklamasın: ayrı chunk, arka planda yüklenir */}
      <Suspense fallback={null}>
        <StarfieldBackground />
      </Suspense>
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
