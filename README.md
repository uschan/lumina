# Lumina | AI Digital Laboratory

> "The interface of the future is no interface at all. It is a seamless conversation between human intent and machine intelligence."

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)

## 🌌 Project Overview

**Lumina** is a highly personalized personal brand website and digital laboratory designed for AI Engineers and Creative Developers. Unlike traditional portfolios, Lumina is built as a Progressive Web App (PWA) with a focus on "intent-based" interactions, immersive micro-animations, and a futuristic "Laboratory" aesthetic.

It serves as a high-fidelity frontend prototype, simulating AI interactions and demonstrating advanced UI/UX patterns suited for the AI era.

### ✨ Key Features

*   **Core Experience**
    *   **Bento Grid Layout**: A responsive, modular grid system for showcasing projects and stats.
    *   **Immersive Design**: Custom cursor physics, 3D tilt effects on cards, and noise texture overlays.
    *   **Dark/Light Mode**: Seamless theme transitions with persisted state.
    *   **Internationalization (i18n)**: Built-in support for English and Chinese (Simplified).

*   **Advanced Functionality**
    *   **Command Palette (`Cmd+K`)**: Keyboard-driven navigation system mimicking IDEs/Operating Systems.
    *   **Smart Interactions**: "Copy as Markdown" for blog posts, optimized for LLM sharing.
    *   **Visualizations**: Simulated typewriter effects for AI analysis and reading progress indicators.
    *   **Engagement**: Giscus (GitHub Discussions) integration, reaction systems, and scroll-triggered animations.

## 🛠️ Tech Stack (Frontend)

*   **Framework**: React 18 (SPA Architecture)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Typography Plugin
*   **Motion & 3D**: Framer Motion
*   **Icons**: Lucide React
*   **Routing**: React Router v6
*   **Utilities**: React Helmet Async (SEO), React Markdown, React Syntax Highlighter

## 📁 Project Structure

The project follows a flat, root-level structure for simplicity and ease of access.

```
lumina/
├── public/              # Static assets (Manifest, Icons)
├── components/          # Reusable UI components (BentoGrid, CommandMenu, etc.)
├── pages/               # Route views (Home, Projects, Insights...)
├── services/            # Static Content Service (Data Source)
├── types/               # TypeScript definitions
├── App.tsx              # Main Application Component & Routing
├── index.tsx            # Entry point
├── index.html           # HTML Template
├── constants.ts         # Configuration & Translations
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/lumina-portfolio.git
    cd lumina-portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎨 Customization Guide

*   **Content**: Edit `services/content.ts` to update projects, posts, and tools data directly in TypeScript.
*   **Translations**: Update dictionaries in `constants.ts`.
*   **Styling**: Global styles are located in the `style` tag within `index.html` or via Tailwind classes.

---

Designed & Engineered by **Lumina**.
*Observations on the intersection of design, engineering, and artificial intelligence.*