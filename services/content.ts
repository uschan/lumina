import { Project, Post, ToolItem } from '../types';

// MOCKING MDX CONTENT
const MARKDOWN_CONTENT_1 = `
## Introduction

The shift from command-based interfaces (CLI/GUI) to intent-based interfaces (LUI/NUI) is the most significant paradigm shift in computing since the mouse.

We are moving away from telling the computer *how* to do something, to telling it *what* we want.

## The Latency Challenge

One of the biggest hurdles in real-time AI interaction is latency. When we use LLMs for UI generation, every millisecond counts.

\`\`\`javascript
// Example of a streaming response handler
async function handleStream(stream) {
  for await (const chunk of stream) {
    updateUI(chunk); // Must be < 16ms to feel instant
  }
}
\`\`\`

## Design Patterns

1.  **Optimistic UI**: Predict what the AI will say.
2.  **Skeleton Screens**: But make them "alive".
3.  **Streaming Components**: React Server Components are perfect for this.

## Conclusion

The future is fluid.
`;

const MARKDOWN_CONTENT_2 = `
## Why Grid?

CSS Grid is powerful, but Tailwind makes it accessible.

\`\`\`css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
}
\`\`\`

## The Bento Box Methodology

Divide your content into logical rectangular regions. Not everything needs to be a list.

### Key Principles

*   **Hierarchy**: Size matters.
*   **Density**: Don't be afraid of whitespace.
*   **Balance**: Mix text and visuals.

## Implementation in React

Using Framer Motion with Grid allows for layout transitions.
`;

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Gemini Lens',
    description: 'A multimodal analysis dashboard powered by Google Gemini 1.5 Pro, featuring real-time video understanding.',
    challenge: 'Processing real-time video streams and synchronizing LLM responses without inducing latency was the primary bottleneck. Traditional request/response cycles were too slow for a "live" feel.',
    solution: 'Implemented a WebSocket architecture combined with Gemini\'s streaming API. Video frames are sampled at 1fps and sent to the model, with differential updates pushed to the UI state.',
    palette: ['#4F46E5', '#10B981', '#111827', '#F3F4F6'],
    tags: ['Next.js 15', 'Gemini 1.5 Pro', 'D3.js', 'Framer Motion'],
    image: 'https://picsum.photos/seed/gemini/800/600',
    links: {
      github: '#',
      demo: '#'
    },
    featured: true,
  },
  {
    id: '2',
    title: 'Code Morph',
    description: 'An intelligent code refactoring tool that visualizes AST transformations and offers AI-suggested optimizations.',
    challenge: 'Visualizing Abstract Syntax Trees (AST) in a way that is comprehensible to humans while maintaining the performance to handle large files.',
    solution: ' utilized React Flow for the node graph visualization and offloaded the AST parsing logic to a Web Worker to keep the main thread responsive.',
    palette: ['#F59E0B', '#3B82F6', '#1E293B', '#CBD5E1'],
    tags: ['TypeScript', 'AST', 'Tailwind v4', 'WebContainers'],
    image: 'https://picsum.photos/seed/code/800/601',
    links: {
      github: '#',
      demo: '#'
    },
    featured: true,
  },
  {
    id: '3',
    title: 'Aural Sync',
    description: 'Spatial audio generation platform for virtual environments.',
    palette: ['#EC4899', '#8B5CF6', '#18181B', '#E4E4E7'],
    tags: ['Web Audio API', 'Three.js', 'React Three Fiber'],
    image: 'https://picsum.photos/seed/audio/800/602',
    links: {
      demo: '#'
    },
    featured: true,
  },
  {
    id: '4',
    title: 'Voxel Editor',
    description: 'Browser-based 3D voxel editor with collaborative features.',
    palette: ['#EF4444', '#14B8A6', '#0F172A', '#F1F5F9'],
    tags: ['WebGL', 'Yjs', 'WebSockets'],
    image: 'https://picsum.photos/seed/voxel/800/603',
    links: {
      github: '#'
    },
    featured: false,
  },
];

export const POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of AI UI',
    excerpt: 'How generative models are shifting interfaces from command-based to intent-based interactions.',
    aiAnalysis: 'Summary: This article explores the transition from GUI to NUI (Natural User Interfaces). Key takeaway: Latency reduction and Optimistic UI patterns are critical for perceived performance in AI apps.',
    content: MARKDOWN_CONTENT_1,
    date: '2023-10-24',
    type: 'insight',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'Mastering Tailwind Grid',
    excerpt: 'A deep dive into creating complex bento grids with utility classes.',
    aiAnalysis: 'Summary: A technical guide on implementing Bento Grids using CSS Grid and Tailwind. Emphasizes hierarchy, density, and balance as key design principles.',
    content: MARKDOWN_CONTENT_2,
    date: '2023-11-02',
    type: 'insight',
    readTime: '8 min',
  },
  {
    id: '3',
    title: 'Weekly Brief: LLM Optimization',
    excerpt: 'Key takeaways from the latest research papers on quantization.',
    content: '## Summary\n\nQuantization is key.',
    date: '2023-11-15',
    type: 'brief',
    readTime: '2 min',
  },
];

export const TOOLS: ToolItem[] = [
  // AI & Models
  { name: 'Gemini 3 Pro', category: 'AI Model', description: 'Advanced Reasoning' },
  { name: 'ChatGPT', category: 'AI Assistant', description: 'GPT-4o' },
  { name: 'Claude', category: 'AI Assistant', description: '3.5 Sonnet' },
  { name: 'Midjourney', category: 'AI Art', description: 'Image Gen' },

  // Development Environment (IDEs)
  { name: 'VS Code', category: 'IDE', description: 'Code Editor' },
  { name: 'Cursor', category: 'IDE', description: 'AI Code Editor' },
  { name: 'PuTTY', category: 'Terminal', description: 'SSH Client' },
  { name: 'Docker', category: 'DevOps', description: 'Containerization' },

  // Core Tech
  { name: 'React 19', category: 'Frontend', description: 'Library' },
  { name: 'TypeScript', category: 'Language', description: 'Type safety' },
  { name: 'Tailwind CSS', category: 'Styling', description: 'Utility-first' },
  { name: 'Next.js 15', category: 'Framework', description: 'App Router' },
  
  // Design & Others
  { name: 'Figma', category: 'Design', description: 'Prototyping' },
  { name: 'Framer', category: 'Design', description: 'Interactive' },
  { name: 'Supabase', category: 'Backend', description: 'Database' },
  { name: 'Vercel', category: 'Deployment', description: 'Hosting' },
];

export const ContentService = {
  getProjects: () => PROJECTS,
  getProjectById: (id: string) => PROJECTS.find(p => p.id === id),
  getPosts: () => POSTS,
  getPostById: (id: string) => POSTS.find(p => p.id === id),
  getTools: () => TOOLS,
};