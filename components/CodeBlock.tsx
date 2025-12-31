
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, AlertTriangle, XCircle, Info, Lightbulb, AlertOctagon } from 'lucide-react';

interface CodeBlockProps {
  children: any;
  className?: string;
  node?: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children, node }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Extract language from className (e.g., "language-js" -> "js")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1].toLowerCase() : null;
  
  // Clean content
  const code = String(children).replace(/\n$/, '');
  
  // Heuristic: If no language is specified, check for newlines to decide between inline vs block
  const isMultiLine = code.includes('\n');
  const isInline = !language && !isMultiLine;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- 1. Inline Code (Default for backticks without language) ---
  if (isInline) {
    return (
      <code className="bg-secondary/50 text-secondary-foreground border border-border/50 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] align-middle">
        {children}
      </code>
    );
  }

  // --- 2. Semantic Inline Capsules (Error, Warning, etc.) ---
  // Designed to flow within text without breaking lines, unless wrapped in a block by the user.
  if (['error', 'warning', 'warn', 'info', 'note', 'tip', 'success', 'important'].includes(language || '')) {
    let icon = <Info size={14} />;
    let styles = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

    switch (language) {
      case 'error':
      case 'danger':
      case 'bug':
        icon = <XCircle size={14} />;
        styles = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
        break;
      case 'warning':
      case 'warn':
        icon = <AlertTriangle size={14} />;
        styles = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
        break;
      case 'tip':
      case 'success':
      case 'done':
        icon = <Lightbulb size={14} />;
        styles = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
        break;
      case 'important':
        icon = <AlertOctagon size={14} />;
        styles = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 align-middle px-3 py-0.5 rounded-full border ${styles} text-sm font-medium mx-1 my-0.5 shadow-sm select-none`}>
         <span className="shrink-0 opacity-80">{icon}</span>
         <span className="font-sans leading-tight pt-[1px]">{children}</span>
      </span>
    );
  }

  // --- 3. Standard Code Block (For explicit languages or multiline text) ---
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="flex gap-1.5 opacity-60">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
           </div>
           {language && (
             <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1 select-none">
               {language}
             </span>
           )}
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-[10px] text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100"
          title="Copy Code"
        >
          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Code Area */}
      <div className="text-sm font-mono overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'text'}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem', 
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
