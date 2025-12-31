import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Wifi, Cpu, Globe, Languages } from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../config';

interface LandingProps {
  lang: Language;
  toggleLang: () => void;
}

const Landing: React.FC<LandingProps> = ({ lang, toggleLang }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  // Starfield Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random()
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Move stars
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      // Draw connecting lines for nearby stars (Constellation effect)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'; // Indigo-ish
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Terminal Simulation
  useEffect(() => {
    const lines = [
      "Initialising neural link...",
      "Resolving dependencies...",
      "Loading creative modules...",
      "Connecting to satellite: [LUMINA-SAT-01]...",
      "Location verified: Digital Void.",
      "System: ONLINE."
    ];
    
    let delay = 0;
    lines.forEach((line, index) => {
      delay += Math.random() * 500 + 300;
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, delay);
    });
  }, []);

  const handleEnter = () => {
    navigate('/lab');
  };

  return (
    // Use h-[100dvh] for mobile browser address bar compatibility
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050505] text-white selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      {/* Main Content Area - Flex Grow to push Footer down */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 w-full min-h-0">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="text-center flex flex-col items-center gap-6 sm:gap-8 md:gap-10"
        >
          {/* Glitchy Title - Responsive Text Sizes */}
          <div className="relative">
             <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mix-blend-screen relative inline-block">
               LUMINA
               <span className="absolute -inset-1 animate-pulse opacity-20 text-indigo-500 blur-lg select-none">LUMINA</span>
             </h1>
             <div className="text-[10px] sm:text-xs md:text-sm font-mono text-indigo-400 mt-2 tracking-[0.3em] sm:tracking-[0.5em] uppercase opacity-80">
               {lang === 'en' ? 'Digital Laboratory' : '数字实验室'}
             </div>
          </div>

          {/* Slogan - Limited Width for Readability */}
          <p className="max-w-[280px] sm:max-w-md mx-auto text-gray-400 font-light text-xs sm:text-sm md:text-base leading-relaxed h-10 sm:h-12 flex items-center justify-center">
             {lang === 'en' 
               ? "Exploring the void between 0 and 1. Crafting poetry for machines."
               : "探索 0 与 1 之间的虚空。为机器谱写诗篇。"}
          </p>

          {/* The "Switch" Button - Compact padding on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-full backdrop-blur-md transition-all duration-300"
          >
             <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-indigo-500"></span>
             </span>
             <span className="font-mono text-xs sm:text-sm tracking-widest uppercase">
               {lang === 'en' ? 'Enter System' : '进入系统'}
             </span>
             <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
             
             {/* Button Glow */}
             <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-indigo-500/50 transition-all duration-500" />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer / Terminal Status - Shrink-0 to prevent collapsing */}
      <div className="relative z-30 p-4 sm:p-6 flex flex-col md:flex-row justify-end md:justify-between items-center md:items-end gap-4 shrink-0 w-full bg-gradient-to-t from-black/80 via-black/0 to-transparent">
        
        {/* Terminal Output - Hidden on Mobile/Tablet to save space */}
        <div className="hidden lg:block font-mono text-[10px] text-green-500/80 leading-tight bg-black/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm max-w-sm">
           <div className="flex items-center gap-2 mb-2 text-gray-500 border-b border-white/10 pb-1">
             <Terminal size={10} />
             <span>TERMINAL_OUTPUT</span>
           </div>
           {terminalLines.map((line, i) => (
             <div key={i} className="animate-fade-in truncate">
               <span className="mr-2 opacity-50">{`>`}</span>
               {line}
             </div>
           ))}
           <div className="animate-pulse">_</div>
        </div>

        <div className="w-full flex flex-col items-center md:items-end gap-3 pointer-events-auto">
            
            {/* Social Media Dock - Scaled down on Mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 bg-black/50 px-3 py-2 rounded-full border border-white/5 backdrop-blur-sm shadow-xl scale-90 sm:scale-100 origin-bottom">
               {SOCIAL_LINKS.map((link) => (
                 <React.Fragment key={link.id}>
                    {link.id === 'wildsalt' && <div className="w-px h-3 bg-white/10 mx-1" />}
                    <SocialIcon 
                      href={link.href} 
                      icon={<link.icon size={14} />} 
                      label={link.label} 
                      activeColor={link.activeColor} 
                    />
                 </React.Fragment>
               ))}
            </div>

            {/* Status Indicators & Language Toggle - Compact on Mobile */}
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-gray-500 font-mono bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                  <Globe size={10} className="sm:w-3 sm:h-3" />
                  <span>EARTH_616</span>
              </div>
              <div className="w-px h-2 sm:h-3 bg-gray-700" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                  <Wifi size={10} className="text-indigo-500 sm:w-3 sm:h-3" />
                  <span>CONNECTED</span>
              </div>
              
              {/* Hide Version on very small screens */}
              <div className="w-px h-2 sm:h-3 bg-gray-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                  <Cpu size={12} />
                  <span>v.2.0.4</span>
              </div>
              
              <div className="w-px h-2 sm:h-3 bg-gray-700" />
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors cursor-pointer group"
                title="Switch Language"
              >
                 <Languages size={10} className="group-hover:text-indigo-400 transition-colors sm:w-3 sm:h-3" />
                 <span className={lang === 'en' ? 'text-white font-bold' : ''}>EN</span>
                 <span>/</span>
                 <span className={lang === 'zh' ? 'text-white font-bold' : ''}>中</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ href, icon, label, activeColor = "text-indigo-400" }: { href: string, icon: React.ReactNode, label: string, activeColor?: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-1.5 sm:p-2 rounded-full hover:bg-white/10 hover:${activeColor} transition-all duration-300 hover:scale-110`}
    title={label}
  >
    {icon}
  </a>
);

export default Landing;