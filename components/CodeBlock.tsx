
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Terminal, AlertTriangle, XCircle, Info, Lightbulb, AlertOctagon } from 'lucide-react';

interface CodeBlockProps {
  children: any;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  // Normalize language to lowercase to handle 'Error', 'Warning' etc.
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

  // --- Admonition / Callout Renderer ---
  // Renders distinct alert boxes for error, warning, info, etc. instead of code blocks
  const renderAdmonition = (title: string, icon: React.ReactNode, colorClass: string, bgClass: string, borderClass: string) => (
    <div className={`my-6 rounded-xl border ${borderClass} ${bgClass} p-4 flex items-start gap-4 relative overflow-hidden transition-all hover:shadow-sm`}>
       <div className={`shrink-0 mt-0.5 ${colorClass}`}>
         {icon}
       </div>
       <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm mb-1 select-none ${colorClass}`}>{title}</div>
          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans opacity-90">
             {children}
          </div>
       </div>
    </div>
  );

  // Check language type for Admonitions
  switch (language) {
    case 'error':
    case 'danger':
    case 'bug':
      return renderAdmonition('Error', <XCircle size={20} />, 'text-red-500', 'bg-red-500/5 dark:bg-red-500/10', 'border-red-500/20');
    case 'warning':
    case 'warn':
      return renderAdmonition('Warning', <AlertTriangle size={20} />, 'text-amber-500', 'bg-amber-500/5 dark:bg-amber-500/10', 'border-amber-500/20');
    case 'info':
    case 'note':
      return renderAdmonition('Note', <Info size={20} />, 'text-blue-500', 'bg-blue-500/5 dark:bg-blue-500/10', 'border-blue-500/20');
    case 'tip':
    case 'success':
    case 'done':
      return renderAdmonition('Tip', <Lightbulb size={20} />, 'text-emerald-500', 'bg-emerald-500/5 dark:bg-emerald-500/10', 'border-emerald-500/20');
    case 'important':
      return renderAdmonition('Important', <AlertOctagon size={20} />, 'text-purple-500', 'bg-purple-500/5 dark:bg-purple-500/10', 'border-purple-500/20');
  }

  // --- Standard Code Block ---
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e] shadow-lg">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
           </div>
           {language !== 'text' && (
             <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1 opacity-60">
               {language}
             </span>
           )}
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-[10px] text-zinc-400 hover:text-white"
        >
          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{isCopied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      {/* Code Area - Reduced padding for better density */}
      <div className="text-sm font-mono overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem', // More compact padding
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.6',
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
