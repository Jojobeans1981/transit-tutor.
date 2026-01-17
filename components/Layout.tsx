
import React from 'react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: 'M', label: 'Monitor', color: 'bg-[#0039A6]' },
    { id: 'quiz', icon: 'S', label: 'Simulate', color: 'bg-[#FF6319]' },
    { id: 'study', icon: 'L', label: 'Library', color: 'bg-[#A7A9AC]' },
    { id: 'chat', icon: 'R', label: 'Tactical', color: 'bg-[#FCCC0A]' },
    { id: 'leaderboard', icon: 'G', label: 'Academy', color: 'bg-[#6CBE45]' }
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', icon: 'A', label: 'Admin', color: 'bg-[#EE352E]' });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020202] text-white selection:bg-[#0039A6]/30">
      {/* Background Radar Effect */}
      <div className="radar-container hidden lg:block">
        <div className="radar-beam"></div>
        <div className="watermark-logo">
           <div className="flex flex-col items-center">
             <i className="fa-solid fa-train-subway text-[200px] mb-8 text-white"></i>
             <p className="font-black text-6xl tracking-[0.2em] uppercase text-white">WE MOVE NY</p>
           </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-72 bg-black/80 glass-blur flex-shrink-0 flex flex-col sticky top-0 h-screen z-30 border-r border-white/5">
        <div className="p-10 flex flex-col items-center">
          <div className="relative mb-4">
             <div className="w-14 h-14 bg-[#0039A6] rounded-full flex items-center justify-center font-black text-2xl shadow-2xl border-2 border-white">T</div>
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF6319] rounded-full flex items-center justify-center font-black text-[10px] border-2 border-black">S</div>
          </div>
          <h1 className="font-black text-xl tracking-tighter uppercase mb-0.5">TRANSIT TUTOR</h1>
          <p className="text-[8px] text-[#FF6319] font-black uppercase tracking-[0.4em] text-center">S.O.D.A. Command</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-white/10 text-white shadow-xl translate-x-1' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white transition-transform group-hover:scale-110 ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-8 border-t border-white/5 bg-[#050505] space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-black text-xl shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-black text-sm truncate uppercase tracking-tight text-white">{user.name}</h4>
              <p className="text-[9px] text-[#FF6319] font-black tracking-widest uppercase">{user.role === 'admin' ? 'Command Level' : `Rank ${user.level} Candidate`}</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
             <p className="text-[7px] text-slate-400 font-bold leading-tight uppercase mb-2">
                <i className="fa-solid fa-code mr-1 text-[#0039A6]"></i>
                Architected & Built by
             </p>
             <p className="text-[9px] text-white font-black uppercase tracking-tight mb-1">Prometheus Workforce Analytics</p>
             <p className="text-[7px] text-[#00853E] font-black uppercase tracking-widest italic">
                Using AI to keep humans Employed. Empowering Human Excellence through Intelligent Innovation.
             </p>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-[#EE352E] hover:border-[#EE352E] transition-all duration-300"
          >
            <i className="fa-solid fa-power-off"></i>
            End Shift
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-x-hidden z-10">
        <div className="flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
