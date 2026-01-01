import React, { useState, useEffect } from 'react';
import { Project, CoreFeature } from '../types';
import { ContentService } from '../services/content';
import { X, Save, Plus, Database } from 'lucide-react';

const SectionHeader = ({ label }: { label: string }) => (
  <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 mt-4">{label}</h3>
);

const Nexus: React.FC = () => {
    // Admin simple auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    
    // Data state
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingItem, setEditingItem] = useState<Partial<Project> | null>(null);
    
    // Feature Form State
    const [newFeature, setNewFeature] = useState<Partial<CoreFeature>>({ title: '', description: '' });
    const [isAiDriven, setIsAiDriven] = useState(false);

    useEffect(() => {
        // Mock auth persistence
        if (sessionStorage.getItem('nexus_auth') === 'true') {
            setIsAuthenticated(true);
            loadData();
        }
    }, []);

    const loadData = async () => {
        const p = await ContentService.fetchProjects();
        setProjects(p);
    };

    const handleLogin = () => {
        if (password === 'lumina-admin') { // Hardcoded for demo/local
            setIsAuthenticated(true);
            sessionStorage.setItem('nexus_auth', 'true');
            loadData();
        } else {
            alert('Access Denied');
        }
    };

    const handleAddFeature = () => {
        if (!newFeature.title || !newFeature.description || !editingItem) return;
        const feature: CoreFeature = {
            title: newFeature.title!,
            description: newFeature.description!,
            aiModel: isAiDriven ? newFeature.aiModel : undefined
        };
        const currentFeatures = editingItem.features || [];
        setEditingItem({ ...editingItem, features: [...currentFeatures, feature] });
        setNewFeature({ title: '', description: '' });
        setIsAiDriven(false);
    };

    const removeItemFromList = (listName: 'features', index: number) => {
        if (!editingItem) return;
        const list = editingItem[listName] as any[] || [];
        const newList = [...list];
        newList.splice(index, 1);
        setEditingItem({ ...editingItem, [listName]: newList });
    };

    const handleSave = () => {
        console.log("Saving project...", editingItem);
        // In a real app, call ContentService.upsert(editingItem)
        alert('Saved to console (Read Only Demo)');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="flex flex-col gap-4 w-64">
                    <h1 className="text-2xl font-mono text-center mb-4">NEXUS LINK</h1>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 p-2 rounded text-center outline-none focus:border-indigo-500"
                        placeholder="Passkey"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin} className="bg-indigo-600 py-2 rounded font-bold hover:bg-indigo-500">
                        Connect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-zinc-300 font-mono text-sm p-4">
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h1 className="text-xl font-bold text-indigo-500 flex items-center gap-2">
                    <Database size={20} />
                    NEXUS CONTROL
                </h1>
                <button onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('nexus_auth'); }} className="text-xs hover:text-white">
                    Disconnect
                </button>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar List */}
                <div className="col-span-3 border-r border-white/10 pr-4 space-y-2">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs uppercase text-gray-500">Projects</span>
                        <button onClick={() => setEditingItem({})} className="p-1 hover:bg-white/10 rounded"><Plus size={14}/></button>
                    </div>
                    {projects.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => setEditingItem(p)}
                            className={`p-2 rounded cursor-pointer truncate ${editingItem?.id === p.id ? 'bg-indigo-900/30 text-indigo-400' : 'hover:bg-white/5'}`}
                        >
                            {p.title}
                        </div>
                    ))}
                </div>

                {/* Edit Area */}
                <div className="col-span-9">
                    {editingItem ? (
                        <div className="max-w-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg text-white">Editing: {editingItem.title || 'New Project'}</h2>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500">
                                    <Save size={14} /> Save
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                                    <input 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                        value={editingItem.title || ''}
                                        onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                                    <textarea 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white h-24 focus:border-indigo-500 outline-none"
                                        value={editingItem.description || ''}
                                        onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                                    />
                                </div>

                                {/* Features & Visual Identity */}
                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <SectionHeader label="Core Features" />
                                    <div className="space-y-2 mb-4">
                                        {(editingItem?.features || []).map((f: CoreFeature, idx: number) => (
                                            <div key={idx} className="flex items-start justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-200 flex items-center gap-2">
                                                        {f.title}
                                                        {f.aiModel && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">{f.aiModel}</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{f.description}</div>
                                                </div>
                                                <button onClick={() => removeItemFromList('features', idx)} className="text-red-500 hover:text-red-400"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs text-gray-500 mb-2">Add New Feature</div>
                                        <input className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Title" value={newFeature.title || ''} onChange={e => setNewFeature({...newFeature, title: e.target.value})} />
                                        <textarea className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white h-16 mt-2 focus:border-indigo-500 outline-none" placeholder="Desc" value={newFeature.description || ''} onChange={e => setNewFeature({...newFeature, description: e.target.value})} />
                                        
                                        <div className="flex items-center gap-3 pt-2">
                                            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none hover:text-white transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    className="accent-indigo-500 w-3 h-3 rounded-sm bg-white/10 border-white/20" 
                                                    checked={isAiDriven} 
                                                    onChange={e => setIsAiDriven(e.target.checked)} 
                                                />
                                                AI Driven
                                            </label>
                                            {isAiDriven && (
                                                 <input 
                                                    className="flex-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white transition-all placeholder:text-gray-600 focus:border-indigo-500 outline-none" 
                                                    placeholder="Model Name (e.g. Gemini 1.5 Pro)" 
                                                    value={newFeature.aiModel || ''} 
                                                    onChange={e => setNewFeature({...newFeature, aiModel: e.target.value})} 
                                                />
                                            )}
                                        </div>

                                        <button onClick={handleAddFeature} className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 py-1.5 rounded text-xs mt-2 hover:bg-indigo-600/30 transition-colors">+ Add Feature</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-600">
                            Select a project to edit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Nexus;