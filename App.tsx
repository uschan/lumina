import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import CommandMenu from './components/CommandMenu';
import BackToTop from './components/BackToTop';
import Starfield from './components/Starfield';
import { TRANSLATIONS } from './constants';
import { ContentService } from './services/content';
import { Language, Project, Post, ToolItem } from './types';
import { AnimatePresence } from 'framer-motion';
// FIX: Use stable icon names. Replaced TerminalSquare->Terminal, FileCode2->FileCode to prevent build errors.
import { BarChart, Users, Sparkles, Bot, BrainCircuit, Image, Code2, MousePointer, Terminal, Container, Atom, FileCode, Wind, Box, PenTool, Smartphone, Database, Cloud, Cpu } from 'lucide-react';

// Lazy Load Pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const Insights = React.lazy(() => import('./pages/Insights'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Tools = React.lazy(() => import('./pages/Tools'));
// Admin / Nexus
const Nexus = React.lazy(() => import('./pages/Nexus'));

// Initialize Query Client
const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Icon Mapping Helper
const getIconForTool = (name: string) => {
  const map: Record<string, any> = {
    'Gemini 3 Pro': Sparkles,
    'ChatGPT': Bot,
    'Claude': BrainCircuit,
    'Midjourney': Image,
    'VS Code': Code2,
    'Cursor': MousePointer, // Changed from MousePointer2
    'PuTTY': Terminal,      // Changed from TerminalSquare
    'Docker': Container,
    'React 19': Atom,
    'TypeScript': FileCode, // Changed from FileCode2
    'Tailwind CSS': Wind,
    'Next.js 15': Box,
    'Figma': PenTool,
    'Framer': Smartphone,
    'Supabase': Database,
    'Vercel': Cloud
  };
  return map[name] || Cpu;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background relative z-10">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="font-mono text-xs text-muted-foreground animate-pulse">INITIALIZING...</p>
    </div>
  </div>
);

const AppContent: React.FC<{ 
  lang: Language; 
  theme: 'light' | 'dark'; 
  toggleTheme: () => void; 
  toggleLang: () => void; 
  t: any 
}> = ({ lang, theme, toggleTheme, toggleLang, t }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isNexus = location.pathname === '/nexus';

  // Initial State: Use fallback content service BUT map icons immediately
  // TODO: Replace with React Query fetch from Supabase in Phase 2
  const [content] = useState<{
    projects: Project[];
    posts: Post[];
    tools: ToolItem[];
  }>(() => {
    return {
      projects: ContentService.getProjects(),
      posts: ContentService.getPosts(),
      tools: ContentService.getTools().map(t => ({
        ...t,
        icon: getIconForTool(t.name)
      }))
    };
  });

  const { projects, posts, tools } = content;

  // Stats Logic
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 flex flex-col">
      {!isLanding && !isNexus && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {theme === 'dark' ? (
            <Starfield className="opacity-100 transition-opacity duration-1000" />
          ) : (
            <div className="absolute inset-0 opacity-[0.4] bg-lab-grid bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_20%,transparent_100%)] transition-opacity duration-1000" />
          )}
        </div>
      )}

      {!isLanding && !isNexus && (
        <>
          <CommandMenu 
            lang={lang} 
            toggleTheme={toggleTheme} 
            toggleLang={toggleLang}
            projects={projects}
            posts={posts}
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
                <Route path="/" element={<Landing lang={lang} toggleLang={toggleLang} />} />
                <Route 
                  path="/lab" 
                  element={
                    <Home 
                      lang={lang} 
                      t={t} 
                      featuredProjects={projects.filter(p => p.featured)} 
                      recentPosts={posts.slice(0, 2)}
                      featuredTools={tools.slice(0, 8)}
                    />
                  } 
                />
                <Route path="/projects" element={<Projects projects={projects} lang={lang} />} />
                <Route path="/projects/:id" element={<ProjectDetail lang={lang} projects={projects} />} />
                <Route path="/insights" element={<Insights posts={posts} lang={lang} />} />
                <Route path="/insights/:id" element={<BlogPost lang={lang} posts={posts} />} />
                <Route path="/tools" element={<Tools tools={tools} lang={lang} />} />
                
                {/* Hidden Admin Route */}
                <Route path="/nexus" element={<Nexus />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isLanding && !isNexus && (
        <>
          <BackToTop />
          <footer className="relative z-10 py-4 border-t border-gray-200 dark:border-zinc-900 mt-4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                 <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
                 <span className="hidden md:inline text-muted-foreground">•</span>
                 <p>Built with React, Tailwind & Gemini 3 Pro.</p>
              </div>
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');
  const t = TRANSLATIONS[lang];

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <ScrollToTop />
          <AppContent lang={lang} theme={theme} toggleTheme={toggleTheme} toggleLang={toggleLang} t={t} />
        </HashRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;