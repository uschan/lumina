
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Post } from '../types';
import { ArrowLeft, Clock, Calendar, List, Share2, ThumbsUp, Heart, Rocket, FileText, Check } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import SupportWidget from '../components/SupportWidget';
import CodeBlock from '../components/CodeBlock';

interface BlogPostProps {
  lang: Language;
  posts: Post[];
}

const BlogPost: React.FC<BlogPostProps> = ({ lang, posts }) => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);
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

       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          
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
                  <span className="px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-500">{post.category}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Tags Display */}
                {post.tags && post.tags.length > 0 && (
                   <div className="flex gap-2 mb-8">
                     {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded bg-secondary text-xs font-mono text-muted-foreground">#{tag}</span>
                     ))}
                   </div>
                )}

                {/* Main Content Area with Border & Styles */}
                <div className="border border-border/50 rounded-3xl p-6 sm:p-10 bg-card/10 backdrop-blur-sm shadow-sm">
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
                </div>

                {/* Interaction & Share Bar */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
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
             </motion.div>
          </div>

          {/* Sidebar / Optimized TOC */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
             <div className="sticky top-32">
                <div className="flex items-center gap-2 mb-6 text-sm font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">
                   <List size={16} />
                   Table of Contents
                </div>
                
                {/* Timeline Styled TOC */}
                <nav className="relative flex flex-col gap-0 mb-12 pl-2">
                   {/* Vertical Line */}
                   <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" />
                   
                   {toc.length > 0 ? toc.map((item, i) => {
                      const isActive = activeId === item.id;
                      return (
                        <a 
                          key={i} 
                          href={`#${item.id}`} 
                          className={`
                            relative pl-6 py-2 text-sm transition-all duration-300
                            ${isActive 
                              ? 'text-indigo-500 font-medium translate-x-1' 
                              : 'text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          {/* Dot Indicator */}
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${isActive ? 'border-indigo-500 bg-background' : 'border-transparent'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-border'}`} />
                          </div>
                          {item.title}
                        </a>
                      );
                   }) : (
                     <span className="text-sm text-muted-foreground italic pl-6">No sections</span>
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
