import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  FileText, 
  Cpu, 
  Moon, 
  Languages, 
  ArrowRight,
  Command,
  X
} from 'lucide-react';
import { Language, Project, Post } from '../types';

interface CommandMenuProps {
  lang: Language;
  toggleTheme: () => void;
  toggleLang: () => void;
  projects: Project[];
  posts: Post[];
}

const CommandMenu: React.FC<CommandMenuProps> = ({ lang, toggleTheme, toggleLang, projects, posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Toggle with Keyboard Shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Logic
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.1 }}
            className="relative w-full max-w-2xl bg-white/90 dark:bg-zinc-900/95 border border-indigo-500/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col max-h-[60vh]"
          >
            {/* Header / Input */}
            <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-zinc-800">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input 
                autoFocus
                placeholder={lang === 'en' ? "Type a command or search..." : "输入指令或搜索内容..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-muted-foreground"
              >
                <span className="text-xs font-mono border border-border px-1.5 py-0.5 rounded mr-2 hidden sm:inline-block">ESC</span>
                <X size={18} />
              </button>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 scrollbar-hide">
              
              {/* System Actions (Only show when query matches or query is empty) */}
              {query === '' && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">System</div>
                  <CommandItem 
                    icon={<Moon size={16} />} 
                    label={lang === 'en' ? "Toggle Theme" : "切换主题"} 
                    shortcut="T"
                    onClick={() => handleAction(toggleTheme)} 
                  />
                  <CommandItem 
                    icon={<Languages size={16} />} 
                    label={lang === 'en' ? "Toggle Language" : "切换语言"} 
                    shortcut="L"
                    onClick={() => handleAction(toggleLang)} 
                  />
                  <CommandItem 
                    icon={<Terminal size={16} />} 
                    label={lang === 'en' ? "Go Home" : "返回首页"} 
                    onClick={() => handleSelect('/lab')} 
                  />
                </div>
              )}

              {/* Projects */}
              {filteredProjects.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">Projects</div>
                  {filteredProjects.map(project => (
                    <CommandItem 
                      key={project.id}
                      icon={<Cpu size={16} />} 
                      label={project.title}
                      desc={project.tags.slice(0, 2).join(', ')}
                      onClick={() => handleSelect(`/projects/${project.slug}`)} 
                    />
                  ))}
                </div>
              )}

              {/* Insights */}
              {filteredPosts.length > 0 && (
                <div className="mb-2">
                   <div className="px-3 py-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">Insights</div>
                   {filteredPosts.map(post => (
                     <CommandItem 
                        key={post.id}
                        icon={<FileText size={16} />} 
                        label={post.title}
                        desc={post.date}
                        onClick={() => handleSelect(`/insights/${post.slug}`)} 
                      />
                   ))}
                </div>
              )}
              
              {filteredProjects.length === 0 && filteredPosts.length === 0 && query !== '' && (
                 <div className="py-12 text-center text-muted-foreground">
                    <p>No results found.</p>
                 </div>
              )}
            </div>
            
            {/* Footer Tip */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex gap-4">
                 <span className="flex items-center gap-1"><Command size={10} /> + K to open</span>
                 <span className="flex items-center gap-1">Enter to select</span>
              </div>
              <div className="font-mono">LUMINA OS v2.0</div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface CommandItemProps {
  icon: React.ReactNode;
  label: string;
  desc?: string;
  shortcut?: string;
  onClick: () => void;
}

const CommandItem: React.FC<CommandItemProps> = ({ icon, label, desc, shortcut, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 text-left group transition-colors"
  >
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground group-hover:text-indigo-500">{icon}</span>
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {desc && <div className="text-xs text-muted-foreground opacity-70">{desc}</div>}
      </div>
    </div>
    {shortcut ? (
        <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground border border-border px-1.5 rounded">{shortcut}</span>
    ) : (
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500" />
    )}
  </button>
);

export default CommandMenu;