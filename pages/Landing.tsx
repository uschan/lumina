import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Wifi, Battery, Cpu, Globe } from 'lucide-react';
import { Language } from '../types';

interface LandingProps {
  lang: Language;
}

const Landing: React.FC<LandingProps> = ({ lang }) => {
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
    <div className="relative h-screen w-full overflow-hidden bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="text-center space-y-8"
        >
          {/* Glitchy Title */}
          <div className="relative">
             <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mix-blend-screen relative inline-block">
               野盐 WILDSALT
               <span className="absolute -inset-1 animate-pulse opacity-20 text-indigo-500 blur-lg select-none">野盐 WILDSALT</span>
             </h1>
             <div className="text-xs md:text-sm font-mono text-indigo-400 mt-2 tracking-[0.5em] uppercase opacity-80">
               {lang === 'en' ? 'Digital Laboratory' : '数字实验室'}
             </div>
          </div>

          {/* Slogan */}
          <p className="max-w-md mx-auto text-gray-400 font-light text-sm md:text-base leading-relaxed h-12">
             {lang === 'en' 
               ? "Exploring the void between 0 and 1. Crafting poetry for machines."
               : "探索 0 与 1 之间的虚空。为机器谱写诗篇。"}
          </p>

          {/* The "Switch" Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-full backdrop-blur-md transition-all duration-300"
          >
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
             </span>
             <span className="font-mono text-sm tracking-widest uppercase">
               {lang === 'en' ? 'Enter System' : '进入系统'}
             </span>
             <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
             
             {/* Button Glow */}
             <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-indigo-500/50 transition-all duration-500" />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer / Terminal Status */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 flex justify-between items-end pointer-events-none">
        {/* Terminal Output */}
        <div className="hidden md:block font-mono text-[10px] text-green-500/80 leading-tight bg-black/50 p-4 rounded-lg border border-white/5 backdrop-blur-sm max-w-sm">
           <div className="flex items-center gap-2 mb-2 text-gray-500 border-b border-white/10 pb-1">
             <Terminal size={10} />
             <span>TERMINAL_OUTPUT</span>
           </div>
           {terminalLines.map((line, i) => (
             <div key={i} className="animate-fade-in">
               <span className="mr-2 opacity-50">{`>`}</span>
               {line}
             </div>
           ))}
           <div className="animate-pulse">_</div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono bg-black/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-2">
              <Globe size={12} />
              <span>EARTH_616</span>
           </div>
           <div className="w-px h-3 bg-gray-700" />
           <div className="flex items-center gap-2">
              <Wifi size={12} className="text-indigo-500" />
              <span>CONNECTED</span>
           </div>
           <div className="w-px h-3 bg-gray-700" />
           <div className="flex items-center gap-2">
              <Battery size={12} className="text-emerald-500" />
              <span>100%</span>
           </div>
           <div className="w-px h-3 bg-gray-700" />
           <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span>v.2.0.4</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;