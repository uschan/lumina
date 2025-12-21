import React from 'react';
import { Project, Language } from '../types';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

interface ProjectsProps {
  projects: Project[];
  lang: Language;
}

const Projects: React.FC<ProjectsProps> = ({ projects, lang }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-[-1] opacity-[0.4] bg-lab-grid dark:bg-lab-grid-dark bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-foreground mb-6">
            <span className="text-indigo-500">//</span> {lang === 'en' ? 'Laboratory' : '实验室'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            {lang === 'en' 
              ? 'A collection of high-fidelity prototypes and production applications powered by Gemini 3. Each block represents a solved problem.'
              : '由 Gemini 3 驱动的高保真原型和生产级应用合集。每个模块都代表一个被解决的问题。'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className="h-[420px]">
              <ProjectCard project={project} lang={lang} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;