import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth';
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
import BlogListPage from './pages/blog/BlogListPage';
import BlogPostPage from './pages/blog/BlogPostPage';
import AdminPage from './pages/blog/AdminPage';

// These pages get full-width stretch (no horizontal centering constraint)
const FULL_WIDTH_PAGES = ['/experience', '/projects', '/blog'];

// Pages with a visible header title — content starts from top, not vertically centered
const TOP_ALIGNED_PAGES = ['/about', '/blog', '/skills', '/education', '/experience', '/projects', '/certifications'];

// Pages that need vertical scrolling
const SCROLLABLE_PAGES = ['/about', '/skills', '/education', '/experience', '/projects', '/certifications', '/blog'];


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
        <Route path="/blog" element={<PageTransition><BlogListPage /></PageTransition>} />
        <Route path="/blog/:postId" element={<PageTransition><BlogPostPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  const isFullWidth  = FULL_WIDTH_PAGES.some((p) => path === p || path.startsWith(p + '/'));
  const isTopAligned = TOP_ALIGNED_PAGES.some((p) => path === p || path.startsWith(p + '/'));
  const isScrollable = SCROLLABLE_PAGES.some((p) => path === p || path.startsWith(p + '/'));

  return (
    <main
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100vh',
        paddingTop: '5rem',    /* clears floating navbar */
        paddingBottom: '1.5rem',
        overflow: isScrollable ? 'auto' : 'hidden',
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
      <AuthProvider>
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
          <StarfieldBackground />
          <Navbar />
          <MainLayout />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
