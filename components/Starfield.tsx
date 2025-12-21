import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
  className?: string;
}

const Starfield: React.FC<StarfieldProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Configuration
    const numStars = 100; // Slightly reduced for content readability
    const connectionDistance = 100;
    
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5, // Slightly smaller stars
        speed: Math.random() * 0.3 + 0.05, // Slower movement for background
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    let animationFrameId: number;

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

      // Draw connecting lines (Constellation effect)
      // We use a very low opacity to ensure text remains readable
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.07)'; // Very subtle Indigo
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < stars.length; i++) {
        // Optimization: Only check a subset of stars or limit distance checks if performance lags
        // For < 150 stars, O(N^2) is acceptable on modern devices
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Vignette Overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default Starfield;