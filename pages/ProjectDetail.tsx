import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentService } from '../services/content';
import { Language } from '../types';
import { ArrowLeft, Github, ExternalLink, Palette, Cpu, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import SupportWidget from '../components/SupportWidget';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import SEO from '../components/SEO';

interface ProjectDetailProps {
  lang: Language;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ lang }) => {
  const { id } = useParams<{ id: string }>();
  // Use ContentService instead of direct import
  const project = ContentService.getProjectById(id || '');

  if (!project) {
    return <div className="pt-32 text-center">Project not found</div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <SEO title={project.title} description={project.description[lang]} lang={lang} />
      
      {/* Background is now global in App.tsx */}

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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          <div className="order-2 lg:order-1 flex flex-col justify-center">
             <div className="flex items-center gap-2 text-indigo-500 font-mono text-sm mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                V.1.0 STABLE
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
               {project.title}
             </h1>
             <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
               {project.description[lang]}
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
          
          {/* Main Context (Left) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Challenge & Solution */}
            {project.challenge && (
              <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="p-8 rounded-3xl bg-card/40 border border-border/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6 text-foreground">
                   <div className="p-2 rounded bg-indigo-500/10 text-indigo-500"><Layers size={20} /></div>
                   <h2 className="text-2xl font-bold">{lang === 'en' ? 'The Challenge' : '挑战'}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  {project.challenge[lang]}
                </p>

                <div className="w-full h-px bg-border/50 mb-8" />

                <div className="flex items-center gap-3 mb-6 text-foreground">
                   <div className="p-2 rounded bg-emerald-500/10 text-emerald-500"><Cpu size={20} /></div>
                   <h2 className="text-2xl font-bold">{lang === 'en' ? 'The Solution' : '解决方案'}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {project.solution?.[lang]}
                </p>
              </motion.section>
            )}
          </div>

          {/* Sidebar Specs (Right) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Tech Stack */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="p-6 rounded-2xl border border-border/50 bg-secondary/20"
             >
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Tech Matrix</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-md bg-background border border-border text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
             </motion.div>

             {/* Visual Guidelines */}
             {project.palette && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="p-6 rounded-2xl border border-border/50 bg-secondary/20"
               >
                  <div className="flex items-center gap-2 mb-4">
                    <Palette size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Visual Identity</h3>
                  </div>
                  <div className="space-y-3">
                    {project.palette.map((color) => (
                      <div key={color} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigator.clipboard.writeText(color)}>
                        <div className="w-12 h-12 rounded-xl shadow-sm border border-border/50" style={{ backgroundColor: color }} />
                        <div className="flex flex-col">
                          <span className="text-sm font-mono font-medium text-foreground">{color}</span>
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.div>
             )}

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

export default ProjectDetail;