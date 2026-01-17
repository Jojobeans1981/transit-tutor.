
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted: boolean;
  colorClass: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size = 48, strokeWidth = 4, isCompleted, colorClass }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          className={isCompleted ? "text-[#00853E]" : colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isCompleted ? (
          <i className="fa-solid fa-check text-[#00853E] text-xs"></i>
        ) : (
          <span className="text-[9px] font-black text-white/50">{Math.round(progress)}%</span>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  const sodaMetrics = [
    { label: 'Radio Prof.', value: `${user.metrics?.radioProficiency || 0}%`, icon: 'fa-tower-broadcast', color: '#0039A6' },
    { label: 'Protocol Comp.', value: `${user.metrics?.protocolCompliance || 0}%`, icon: 'fa-shield-halved', color: '#FF6319' },
    { label: 'Response Spd.', value: user.metrics?.incidentResponseSpeed || 'N/A', icon: 'fa-bolt', color: '#FCCC0A' },
    { label: 'Accuracy Rt.', value: `${user.metrics?.accuracyRate || 0}%`, icon: 'fa-bullseye', color: '#00853E' },
    { label: 'Fleet Log.', value: `${user.metrics?.fleetManagementScore || 0}%`, icon: 'fa-truck-front', color: '#A7A9AC' },
    { label: 'Safety Std.', value: `${user.metrics?.safetyCompliance || 0}%`, icon: 'fa-hard-hat', color: '#EE352E' }
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
             <span className="bg-[#0039A6] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Powered by We Move NY</span>
             <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">S.O.D.A. Core v2.5.0</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-10 bg-[#FF6319] rounded-full"></div>
             <div>
               <h2 className="text-6xl font-black tracking-tighter text-white">SYSTEM MONITOR</h2>
               <div className="flex items-center gap-4 mt-1">
                 <p className="text-[#FF6319] font-black uppercase tracking-[0.3em] text-[10px]">Candidate: {user.name}</p>
                 <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Academy Link Active</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
        
        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-10 w-full xl:w-auto">
          <div className="flex-grow min-w-[280px]">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-black text-[#0039A6] uppercase tracking-[0.2em]">Rank {user.level} Proficiency</span>
              <span className="text-[10px] font-bold text-slate-500">{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#0039A6] to-[#00AEEF] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,57,166,0.5)]"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-16 h-16 bg-[#0039A6] text-white rounded-full flex items-center justify-center text-3xl font-black border-4 border-white shadow-xl transform rotate-3">
            {user.level}
          </div>
        </div>
      </header>

      {/* Internal Health Check Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-[#111]/50 glass-blur border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Telemetry Link</span>
            <span className="text-[10px] font-black text-[#00853E]">STABLE</span>
         </div>
         <div className="bg-[#111]/50 glass-blur border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Prometheus AI</span>
            <span className="text-[10px] font-black text-[#0039A6]">NOMINAL</span>
         </div>
         <div className="bg-[#111]/50 glass-blur border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Scan Status</span>
            <span className="text-[10px] font-black text-[#FCCC0A] animate-pulse">SWEEPING</span>
         </div>
         <div className="bg-[#111]/50 glass-blur border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Compliance</span>
            <span className="text-[10px] font-black text-[#EE352E]">VERIFIED</span>
         </div>
      </div>

      {/* Surface Operations Metrics */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest">Core Performance Indices</span>
          <div className="h-[1px] flex-grow bg-white/10"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sodaMetrics.map((metric, i) => (
            <div key={i} className="bg-[#111]/50 glass-blur p-6 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <i className={`fa-solid ${metric.icon} text-lg`} style={{ color: metric.color }}></i>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: metric.color }}></div>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{metric.label}</p>
              <p className="text-3xl font-black text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-[#111]/50 glass-blur p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="font-black text-3xl text-white tracking-tighter uppercase">Operational Analytics</h3>
              <p className="text-[9px] font-black text-[#0039A6] uppercase tracking-[0.3em] mt-1">Readiness History Scan</p>
            </div>
          </div>
          <div className="h-80">
            {user.history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={user.history}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0039A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0039A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#222" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666', fontWeight: '900' }} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#666', fontWeight: '900' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderRadius: '1rem', border: '1px solid #333', color: '#fff' }}
                    itemStyle={{ color: '#0039A6', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#0039A6" strokeWidth={6} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-800 border-4 border-dotted border-white/5 rounded-[2rem]">
                <i className="fa-solid fa-tower-observation text-6xl mb-4 opacity-20"></i>
                <p className="font-black uppercase tracking-widest text-[10px]">No telemetry logged</p>
              </div>
            )}
          </div>
        </div>

        {/* Missions / Weekly Goals */}
        <div className="bg-[#111]/50 glass-blur p-10 rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h3 className="font-black text-2xl text-white tracking-tighter uppercase">Mission Log</h3>
            <div className="w-8 h-8 bg-[#FF6319] rounded-full flex items-center justify-center font-black text-xs">M</div>
          </div>
          
          <div className="space-y-6 flex-grow relative z-10">
            {user.weeklyGoals.map((goal: any) => {
              const progress = (goal.current / goal.target) * 100;
              const isCompleted = progress >= 100;

              return (
                <div 
                  key={goal.id} 
                  className={`flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 ${
                    isCompleted ? 'bg-[#00853E]/10 border-[#00853E]/30' : 'bg-black/40 border-white/5'
                  }`}
                >
                  <CircularProgress 
                    progress={progress} 
                    isCompleted={isCompleted} 
                    colorClass={goal.id === '1' ? 'text-[#0039A6]' : goal.id === '2' ? 'text-[#FF6319]' : 'text-[#FCCC0A]'} 
                  />
                  
                  <div className="flex-grow">
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                      isCompleted ? 'text-[#00853E]' : 'text-white/70'
                    }`}>
                      {goal.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-bold text-white/30">{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-black/80 rounded-2xl border border-white/5 text-center relative z-10">
             <p className="text-[9px] font-black text-[#FF6319] uppercase tracking-[0.3em] mb-1">COMMAND DIRECTIVE</p>
             <p className="text-[11px] font-bold text-white/60 italic">
              Optimize capability. Maintain service. Move NY.
             </p>
          </div>
        </div>
      </div>
      
      {/* Production Footer */}
      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Environment: Production (Vercel)</span>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Database: Linked (Supabase)</span>
            </div>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Architected by Prometheus Workforce Analytics</span>
              <span className="text-[8px] font-bold text-[#00853E] uppercase tracking-tight">Utilizing AI to fortify the human advantage.</span>
            </div>
         </div>
         <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.4em]">Transit Tutor Academy v2.5.0</p>
      </footer>
    </div>
  );
};

export default Dashboard;
