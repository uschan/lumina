import React, { useState } from 'react';
import { supabase, checkConnection } from '../services/supabase';
import { PROJECTS, POSTS, TOOLS } from '../services/content';
import { Database, Upload, Check, AlertTriangle, ShieldCheck, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const Nexus: React.FC = () => {
  const [status, setStatus] = useState<string>('idle');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleTestConnection = async () => {
    setStatus('checking');
    addLog('Initiating handshake with Supabase...');
    const result = await checkConnection();
    if (result.success) {
        addLog(`Connection Verified. Access to projects table confirmed.`);
        setStatus('connected');
    } else {
        addLog(`Connection Failed: ${(result.error as any)?.message}`);
        setStatus('error');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("This will upload local content to Supabase. Continue?")) return;
    
    setStatus('seeding');
    addLog('Starting seeding protocol...');

    try {
        // Seed Projects
        addLog(`Uploading ${PROJECTS.length} projects...`);
        
        // STRICT MAPPING: Explicitly select only fields that exist in the DB Schema.
        // This prevents "Could not find column 'challenge'" errors if local objects have extra properties.
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
        
        const { error: projError } = await supabase.from('projects').insert(projectsPayload);
        if (projError) throw projError;
        addLog('Projects uploaded successfully.');

        // Seed Posts
        addLog(`Uploading ${POSTS.length} posts...`);
        
        // STRICT MAPPING for Posts
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

        const { error: postError } = await supabase.from('posts').insert(postsPayload);
        if (postError) throw postError;
        addLog('Posts uploaded successfully.');

        // Seed Tools
        addLog(`Uploading ${TOOLS.length} tools...`);
        const toolsPayload = TOOLS.map((t) => ({
            name: t.name,
            category: t.category,
            description: t.description,
            icon_name: t.name 
        }));
        const { error: toolError } = await supabase.from('tools').insert(toolsPayload);
        if (toolError) throw toolError;
        addLog('Tools uploaded successfully.');

        setStatus('success');
        addLog('Database seeding complete. System ready.');

    } catch (e: any) {
        addLog(`Seeding Error: ${e.message}`);
        setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white">
      <div className="max-w-3xl mx-auto border border-green-500/30 rounded-lg p-6 bg-black/50 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <div className="flex items-center justify-between mb-8 border-b border-green-500/30 pb-4">
            <div className="flex items-center gap-3">
                <ShieldCheck size={24} />
                <h1 className="text-xl font-bold tracking-widest">NEXUS CONTROL</h1>
            </div>
            <div className="text-xs opacity-50">V.0.1.0-ALPHA</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 border border-green-500/20 rounded bg-green-500/5">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase">
                    <Server size={16} /> Connection Status
                </h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${status === 'connected' || status === 'success' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span className="text-sm opacity-80 uppercase">{status}</span>
                </div>
                <button 
                    onClick={handleTestConnection}
                    className="w-full py-2 border border-green-500/50 hover:bg-green-500/20 transition-colors text-xs uppercase tracking-wider rounded"
                >
                    Test Uplink
                </button>
            </div>

            <div className="p-4 border border-green-500/20 rounded bg-green-500/5">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase">
                    <Database size={16} /> Data Migration
                </h3>
                <p className="text-xs opacity-60 mb-4 leading-relaxed">
                    Transfer local static content objects (TypeScript) to Supabase PostgreSQL vectors.
                </p>
                <button 
                    onClick={handleSeed}
                    disabled={status !== 'connected'}
                    className={`w-full py-2 flex items-center justify-center gap-2 border transition-colors text-xs uppercase tracking-wider rounded ${
                        status === 'connected' 
                        ? 'border-green-500/50 hover:bg-green-500/20 cursor-pointer' 
                        : 'border-gray-800 text-gray-700 cursor-not-allowed'
                    }`}
                >
                    <Upload size={14} /> Seed Database
                </button>
            </div>
        </div>

        {/* Terminal Output */}
        <div className="bg-black border border-green-500/20 rounded p-4 h-64 overflow-y-auto font-mono text-xs">
            {log.length === 0 && <span className="opacity-30">Waiting for commands...</span>}
            {log.map((l, i) => (
                <div key={i} className="mb-1 border-b border-green-900/20 pb-1 last:border-0">
                    <span className="opacity-50 mr-2">{`>`}</span>
                    {l}
                </div>
            ))}
            {status === 'seeding' && (
                <div className="animate-pulse mt-2">_ Processing...</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Nexus;