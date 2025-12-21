import React from 'react';
import { Coffee, Heart } from 'lucide-react';

interface SupportWidgetProps {
  compact?: boolean;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({ compact = false }) => {
  return (
    <a 
      href="https://www.buymeacoffee.com" 
      target="_blank" 
      rel="noreferrer"
      className={`
        group relative overflow-hidden flex items-center justify-center gap-3 
        rounded-xl border border-amber-500/30 bg-amber-500/10 
        hover:bg-amber-500/20 hover:border-amber-500/50 
        transition-all duration-300 cursor-pointer
        ${compact ? 'p-3' : 'p-4 w-full'}
      `}
    >
      <div className="relative z-10 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
        <Coffee size={20} className="group-hover:rotate-12 transition-transform" />
        <span className={compact ? 'hidden sm:inline' : 'inline'}>
          Fuel the Laboratory
        </span>
      </div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -z-10 translate-x-[-100%] group-hover:animate-shimmer bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
    </a>
  );
};

export default SupportWidget;