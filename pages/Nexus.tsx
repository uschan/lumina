import React, { useState, useEffect } from 'react';
import { supabase, checkConnection } from '../services/supabase';
import { PROJECTS, POSTS, TOOLS } from '../services/content';
import { STORAGE_KEY_API, STORAGE_KEY_URL } from '../services/ai';
import { 
  Database, Upload, ShieldCheck, Server, Lock, Settings, 
  LayoutList, Save, Key, Globe, RefreshCw, Terminal, Eye, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'content' | 'settings';

const Nexus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [status, setStatus] = useState<string>('idle');
  const [log, setLog] = useState<string[]>([]);
  
  // Settings State
  const [apiKey, setApiKey] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  
  // Data View State
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    // Load settings from storage
    setApiKey(localStorage.getItem(STORAGE_KEY_API) || '');
    setProxyUrl(localStorage.getItem(STORAGE_KEY_URL) || '');
  }, []);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
      const prefix = type === 'error' ? '[ERR]' : type === 'success' ? '[OK]' : '[INFO]';
      setLog(prev => [`${prefix} [${new Date().toLocaleTimeString()}] ${msg}`, ...prev]); // Newest first
  };

  const handleTestConnection = async () => {
    setStatus('checking');
    addLog('Initiating handshake with Supabase...');
    const result = await checkConnection();
    if (result.success) {
        addLog(`Connection Verified. Access to projects table confirmed. Count: ${result.count}`, 'success');
        setStatus('connected');
        fetchDataPreview();
    } else {
        addLog(`Connection Failed: ${(result.error as any)?.message}`, 'error');
        setStatus('error');
    }
  };

  const fetchDataPreview = async () => {
    setViewLoading(true);
    try {
        const { data: pData } = await supabase.from('projects').select('id, title, slug, published:featured');
        const { data: bData } = await supabase.from('posts').select('id, title, category, date');
        setDbProjects(pData || []);
        setDbPosts(bData || []);
    } catch (e) {
        console.error(e);
    } finally {
        setViewLoading(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_API, apiKey);
    localStorage.setItem(STORAGE_KEY_URL, proxyUrl);
    addLog('System Configuration Saved. AI Module updated.', 'success');
    alert('Settings Saved');
  };

  const handleSeed = async () => {
    if (!window.confirm("This will overwrite/append local content to Supabase. Continue?")) return;
    
    setStatus('seeding');
    addLog('Starting seeding protocol...');

    try {
        // --- SEED PROJECTS ---
        addLog(`Uploading ${PROJECTS.length} projects...`);
        const projectsPayload = PROJECTS.map((p) => ({
                slug: p.slug,
                title: p.title,
                description: p.description,
                content: p.content || '',
                palette: p.palette || [],
                tags: p.tags,
                image: p.image,
                links: p.links,
                featured: p.featured || false,
                publish_date: p.publishDate
        }));
        
        // Use upsert to prevent duplicates on slug if constraint exists, or just insert
        const { error: projError } = await supabase.from('projects').upsert(projectsPayload, { onConflict: 'slug' });
        if (projError) throw projError;
        addLog('Projects synced.', 'success');

        // --- SEED POSTS ---
        addLog(`Uploading ${POSTS.length} posts...`);
        const postsPayload = POSTS.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            tags: p.tags,
            ai_analysis: p.aiAnalysis,
            content: p.content,
            date: p.date,
            type: p.type,
            read_time: p.readTime,
            published: p.published || true
        }));
        const { error: postError } = await supabase.from('posts').upsert(postsPayload, { onConflict: 'slug' });
        if (postError) throw postError;
        addLog('Posts synced.', 'success');

        // --- SEED TOOLS ---
        addLog(`Uploading ${TOOLS.length} tools...`);
        // Tools don't have unique slug usually, so we might duplicate if we just insert. 
        // For this demo, we'll try to insert.
        const toolsPayload = TOOLS.map((t) => ({
            name: t.name,
            category: t.category,
            description: t.description,
            icon_name: t.name 
        }));
        const { error: toolError } = await supabase.from('tools').insert(toolsPayload);
        if (toolError) {
             // Ignore tool duplicates error for now or handle gracefully
             addLog(`Tool sync note: ${toolError.message}`, 'info');
        } else {
             addLog('Tools synced.', 'success');
        }

        setStatus('success');
        addLog('Database seeding complete.', 'success');
        fetchDataPreview();

    } catch (e: any) {
        if (e.code === '42501') {
             addLog(`PERMISSION DENIED (42501): Row Level Security Policy Violation.`, 'error');
             addLog(`Run policies in Supabase SQL Editor.`, 'error');
        } else {
             addLog(`Seeding Error: ${e.message}`, 'error');
        }
        setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 bg-[#050505] text-green-500 font-mono selection:bg-green-900 selection:text-white pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-green-500/30 pb-6 gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <ShieldCheck size={28} />
                    <h1 className="text-2xl font-bold tracking-widest">NEXUS CONTROL</h1>
                </div>
                <div className="text-xs opacity-50 pl-10">SYSTEM ADMINISTRATION INTERFACE V.2.1</div>
            </div>
            
            <div className="flex gap-2">
                <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Terminal size={16} />} label="Console" />
                <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<LayoutList size={16} />} label="Data View" />
                <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={16} />} label="Config" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Main Interaction Area */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Settings size={20} /> System Configuration
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider opacity-70 mb-2 flex items-center gap-2">
                                    <Key size={14} /> Gemini API Key
                                </label>
                                <input 
                                    type="password" 
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your Google Gemini API Key"
                                    className="w-full bg-black border border-green-500/30 rounded px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-green-900"
                                />
                                <p className="text-[10px] mt-2 opacity-50">Key is stored locally in your browser (LocalStorage). It is never sent to our servers.</p>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider opacity-70 mb-2 flex items-center gap-2">
                                    <Globe size={14} /> Custom API Base URL (Proxy)
                                </label>
                                <input 
                                    type="text" 
                                    value={proxyUrl}
                                    onChange={(e) => setProxyUrl(e.target.value)}
                                    placeholder="e.g., https://openai-proxy.com/v1"
                                    className="w-full bg-black border border-green-500/30 rounded px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-green-900"
                                />
                                <p className="text-[10px] mt-2 opacity-50 text-yellow-500/80">
                                    <AlertCircle size={10} className="inline mr-1"/>
                                    Required for users in restricted regions (CN). Leave empty to use default Google endpoint.
                                </p>
                            </div>

                            <button 
                                onClick={handleSaveSettings}
                                className="flex items-center gap-2 bg-green-900/20 hover:bg-green-500/20 border border-green-500/50 text-green-500 px-6 py-2 rounded text-sm uppercase tracking-wider transition-all"
                            >
                                <Save size={16} /> Save Configuration
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Status Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-green-500/20 rounded bg-green-500/5">
                                <h3 className="flex items-center gap-2 font-bold mb-2 text-xs uppercase opacity-70">
                                    <Server size={14} /> Database Uplink
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${status === 'connected' || status === 'success' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                                    <span className="text-xl font-bold">{status === 'connected' || status === 'success' ? 'ACTIVE' : 'OFFLINE'}</span>
                                </div>
                            </div>
                            <div className="p-4 border border-green-500/20 rounded bg-green-500/5">
                                <h3 className="flex items-center gap-2 font-bold mb-2 text-xs uppercase opacity-70">
                                    <Database size={14} /> Local Records
                                </h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <span>Projects: {PROJECTS.length}</span>
                                    <span>Posts: {POSTS.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border border-green-500/30 rounded bg-black/40 backdrop-blur-sm">
                            <h3 className="flex items-center gap-2 font-bold mb-6 text-sm uppercase">
                                <RefreshCw size={16} /> Sync Operations
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleTestConnection}
                                    className="flex-1 py-3 border border-green-500/50 hover:bg-green-500/10 transition-colors text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2"
                                >
                                    Test Connection
                                </button>
                                <button 
                                    onClick={handleSeed}
                                    disabled={status !== 'connected' && status !== 'success'}
                                    className={`flex-1 py-3 border transition-colors text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 ${
                                        status === 'connected' || status === 'success'
                                        ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20 text-white cursor-pointer' 
                                        : 'border-gray-800 text-gray-700 cursor-not-allowed'
                                    }`}
                                >
                                    <Upload size={14} /> Push to Supabase
                                </button>
                            </div>
                            <p className="text-[10px] mt-4 opacity-50 text-center">
                                * Pushing will upsert (update/insert) local data to the connected Supabase instance.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Database size={20} /> Remote Data Preview
                            </h2>
                            <button onClick={fetchDataPreview} className="p-2 hover:bg-green-500/20 rounded"><RefreshCw size={14}/></button>
                         </div>

                         {viewLoading ? (
                             <div className="py-12 text-center opacity-50 animate-pulse">Scanning database vectors...</div>
                         ) : (
                             <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase opacity-70 mb-3 border-b border-green-500/20 pb-1">Projects Table ({dbProjects.length})</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="text-green-700">
                                                    <th className="py-2">ID</th>
                                                    <th className="py-2">Title</th>
                                                    <th className="py-2">Slug</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dbProjects.map(p => (
                                                    <tr key={p.id} className="border-b border-green-900/20 hover:bg-green-500/5">
                                                        <td className="py-2 opacity-50 font-mono">{p.id.substring(0,8)}...</td>
                                                        <td className="py-2 font-bold">{p.title}</td>
                                                        <td className="py-2 opacity-70">{p.slug}</td>
                                                    </tr>
                                                ))}
                                                {dbProjects.length === 0 && <tr><td colSpan={3} className="py-4 text-center opacity-30">No data found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs uppercase opacity-70 mb-3 border-b border-green-500/20 pb-1">Posts Table ({dbPosts.length})</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="text-green-700">
                                                    <th className="py-2">Title</th>
                                                    <th className="py-2">Category</th>
                                                    <th className="py-2">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dbPosts.map(p => (
                                                    <tr key={p.id} className="border-b border-green-900/20 hover:bg-green-500/5">
                                                        <td className="py-2 font-bold">{p.title}</td>
                                                        <td className="py-2 opacity-70">{p.category}</td>
                                                        <td className="py-2 opacity-50">{p.date}</td>
                                                    </tr>
                                                ))}
                                                {dbPosts.length === 0 && <tr><td colSpan={3} className="py-4 text-center opacity-30">No data found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                             </div>
                         )}
                    </motion.div>
                )}
            </div>

            {/* RIGHT COLUMN: Terminal Log (Always Visible) */}
            <div className="lg:col-span-1">
                <div className="bg-black border border-green-500/30 rounded-lg p-4 h-[500px] flex flex-col sticky top-24">
                    <div className="flex items-center justify-between mb-4 border-b border-green-900/30 pb-2">
                        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={12} /> System Log
                        </span>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-thin scrollbar-thumb-green-900">
                        {log.length === 0 && <span className="opacity-30">System idle. Waiting for input...</span>}
                        {log.map((l, i) => (
                            <div key={i} className={`break-words leading-tight pb-1 border-b border-green-900/10 ${l.includes('[ERR]') ? 'text-red-400' : l.includes('[OK]') ? 'text-green-400' : 'text-green-600'}`}>
                                <span className="opacity-30 mr-1">{`>`}</span>
                                {l}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded text-xs uppercase tracking-wider transition-all ${
            active 
            ? 'bg-green-500 text-black font-bold shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
            : 'border border-green-500/30 text-green-500 hover:bg-green-500/10'
        }`}
    >
        {icon} <span className="hidden sm:inline">{label}</span>
    </button>
);

export default Nexus;