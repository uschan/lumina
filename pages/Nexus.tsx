
import React, { useState, useEffect } from 'react';
import { ProjectService, PostService, ToolService } from '../services/content';
import { Project, Post, ToolItem, CoreFeature, TimelineEvent, Collaborator } from '../types';
import { 
  ShieldCheck, Lock, LayoutDashboard, FileText, Cpu,
  Plus, Trash2, Edit3, RefreshCw, X, LogOut, Check, Sparkles, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ADMIN PIN CONFIG
const ADMIN_PIN = "2077"; 

type TabType = 'projects' | 'posts' | 'tools';

const Nexus: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<TabType>('projects');

  // Temp state for Features
  const [newFeature, setNewFeature] = useState<CoreFeature>({ title: '', description: '', aiModel: '' });
  const [isAiDriven, setIsAiDriven] = useState(false);

  // Temp state for Timeline
  const [newTimeline, setNewTimeline] = useState<TimelineEvent>({ date: '', title: '', description: '' });

  // Temp state for Collaborators
  const [newCollaborator, setNewCollaborator] = useState<Collaborator>({ name: '', role: '', avatar: '' });

  useEffect(() => {
    // Check session
    if (sessionStorage.getItem('nexus_auth') === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('nexus_auth', 'true');
      loadData();
    } else {
      setAuthError(true);
      setPinInput("");
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('nexus_auth');
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, b, t] = await Promise.all([
          ProjectService.fetchAll(),
          PostService.fetchAll(),
          ToolService.fetchAll()
      ]);
      setProjects(p);
      setPosts(b);
      setTools(t);
    } catch (e) {
      console.error(e);
      alert("Failed to load data. Check database connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditor = (type: TabType, item?: any) => {
    setEditType(type);
    
    // Reset temp states
    setNewFeature({ title: '', description: '', aiModel: '' });
    setIsAiDriven(false);
    setNewTimeline({ date: '', title: '', description: '' });
    setNewCollaborator({ name: '', role: '', avatar: '' });

    if (item) {
        // Deep copy
        setEditingItem(JSON.parse(JSON.stringify(item)));
    } else {
        if (type === 'projects') {
            setEditingItem({ 
                tags: [], 
                links: {}, 
                featured: false, 
                features: [], 
                visualIdentity: { colors: [], layout: '', typography: '', iconography: '', animation: '' },
                gallery: [],
                timeline: [],
                collaborators: []
            });
        }
        if (type === 'posts') setEditingItem({ tags: [], published: true });
        if (type === 'tools') setEditingItem({ iconName: 'Cpu' });
    }
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
      if (!newFeature.title) return;
      const featureToAdd = { ...newFeature };
      if (!isAiDriven) delete featureToAdd.aiModel;
      const currentFeatures = editingItem.features || [];
      setEditingItem({ ...editingItem, features: [...currentFeatures, featureToAdd] });
      setNewFeature({ title: '', description: '', aiModel: '' });
      setIsAiDriven(false);
  };

  const handleAddTimeline = () => {
      if (!newTimeline.date || !newTimeline.title) return;
      const currentTimeline = editingItem.timeline || [];
      setEditingItem({ ...editingItem, timeline: [...currentTimeline, newTimeline] });
      setNewTimeline({ date: '', title: '', description: '' });
  };

  const handleAddCollaborator = () => {
      if (!newCollaborator.name) return;
      const currentCollabs = editingItem.collaborators || [];
      setEditingItem({ ...editingItem, collaborators: [...currentCollabs, newCollaborator] });
      setNewCollaborator({ name: '', role: '', avatar: '' });
  };

  const removeItemFromList = (key: string, idx: number) => {
      const list = [...(editingItem[key] || [])];
      list.splice(idx, 1);
      setEditingItem({ ...editingItem, [key]: list });
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    setIsLoading(true);
    try {
        if (editType === 'projects') {
            await ProjectService.upsert({
                ...editingItem,
                tags: typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map((t:string)=>t.trim()) : editingItem.tags,
                gallery: typeof editingItem.gallery === 'string' ? editingItem.gallery.split(',').map((u:string)=>u.trim()) : editingItem.gallery,
                visualIdentity: {
                    ...editingItem.visualIdentity,
                    colors: typeof editingItem.visualIdentity?.colors === 'string' 
                        ? editingItem.visualIdentity.colors.split(',').map((c: string) => c.trim())
                        : editingItem.visualIdentity?.colors || []
                }
            });
        } else if (editType === 'posts') {
            await PostService.upsert({
                ...editingItem,
                tags: typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map((t:string)=>t.trim()) : editingItem.tags
            });
        } else if (editType === 'tools') {
            await ToolService.upsert(editingItem);
        }
        await loadData();
        setIsModalOpen(false);
    } catch (e: any) {
        alert(`Error saving item: ${e.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined, type: TabType) => {
      if (!id) return;
      if(!window.confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
      
      setIsLoading(true);
      try {
          if (type === 'projects') await ProjectService.delete(id);
          else if (type === 'posts') await PostService.delete(id);
          else if (type === 'tools') await ToolService.delete(id);
          await loadData();
      } catch(e: any) { 
          alert(`Error deleting: ${e.message}`);
      } finally { 
          setIsLoading(false); 
      }
  };

  // --- RENDER LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white font-mono">
         <div className={`w-full max-w-sm p-8 border rounded-2xl bg-white/5 backdrop-blur-xl transition-colors duration-300 ${authError ? 'border-red-500/50' : 'border-white/10'}`}>
            <div className="flex justify-center mb-8">
                <div className={`p-4 rounded-full bg-white/5 ${authError ? 'text-red-500' : 'text-indigo-500'}`}>
                    <Lock size={32} />
                </div>
            </div>
            <h1 className="text-center text-xl font-bold tracking-[0.2em] mb-8 text-gray-300">NEXUS GATEWAY</h1>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <input 
                      type="password" 
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value)}
                      placeholder="ACCESS PIN"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-700 text-white"
                      autoFocus
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold tracking-wider transition-all">
                    AUTHENTICATE
                </button>
            </form>
         </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 font-sans">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
         <div className="flex items-center gap-3">
             <ShieldCheck className="text-indigo-500" />
             <span className="font-bold tracking-tight">NEXUS <span className="text-gray-600 font-normal">v2.1</span></span>
             {isLoading && <RefreshCw className="animate-spin text-gray-500 ml-2" size={14} />}
         </div>
         <button onClick={handleLogout} className="text-xs font-mono text-gray-500 hover:text-white flex items-center gap-2">
             LOGOUT <LogOut size={12} />
         </button>
      </div>

      <div className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
         
         {/* Navigation Tabs */}
         <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-1">
             <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<LayoutDashboard size={16}/>} label="Projects" />
             <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<FileText size={16}/>} label="Posts" />
             <TabButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={<Cpu size={16}/>} label="Tools" />
         </div>

         {/* LIST VIEWS */}
         {activeTab === 'projects' && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-300">Projects ({projects.length})</h2>
                    <AddButton onClick={() => openEditor('projects')} label="New Project" />
                 </div>
                 <div className="grid gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-10 bg-gray-800 rounded overflow-hidden">
                                    <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-200">{p.title}</div>
                                    <div className="text-xs text-gray-500 font-mono flex gap-2">
                                        <span>/{p.slug}</span>
                                        {p.featured && <span className="text-indigo-400">★ Featured</span>}
                                    </div>
                                </div>
                            </div>
                            <ActionButtons onEdit={() => openEditor('projects', p)} onDelete={() => handleDelete(p.id, 'projects')} />
                        </div>
                    ))}
                 </div>
             </div>
         )}
         {/* ... (Posts and Tools Views - unchanged mainly, keeping short for brevity) */}
         {activeTab === 'posts' && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-300">Blog Posts ({posts.length})</h2>
                    <AddButton onClick={() => openEditor('posts')} label="New Post" />
                 </div>
                 <div className="grid gap-4">
                    {posts.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all">
                            <div>
                                <div className="font-bold text-sm text-gray-200">{p.title}</div>
                                <div className="text-xs text-gray-500">{p.date}</div>
                            </div>
                            <ActionButtons onEdit={() => openEditor('posts', p)} onDelete={() => handleDelete(p.id, 'posts')} />
                        </div>
                    ))}
                 </div>
             </div>
         )}
         {activeTab === 'tools' && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-300">Workspace Tools ({tools.length})</h2>
                    <AddButton onClick={() => openEditor('tools')} label="New Tool" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {tools.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                            <div className="font-bold text-sm text-gray-200">{t.name}</div>
                            <ActionButtons onEdit={() => openEditor('tools', t)} onDelete={() => handleDelete(t.id, 'tools')} />
                        </div>
                    ))}
                 </div>
             </div>
         )}
      </div>

      {/* --- EDITOR MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-3xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                             <h3 className="font-bold text-sm uppercase tracking-wider">{editingItem?.id ? 'Edit' : 'Create'} {editType.slice(0, -1)}</h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                        
                        {/* PROJECT FIELDS */}
                        {editType === 'projects' && (
                            <>
                                <SectionHeader label="Basic Info" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Title" value={editingItem?.title} onChange={v => setEditingItem({...editingItem, title: v})} />
                                    <Input label="Slug (URL)" value={editingItem?.slug} onChange={v => setEditingItem({...editingItem, slug: v})} />
                                </div>
                                <Input label="Description (Short)" value={editingItem?.description} onChange={v => setEditingItem({...editingItem, description: v})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Main Image URL" value={editingItem?.image} onChange={v => setEditingItem({...editingItem, image: v})} />
                                    <Input label="Date (YYYY-MM-DD)" value={editingItem?.publishDate} onChange={v => setEditingItem({...editingItem, publishDate: v})} />
                                </div>
                                <Input label="Gallery URLs (Comma separated)" value={Array.isArray(editingItem?.gallery) ? editingItem.gallery.join(', ') : (editingItem?.gallery || '')} onChange={v => setEditingItem({...editingItem, gallery: v})} />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Github URL" value={editingItem?.links?.github} onChange={v => setEditingItem({...editingItem, links: {...editingItem.links, github: v}})} />
                                    <Input label="Demo URL" value={editingItem?.links?.demo} onChange={v => setEditingItem({...editingItem, links: {...editingItem.links, demo: v}})} />
                                </div>
                                <Input label="Tags (comma separated)" value={Array.isArray(editingItem?.tags) ? editingItem.tags.join(', ') : editingItem?.tags} onChange={v => setEditingItem({...editingItem, tags: v})} />
                                <TextArea label="Storytelling Content (Markdown)" value={editingItem?.content} onChange={v => setEditingItem({...editingItem, content: v})} height="h-48" />
                                
                                {/* Timeline Builder */}
                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <SectionHeader label="Dev Timeline" />
                                    <div className="space-y-2 mb-4">
                                        {(editingItem?.timeline || []).map((t: TimelineEvent, idx: number) => (
                                            <div key={idx} className="flex justify-between bg-white/5 p-2 rounded border border-white/5 text-xs">
                                                <span><b className="text-indigo-400">{t.date}</b>: {t.title}</span>
                                                <button onClick={() => removeItemFromList('timeline', idx)} className="text-red-500"><X size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Date" value={newTimeline.date} onChange={e => setNewTimeline({...newTimeline, date: e.target.value})} />
                                        <input className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Title" value={newTimeline.title} onChange={e => setNewTimeline({...newTimeline, title: e.target.value})} />
                                        <button onClick={handleAddTimeline} className="bg-white/10 text-xs rounded text-gray-300">Add</button>
                                    </div>
                                    <input className="w-full mt-2 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Description" value={newTimeline.description} onChange={e => setNewTimeline({...newTimeline, description: e.target.value})} />
                                </div>

                                {/* Collaborators Builder */}
                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <SectionHeader label="Collaborators" />
                                    <div className="space-y-2 mb-4">
                                        {(editingItem?.collaborators || []).map((c: Collaborator, idx: number) => (
                                            <div key={idx} className="flex justify-between bg-white/5 p-2 rounded border border-white/5 text-xs">
                                                <span>{c.name} ({c.role})</span>
                                                <button onClick={() => removeItemFromList('collaborators', idx)} className="text-red-500"><X size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Name (e.g. Gemini)" value={newCollaborator.name} onChange={e => setNewCollaborator({...newCollaborator, name: e.target.value})} />
                                        <input className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Role (e.g. Architect)" value={newCollaborator.role} onChange={e => setNewCollaborator({...newCollaborator, role: e.target.value})} />
                                        <button onClick={handleAddCollaborator} className="bg-white/10 text-xs rounded text-gray-300">Add</button>
                                    </div>
                                </div>

                                {/* Features & Visual Identity */}
                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <SectionHeader label="Core Features" />
                                    <div className="space-y-2 mb-4">
                                        {(editingItem?.features || []).map((f: CoreFeature, idx: number) => (
                                            <div key={idx} className="flex items-start justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-200">{f.title}</div>
                                                    <div className="text-xs text-gray-500">{f.description}</div>
                                                </div>
                                                <button onClick={() => removeItemFromList('features', idx)} className="text-red-500 hover:text-red-400"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <input className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white" placeholder="Title" value={newFeature.title} onChange={e => setNewFeature({...newFeature, title: e.target.value})} />
                                        <textarea className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-sm text-white h-16" placeholder="Desc" value={newFeature.description} onChange={e => setNewFeature({...newFeature, description: e.target.value})} />
                                        <button onClick={handleAddFeature} className="w-full bg-white/10 py-1.5 rounded text-xs">+ Feature</button>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <SectionHeader label="Visual Identity" />
                                    <Input label="Colors (Hex, comma separated)" value={Array.isArray(editingItem?.visualIdentity?.colors) ? editingItem.visualIdentity.colors.join(', ') : (editingItem?.visualIdentity?.colors || '')} onChange={v => setEditingItem({...editingItem, visualIdentity: { ...editingItem.visualIdentity, colors: v }})} />
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <Input 
                                            label="Layout Strategy" 
                                            value={editingItem?.visualIdentity?.layout} 
                                            onChange={v => setEditingItem({...editingItem, visualIdentity: { ...editingItem.visualIdentity, layout: v }})} 
                                        />
                                        <Input 
                                            label="Typography" 
                                            value={editingItem?.visualIdentity?.typography} 
                                            onChange={v => setEditingItem({...editingItem, visualIdentity: { ...editingItem.visualIdentity, typography: v }})} 
                                        />
                                        <Input 
                                            label="Iconography" 
                                            value={editingItem?.visualIdentity?.iconography} 
                                            onChange={v => setEditingItem({...editingItem, visualIdentity: { ...editingItem.visualIdentity, iconography: v }})} 
                                        />
                                        <Input 
                                            label="Motion/Animation" 
                                            value={editingItem?.visualIdentity?.animation} 
                                            onChange={v => setEditingItem({...editingItem, visualIdentity: { ...editingItem.visualIdentity, animation: v }})} 
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* POST & TOOL FIELDS (Same as before) */}
                        {editType === 'posts' && (
                             /* ... Post Fields ... */
                             <>
                                <Input label="Title" value={editingItem?.title} onChange={v => setEditingItem({...editingItem, title: v})} />
                                <Input label="Slug" value={editingItem?.slug} onChange={v => setEditingItem({...editingItem, slug: v})} />
                                <TextArea label="Content" value={editingItem?.content} onChange={v => setEditingItem({...editingItem, content: v})} height="h-64" />
                             </>
                        )}
                        {editType === 'tools' && (
                             /* ... Tool Fields ... */
                             <>
                                <Input label="Name" value={editingItem?.name} onChange={v => setEditingItem({...editingItem, name: v})} />
                                <Input label="Icon Name" value={editingItem?.iconName} onChange={v => setEditingItem({...editingItem, iconName: v})} />
                             </>
                        )}
                        
                    </div>

                    <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSaveItem} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                             <Check size={16} /> Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{label}</span>
        <div className="h-px bg-white/10 flex-1" />
    </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${active ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{icon} {label}</button>
);

const AddButton = ({ onClick, label }: any) => (
    <button onClick={onClick} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Plus size={14} /> {label}</button>
);

const ActionButtons = ({ onEdit, onDelete }: any) => (
    <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 text-gray-500 hover:bg-white/10 hover:text-white rounded-lg transition-colors"><Edit3 size={16}/></button>
        <button onClick={onDelete} className="p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
    </div>
);

const Input = ({ label, value, onChange }: any) => (
    <div>
        <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
        <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 outline-none transition-colors" value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
);

const TextArea = ({ label, value, onChange, height = "h-32" }: any) => (
    <div>
        <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
        <textarea className={`w-full ${height} bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-gray-200 font-mono focus:border-indigo-500 outline-none resize-none transition-colors`} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
);

export default Nexus;
