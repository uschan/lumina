
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, Language, PostCategory } from '../types';
import { Calendar, Clock, ArrowUpRight, Flag, Zap, MessageCircle, Battery, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightsProps {
  posts: Post[];
  lang: Language;
}

// Collections / Archives Data
const COLLECTIONS: { id: PostCategory, title: any, desc: any, icon: any, color: string, date: string }[] = [
  { 
    id: 'daily',
    title: { en: 'Daily Notes', zh: '日常随记' },
    desc: { en: 'Thoughts, snippets, and ideas.', zh: '想法、片段和灵感。' },
    icon: <MessageCircle className="text-emerald-500" size={24} />,
    color: 'emerald',
    date: 'Active'
  },
  { 
    id: 'tech',
    title: { en: 'Tech Issues', zh: '技术问题' },
    desc: { en: 'Bugs, fixes, and logs.', zh: '漏洞、修复和日志。' },
    icon: <Zap className="text-rose-500" size={24} />,
    color: 'rose',
    date: 'Active'
  },
  { 
    id: 'wild',
    title: { en: 'WildSalt', zh: '野盐 WildSalt' },
    desc: { en: 'Philosophy & culture.', zh: '哲学与文化。' },
    icon: <Battery className="text-amber-500" size={24} />,
    color: 'amber',
    date: 'Active'
  },
  { 
    id: 'design',
    title: { en: 'Design Systems', zh: '设计系统' },
    desc: { en: 'UI/UX patterns.', zh: 'UI/UX 模式。' },
    icon: <Flag className="text-indigo-500" size={24} />,
    color: 'indigo',
    date: 'Active'
  }
];

const Insights: React.FC<InsightsProps> = ({ posts, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

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

         {/* Archives / Collections Cards (Grid Layout) */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {COLLECTIONS.map((col, idx) => (
               <motion.div 
                 key={col.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 onClick={() => setSelectedCategory(selectedCategory === col.id ? null : col.id)}
                 className={`
                    p-4 sm:p-6 rounded-3xl border shadow-sm transition-all cursor-pointer group flex flex-col h-full
                    ${selectedCategory === col.id 
                        ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500' 
                        : 'bg-white dark:bg-card/50 border-border/50 hover:shadow-lg hover:border-indigo-500/30'
                    }
                 `}
               >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                     <div className="p-2 rounded-xl bg-background border border-border/50 group-hover:scale-110 transition-transform shadow-sm">
                        {col.icon}
                     </div>
                     {selectedCategory === col.id && (
                        <div className="text-indigo-500 animate-pulse">●</div>
                     )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">{col.title[lang]}</h3>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-4 font-mono">{col.date}</div>
                  
                  <div className="bg-secondary/30 rounded-xl p-3 text-[10px] sm:text-xs text-muted-foreground leading-relaxed flex-grow relative overflow-hidden hidden sm:block">
                     <p className="relative z-10">{col.desc[lang]}</p>
                  </div>
               </motion.div>
            ))}
         </div>

        <div className="space-y-6 sm:space-y-8 border-t border-border/50 pt-12 max-w-4xl mx-auto">
           <div className="flex items-center justify-between text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 sm:mb-4">
              <span>{lang === 'en' ? 'Entries' : '文章列表'}</span>
              {selectedCategory && (
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
                >
                    <XCircle size={12} />
                    {lang === 'en' ? 'Clear Filter' : '清除筛选'}
                </button>
              )}
           </div>

          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                <motion.div 
                    key={post.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link 
                    to={`/insights/${post.id}`}
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
                        
                        <div className={`flex items-center justify-center px-2 py-0.5 rounded border text-[10px] sm:text-xs uppercase tracking-wider font-medium ml-auto sm:ml-0 ${
                        post.type === 'insight' 
                        ? 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5' 
                        : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                        }`}>
                        {post.type}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-indigo-500 transition-colors">
                        {post.title[lang]}
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 font-light">
                        {post.excerpt[lang]}
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
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 text-muted-foreground">
                    {lang === 'en' ? 'No entries found in this category.' : '该分类下暂无文章。'}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Insights;
