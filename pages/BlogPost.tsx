
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Post } from '../types';
import { 
  ArrowLeft, Clock, Calendar, List, Share2, FileText, Check, 
  X, Twitter, Facebook, Linkedin, Link2, Globe, Hash
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import SupportWidget from '../components/SupportWidget';
import CodeBlock from '../components/CodeBlock';

interface BlogPostProps {
  lang: Language;
  posts: Post[];
}

// Helper: Recursively extract text from React children
const extractText = (node: any): string => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props && node.props.children) return extractText(node.props.children);
  return '';
};

// Helper: Generate ID from text (Chinese friendly)
const generateId = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\u4e00-\u9fa5\-]+/g, '') // Keep English, Numbers, Chinese, Hyphens. Strip others.
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// Weibo Icon Component
const WeiboIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.08 1.22c-5.18 0-8.77 3.32-8.77 7.77 0 3.75 3.3 6.9 6.88 6.9 3.03 0 5.4-1.7 5.4-4.22 0-3.6-3.8-5.3-7.58-3.76-.8.32-.73-1.66 1.1-2.07 2.1-.5 6.07-.63 7.8 1.48.55.67.92.5 1.15.2.5-.54 1.3-1.8.8-3.26-.8-2.14-3.4-3.04-6.78-3.04zM19.34 8.7c-1.3-.23-1.8.63-1.53 1.34.6 1.47 1.8 1.96 3.12 1.05.57-.4.5-1.95-1.6-2.4zm-2.8 2.22c-.62-.16-.86.3-.72.63.3.73.9.96 1.5.47.28-.23.23-.93-.77-1.1zm-8.8 3.97c-3.1 0-5.34 2.5-5.34 5.2 0 2.54 2.3 4.17 5.76 4.17 3.9 0 6.6-2.4 6.6-5.4 0-2.8-2.6-4-7.02-4zm1.08 7.3c-2.3.4-4.5-.7-4.9-2.5-.42-1.8 1-3.37 3.35-3.8 2.4-.42 4.67.7 5.1 2.52.4 1.8-1.07 3.36-3.55 3.77z" />
  </svg>
);

const BlogPost: React.FC<BlogPostProps> = ({ lang, posts }) => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleCopyContent = () => {
    if (post?.content) {
      navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = post?.title || 'Lumina Article';

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <Twitter size={20} />,
      url: `https://x.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-black dark:hover:text-white'
    },
    {
      name: 'Weibo',
      icon: <WeiboIcon size={20} />,
      url: `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'hover:text-red-500'
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-700'
    }
  ];

  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareUrl);
      alert(lang === 'en' ? 'Link copied!' : '链接已复制！');
  };

  if (!post) {
    return <div className="pt-32 text-center">Post not found</div>;
  }

  // Parse TOC from Markdown Content
  // We use regex to find lines starting with ##, then clean them to match the ID generation logic
  const toc = post.content?.match(/^##\s+(.*$)/gm)?.map(heading => {
     // Remove '## ' and any bold/italic markers from the text for display
     const rawTitle = heading.replace(/^##\s+/, '');
     const cleanTitle = rawTitle.replace(/[*_`]/g, ''); 
     // Generate ID consistent with CustomH2
     const id = generateId(cleanTitle);
     return { title: cleanTitle, id };
  }) || [];

  // Custom H2 component for Markdown to add IDs
  const CustomH2 = ({ children }: any) => {
    // Extract pure text from children (which might be mixed with <code>, <strong> etc)
    const text = extractText(children);
    const id = generateId(text);
    
    return (
        <h2 id={id} className="scroll-mt-32 relative group">
            {children}
            {/* Hover Anchor Link */}
            <a 
                href={`#${id}`} 
                className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500/50 hover:text-indigo-500 p-1 hidden lg:block"
                aria-label={`Link to ${text}`}
            >
                <Hash size={16} />
            </a>
        </h2>
    );
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

                {/* Footer Actions: Copy & Share */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-end gap-6 border-t border-border/30 pt-8">
                    <div className="flex gap-3">
                         <button 
                           onClick={handleCopyContent}
                           className="flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-foreground font-medium text-sm transition-colors border border-border/50"
                         >
                            {copied ? <Check size={16} /> : <FileText size={16} />}
                            {copied ? (lang === 'en' ? 'Copied MD' : '已复制 MD') : (lang === 'en' ? 'Copy Markdown' : '复制 Markdown')}
                         </button>
                         <button 
                           onClick={() => setIsShareModalOpen(true)}
                           className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20"
                         >
                            <Share2 size={16} />
                            {lang === 'en' ? 'Share' : '分享'}
                         </button>
                    </div>
                </div>
             </motion.div>
          </div>

          {/* Sidebar / Static TOC */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
             <div className="sticky top-32">
                <div className="flex items-center gap-2 mb-6 text-sm font-bold text-foreground uppercase tracking-widest border-b border-border/50 pb-2">
                   <List size={16} />
                   Table of Contents
                </div>
                
                {/* Static Outline TOC */}
                <nav className="relative flex flex-col gap-1 mb-12 pl-2 border-l border-border/50">
                   {toc.length > 0 ? toc.map((item, i) => {
                      return (
                        <a 
                          key={i} 
                          href={`#${item.id}`} 
                          className="pl-4 py-1.5 text-sm text-muted-foreground hover:text-indigo-500 hover:border-l-2 hover:border-indigo-500 border-l-2 border-transparent -ml-[1px] transition-colors block truncate"
                          title={item.title}
                        >
                          {item.title}
                        </a>
                      );
                   }) : (
                     <span className="text-sm text-muted-foreground italic pl-4">No sections</span>
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

       {/* Share Modal */}
       <AnimatePresence>
         {isShareModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               {/* Backdrop */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsShareModalOpen(false)}
                 className="absolute inset-0 bg-background/60 backdrop-blur-sm"
               />
               
               {/* Modal Content */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6"
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-foreground">Share Article</h3>
                     <button onClick={() => setIsShareModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                     {shareLinks.map((link) => (
                        <a 
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex flex-col items-center gap-2 group`}
                        >
                           <div className={`w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center transition-colors group-hover:bg-secondary ${link.color}`}>
                              {link.icon}
                           </div>
                           <span className="text-xs text-muted-foreground">{link.name}</span>
                        </a>
                     ))}
                  </div>

                  {/* Copy Link Input */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border">
                     <Globe size={16} className="text-muted-foreground ml-2" />
                     <input 
                       readOnly 
                       value={shareUrl} 
                       className="flex-1 bg-transparent border-none text-xs text-muted-foreground outline-none truncate"
                     />
                     <button 
                       onClick={handleCopyLink}
                       className="p-1.5 rounded-md hover:bg-background text-indigo-500 transition-colors"
                       title="Copy Link"
                     >
                        <Link2 size={16} />
                     </button>
                  </div>

               </motion.div>
            </div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default BlogPost;
