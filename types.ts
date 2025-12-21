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
  description: {
    en: string;
    zh: string;
  };
  // New detailed fields
  challenge?: {
    en: string;
    zh: string;
  };
  solution?: {
    en: string;
    zh: string;
  };
  palette?: string[]; // Hex codes
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
  title: {
    en: string;
    zh: string;
  };
  excerpt: {
    en: string;
    zh: string;
  };
  aiAnalysis?: {
    en: string;
    zh: string;
  };
  content?: string; // Markdown content
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