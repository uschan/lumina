
import { supabase, isConfigured } from './supabase';
import { Project, Post, ToolItem } from '../types';

// --- CRUD OPERATIONS ---

// Projects
export const ProjectService = {
  async fetchAll(): Promise<Project[]> {
    if (!isConfigured) return [];
    const { data } = await supabase.from('projects').select('*').order('publish_date', { ascending: false });
    return (data || []).map((p: any) => ({ 
        ...p, 
        publishDate: p.publish_date,
        visualIdentity: p.visual_identity, // Map DB snake_case to CamelCase
        features: p.features,
        gallery: p.gallery || [],
        timeline: p.timeline || [],
        collaborators: p.collaborators || []
    }));
  },

  async upsert(project: Partial<Project>) {
    // Map camelCase to snake_case for DB
    const payload = {
        id: project.id, // If undefined, Supabase generates one
        slug: project.slug,
        title: project.title,
        description: project.description,
        content: project.content,
        palette: project.palette, // Keep legacy
        tags: project.tags,
        image: project.image,
        links: project.links,
        featured: project.featured,
        publish_date: project.publishDate,
        // New Fields
        features: project.features,
        visual_identity: project.visualIdentity,
        gallery: project.gallery,
        timeline: project.timeline,
        collaborators: project.collaborators
    };
    const { error } = await supabase.from('projects').upsert(payload);
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }
};

// Posts
export const PostService = {
  async fetchAll(): Promise<Post[]> {
    if (!isConfigured) return [];
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    return (data || []).map((p: any) => ({ 
        ...p, 
        readTime: p.read_time 
    }));
  },

  async upsert(post: Partial<Post>) {
    const payload = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        content: post.content,
        date: post.date,
        read_time: post.readTime,
        published: post.published
    };
    const { error } = await supabase.from('posts').upsert(payload);
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  }
};

// Tools
export const ToolService = {
  async fetchAll(): Promise<ToolItem[]> {
    if (!isConfigured) return [];
    const { data } = await supabase.from('tools').select('*').order('name', { ascending: true });
    return (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        iconName: t.icon_name,
        url: t.url
    }));
  },

  async upsert(tool: Partial<ToolItem>) {
      const payload = {
          id: tool.id,
          name: tool.name,
          category: tool.category,
          description: tool.description,
          icon_name: tool.iconName || 'Cpu', // Default icon if missing
          url: tool.url
      };
      const { error } = await supabase.from('tools').upsert(payload);
      if (error) throw error;
  },

  async delete(id: string) {
      const { error } = await supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
  }
};

// --- FALLBACK FETCHERS FOR APP (ReadOnly) ---
// These are used by the main App to fetch data
export const ContentService = {
  fetchProjects: ProjectService.fetchAll,
  fetchPosts: PostService.fetchAll,
  fetchTools: ToolService.fetchAll
};
