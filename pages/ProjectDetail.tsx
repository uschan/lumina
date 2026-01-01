import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Github, ExternalLink, Calendar, Users, Sparkles, Bot, Palette, 
  Layers, Type, Image as ImageIcon, MousePointer, Cpu, PaintBucket, User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project, Language } from '../types';
import CodeBlock from '../components/CodeBlock';
import SupportWidget from '../components/SupportWidget';
import { getIconForTech } from '../utils/iconMap';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

interface ProjectDetailProps {
  projects: Project[];
  lang: Language;
}

const AvatarPlaceholder = ({ name, role, icon: Icon, color }: { name: string, role: string, icon: any, color?: string }) => (
  <div className="group relative flex items-center gap-2 pr-3 pl-1 py-1 rounded-full bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors cursor-help">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm ${color || 'bg-zinc-700 dark:bg-zinc-600'}`}>
        <Icon size={12} />
    </div>
    <div className="flex flex-col">
        <span className="text-[10px] font-bold leading-none text-foreground">{name}</span>
        <span className="text-[8px] text-muted-foreground leading-none">{role}</span>
    </div>
    
    {/* Tooltip - Absolute position needs z-index and no parent overflow clipping */}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {name} • {role}
    </div>
  </div>
);

const SpecRow = ({ label, icon: Icon, value }: { label: string, icon: any, value: string }) => (
  <div className="flex items-center justify-between text-xs py-2 border-b border-border/30 last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={12} className="opacity-70" />
        <span>{label}</span>
    </div>
    <div className="font-medium text-foreground text-right">{value}</div>
  </div>
);

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, lang }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const found = projects.find(p => p.slug === slug);
    if (found) {
      setProject(found);
    } 
  }, [slug, projects, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
           <p className="text-xs font-mono text-muted-foreground">Initializing Module...</p>
        </div>
      </div>
    );
  }

  const displayColors = project.visualIdentity?.colors || project.palette || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-indigo-500 mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {lang === 'en' ? 'Return to Laboratory' : '返回实验室'}
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
             <div className="flex items-center gap-3 mb-6">
                <span className="px-2 py-0.5 rounded border border-indigo-500/20 text-indigo-500 bg-indigo-500/5 text-[10px] font-mono uppercase tracking-widest">
                  Experiment {project.id.substring(0,4)}
                </span>
                {project.publishDate && (
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <Calendar size={12} /> {project.publishDate}
                  </span>
                )}
             </div>

             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-6">
               {project.title}
             </h1>
             
             <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light border-l-2 border-indigo-500/20 pl-6">
               {project.description}
             </p>

             <div className="flex flex-wrap gap-4">
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                    <ExternalLink size={18} />
                    {lang === 'en' ? 'Launch Demo' : '启动演示'}
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium flex items-center gap-2 transition-colors border border-border">
                    <Github size={18} />
                    {lang === 'en' ? 'Source Code' : '源码'}
                  </a>
                )}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="order-1 lg:order-2"
          >
             <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-card/50 aspect-video group">
                <ImageWithSkeleton 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                {/* Overlay Grid */}
                <div className="absolute inset-0 bg-lab-grid bg-[size:20px_20px] opacity-20 pointer-events-none mix-blend-overlay" />
             </div>
          </motion.div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Context (Left) - Storytelling & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="p-4 sm:p-10 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-sm"
            >
                {/* 1. Development Timeline (Compact, Top of Content) */}
                {project.timeline && project.timeline.length > 0 && (
                    <div className="mb-10 pb-8 border-b border-border/40">
                        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Process Timeline
                        </h3>
                        <div className="relative border-l border-border/50 ml-1.5 space-y-6">
                            {project.timeline.map((event, idx) => (
                                <div key={idx} className="relative pl-6 group">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 border-muted-foreground/30 group-hover:border-indigo-500 transition-colors shadow-sm z-10" />
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                        <span className="text-xs font-mono text-indigo-500/80 min-w-[85px]">{event.date}</span>
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm leading-tight">{event.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-lg">{event.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Markdown Content */}
                {project.content && (
                    <div className="prose prose-zinc font-light text-base dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-md prose-headings:font-medium prose-p:text-muted-foreground prose-a:text-indigo-500 hover:prose-a:text-indigo-400">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{ 
                              code: CodeBlock as any 
                            }}
                        >
                            {project.content}
                        </ReactMarkdown>
                    </div>
                )}
            </motion.div>
          </div>

          {/* Sidebar Specs (Right) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* 1. Collaborators / Vibe Coding Team */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               // Removed overflow-hidden here to allow tooltips to show
               className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm relative z-10"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Users size={12} /> Neural Team
                </h3>
                
                <div className="flex items-center flex-wrap gap-2 py-2 relative">
                   {(!project.collaborators || project.collaborators.length === 0) ? (
                        // Fallback Default Team
                        <>
                           <AvatarPlaceholder name="Lumina" role="Architect" icon={User} />
                           <AvatarPlaceholder name="Gemini" role="Co-Pilot" icon={Sparkles} color="bg-indigo-500" />
                           <AvatarPlaceholder name="GPT-4" role="Reasoning" icon={Bot} color="bg-emerald-500" />
                        </>
                   ) : (
                       project.collaborators.map((c, idx) => (
                           <AvatarPlaceholder 
                              key={idx} 
                              name={c.name} 
                              role={c.role} 
                              icon={c.name.toLowerCase().includes('gemini') ? Sparkles : Bot} 
                              color={c.name.toLowerCase().includes('gemini') ? 'bg-indigo-500' : undefined}
                           />
                       ))
                   )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-3 text-center italic">
                    "Pure Vibe Coding Protocol"
                </div>
             </motion.div>

             {/* 2. Core Features Module */}
             {project.features && project.features.length > 0 && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
                 >
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                       <Sparkles size={12} /> Core Features
                    </h3>
                    <div className="space-y-6">
                        {project.features.map((feature, idx) => (
                            <div key={idx} className="relative group">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                                    {feature.aiModel && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-500">
                                            <Sparkles size={8} />
                                            {feature.aiModel}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                 </motion.div>
             )}

             {/* 3. Visual Identity Module */}
             <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm relative z-0"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                   <Palette size={12} /> Visual Identity
                </h3>
                
                {/* Spec Table */}
                <div className="space-y-3">
                    {/* Color Palette */}
                    {displayColors.length > 0 && (
                        <div className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                                <PaintBucket size={12} className="opacity-70" />
                                <span>Color System</span>
                            </div>
                            <div className="flex items-center justify-end pl-2">
                                {displayColors.map((color: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        className="group relative -ml-1 first:ml-0"
                                    >
                                        <div 
                                            className="w-8 h-8 rounded-full border-2 border-background shadow-sm hover:scale-110 hover:z-10 transition-all cursor-pointer relative z-0" 
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 font-mono">
                                            {color}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.visualIdentity?.layout && (
                        <SpecRow label="Layout" icon={Layers} value={project.visualIdentity.layout} />
                    )}
                    {project.visualIdentity?.typography && (
                        <SpecRow label="Typography" icon={Type} value={project.visualIdentity.typography} />
                    )}
                    {project.visualIdentity?.iconography && (
                        <SpecRow label="Iconography" icon={ImageIcon} value={project.visualIdentity.iconography} />
                    )}
                    {project.visualIdentity?.animation && (
                        <SpecRow label="Animation" icon={MousePointer} value={project.visualIdentity.animation} />
                    )}
                </div>
             </motion.div>

             {/* 4. Tech Matrix Module (Icon Grid) */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Cpu size={12} /> Tech Matrix
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {project.tags.map(tag => {
                      const Icon = getIconForTech(tag);
                      return (
                        <div key={tag} className="group relative flex items-center justify-center p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 hover:border-indigo-500/30 transition-all cursor-help">
                            <Icon size={20} className="text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                {tag}
                            </div>
                        </div>
                      );
                  })}
                </div>
             </motion.div>

             {/* Support */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
             >
                <SupportWidget />
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;