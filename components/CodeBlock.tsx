
import React, { useState, memo, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Check, Copy, AlertTriangle, XCircle, Info, 
  Lightbulb, AlertOctagon, FileCode, Terminal 
} from 'lucide-react';

interface CodeBlockProps {
  children: any;
  className?: string;
  node?: any;
  showLineNumbers?: boolean;
  highlightLines?: string;
  title?: string;
  wrapLines?: boolean;
}

// Semantic Capsule Configuration
const SEMANTIC_CONFIG = {
  error: {
    icon: <XCircle size={14} />,
    styles: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    label: "Error"
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    styles: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    label: "Warning"
  },
  info: {
    icon: <Info size={14} />,
    styles: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    label: "Info"
  },
  tip: {
    icon: <Lightbulb size={14} />,
    styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    label: "Tip"
  },
  success: {
    icon: <Check size={14} />,
    styles: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    label: "Success"
  },
  important: {
    icon: <AlertOctagon size={14} />,
    styles: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    label: "Important"
  }
};

// Language Aliases
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  txt: 'text',
  vue: 'html',
  rb: 'ruby',
  php: 'php',
  cpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  json: 'json'
};

const CodeBlock: React.FC<CodeBlockProps> = memo(({ 
  className, 
  children, 
  node,
  showLineNumbers: propShowLineNumbers,
  highlightLines,
  title: propTitle,
  wrapLines = false
}) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Parse Metadata from Markdown (e.g., ```js {1-3} title="test.js")
  const metaInfo = useMemo(() => {
    if (!node?.data?.meta) return {};
    const meta = node.data.meta;
    const result: Record<string, any> = {};
    
    // Regex to match: {range}, key=value, bare words, flags
    const parts = meta.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    
    parts.forEach((part: string) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        // Range: {1,3-5}
        result.highlightLines = part.slice(1, -1);
      } else if (part.includes('=')) {
        // Key-Value: title="foo.js"
        const [key, value] = part.split('=');
        result[key] = value.replace(/"/g, '');
      } else if (part === 'showLineNumbers') {
        // Flag
        result.showLineNumbers = true;
      } else {
        // Fallback: treat bare string as title if not set
        if (!result.title) result.title = part.replace(/"/g, '');
      }
    });
    
    return result;
  }, [node]);
  
  // Extract and normalize language
  const languageMatch = /language-(\w+)/.exec(className || '');
  const rawLanguage = languageMatch ? languageMatch[1].toLowerCase() : null;
  const language = (rawLanguage && LANGUAGE_ALIASES[rawLanguage]) || rawLanguage;
  
  // Clean Code
  const code = useMemo(() => String(children).replace(/\n$/, ''), [children]);
  
  // Detect Type
  const isMultiLine = useMemo(() => code.includes('\n'), [code]);
  const isInline = !language && !isMultiLine;
  
  // Merge Props
  const finalShowLineNumbers = propShowLineNumbers ?? metaInfo.showLineNumbers ?? false;
  const finalHighlightLines = highlightLines ?? metaInfo.highlightLines;
  const finalTitle = propTitle ?? metaInfo.title ?? null;
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [code]);
  
  // --- 1. Inline Code ---
  // Style: Subtle background, rounded, mono font. Matches Lumina's 'secondary' theme.
  if (isInline) {
    return (
      <code className="bg-secondary/50 text-secondary-foreground border border-border/50 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] align-middle">
        {children}
      </code>
    );
  }
  
  // --- 2. Semantic Capsules ---
  // Style: Pills that flow with text. Used for Error, Warning, etc.
  if (language && SEMANTIC_CONFIG[language as keyof typeof SEMANTIC_CONFIG]) {
    const config = SEMANTIC_CONFIG[language as keyof typeof SEMANTIC_CONFIG];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border ${config.styles} text-sm font-medium mx-1 my-0.5 shadow-sm select-none align-middle`}>
        <span className="shrink-0 opacity-80">{config.icon}</span>
        <span className="font-sans leading-tight pt-[1px]">
          {children}
        </span>
      </span>
    );
  }
  
  // --- 3. Standard Code Block ---
  // Style: VS Code Dark theme adaptation.
  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e] shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Mac-style dots */}
          <div className="flex gap-1.5 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          
          {/* Title or Language Label */}
          {finalTitle ? (
            <div className="flex items-center gap-2 text-zinc-400 text-xs border-l border-white/10 pl-3 ml-1">
              <FileCode size={12} />
              <span className="font-mono opacity-80">{finalTitle}</span>
            </div>
          ) : (
            language && (
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-wider pl-1 select-none">
                 {language === 'bash' ? <Terminal size={10} /> : <FileCode size={10} />}
                 {language}
              </div>
            )
          )}
        </div>
        
        {/* Actions */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-[10px] text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100"
          title="Copy Code"
        >
          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>
      
      {/* Code Content */}
      <div className="text-sm font-mono overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'text'}
          showLineNumbers={finalShowLineNumbers}
          wrapLines={wrapLines}
          lineProps={(lineNumber) => {
            const style: React.CSSProperties = {};
            // Highlight Logic
            if (finalHighlightLines) {
              const lines = finalHighlightLines.split(',').flatMap(range => {
                if (range.includes('-')) {
                  const [start, end] = range.split('-').map(Number);
                  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                }
                return [Number(range)];
              });
              
              if (lines.includes(lineNumber)) {
                style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                style.borderLeft = '2px solid #6366f1'; // Indigo-500
                style.display = 'block';
                style.paddingLeft = '1rem';
                style.marginLeft = '-1rem'; // Compensation for padding
              }
            }
            return { style };
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.85rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: { 
              fontFamily: 'JetBrains Mono, monospace',
              fontVariantLigatures: 'none'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
