
import React, { useState, useRef, useEffect } from 'react';
import { chatWithStudyGuide } from '../geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const STUDY_CONTEXTS = [
  { 
    id: 'general', 
    label: 'ADMIN', 
    bullet: '1',
    color: 'bg-[#EE352E]',
    content: 'General dispatcher duties include maintaining shop logs, verifying unit locations, and adhering to the Dispatcher Code of Ethics. Shift handovers must include all pending incidents.' 
  },
  { 
    id: 'radio', 
    label: 'RADIO', 
    bullet: 'A',
    color: 'bg-[#0039A6]',
    content: 'Standard NYC DOT 10-codes: 10-1 (Receiving Poorly), 10-4 (Acknowledgment), 10-13 (Emergency), 10-20 (Location), 10-97 (Arrived at Scene). All transmissions must be brief and professional.' 
  },
  { 
    id: 'emergency', 
    label: 'S.O.D.A.', 
    bullet: 'S',
    color: 'bg-[#FF6319]',
    content: 'During a Level 1 Snow Emergency, all personnel are frozen for 12-hour shifts. Dispatchers must prioritize repair vehicles (wreckers) over routine fleet maintenance.' 
  },
  { 
    id: 'safety', 
    label: 'SAFETY', 
    bullet: '4',
    color: 'bg-[#00853E]',
    content: 'Shop floor requirements: CSA-approved safety boots and hard hats must be worn at all times in the bays. Dispatchers are responsible for logging any reported floor spills immediately.' 
  },
  { 
    id: 'logistics', 
    label: 'E-SHOP', 
    bullet: 'L',
    color: 'bg-[#A7A9AC]',
    content: 'The E-Shop system tracks parts inventory. Dispatchers must verify that all vehicle parts assigned to a repair ticket match the shop requisition form before closing a task.' 
  }
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "SYSTEM INITIALIZED. I am your Tactical Dispatcher Liaison. Select a data node and submit your inquiry for real-time guidance." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeContextId, setActiveContextId] = useState('general');
  const endRef = useRef<HTMLDivElement>(null);

  const activeContext = STUDY_CONTEXTS.find(c => c.id === activeContextId) || STUDY_CONTEXTS[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const aiResponse = await chatWithStudyGuide(userMsg, activeContext.content);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "CRITICAL ERROR: Connection to Command Core failed. Retransmit." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-5xl mx-auto bg-black border-x border-white/5 relative shadow-2xl">
      <header className="p-8 border-b border-white/5 bg-black sticky top-0 z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-black text-xl shadow-xl border-2 border-[#0039A6]">
              T
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight uppercase">Tactical Advisor</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="w-1.5 h-1.5 bg-[#00853E] rounded-full animate-pulse"></span>
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Operational Knowledge Connected</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">Log: {activeContext.label}</span>
          </div>
        </div>

        {/* Data Node Selector */}
        <div className="flex flex-col gap-3">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">ACTIVE DATA NODE</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {STUDY_CONTEXTS.map(context => (
              <button
                key={context.id}
                onClick={() => setActiveContextId(context.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                  activeContextId === context.id 
                  ? 'bg-white text-black border-white shadow-xl translate-y-[-2px]' 
                  : 'bg-black border-white/10 text-slate-500 hover:text-white hover:border-white/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                  activeContextId === context.id ? 'bg-black text-white' : context.color + ' text-white'
                }`}>
                  {context.bullet}
                </div>
                {context.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-10 space-y-10 bg-[#050505]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-2xl relative shadow-2xl transition-all ${
              msg.role === 'user' 
              ? 'bg-[#0039A6] text-white rounded-br-none' 
              : 'bg-[#1A1A1A] border border-white/5 text-white rounded-bl-none'
            }`}>
              <div className={`absolute -top-3 ${msg.role === 'user' ? '-right-2' : '-left-2'} text-[8px] font-black uppercase tracking-widest text-slate-600`}>
                 {msg.role === 'user' ? 'Dispatcher Inquiry' : 'Command Response'}
              </div>
              <p className="text-base font-bold leading-relaxed tracking-tight whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl rounded-bl-none flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#FF6319] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#FF6319] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#FF6319] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Accessing Node {activeContext.bullet}...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-10 border-t border-white/5 bg-black">
        <div className="flex gap-6">
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`TRANSMIT QUERY RE: ${activeContext.label}...`}
              className="w-full p-6 bg-[#111] border-2 border-white/5 rounded-2xl focus:border-[#FF6319] outline-none transition-all font-black text-white placeholder:text-slate-800 tracking-widest text-sm"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-20 h-20 bg-[#FF6319] text-white rounded-2xl flex items-center justify-center hover:bg-[#e05616] transition-all disabled:opacity-20 shadow-2xl shadow-[#FF6319]/20"
          >
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-satellite-dish'} text-2xl`}></i>
          </button>
        </div>
        <div className="mt-8 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00853E] animate-pulse"></div>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Encrypted Comm-Link Established</p>
           </div>
           <p className="text-[8px] text-slate-800 font-black uppercase tracking-[0.5em]">TUTOR V2.5.0</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
