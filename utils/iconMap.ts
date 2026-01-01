
import { 
  BarChart, Users, Sparkles, Bot, BrainCircuit, Image, Code2, MousePointer, 
  Terminal, Container, Atom, FileCode, Wind, Box, PenTool, Smartphone, 
  Database, Cloud, Cpu, Server, Globe, Braces, Layers, Command
} from 'lucide-react';

export const getIconForTech = (name: string) => {
  const normalized = name.toLowerCase();
  
  // Direct Map
  const map: Record<string, any> = {
    'gemini': Sparkles,
    'gemini 3 pro': Sparkles,
    'chatgpt': Bot,
    'gpt-4': Bot,
    'claude': BrainCircuit,
    'midjourney': Image,
    'dalle': Image,
    'vs code': Code2,
    'cursor': MousePointer,
    'putty': Terminal,
    'docker': Container,
    'react': Atom,
    'react 18': Atom,
    'react 19': Atom,
    'typescript': FileCode,
    'ts': FileCode,
    'javascript': Braces,
    'js': Braces,
    'tailwind': Wind,
    'tailwind css': Wind,
    'next.js': Box,
    'next.js 15': Box,
    'figma': PenTool,
    'framer': Smartphone,
    'framer motion': Smartphone,
    'supabase': Database,
    'postgres': Database,
    'postgresql': Database,
    'vercel': Cloud,
    'node': Server,
    'node.js': Server,
    'html': Globe,
    'css': Layers,
    'python': Command
  };

  // 1. Check exact match
  if (map[normalized]) return map[normalized];

  // 2. Check partial match (e.g. "React Query" -> matches "react")
  for (const key in map) {
      if (normalized.includes(key)) return map[key];
  }
  
  // Default
  return Cpu;
};
