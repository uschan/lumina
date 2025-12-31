# Lumina | AI 数字实验室

> "未来的界面即无界面。它是人类意图与机器智能之间的无缝对话。"

[![English](https://img.shields.io/badge/README-English-blue.svg)](./README.md)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)

## 🌌 项目概览

**Lumina** 是专为 AI 工程师和创意开发者设计的极具个性化的个人品牌网站与数字实验室。与传统的作品集不同，Lumina 被构建为一个渐进式 Web 应用 (PWA)，专注于探索“基于意图”的交互模式、沉浸式微动画以及充满未来感的“实验室”美学。

当前版本作为一个高保真的前端原型，模拟了 AI 交互流程，并展示了适合 AI 时代的先进 UI/UX 模式。

### ✨ 核心特性

*   **核心体验**
    *   **Bento Grid 布局**: 响应式、模块化的网格系统，用于优雅地展示项目和数据统计。
    *   **沉浸式设计**: 自定义光标物理效果、卡片 3D 倾斜视差、以及噪点纹理覆盖。
    *   **深色/浅色模式**: 丝滑的主题切换体验，支持状态持久化。
    *   **国际化 (i18n)**: 内置中英文双语支持，一键切换。

*   **进阶功能**
    *   **命令面板 (`Cmd+K`)**: 模拟 IDE/操作系统的键盘驱动导航系统，提升极客体验。
    *   **智能交互**: 博客文章支持“复制为 Markdown”功能，专门优化用于与 LLM 分享上下文。
    *   **可视化效果**: 模拟 AI 分析的打字机效果，以及环形阅读进度指示器。
    *   **互动与反馈**: 滚动触发动画与高灵敏度的微交互。

## 🛠️ 技术栈 (前端)

*   **框架**: React 18 (SPA 架构)
*   **语言**: TypeScript
*   **样式**: Tailwind CSS + Typography 插件
*   **动画 & 3D**: Framer Motion
*   **图标**: Lucide React
*   **路由**: React Router v6
*   **工具库**: React Helmet Async (SEO), React Markdown, React Syntax Highlighter

## 📁 项目结构

项目采用扁平化的根目录结构，便于维护。

```
lumina/
├── public/              # 静态资源 (Manifest, 图标)
├── components/          # 可复用 UI 组件 (BentoGrid, CommandMenu 等)
├── pages/               # 路由页面 (Home, Projects, Insights...)
├── services/            # 静态内容服务 (数据源)
├── types/               # TypeScript 类型定义
├── App.tsx              # 主入口 & 路由逻辑
├── index.tsx            # 入口点
├── index.html           # HTML 模板
├── constants.ts         # 配置与翻译字典
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/lumina-portfolio.git
    cd lumina-portfolio
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动开发服务器**
    ```bash
    npm start
    ```

4.  **构建生产版本**
    ```bash
    npm run build
    ```

## 🎨 定制指南

*   **内容管理**: 直接编辑 `services/content.ts` 以更新项目、文章和工具数据（TypeScript 类型安全）。
*   **多语言翻译**: 更新 `constants.ts` 中的字典。
*   **样式**: 全局样式位于 `index.html` 中的 `style` 标签内或通过 Tailwind 类名控制。

---

Designed & Engineered by **Lumina**.
*Observations on the intersection of design, engineering, and artificial intelligence.*