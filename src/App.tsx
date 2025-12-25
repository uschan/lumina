import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import CommandMenu from './components/CommandMenu';
import BackToTop from './components/BackToTop';
import Starfield from './components/Starfield';
import { TRANSLATIONS } from './constants';
import { Language } from './types';
import { AnimatePresence } from 'framer-motion';
import { BarChart, Users } from 'lucide-react';
import { ContentProvider, useContent } from './contexts/ContentContext';

// Lazy Load Pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const Insights = React.lazy(() => import('./pages/Insights'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Tools = React.lazy(() => import('./pages/Tools'));

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background relative z-10">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="font-mono text-xs text-muted-foreground animate-pulse">INITIALIZING...</p>
    </div>
  </div>
);

// Inner Content Component to access Router Context and Content Context
const AppContent: React.FC<{ 
  lang: Language; 
  theme: 'light' | 'dark'; 
  toggleTheme: () => void; 
  toggleLang: () => void; 
  t: any 
}> = ({ lang, theme, toggleTheme, toggleLang, t }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  // Use data from Context
  const { projects, posts, tools, loading } = useContent();

  // Simulated Visitor Stats Logic
  const [stats, setStats] = useState({ total: 10234, today: 42 });

  useEffect(() => {
    const storedTotal = localStorage.getItem('lumina_total_visits');
    const storedToday = localStorage.getItem('lumina_today_visits');
    const lastVisitDate = localStorage.getItem('lumina_last_visit_date');
    const todayStr = new Date().toDateString();

    let newTotal = storedTotal ? parseInt(storedTotal) : 10234;
    let newToday = storedToday ? parseInt(storedToday) : 42;

    if (lastVisitDate !== todayStr) {
      newToday = 12;
    } else {
      if (!sessionStorage.getItem('visited_session')) {
         newToday += 1;
         newTotal += 1;
         sessionStorage.setItem('visited_session', 'true');
      }
    }

    localStorage.setItem('lumina_total_visits', newTotal.toString());
    localStorage.setItem('lumina_today_visits', newToday.toString());
    localStorage.setItem('lumina_last_visit_date', todayStr);

    setStats({ total: newTotal, today: newToday });
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 flex flex-col">
      
      {/* Global Background Layer */}
      {!isLanding && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {theme === 'dark' ? (
            <Starfield className="opacity-100 transition-opacity duration-1000" />
          ) : (
            <div className="absolute inset-0 opacity-[0.4] bg-lab-grid bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_20%,transparent_100%)] transition-opacity duration-1000" />
          )}
        </div>
      )}

      {/* Conditionally Render Navigation and Command Menu */}
      {!isLanding && (
        <>
          <CommandMenu 
            lang={lang} 
            toggleTheme={toggleTheme} 
            toggleLang={toggleLang}
          />
          <Navigation 
            lang={lang} 
            t={t.nav} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            toggleLang={toggleLang} 
          />
        </>
      )}

      <main className={`relative z-10 flex-grow ${isLanding ? 'h-screen' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={<Landing lang={lang} />} 
                />
                
                <Route 
                  path="/lab" 
                  element={
                    <Home 
                      lang={lang} 
                      t={t} 
                      featuredProjects={projects.filter(p => p.featured)} 
                      recentPosts={posts.slice(0, 2)}
                      featuredTools={tools.slice(0, 4)}
                    />
                  } 
                />
                <Route 
                  path="/projects" 
                  element={<Projects lang={lang} />} 
                />
                {/* Changed :id to :slug */}
                <Route 
                  path="/projects/:slug" 
                  element={<ProjectDetail lang={lang} />} 
                />
                <Route 
                  path="/insights" 
                  element={<Insights lang={lang} />} 
                />
                {/* Changed :id to :slug */}
                <Route 
                  path="/insights/:slug" 
                  element={<BlogPost lang={lang} />} 
                />
                <Route 
                  path="/tools" 
                  element={<Tools lang={lang} />} 
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isLanding && (
        <>
          <BackToTop />
          <footer className="relative z-10 py-8 border-t border-gray-200 dark:border-zinc-900 mt-12 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
              
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                 <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
                 <span className="hidden md:inline text-muted-foreground">•</span>
                 <p>Built with React, Tailwind & Gemini 3 Pro.</p>
              </div>

              {/* Visitor Stats Section */}
              <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
                 <div className="flex items-center gap-2" title="Total Visitors">
                    <Users size={12} className="text-indigo-500" />
                    <span>TOTAL: {stats.total.toLocaleString()}</span>
                 </div>
                 <div className="w-px h-3 bg-border" />
                 <div className="flex items-center gap-2" title="Today's Visitors">
                    <BarChart size={12} className="text-emerald-500" />
                    <span>TODAY: {stats.today.toLocaleString()}</span>
                 </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Language State
  const [lang, setLang] = useState<Language>('en');

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = TRANSLATIONS[lang];

  return (
    <HelmetProvider>
      <ContentProvider>
        {/* Switched to BrowserRouter for proper SEO URLs */}
        <BrowserRouter>
          <ScrollToTop />
          <AppContent 
            lang={lang}
            theme={theme}
            toggleTheme={toggleTheme}
            toggleLang={toggleLang}
            t={t}
          />
        </BrowserRouter>
      </ContentProvider>
    </HelmetProvider>
  );
};

export default App;