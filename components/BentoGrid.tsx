import React from 'react';
import { motion } from 'framer-motion';

export const BentoContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)] ${className}`}>
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number; // Simplified to number for grid-column-end
  rowSpan?: number;
  delay?: number;
}

export const BentoItem: React.FC<BentoItemProps> = ({ 
  children, 
  className = '', 
  colSpan = 4, // Default to 4 columns (3 items per row on 12-col grid)
  rowSpan = 1,
  delay = 0
}) => {
  
  // Helper to map prop to Tailwind classes for 12-col grid
  const getColSpanClass = (span: number) => {
    switch(span) {
      case 2: return 'md:col-span-2 lg:col-span-2';
      case 3: return 'md:col-span-3 lg:col-span-3';
      case 4: return 'md:col-span-4 lg:col-span-4';
      case 6: return 'md:col-span-6 lg:col-span-6';
      case 8: return 'md:col-span-6 lg:col-span-8';
      case 12: return 'col-span-full';
      default: return 'md:col-span-4 lg:col-span-4';
    }
  };

  const getRowSpanClass = (span: number) => {
     switch(span) {
      case 2: return 'row-span-2';
      default: return 'row-span-1';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`
        ${getColSpanClass(colSpan)} 
        ${getRowSpanClass(rowSpan)}
        relative rounded-3xl 
        border border-border/40 
        bg-card/20 backdrop-blur-sm
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};