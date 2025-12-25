import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { Language } from '../types';
import { motion } from 'framer-motion';
import { Atom, FileCode2, Wind, Layers, Sparkles, Box, Zap, PenTool, Cpu } from 'lucide-react';

// Map icon names from JSON to Lucide components
const ICON_MAP: Record<string, any> = {
  Atom, FileCode2, Wind, Layers, Sparkles, Box, Zap, PenTool, Cpu
};

interface ToolsProps {
  lang: Language;
}

const Tools: React.FC<ToolsProps> = ({ lang }) => {
  const { tools } = useContent();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      
      {/* Background is now global in App.tsx */}

      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-foreground mb-6">
             <span className="text-indigo-500">::</span> {lang === 'en' ? 'Workspace' : '工作台'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            {lang === 'en' 
              ? 'The digital instruments and neural frameworks used to construct this reality.' 
              : '构建此数字现实所使用的数字仪器与神经框架。'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => {
            const Icon = ICON_MAP[tool.iconName] || Cpu;
            return (
              <motion.div 
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{tool.category}</span>
                  <div className="p-2 rounded-lg bg-background/50 border border-border/50 group-hover:border-indigo-500/50 group-hover:text-indigo-500 transition-colors">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-indigo-500 transition-colors">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tools;