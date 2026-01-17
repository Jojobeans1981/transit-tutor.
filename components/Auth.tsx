
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string, password: string, name: string, isSignUp: boolean) => string | null;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = onLogin(username, password, fullName, isSignUp);
    if (result) {
      setError(result);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Transit Lines Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-[#0039A6]"></div>
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#FF6319]"></div>
        <div className="absolute top-3/4 left-0 w-full h-[2px] bg-[#00853E]"></div>
        <div className="absolute left-1/4 top-0 h-full w-[2px] bg-[#EE352E]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-[#1A1A1A] rounded-[2rem] p-10 md:p-14 shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/5">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
               <div className="w-20 h-20 bg-[#0039A6] rounded-full flex items-center justify-center font-black text-white text-4xl shadow-2xl border-4 border-white">
                T
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF6319] rounded-full flex items-center justify-center font-black text-white text-xs border-2 border-[#1A1A1A]">
                S
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">TRANSIT TUTOR</h1>
            <p className="text-[#FF6319] mt-2 font-black uppercase tracking-[0.2em] text-[10px]">Surface Operations Dispatcher Academy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Dispatcher Name</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Officer J. Rodriguez"
                  className="w-full px-6 py-4 bg-black border-2 border-white/10 rounded-xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-700"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Academy Username</label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dispatch_pro_24"
                className="w-full px-6 py-4 bg-black border-2 border-white/10 rounded-xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-700"
              />
              {isSignUp && (
                <p className="text-[7px] text-slate-500 mt-2 uppercase font-black tracking-widest italic">* Hint: Include 'admin' in your username for Command access.</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Academy Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-black border-2 border-white/10 rounded-xl focus:border-[#0039A6] outline-none transition-all font-bold text-white placeholder:text-slate-700"
              />
            </div>

            {error && (
              <p className="text-[#EE352E] text-xs font-bold text-center animate-pulse">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-[#0039A6] hover:bg-[#002a7a] text-white rounded-xl font-black shadow-xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              {isSignUp ? 'Enroll in Academy' : 'Clear for Departure'}
              <i className="fa-solid fa-train"></i>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-xs font-black text-[#FF6319] uppercase tracking-widest hover:underline"
            >
              {isSignUp ? 'Already a Member? Log In' : 'New Candidate? Register Here'}
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">S.O.D.A. Core Systems v2.5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
