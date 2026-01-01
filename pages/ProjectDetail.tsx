
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Project } from '../types';
import { 
    ArrowLeft, Github, ExternalLink, Palette, Cpu, Sparkles, Layers, Type, 
    MousePointer, Image as ImageIcon, PaintBucket, ChevronLeft, ChevronRight, 
    Bot, User, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SupportWidget from '../components/SupportWidget';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import SEO from '../components/SEO';
import CodeBlock from '../components/CodeBlock';
import { getIconForTech } from '../utils/iconMap';

interface ProjectDetailProps {
  lang: Language;
  projects: Project[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ lang, projects }) => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);
  
  // Gallery State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  if (!project) {
    return <div className="pt-32 text-center">Project not found</div>;
  }

  // Handle Gallery
  const hasGallery = project.gallery && project.gallery.length > 0;
  const images = hasGallery ? [project.image, ...project.gallery!] : [project.image];
  
  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);

  // Fallback for colors
  const displayColors = project.visualIdentity?.colors && project.visualIdentity.colors.length > 0
    ? project.visualIdentity.colors
    : project.palette || [];

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6">
      <SEO title={project.title} description={project.description} lang={lang} />
      
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          {lang === 'en' ? 'Back to Experiments' : '返回实验列表'}
        </Link>

        {/* Hero / Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12"
        >
          {/* Header Info */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
             <div className="flex items-center gap-2 text-indigo-500 font-mono text-sm mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                V.1.0 STABLE
             </div>
             <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
               {project.title}
             </h1>
             <p className="text-sm md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
               {project.description}
             </p>
             <div className="flex gap-4">
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                    <Github size={18} />
                    GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background hover:bg-secondary/50 transition-colors">
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
             </div>
          </div>

          {/* Gallery Carousel */}
          <div className="order-1 lg:order-2 relative aspect-video rounded-3xl overflow-hidden border border-border/50 bg-muted/20 group">
             <AnimatePresence mode='wait'>
                 <motion.div 
                    key={currentImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                 >
                    <ImageWithSkeleton 
                        src={images[currentImageIdx]} 
                        alt={project.title} 
                        className="object-cover w-full h-full"
                        containerClassName="w-full h-full"
                    />
                 </motion.div>
             </AnimatePresence>
             
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />

             {/* Controls (Only if multiple images) */}
             {images.length > 1 && (
                 <>
                    <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                    
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIdx ? 'bg-white w-3' : 'bg-white/50'}`} 
                            />
                        ))}
                    </div>
                 </>
             )}
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Context (Left) - Storytelling & Timeline */}
          <div className="lg:col-span-8 space-y-12">
            {/* Markdown Content */}
            {project.content && (
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="p-8 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-sm prose prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-md"
              >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{ code: CodeBlock }}
                >
                    {project.content}
                </ReactMarkdown>
              </motion.div>
            )}

            {/* Development Timeline */}
            {project.timeline && project.timeline.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="pl-4 border-l-2 border-border/50 ml-4 space-y-8 relative"
                >
                    <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6 -ml-6 pl-6 bg-background inline-block">Process Timeline</h3>
                    {project.timeline.map((event, idx) => (
                        <div key={idx} className="relative pl-6 group">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 group-hover:border-indigo-500 transition-colors shadow-sm" />
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                <span className="text-xs font-mono text-indigo-500">{event.date}</span>
                                <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                    ))}
                </motion.div>
            )}
          </div>

          {/* Sidebar Specs (Right) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* 1. Collaborators / Vibe Coding Team */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Users size={12} /> Neural Team
                </h3>
                
                {/* Default to User + Gemini if none specified, or just show defined ones */}
                <div className="flex items-center -space-x-3 overflow-hidden py-2 pl-1">
                   {(!project.collaborators || project.collaborators.length === 0) ? (
                        // Fallback Default Team
                        <>
                           <AvatarPlaceholder name="Lumina" role="Architect" icon={User} />
                           <AvatarPlaceholder name="Gemini" role="Co-Pilot" icon={Sparkles} color="bg-indigo-500" />
                           <AvatarPlaceholder name="ChatGPT" role="Reasoning" icon={Bot} color="bg-emerald-500" />
                        </>
                   ) : (
                       project.collaborators.map((c, idx) => (
                           <AvatarPlaceholder key={idx} name={c.name} role={c.role} icon={c.name.toLowerCase().includes('gemini') ? Sparkles : Bot} />
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
                 className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                   <Palette size={12} /> Visual Identity
                </h3>
                
                {/* Spec Table */}
                <div className="space-y-3">
                    {/* Color Palette - Right Aligned in Table Style */}
                    {displayColors.length > 0 && (
                        <div className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                                <PaintBucket size={12} className="opacity-70" />
                                <span>Color System</span>
                            </div>
                            <div className="flex items-center justify-end pl-2">
                                {displayColors.map((color, idx) => (
                                    <div 
                                        key={color} 
                                        className="group relative -ml-2 first:ml-0"
                                    >
                                        <div 
                                            className="w-6 h-6 rounded-full border-2 border-background shadow-sm hover:scale-110 hover:z-10 transition-all cursor-pointer relative z-0" 
                                            style={{ backgroundColor: color }}
                                        />
                                        {/* Tooltip */}
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

// Helper Components

const SpecRow = ({ label, icon: Icon, value }: { label: string, icon: any, value: string }) => (
    <div className="flex items-start justify-between text-xs py-1 border-b border-border/30 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
            <Icon size={12} className="opacity-70" />
            <span>{label}</span>
        </div>
        <div className="text-right text-foreground font-medium max-w-[150px] leading-tight">{value}</div>
    </div>
);

const AvatarPlaceholder = ({ name, role, icon: Icon, color = "bg-zinc-700" }: any) => (
    <div className="relative group cursor-pointer">
        <div className={`w-10 h-10 rounded-full border-2 border-card flex items-center justify-center text-white shadow-sm hover:scale-110 hover:z-10 transition-all relative z-0 ${color}`}>
            <Icon size={16} />
        </div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 min-w-[100px] text-center border border-white/10">
            <div className="text-white font-bold text-xs">{name}</div>
            <div className="text-gray-400 text-[9px] uppercase tracking-wider">{role}</div>
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/10"></div>
        </div>
    </div>
);

export default ProjectDetail;
