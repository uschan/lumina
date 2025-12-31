
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Command, FileText, Cpu, Calendar, ArrowUpRight, Radio, Link } from 'lucide-react';
import { BentoContainer, BentoItem } from '../components/BentoGrid';
import ProjectCard from '../components/ProjectCard';
import SupportWidget from '../components/SupportWidget';
import SEO from '../components/SEO';
import { Language, Translation, Project, Post, ToolItem } from '../types';
import { SOCIAL_LINKS } from '../config';

interface HomeProps {
  lang: Language;
  t: Translation;
  featuredProjects: Project[];
  recentPosts: Post[];
  featuredTools: ToolItem[];
}

const Home: React.FC<HomeProps> = ({ lang, t, featuredProjects, recentPosts, featuredTools }) => {
  // Text Scramble Effect Logic
  const TARGET_TEXT = "Lumina";
  const CHARS = "!@#$%^&*():{};|,.<>/?";
  const [scrambledText, setScrambledText] = useState(TARGET_TEXT);
  const [isScrambling, setIsScrambling] = useState(false);

  const handleScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iteration = 0;
    
    const interval = setInterval(() => {
      setScrambledText(
        TARGET_TEXT.split("").map((letter, index) => {
          if (index < iteration) {
            return TARGET_TEXT[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );

      if (iteration >= TARGET_TEXT.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
      // Trigger scramble on mount
      handleScramble();
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-10 px-4 sm:px-6">
      <SEO title="Home" description={t.hero.description} lang={lang} />
      
      {/* Background is now global in App.tsx */}

      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Minimal Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono tracking-widest uppercase backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Online
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-thin tracking-tighter text-foreground"
            onMouseEnter={handleScramble}
          >
             {scrambledText}
            <span className="text-indigo-500">.</span>
          </h1>
          
          <div className="max-w-xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            <div className="mb-2 flex items-center justify-center gap-2">
                 <span className="flex items-center gap-1.5 font-semibold text-foreground">🧑‍💻 Lumina</span>
            </div>
            <p>{t.hero.description}</p>
          </div>

          <div className="flex gap-4 pt-4">
             <Link to="/projects" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <span className="mr-2">{t.hero.cta}</span>
                <Command size={16} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
             </Link>
          </div>
        </section>

        {/* The Laboratory Grid (Projects) */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-border/50 pb-4">
            <h2 className="text-2xl font-light tracking-tight flex items-center gap-2">
              <Terminal size={20} className="text-indigo-500" />
              Latest Experiments
            </h2>
            <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {featuredProjects.slice(0, 3).map((project, idx) => (
                <div key={project.id} className="h-[400px]">
                  <ProjectCard project={project} index={idx} />
                </div>
             ))}
          </div>
        </section>

        {/* Laboratory Log (Insights) */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-border/50 pb-4">
            <h2 className="text-2xl font-light tracking-tight flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" />
              Laboratory Log
            </h2>
            <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/insights/${post.slug}`} className="group block h-full">
                <div className="h-full flex flex-col p-6 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-card/60 transition-all duration-300">
                   <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded border border-indigo-500/20 text-indigo-500 bg-indigo-500/5">
                        {post.category}
                      </span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-indigo-500 transition-colors">
                     {post.title}
                   </h3>
                   
                   <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-grow">
                     {post.excerpt}
                   </p>

                   <div className="flex items-center text-indigo-500 font-medium text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform pt-4 border-t border-border/30">
                     {lang === 'en' ? 'Read Entry' : '阅读条目'}
                     <ArrowUpRight size={14} className="ml-1" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Workspace (Tools) */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-border/50 pb-4">
            <h2 className="text-2xl font-light tracking-tight flex items-center gap-2">
              <Cpu size={20} className="text-indigo-500" />
              Active Workspace
            </h2>
            <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {featuredTools.map((tool) => {
                const Icon = tool.icon || Cpu;
                const Wrapper = tool.url ? 'a' : 'div';
                const wrapperProps = tool.url ? { href: tool.url, target: "_blank", rel: "noopener noreferrer", className: "block h-full" } : { className: "block h-full" };

                return (
                  <Wrapper key={tool.name} {...wrapperProps}>
                      <div className="group h-full flex flex-col gap-3 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-indigo-500/30 transition-colors relative">
                        {tool.url && (
                            <div className="absolute bottom-3 right-3 text-Amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                <Link size={16}/>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-mono text-muted-foreground">{tool.category}</div>
                            <Icon size={16} className="text-indigo-500 opacity-80" />
                        </div>
                        <div className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors">{tool.name}</div>
                      </div>
                  </Wrapper>
                );
             })}
          </div>
        </section>

        {/* Zen Info Block */}
        <BentoContainer>
           <BentoItem colSpan={8} className="p-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-card to-secondary/30">
              <div className="max-w-lg">
                <h3 className="text-2xl font-medium mb-4">The Philosophy</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  We believe that the interface of the future is no interface at all. 
                  It is a seamless conversation between human intent and machine intelligence. 
                  Every pixel here is crafted to reduce friction.
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-end gap-4">
                 <div className="flex items-center gap-1.5 p-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-sm">
                    {SOCIAL_LINKS.map(link => (
                        <React.Fragment key={link.id}>
                             {link.id === 'wildsalt' && <div className="w-px h-3 bg-border mx-1" />}
                             <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className={`p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all hover:scale-110 ${link.activeColor ? `hover:${link.activeColor}` : ''}`}
                             >
                                <link.icon size={16} />
                             </a>
                        </React.Fragment>
                    ))}
                 </div>
                 <div className="w-full">
                    <SupportWidget compact />
                 </div>
              </div>
           </BentoItem>

           <BentoItem colSpan={4} className="p-6 flex flex-col justify-between items-center text-center bg-indigo-500/5 border-indigo-500/20">
              <div className="flex flex-col items-center justify-center flex-grow py-2">
                <span className="text-5xl font-mono font-bold text-indigo-500 mb-2">35+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Prototypes Deployed</span>
              </div>

              {/* Integrated Signal Network */}
              <div className="w-full pt-4 border-t border-indigo-500/10 flex flex-col items-center gap-3">
                   <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                       <Radio size={10} className="text-emerald-500 animate-pulse" />
                       {lang === 'en' ? 'Signal Network' : '信号网络'}
                   </div>
                   <div className="flex flex-wrap justify-center gap-2 w-full">
                       <a href="https://sonder.study/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-background/40 border border-indigo-500/10 hover:border-indigo-500/40 text-[11px] text-muted-foreground hover:text-indigo-500 transition-colors flex items-center gap-1 group">
                          小词大意 <ExternalLink size={8} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                       </a>
                       <a href="https://monoaware.top/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-background/40 border border-indigo-500/10 hover:border-indigo-500/40 text-[11px] text-muted-foreground hover:text-indigo-500 transition-colors flex items-center gap-1 group">
                          深度拆解 <ExternalLink size={8} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                       </a>
                   </div>
              </div>
           </BentoItem>

        </BentoContainer>

      </div>
    </div>
  );
};

export default Home;
