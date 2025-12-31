
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Post, Language } from '../types';
import { Calendar, Clock, ArrowUpRight, Flag, Zap, Layers, Filter, X, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightsProps {
  posts: Post[];
  lang: Language;
}

// Map logical categories to visual styles
const CATEGORY_CONFIG: Record<string, { title: { en: string, zh: string }, desc: { en: string, zh: string }, icon: any, color: string }> = {
  'Engineering': { 
    title: { en: 'Engineering', zh: '工程技术' },
    desc: { en: 'System architecture & code.', zh: '系统架构与代码实现。' },
    icon: <Zap className="text-rose-500" size={24} />,
    color: 'rose'
  },
  'Design': { 
    title: { en: 'Design', zh: '设计美学' },
    desc: { en: 'UI/UX & Design Systems.', zh: 'UI/UX 与设计系统。' },
    icon: <Flag className="text-indigo-500" size={24} />,
    color: 'indigo'
  },
  'Research': { 
    title: { en: 'Research', zh: '深度研究' },
    desc: { en: 'AI papers & analysis.', zh: 'AI 论文与深度分析。' },
    icon: <Layers className="text-emerald-500" size={24} />,
    color: 'emerald'
  },
  'Philosophy': { 
    title: { en: 'Philosophy', zh: '随笔思考' },
    desc: { en: 'Thoughts & culture.', zh: '碎片想法与文化思考。' },
    icon: <Battery className="text-amber-500" size={24} />,
    color: 'amber'
  }
};

const Insights: React.FC<InsightsProps> = ({ posts, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts based on selection
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
       
      {/* Background is now global in App.tsx */}

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 max-w-4xl mx-auto text-center md:text-left">
           <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-foreground mb-6">
            <span className="text-indigo-500">_</span> {lang === 'en' ? 'Log' : '日志'}
           </h1>
           <p className="text-xl text-muted-foreground font-light mb-8">
             {lang === 'en' 
               ? 'Observations on the intersection of design, engineering, and artificial intelligence.' 
               : '关于设计、工程与人工智能交叉领域的观察记录。'
             }
           </p>
        </header>

         {/* Category Filter / Collections */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {Object.entries(CATEGORY_CONFIG).map(([key, config], idx) => {
               const isSelected = selectedCategory === key;
               const isInactive = selectedCategory !== null && !isSelected;

               return (
                 <motion.div 
                   key={key}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ 
                     opacity: isInactive ? 0.5 : 1, 
                     y: 0,
                     scale: isSelected ? 1.02 : 1
                   }}
                   transition={{ delay: idx * 0.1 }}
                   onClick={() => setSelectedCategory(isSelected ? null : key)}
                   className={`
                     p-4 sm:p-6 rounded-3xl border shadow-sm transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden
                     ${isSelected 
                        ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500' 
                        : 'bg-white dark:bg-card/50 border-border/50 hover:shadow-lg hover:border-indigo-500/30'
                     }
                   `}
                 >
                    <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                       <div className={`p-2 rounded-xl border transition-transform shadow-sm ${isSelected ? 'bg-background border-indigo-500/30' : 'bg-background border-border/50 group-hover:scale-110'}`}>
                          {config.icon}
                       </div>
                       {isSelected && <div className="text-indigo-500"><Filter size={16} /></div>}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold mb-1 relative z-10 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                      {config.title[lang]}
                    </h3>
                    
                    <div className="bg-secondary/30 rounded-xl p-3 text-[10px] sm:text-xs text-muted-foreground leading-relaxed flex-grow relative overflow-hidden hidden sm:block z-10">
                       <p>{config.desc[lang]}</p>
                    </div>

                    {/* Background Pattern for Selected State */}
                    {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                    )}
                 </motion.div>
               );
            })}
         </div>

        <div className="space-y-6 sm:space-y-8 border-t border-border/50 pt-12 max-w-4xl mx-auto">
           <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                  {selectedCategory 
                    ? (lang === 'en' ? `Filtering by: ${selectedCategory}` : `筛选: ${CATEGORY_CONFIG[selectedCategory]?.title[lang]}`) 
                    : (lang === 'en' ? 'Recent Entries' : '最近更新')
                  }
              </div>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={12} /> Clear Filter
                </button>
              )}
           </div>

          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    to={`/insights/${post.slug}`}
                    className="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start p-5 sm:p-8 rounded-3xl bg-card/20 hover:bg-card/50 border border-border/50 hover:border-indigo-500/40 transition-all duration-300"
                  >
                    {/* Metadata Column */}
                    <div className="sm:w-32 shrink-0 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start text-xs font-mono text-muted-foreground sm:mt-1 border-b sm:border-0 border-border/40 pb-3 sm:pb-0 mb-1 sm:mb-0">
                      <div className="flex items-center gap-3 sm:gap-3 sm:flex-col sm:items-start">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <time>{post.date}</time>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-center justify-center px-2 py-0.5 rounded border text-[10px] sm:text-xs uppercase tracking-wider font-medium ml-auto sm:ml-0 mt-0 sm:mt-2 ${
                        post.category && CATEGORY_CONFIG[post.category]
                        ? `border-${CATEGORY_CONFIG[post.category].color}-500/20 text-${CATEGORY_CONFIG[post.category].color}-500 bg-${CATEGORY_CONFIG[post.category].color}-500/5`
                        : 'border-gray-500/20 text-gray-500'
                      }`}>
                        {post.category || 'Uncategorized'}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-indigo-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 font-light">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-indigo-500 font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
                        {lang === 'en' ? 'Access Data' : '读取数据'}
                        <ArrowUpRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-12 text-center text-muted-foreground font-light"
              >
                No entries found in this sector.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Insights;
