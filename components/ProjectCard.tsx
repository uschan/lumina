import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Cpu, Github, ExternalLink } from 'lucide-react';
import { Project, Language } from '../types';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';

interface ProjectCardProps {
  project: Project;
  lang: Language;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = clientX - left - width / 2;
    const yPct = clientY - top - height / 2;
    
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col h-full rounded-3xl border border-border/50 bg-card/30 dark:bg-card/20 backdrop-blur-md hover:border-indigo-500/30 transition-colors duration-500 will-change-transform"
    >
      {/* Animated Gradient Border (Glow Effect) */}
      <div className="absolute inset-0 z-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu" style={{ transform: 'translateZ(-1px)' }}>
         <div className="absolute inset-[-1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-1" style={{ transform: 'translateZ(10px)' }}>
        
        {/* Image Area with "Scanner" Overlay - Wrapped in Link */}
        <Link to={`/projects/${project.id}`} className="relative block aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted/20 cursor-pointer">
          <ImageWithSkeleton
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            containerClassName="h-full w-full"
          />
          
          {/* Code Flow Overlay */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-full h-full p-4 font-mono text-xs text-green-400/80 overflow-hidden leading-tight mask-image-b">
                <div className="animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent absolute inset-0 -skew-x-12 translate-x-[-100%]" />
                <p>{`> initializing module: ${project.title}`}</p>
                <p>{`> loading gemini model context...`}</p>
                <p className="mt-2 text-indigo-300">{`// ${project.description.en.substring(0, 50)}...`}</p>
             </div>
          </div>
        </Link>

        {/* External Links floating on top */}
        <div className="absolute top-4 right-4 z-20 flex gap-2" style={{ transform: 'translateZ(20px)' }}>
             {project.links.github && (
                 <a href={project.links.github} className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-indigo-600">
                    <Github size={16} />
                 </a>
             )}
             {project.links.demo && (
                 <a href={project.links.demo} className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75 hover:bg-indigo-600">
                    <ExternalLink size={16} />
                 </a>
             )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-grow p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
               <Cpu size={14} className="animate-pulse-slow" />
               <span className="text-xs font-mono tracking-wider uppercase">System Active</span>
            </div>
          </div>

          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
                {project.title}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
            {project.description[lang]}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10px] font-medium text-secondary-foreground backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;