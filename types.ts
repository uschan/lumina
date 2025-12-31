export type Language = 'en' | 'zh';

export interface Translation {
  nav: {
    home: string;
    projects: string;
    insights: string;
    tools: string;
  };
  hero: {
    role: string;
    greeting: string;
    description: string;
    cta: string;
  };
  common: {
    readMore: string;
    viewProject: string;
    techStack: string;
    briefs: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string; // Flattened: No longer { en: string, zh: string }
  challenge?: string;
  solution?: string;
  palette?: string[];
  tags: string[];
  image: string;
  links: {
    github?: string;
    demo?: string;
  };
  featured?: boolean;
}

export interface Post {
  id: string;
  title: string;       // Flattened
  excerpt: string;     // Flattened
  aiAnalysis?: string; // Flattened
  content?: string;
  date: string;
  type: 'insight' | 'brief';
  readTime: string;
}

export interface ToolItem {
  name: string;
  category: string;
  icon?: any;
  description: string;
}