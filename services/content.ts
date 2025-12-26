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
    description: {
      en: 'A multimodal analysis dashboard powered by Google Gemini 1.5 Pro, featuring real-time video understanding.',
      zh: '基于 Google Gemini 1.5 Pro 的多模态分析仪表盘，支持实时视频理解与语义检索。',
    },
    challenge: {
        en: 'Processing real-time video streams and synchronizing LLM responses without inducing latency was the primary bottleneck. Traditional request/response cycles were too slow for a "live" feel.',
        zh: '处理实时视频流并同步 LLM 响应而不产生延迟是主要的瓶颈。传统的请求/响应周期对于“实时”体验来说太慢了。'
    },
    solution: {
        en: 'Implemented a WebSocket architecture combined with Gemini\'s streaming API. Video frames are sampled at 1fps and sent to the model, with differential updates pushed to the UI state.',
        zh: '实施了 WebSocket 架构并结合 Gemini 的流式 API。视频帧以 1fps 采样并发送到模型，差异更新被推送到 UI 状态。'
    },
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
    description: {
      en: 'An intelligent code refactoring tool that visualizes AST transformations and offers AI-suggested optimizations.',
      zh: '智能代码重构工具，可视化 AST 转换过程并提供 AI 驱动的优化建议。',
    },
    challenge: {
        en: 'Visualizing Abstract Syntax Trees (AST) in a way that is comprehensible to humans while maintaining the performance to handle large files.',
        zh: '以人类可理解的方式可视化抽象语法树 (AST)，同时保持处理大文件的性能。'
    },
    solution: {
        en: ' utilized React Flow for the node graph visualization and offloaded the AST parsing logic to a Web Worker to keep the main thread responsive.',
        zh: '使用 React Flow 进行节点图可视化，并将 AST 解析逻辑卸载到 Web Worker 以保持主线程响应。'
    },
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
    description: {
      en: 'Spatial audio generation platform for virtual environments.',
      zh: '用于虚拟环境的空间音频生成平台。',
    },
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
    description: {
      en: 'Browser-based 3D voxel editor with collaborative features.',
      zh: '基于浏览器的 3D 体素编辑器，支持多人协作。',
    },
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
    title: { en: 'The Future of AI UI', zh: 'AI 时代的 UI 设计未来' },
    excerpt: {
      en: 'How generative models are shifting interfaces from command-based to intent-based interactions.',
      zh: '生成式模型如何将界面交互从基于命令转变为基于意图。',
    },
    aiAnalysis: {
        en: 'Summary: This article explores the transition from GUI to NUI (Natural User Interfaces). Key takeaway: Latency reduction and Optimistic UI patterns are critical for perceived performance in AI apps.',
        zh: 'AI 摘要：本文探讨了从 GUI 到 NUI（自然用户界面）的转变。核心观点：降低延迟和乐观 UI 模式对于 AI 应用的感知性能至关重要。'
    },
    content: MARKDOWN_CONTENT_1,
    date: '2023-10-24',
    type: 'insight',
    readTime: '5 min',
  },
  {
    id: '2',
    title: { en: 'Mastering Tailwind Grid', zh: '精通 Tailwind Grid 布局' },
    excerpt: {
      en: 'A deep dive into creating complex bento grids with utility classes.',
      zh: '深入探讨如何使用原子类构建复杂的 Bento Grid 布局。',
    },
    aiAnalysis: {
        en: 'Summary: A technical guide on implementing Bento Grids using CSS Grid and Tailwind. Emphasizes hierarchy, density, and balance as key design principles.',
        zh: 'AI 摘要：关于使用 CSS Grid 和 Tailwind 实现 Bento Grid 的技术指南。强调层次结构、密度和平衡作为关键设计原则。'
    },
    content: MARKDOWN_CONTENT_2,
    date: '2023-11-02',
    type: 'insight',
    readTime: '8 min',
  },
  {
    id: '3',
    title: { en: 'Weekly Brief: LLM Optimization', zh: '周报：LLM 性能优化' },
    excerpt: {
      en: 'Key takeaways from the latest research papers on quantization.',
      zh: '关于量化技术的最新研究论文摘要。',
    },
    content: '## Summary\n\nQuantization is key.',
    date: '2023-11-15',
    type: 'brief',
    readTime: '2 min',
  },
];

// NOTE: We do NOT import icons here anymore to prevent circular dependency / load issues.
// Icons are mapped by name in App.tsx
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