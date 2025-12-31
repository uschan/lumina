import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2, Minimize2, Settings, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LuminaAI, ChatMessage } from '../services/ai';
import { Project, Post, ToolItem } from '../types';
import { Link } from 'react-router-dom';

interface AIChatWidgetProps {
  projects: Project[];
  posts: Post[];
  tools: ToolItem[];
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ projects, posts, tools }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. I am Lumina's digital twin. Accessing database... How can I assist you with the portfolio?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check configuration on mount and when opening
  useEffect(() => {
    setIsConfigured(LuminaAI.isConfigured());
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    if (!isConfigured) {
        setMessages(prev => [...prev, { role: 'model', text: "⚠️ Access Denied: API Key missing. Please configure the neural link in the Nexus console." }]);
        return;
    }

    const userMsg = input.trim();
    setInput('');
    
    // Add User Message
    const newHistory = [...messages, { role: 'user', text: userMsg } as ChatMessage];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      // Create a placeholder for the AI response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const stream = LuminaAI.chatStream(userMsg, messages, { projects, posts, tools });
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
           const last = prev[prev.length - 1];
           if (last.role === 'model') {
             return [...prev.slice(0, -1), { ...last, text: fullResponse }];
           } else {
             return [...prev, { role: 'model', text: fullResponse }];
           }
        });
        scrollToBottom();
      }
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: ':: SYSTEM ERROR :: Signal lost.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[90vw] sm:w-[380px] h-[500px] bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-indigo-500/10 bg-indigo-500/5">
               <div className="flex items-center gap-2">
                 <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} absolute -right-0.5 -top-0.5`} />
                    <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Lumina AI</span>
                    <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-wider">
                        {isConfigured ? 'Gemini 2.5 Active' : 'Offline Mode'}
                    </span>
                 </div>
               </div>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors"
               >
                 <Minimize2 size={16} />
               </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
               
               {!isConfigured && messages.length <= 1 && (
                   <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs leading-relaxed mb-4">
                       <div className="flex items-center gap-2 font-bold mb-2">
                           <AlertTriangle size={14} /> Configuration Required
                       </div>
                       <p className="mb-2">The AI Neural Link is currently disconnected. To enable the chatbot:</p>
                       <ol className="list-decimal list-inside space-y-1 opacity-80 mb-3">
                           <li>Go to the <Link to="/nexus" className="underline font-bold hover:text-foreground">Nexus Console</Link>.</li>
                           <li>Open the <strong>Config</strong> tab.</li>
                           <li>Enter your Gemini API Key.</li>
                           <li>(Optional) Set a Proxy URL if in a restricted region.</li>
                       </ol>
                   </div>
               )}

               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                       <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles size={12} className="text-indigo-500" />
                       </div>
                    )}
                    
                    <div className={`
                      max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-secondary/80 text-foreground rounded-tl-sm border border-border/50'
                      }
                    `}>
                       {msg.role === 'model' ? (
                         <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:p-2">
                           <ReactMarkdown>{msg.text || (isTyping && idx === messages.length -1 ? '...' : '')}</ReactMarkdown>
                         </div>
                       ) : (
                         msg.text
                       )}
                    </div>

                    {msg.role === 'user' && (
                       <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                          <User size={12} className="text-muted-foreground" />
                       </div>
                    )}
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-indigo-500/10 bg-indigo-500/5 flex gap-2">
               <input
                 className="flex-1 bg-white dark:bg-black/20 border border-indigo-500/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                 placeholder={isConfigured ? "Ask about projects..." : "System Offline"}
                 value={input}
                 disabled={!isConfigured}
                 onChange={(e) => setInput(e.target.value)}
               />
               <button 
                 type="submit"
                 disabled={!input.trim() || isTyping || !isConfigured}
                 className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
               >
                 {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
          ${isOpen 
            ? 'bg-red-500/10 text-red-500 border border-red-500/20 rotate-90' 
            : 'bg-indigo-600 text-white border border-indigo-400/50 hover:shadow-indigo-500/25'
          }
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Notification Dot */}
        {!isOpen && isConfigured && (
           <span className="absolute top-0 right-0 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background"></span>
           </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatWidget;