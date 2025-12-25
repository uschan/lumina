import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentData, Project, Post, ToolItem } from '../types';

interface ContentContextType {
  projects: Project[];
  posts: Post[];
  tools: ToolItem[];
  loading: boolean;
  error: string | null;
  getProjectBySlug: (slug: string) => Project | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ContentData>({ projects: [], posts: [], tools: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/content.json');
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Content loading error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getProjectBySlug = (slug: string) => data.projects.find(p => p.slug === slug);
  const getPostBySlug = (slug: string) => data.posts.find(p => p.slug === slug);

  return (
    <ContentContext.Provider 
      value={{ 
        projects: data.projects, 
        posts: data.posts, 
        tools: data.tools, 
        loading, 
        error,
        getProjectBySlug,
        getPostBySlug
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};