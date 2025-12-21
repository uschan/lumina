import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  children: any;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
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

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-zinc-700/50 bg-[#1e1e1e] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
           </div>
           <span className="ml-2 text-xs text-zinc-400 font-mono flex items-center gap-1">
             <Terminal size={10} />
             {language}
           </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-xs text-zinc-400 hover:text-white"
        >
          {isCopied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          <span>{isCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="text-sm font-mono overflow-x-auto">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: { fontFamily: 'inherit' }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;