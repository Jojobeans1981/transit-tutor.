
import React from 'react';
import { MOCK_LEADERBOARD } from '../constants';

const Leaderboard: React.FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-32">
      <header className="text-center space-y-3">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">ACADEMY RANKS</h2>
        <p className="text-[#FF6319] font-black uppercase tracking-[0.4em] text-[10px]">Active Service Dispatcher Leaderboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
        {MOCK_LEADERBOARD.slice(0, 3).map((user, i) => {
          const isFirst = i === 0;
          return (
            <div 
              key={user.id} 
              className={`relative p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl transition-all border ${
                isFirst 
                ? 'bg-[#0039A6] text-white border-white order-2 md:scale-110 z-10' 
                : 'bg-[#1A1A1A] text-white border-white/5 order-1 md:order-1'
              }`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mb-6 border-4 ${
                isFirst ? 'bg-white text-[#0039A6] border-white' : 'bg-[#333] text-white border-white/20'
              }`}>
                {user.avatar}
              </div>
              <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
                isFirst ? 'bg-white text-[#0039A6] border-[#0039A6]' : 'bg-[#FF6319] border-white text-white'
              }`}>
                {i + 1}
              </div>
              <h3 className="font-black text-2xl mb-1 tracking-tight">{user.name}</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isFirst ? 'text-white/80' : 'text-[#FF6319]'}`}>Rank {user.level}</span>
              <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full">
                <i className="fa-solid fa-bolt-lightning text-xs"></i>
                <span className="font-black text-xs uppercase tracking-widest">{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#111] rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-black/40">
          <div className="grid grid-cols-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">
            <div className="col-span-1">RANK</div>
            <div className="col-span-3">CANDIDATE</div>
            <div className="col-span-1 text-center">LEVEL</div>
            <div className="col-span-1 text-right">XP LOG</div>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_LEADERBOARD.slice(3).map((user, i) => (
            <div key={user.id} className="grid grid-cols-6 items-center p-8 px-12 hover:bg-white/5 transition-all cursor-default group">
              <div className="col-span-1 font-black text-slate-600 group-hover:text-white transition-colors">{i + 4}</div>
              <div className="col-span-3 flex items-center gap-6">
                <div className="w-12 h-12 bg-[#333] text-white rounded-full flex items-center justify-center font-black text-sm border-2 border-transparent group-hover:border-white transition-all">
                  {user.avatar}
                </div>
                <span className="font-black text-white text-lg tracking-tight">{user.name}</span>
              </div>
              <div className="col-span-1 text-center font-black text-[#FF6319] uppercase tracking-widest text-xs">Lvl {user.level}</div>
              <div className="col-span-1 text-right font-black text-white tabular-nums">{user.xp.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
