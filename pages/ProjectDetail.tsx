
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Project } from '../types';
import { ArrowLeft, Github, ExternalLink, Palette, Cpu, Sparkles, Layers, Type, MousePointer, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SupportWidget from '../components/SupportWidget';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import SEO from '../components/SEO';
import CodeBlock from '../components/CodeBlock';

interface ProjectDetailProps {
  lang: Language;
  projects: Project[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ lang, projects }) => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <div className="pt-32 text-center">Project not found</div>;
  }

  // Fallback for visual identity colors if using old palette field
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

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12"
        >
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
          <div className="order-1 lg:order-2 relative aspect-video rounded-3xl overflow-hidden border border-border/50 bg-muted/20 group">
             <ImageWithSkeleton 
               src={project.image} 
               alt={project.title} 
               className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
               containerClassName="w-full h-full"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Context (Left) - Storytelling */}
          <div className="lg:col-span-8">
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
          </div>

          {/* Sidebar Specs (Right) - Redesigned */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* 1. Core Features Module */}
             {project.features && project.features.length > 0 && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
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

             {/* 2. Visual Identity Module */}
             <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                   <Palette size={12} /> Visual Identity
                </h3>
                
                {/* Color Palette - Horizontal Overlapping */}
                {displayColors.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center pl-2">
                            {displayColors.map((color, idx) => (
                                <div 
                                    key={color} 
                                    className="group relative -ml-2 first:ml-0"
                                >
                                    <div 
                                        className="w-8 h-8 rounded-full border-2 border-background shadow-sm hover:scale-110 hover:z-10 transition-all cursor-pointer relative z-0" 
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

                {/* Spec Table */}
                <div className="space-y-3">
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

             {/* 3. Tech Matrix Module */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-6 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-sm"
             >
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Cpu size={12} /> Tech Matrix
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50 text-xs font-medium text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
             </motion.div>

             {/* Support */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
             >
                <SupportWidget />
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecRow = ({ label, icon: Icon, value }: { label: string, icon: any, value: string }) => (
    <div className="flex items-start justify-between text-xs py-1 border-b border-border/30 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
            <Icon size={12} className="opacity-70" />
            <span>{label}</span>
        </div>
        <div className="text-right text-foreground font-medium max-w-[150px] leading-tight">{value}</div>
    </div>
);

export default ProjectDetail;
