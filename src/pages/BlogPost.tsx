import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentService } from '../services/content';
import { Language } from '../types';
import { ArrowLeft, Clock, Calendar, List, Sparkles, Share2, ThumbsUp, Heart, Rocket, FileText, Check } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import SupportWidget from '../components/SupportWidget';
import CodeBlock from '../components/CodeBlock';
import Comments from '../components/Comments';

interface BlogPostProps {
  lang: Language;
}

const BlogPost: React.FC<BlogPostProps> = ({ lang }) => {
  const { slug } = useParams<{ slug: string }>(); 
  // Use slug lookup
  const post = ContentService.getPostBySlug(slug || '');
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState({ like: 124, heart: 45, rocket: 89 });
  const [activeId, setActiveId] = useState<string>('');
  
  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // AI Typewriter Effect
  const [displayedAnalysis, setDisplayedAnalysis] = useState('');
  useEffect(() => {
    if (post?.aiAnalysis?.[lang]) {
        setDisplayedAnalysis('');
        let i = 0;
        const text = post.aiAnalysis[lang];
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedAnalysis(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
        return () => clearInterval(timer);
    }
  }, [post, lang]);

  // TOC Active Highlighting Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => observer.observe(h));

    return () => {
      headings.forEach((h) => observer.unobserve(h));
    };
  }, [post]);

  const handleCopyContent = () => {
    if (post?.content) {
      navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
     navigator.clipboard.writeText(window.location.href);
     alert(lang === 'en' ? 'Link copied to clipboard!' : '链接已复制到剪贴板！');
  };

  const incrementReaction = (type: keyof typeof reactions) => {
     setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  if (!post) {
    return <div className="pt-32 text-center">Post not found</div>;
  }

  // Simple TOC extraction logic for H2 headers
  const toc = post.content?.match(/^## (.*$)/gm)?.map(heading => {
     const title = heading.replace('## ', '');
     const id = title.toLowerCase().replace(/[^\w]+/g, '-');
     return { title, id };
  }) || [];

  // Custom H2 component for Markdown to add IDs
  const CustomH2 = ({ children }: any) => {
    const text = React.Children.toArray(children).join('');
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return <h2 id={id} className="scroll-mt-32 relative group">{children}</h2>;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative">
       {/* Reading Progress Bar */}
       <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
          style={{ scaleX }}
        />

       {/* Background is now global in App.tsx */}

       <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
             <Link to="/insights" className="inline-flex items-center text-sm text-muted-foreground hover:text-indigo-500 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                {lang === 'en' ? 'Back to Lab Log' : '返回日志'}
             </Link>

             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
             >
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-6 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  <span className="px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-500">{post.type}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-tight">
                  {post.title[lang]}
                </h1>

                {/* AI Analysis Block */}
                {post.aiAnalysis && (
                    <div className="mb-10 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-sm font-bold mb-3 uppercase tracking-wider">
                            <Sparkles size={14} />
                            {lang === 'en' ? 'AI Assessment' : 'AI 智能评析'}
                        </div>
                        <p className="text-sm md:text-base leading-relaxed font-mono text-foreground/80">
                            {displayedAnalysis}
                            <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse"/>
                        </p>
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Sparkles size={100} />
                        </div>
                    </div>
                )}

                <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                  prose-headings:font-light prose-headings:tracking-tight 
                  prose-p:leading-relaxed prose-p:text-muted-foreground
                  prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0
                  ">
                   <ReactMarkdown
                      components={{
                        code: CodeBlock,
                        h2: CustomH2
                      }}
                   >
                     {post.content || ''}
                   </ReactMarkdown>
                </div>

                {/* Interaction & Share Bar */}
                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4">
                        <button onClick={() => incrementReaction('like')} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors">
                            <ThumbsUp size={18} className="group-active:scale-125 transition-transform" />
                            <span className="text-sm font-mono">{reactions.like}</span>
                        </button>
                        <button onClick={() => incrementReaction('heart')} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
                            <Heart size={18} className="group-active:scale-125 transition-transform" />
                            <span className="text-sm font-mono">{reactions.heart}</span>
                        </button>
                        <button onClick={() => incrementReaction('rocket')} className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors">
                            <Rocket size={18} className="group-active:scale-125 transition-transform" />
                            <span className="text-sm font-mono">{reactions.rocket}</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                         <button 
                           onClick={handleCopyContent}
                           className="flex items-center gap-2 px-6 py-2 rounded-full bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
                         >
                            {copied ? <Check size={16} /> : <FileText size={16} />}
                            {copied ? (lang === 'en' ? 'Copied MD' : '已复制 MD') : (lang === 'en' ? 'Copy Markdown' : '复制 Markdown')}
                         </button>
                         <button 
                           onClick={handleShareLink}
                           className="p-2 rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground"
                           title={lang === 'en' ? "Share Link" : "分享链接"}
                         >
                            <Share2 size={18} />
                         </button>
                    </div>
                </div>

                {/* Comment Section (Giscus) */}
                <Comments />

             </motion.div>
          </div>

          {/* Sidebar / TOC */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
             <div className="sticky top-32">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-foreground uppercase tracking-widest">
                   <List size={16} />
                   Table of Contents
                </div>
                <nav className="flex flex-col gap-2 border-l border-border pl-4 mb-12">
                   {toc.length > 0 ? toc.map((item, i) => (
                      <a 
                        key={i} 
                        href={`#${item.id}`} 
                        className={`text-sm transition-colors border-l-2 -ml-[17px] pl-4 py-1
                           ${activeId === item.id 
                             ? 'text-indigo-500 border-indigo-500 font-medium' 
                             : 'text-muted-foreground border-transparent hover:text-foreground'
                           }`}
                      >
                        {item.title}
                      </a>
                   )) : (
                     <span className="text-sm text-muted-foreground italic">No sections</span>
                   )}
                </nav>
                
                <div className="mb-12">
                   <SupportWidget />
                </div>

                <div className="p-4 rounded-xl bg-card border border-border">
                   <h4 className="font-bold text-sm mb-2">Subscribe</h4>
                   <p className="text-xs text-muted-foreground mb-4">Get the latest lab experiments directly to your inbox.</p>
                   <input type="email" placeholder="Email address" className="w-full bg-background border border-border rounded px-3 py-2 text-sm mb-2 focus:ring-1 focus:ring-indigo-500 outline-none" />
                   <button className="w-full bg-foreground text-background text-xs font-bold py-2 rounded hover:bg-foreground/80 transition-colors">JOIN</button>
                </div>
             </div>
          </aside>
       </div>
    </div>
  );
};

export default BlogPost;