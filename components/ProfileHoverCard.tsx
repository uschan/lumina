import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Mail, MapPin, ExternalLink } from 'lucide-react';

interface ProfileHoverCardProps {
  children: React.ReactNode;
}

const ProfileHoverCard: React.FC<ProfileHoverCardProps> = ({ children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative inline-block z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)} // Better mobile support
    >
      <span className="cursor-pointer font-semibold text-foreground hover:text-indigo-500 transition-colors border-b border-dashed border-indigo-500/50 pb-0.5">
        {children}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.96, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-full mt-3 cursor-default w-[85vw] max-w-[320px] sm:w-80"
          >
            <div className="relative bg-white dark:bg-[#18181b] rounded-xl p-0 shadow-2xl border border-border/60 overflow-hidden ring-1 ring-black/5">
              {/* Decorative Header Background */}
              <div className="h-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-b border-border/40" />

              <div className="px-5 pb-5 -mt-8 relative">
                {/* Avatar & Header */}
                <div className="flex justify-between items-end mb-3">
                   <div className="relative">
                      <img 
                        src="https://picsum.photos/seed/avatar/128/128" 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full border-4 border-white dark:border-[#18181b] shadow-sm bg-background"
                      />
                      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#18181b] rounded-full"></div>
                   </div>
                   <button className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
                     Follow
                   </button>
                </div>

                {/* Content Info */}
                <div>
                   <h4 className="text-lg font-bold text-foreground">Lumina</h4>
                   <p className="text-sm text-muted-foreground font-mono mb-3">@lumina_lab</p>
                   
                   <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                     Full-stack creative developer crafting digital experiences at the intersection of design & AI.
                   </p>

                   <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <MapPin size={14} className="text-indigo-500" />
                      <span>Digital Nomad / Earth</span>
                   </div>
                </div>

                {/* Footer / Socials */}
                <div className="flex gap-2 pt-4 border-t border-border/50">
                   <SocialLink icon={<Github size={16} />} href="#" label="GitHub" />
                   <SocialLink icon={<Twitter size={16} />} href="#" label="Twitter" />
                   <SocialLink icon={<Mail size={16} />} href="#" label="Email" />
                   <SocialLink icon={<ExternalLink size={16} />} href="#" label="Website" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialLink = ({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) => (
  <a 
    href={href} 
    title={label}
    className="p-2 rounded-lg bg-secondary/50 hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors text-muted-foreground"
  >
    {icon}
  </a>
);

export default ProfileHoverCard;