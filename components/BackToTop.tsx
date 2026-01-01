import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animation for the progress circle
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scaleY: 0.5 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            aria-label="Back to top"
          >
            {/* Progress Circle SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
               <circle
                 cx="50"
                 cy="50"
                 r="48"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="4"
                 className="text-gray-200 dark:text-zinc-800"
               />
               <motion.circle
                 cx="50"
                 cy="50"
                 r="48"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="4"
                 className="text-indigo-500"
                 style={{ pathLength }}
               />
            </svg>
            
            <ArrowUp size={20} className="text-foreground group-hover:text-indigo-500 transition-colors" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;