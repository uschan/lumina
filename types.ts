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
  slug: string;        // SEO Friendly URL
  title: string;
  description: string; 
  content?: string;    // Markdown Content (Replaces rigid challenge/solution)
  palette?: string[];
  tags: string[];
  image: string;
  links: {
    github?: string;
    demo?: string;
  };
  featured?: boolean;
  publishDate?: string;
}

export interface Post {
  id: string;
  slug: string;        // SEO Friendly URL
  title: string;
  excerpt: string;
  category: string;    // Taxonomy: 'Engineering' | 'Design' | 'Philosophy'
  tags: string[];      // Taxonomy: ['React', 'AI', 'System']
  aiAnalysis?: string;
  content?: string;
  date: string;
  type: 'insight' | 'brief'; // Visual style only
  readTime: string;
  published?: boolean;
}

export interface ToolItem {
  name: string;
  category: string;
  icon?: any;
  description: string;
}