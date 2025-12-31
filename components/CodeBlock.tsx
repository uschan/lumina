
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, AlertTriangle, XCircle, Info, Lightbulb, AlertOctagon } from 'lucide-react';

interface CodeBlockProps {
  children: any;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  // Normalize language to lowercase
  const language = match ? match[1].toLowerCase() : 'text';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    );
  }

  // --- Semantic Capsule Renderer ---
  // Renders a compact, capsule-shaped badge for specific tags (error, warning, etc.)
  // reducing visual noise compared to full code blocks.
  const renderCapsule = (icon: React.ReactNode, bgClass: string, textClass: string, borderClass: string) => (
    <div className={`my-3 w-fit max-w-full flex items-center gap-2.5 px-4 py-2 rounded-full border ${bgClass} ${borderClass} ${textClass} shadow-sm`}>
       <div className="shrink-0">{icon}</div>
       <span className="text-sm font-medium leading-none whitespace-pre-wrap font-sans">{code}</span>
    </div>
  );

  // Check language type for Semantic Capsules
  switch (language) {
    case 'error':
    case 'danger':
    case 'bug':
      return renderCapsule(<XCircle size={16} />, 'bg-red-500/10', 'text-red-600 dark:text-red-400', 'border-red-500/20');
    case 'warning':
    case 'warn':
      return renderCapsule(<AlertTriangle size={16} />, 'bg-amber-500/10', 'text-amber-600 dark:text-amber-400', 'border-amber-500/20');
    case 'info':
    case 'note':
      return renderCapsule(<Info size={16} />, 'bg-blue-500/10', 'text-blue-600 dark:text-blue-400', 'border-blue-500/20');
    case 'tip':
    case 'success':
    case 'done':
      return renderCapsule(<Lightbulb size={16} />, 'bg-emerald-500/10', 'text-emerald-600 dark:text-emerald-400', 'border-emerald-500/20');
    case 'important':
      return renderCapsule(<AlertOctagon size={16} />, 'bg-purple-500/10', 'text-purple-600 dark:text-purple-400', 'border-purple-500/20');
  }

  // --- Standard Code Block ---
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e] shadow-lg">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="flex gap-1.5 opacity-60">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
           </div>
           {language !== 'text' && (
             <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1 select-none">
               {language}
             </span>
           )}
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-[10px] text-zinc-400 hover:text-white"
          title="Copy Code"
        >
          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Code Area */}
      <div className="text-sm font-mono overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '0.75rem 1rem', 
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: { fontFamily: 'JetBrains Mono, monospace' }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
