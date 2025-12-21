import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Home, LayoutGrid, BookOpen, Cpu } from 'lucide-react';
import { Language, Translation } from '../types';
import { motion } from 'framer-motion';

interface NavigationProps {
  lang: Language;
  t: Translation['nav'];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLang: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ lang, t, theme, toggleTheme, toggleLang }) => {
  const navItems = [
    // Changed path from '/' to '/lab' so user goes to Dashboard, not Landing page
    { path: '/lab', label: t.home, icon: Home, short: 'Home' },
    { path: '/projects', label: t.projects, icon: LayoutGrid, short: 'Proj' },
    { path: '/insights', label: t.insights, icon: BookOpen, short: 'Log' },
    { path: '/tools', label: t.tools, icon: Cpu, short: 'Tools' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-gray-200 dark:border-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-black/20 overflow-x-auto max-w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            <item.icon size={18} className="sm:hidden" />
            <span className="hidden sm:block">{item.label}</span>
          </NavLink>
        ))}

        <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1 sm:mx-2 shrink-0" />

        <button
          onClick={toggleLang}
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Toggle Language"
        >
          <span className="text-xs font-bold w-5 h-5 flex items-center justify-center">
            {lang === 'en' ? 'EN' : '中'}
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;