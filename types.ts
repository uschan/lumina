
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
  content?: string;    // Markdown Content
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
  category: string;    // Taxonomy
  tags: string[];      // Taxonomy
  content?: string;
  date: string;
  readTime: string;
  published?: boolean;
}

export interface ToolItem {
  id?: string;         // Database ID
  name: string;
  category: string;
  icon?: any;          // React Component (Runtime)
  iconName?: string;   // String name for DB storage (e.g. 'Cpu')
  description: string;
}
