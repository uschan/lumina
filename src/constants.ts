
import { Translation } from './types';

export const TRANSLATIONS: Record<string, Translation> = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      insights: 'Laboratory Log',
      tools: 'Workspace',
    },
    hero: {
      role: 'Creative Developer & AI Architect',
      greeting: 'Hello, I\'m Lumina.',
      description: 'Crafting intelligent interfaces and bridging the gap between human intuition and artificial intelligence. Obsessed with minimal aesthetics and high-performance engineering.',
      cta: 'View My Work',
    },
    common: {
      readMore: 'Read Analysis',
      viewProject: 'Initialize Module',
      techStack: 'Tech Stack',
      briefs: 'Daily Briefs',
    },
  },
  zh: {
    nav: {
      home: '首页',
      projects: '实验作品',
      insights: '实验日志',
      tools: '工作台',
    },
    hero: {
      role: '创意开发者 & AI 架构师',
      greeting: '你好，我是 Lumina。',
      description: '致力于打造智能交互界面，连接人类直觉与人工智能。沉迷于极简美学与高性能工程的极致融合。',
      cta: '查看作品',
    },
    common: {
      readMore: '阅读分析',
      viewProject: '启动模块',
      techStack: '技术栈',
      briefs: '简报',
    },
  },
};

// Giscus Configuration
// Updated with user provided values
export const GISCUS_CONFIG = {
  repo: "uschan/lumina",
  repoId: "R_kgDOQsz9Zw",
  category: "Announcements",
  categoryId: "DIC_kwDOQsz9Z84C0RA3"
};
