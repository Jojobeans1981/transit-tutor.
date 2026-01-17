
import React, { useState, useRef } from 'react';
import { StudyMaterialItem } from '../types';

interface AdminViewProps {
  onUpload: (newMaterials: StudyMaterialItem[]) => void;
  materials: StudyMaterialItem[];
}

const AdminView: React.FC<AdminViewProps> = ({ onUpload, materials }) => {
  const [isIngesting, setIsIngesting] = useState(false);
  const [previewItems, setPreviewItems] = useState<StudyMaterialItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Enhanced Parser for the specific format: "title","content"
      // We use a regex to properly handle quoted values with commas inside them
      const lines = text.split(/\r?\n/);
      const parsedItems: StudyMaterialItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Match quoted strings or unquoted values
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        const matches = lines[i].match(regex);
        
        if (matches && matches.length >= 2) {
          const title = matches[0].replace(/^"|"$/g, '').replace(/""/g, '"');
          const content = matches[1].replace(/^"|"$/g, '').replace(/""/g, '"');
          
          const item: StudyMaterialItem = {
            id: `admin-ingest-${Date.now()}-${i}`,
            title: title || 'Untitled Protocol',
            content: content,
            type: 'Academy Protocol',
            cat: 'general',
            bullet: 'P',
            color: 'bg-[#EE352E]',
            size: `${(content.length / 1024).toFixed(1)} KB`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          };
          parsedItems.push(item);
        }
      }

      setTimeout(() => {
        setPreviewItems(parsedItems);
        setIsIngesting(false);
      }, 1200);
    };

    reader.readAsText(file);
  };

  const commitIngestion = () => {
    onUpload(previewItems);
    setPreviewItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateItemCategory = (index: number, cat: string) => {
    const updated = [...previewItems];
    const catConfigs: any = {
      comm: { bullet: 'A', color: 'bg-[#0039A6]' },
      protocols: { bullet: 'S', color: 'bg-[#FF6319]' },
      safety: { bullet: '4', color: 'bg-[#00853E]' },
      logistics: { bullet: 'L', color: 'bg-[#A7A9AC]' },
      general: { bullet: '1', color: 'bg-[#EE352E]' }
    };
    
    updated[index].cat = cat;
    updated[index].bullet = catConfigs[cat].bullet;
    updated[index].color = catConfigs[cat].color;
    setPreviewItems(updated);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">COMMAND CENTER</h2>
          <p className="text-[#EE352E] font-black uppercase tracking-[0.4em] text-[10px] mt-3">Restricted Ingestion Node • Authorized Personnel Only</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            disabled={isIngesting || previewItems.length > 0}
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 rounded-xl font-black bg-white text-black hover:bg-slate-200 transition-all flex items-center gap-3 uppercase tracking-widest text-[10px] shadow-2xl disabled:opacity-30"
          >
            {isIngesting ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-file-csv"></i>}
            Ingest Parser Output
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
        </div>
      </header>

      {isIngesting && (
        <div className="bg-[#EE352E]/10 border border-[#EE352E]/30 p-12 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 animate-pulse">
           <i className="fa-solid fa-brain text-5xl text-[#EE352E]"></i>
           <div>
             <h4 className="font-black text-white text-2xl uppercase tracking-tighter">Prometheus Ingestion Active</h4>
             <p className="text-[10px] font-black text-[#EE352E] uppercase tracking-[0.3em] mt-2">Parsing secure CSV stream for academy storage...</p>
           </div>
        </div>
      )}

      {previewItems.length > 0 ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Batch Review Queue ({previewItems.length} Chunks)</h3>
            <div className="flex gap-4">
              <button onClick={() => setPreviewItems([])} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white">Discard Batch</button>
              <button onClick={commitIngestion} className="bg-[#00853E] px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-transform">Commit to Library</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {previewItems.map((item, idx) => (
              <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-white ${item.color}`}>
                  {item.bullet}
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-white uppercase text-sm tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.content}</p>
                </div>
                <div className="flex gap-2">
                  {['comm', 'protocols', 'safety', 'logistics', 'general'].map(c => (
                    <button 
                      key={c}
                      onClick={() => updateItemCategory(idx, c)}
                      className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                        item.cat === c ? 'bg-white text-black' : 'bg-white/5 text-slate-600 hover:bg-white/10'
                      }`}
                    >
                      {c.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111]/50 p-10 rounded-[2rem] border border-white/5">
             <h4 className="font-black text-white text-xl uppercase tracking-tighter mb-4 flex items-center gap-3">
               <i className="fa-solid fa-chart-line text-[#EE352E]"></i>
               Archive Statistics
             </h4>
             <div className="space-y-4">
               <div className="flex justify-between items-center py-4 border-b border-white/5">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Library Chunks</span>
                 <span className="text-xl font-black text-white">{materials.length}</span>
               </div>
               <div className="flex justify-between items-center py-4 border-b border-white/5">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Ingestion</span>
                 <span className="text-sm font-black text-[#EE352E]">24H AGO</span>
               </div>
               <div className="flex justify-between items-center py-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Storage Status</span>
                 <span className="text-sm font-black text-[#00853E]">OPTIMAL</span>
               </div>
             </div>
          </div>

          <div className="bg-[#EE352E] p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-white text-3xl uppercase tracking-tighter leading-none mb-4">Prometheus Workflow Protocol</h4>
              <p className="text-white/80 text-sm font-bold italic leading-relaxed">
                "We utilize AI to fortify the human advantage. By parsing complex manuals into accessible data chunks, we preserve the essential human element in transit operations while streamlining the learning curve."
              </p>
            </div>
            <div className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 relative z-10">
               Prometheus Workforce Analytics: Using AI to keep humans Employed.
            </div>
            <i className="fa-solid fa-shield-halved absolute bottom-[-40px] right-[-40px] text-[200px] text-black/10 transition-transform group-hover:scale-110 duration-700"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
