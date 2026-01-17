
import React, { useState, useMemo } from 'react';
import { StudyMaterialItem } from '../types';

interface StudyMaterialProps {
  materials: StudyMaterialItem[];
}

const StudyMaterial: React.FC<StudyMaterialProps> = ({ materials }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'ALL FILES', bullet: 'T', color: 'bg-white text-black' },
    { id: 'comm', label: 'RADIO', bullet: 'A', color: 'bg-[#0039A6] text-white' },
    { id: 'protocols', label: 'S.O.D.A.', bullet: 'S', color: 'bg-[#FF6319] text-white' },
    { id: 'safety', label: 'SAFETY', bullet: '4', color: 'bg-[#00853E] text-white' },
    { id: 'logistics', label: 'E-SHOP', bullet: 'L', color: 'bg-[#A7A9AC] text-white' },
    { id: 'general', label: 'ADMIN', bullet: '1', color: 'bg-[#EE352E] text-white' }
  ];

  const filtered = useMemo(() => {
    return materials.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.cat === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, materials]);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">LIBRARY</h2>
          <p className="text-[#FF6319] font-black uppercase tracking-[0.4em] text-[10px] mt-3">Access Command Protocols & Training Manuals</p>
        </div>
      </header>

      <div className="space-y-8">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            placeholder="FILTER COMMAND DATABASE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-[#111] border-2 border-white/5 rounded-2xl focus:border-[#0039A6] outline-none transition-all font-black text-white placeholder:text-slate-800 tracking-widest text-sm"
          />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                ? 'bg-white text-black shadow-xl translate-y-[-2px]' 
                : 'bg-[#111] text-slate-500 hover:text-white border border-white/5'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] ${
                activeCategory === cat.id ? 'bg-black text-white' : cat.color
              }`}>
                {cat.bullet}
              </div>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer shadow-lg">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl border-2 border-transparent group-hover:border-white transition-all ${item.color}`}>
                  {item.bullet}
                </div>
                <div>
                  <h4 className="font-black text-white text-lg tracking-tight group-hover:text-[#0039A6] transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>{item.type}</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span>{item.size}</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span>LOGGED {item.date}</span>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-slate-700 group-hover:text-[#FF6319] hover:bg-white/5 transition-all">
                <i className="fa-solid fa-file-arrow-down text-xl"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-black rounded-[3rem] border-2 border-dotted border-white/5">
          <i className="fa-solid fa-radar text-6xl text-slate-800 animate-pulse"></i>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter">DATA GAP DETECTED</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">No files matching query found in academy archives</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterial;
