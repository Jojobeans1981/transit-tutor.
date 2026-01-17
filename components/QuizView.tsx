
import React, { useState } from 'react';
import { generateQuizFromTopic } from '../geminiService';
import { MOCK_TOPICS } from '../constants';
import { Question } from '../types';

const QuizView: React.FC<{ onComplete: (score: number, xp: number) => void }> = ({ onComplete }) => {
  const [topic, setTopic] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const startQuiz = async (selectedTopic: string) => {
    setLoading(true);
    setTopic(selectedTopic);
    try {
      const q = await generateQuizFromTopic(selectedTopic);
      setQuestions(q);
      setCurrentIdx(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsConfirmed(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    setIsConfirmed(true);
    if (selectedAnswer === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsConfirmed(false);
    } else {
      const earnedXp = Math.round((score / questions.length) * 100) + 50;
      onComplete(score, earnedXp);
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 space-y-8 bg-black">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-white/5 rounded-full"></div>
          <div className="w-24 h-24 border-8 border-[#0039A6] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-black text-xl animate-pulse">T</div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Initializing Simulation...</h3>
          <p className="text-[#FF6319] font-black mt-2 uppercase tracking-[0.4em] text-[10px]">Consulting Command Data Nodes</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const earnedXp = Math.round((score / questions.length) * 100) + 50;
    const isAce = score === questions.length;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <div className="max-w-md w-full bg-[#111] rounded-[2.5rem] p-12 shadow-[0_0_100px_rgba(0,57,166,0.1)] text-center space-y-10 border border-white/5 relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl mx-auto shadow-2xl border-4 border-white ${
            isAce ? 'bg-[#00853E] text-white' : 'bg-[#0039A6] text-white'
          }`}>
            {isAce ? 'A' : 'S'}
          </div>
          
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter">{isAce ? 'ACE SCORE' : 'SIM COMPLETE'}</h2>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Topic: {topic}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black p-8 rounded-3xl border border-white/5">
              <span className="block text-[10px] font-black text-[#0039A6] uppercase tracking-widest mb-2">Efficiency</span>
              <span className="text-4xl font-black text-white">{Math.round((score / questions.length) * 100)}%</span>
            </div>
            <div className="bg-black p-8 rounded-3xl border border-white/5">
              <span className="block text-[10px] font-black text-[#FF6319] uppercase tracking-widest mb-2">Command XP</span>
              <span className="text-4xl font-black text-white">+{earnedXp}</span>
            </div>
          </div>

          <button 
            onClick={() => setQuestions([])}
            className="w-full py-5 bg-white text-black rounded-xl font-black hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            End Simulation
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const current = questions[currentIdx];
    const isCorrect = selectedAnswer === current.correctAnswer;

    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-40">
        <div className="mb-14 flex items-center justify-between">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest">
              {current.category}
            </span>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Section {currentIdx + 1} of {questions.length}</h4>
          </div>
          <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-[#0039A6] transition-all duration-1000 shadow-[0_0_15px_rgba(0,57,166,0.6)]" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-4xl font-black text-white mb-14 leading-tight tracking-tighter">
          {current.question}
        </h2>

        <div className="grid grid-cols-1 gap-5 mb-14">
          {current.options.map((option, idx) => {
            let colorClass = "border-white/5 bg-[#111] hover:border-white/20";
            if (isConfirmed) {
              if (idx === current.correctAnswer) colorClass = "border-[#00853E] bg-[#00853E]/10";
              else if (selectedAnswer === idx) colorClass = "border-[#EE352E] bg-[#EE352E]/10";
              else colorClass = "border-white/5 opacity-30";
            } else if (selectedAnswer === idx) {
              colorClass = "border-[#0039A6] bg-[#0039A6]/10 shadow-2xl shadow-[#0039A6]/20";
            }

            return (
              <button
                key={idx}
                disabled={isConfirmed}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group ${colorClass}`}
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
                  selectedAnswer === idx ? 'bg-white text-black border-white' : 'bg-black text-slate-500 border-white/10 group-hover:border-white/30'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-black text-white text-xl flex-grow tracking-tight">{option}</span>
              </button>
            );
          })}
        </div>

        {isConfirmed && (
          <div className={`p-10 rounded-[2rem] border-l-8 mb-14 animate-in slide-in-from-bottom-6 duration-500 bg-[#111] ${
            isCorrect ? 'border-[#00853E]' : 'border-[#FF6319]'
          }`}>
            <h4 className={`font-black uppercase tracking-[0.3em] text-[10px] mb-6 flex items-center gap-3 ${isCorrect ? 'text-[#00853E]' : 'text-[#FF6319]'}`}>
              <i className={`fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
              {isCorrect ? 'Operational Success' : 'Correction Required'}
            </h4>
            <div className="space-y-6">
              <p className="text-white text-lg leading-relaxed font-bold italic border-b border-white/5 pb-6">
                "{current.explanation.split('[Reference:')[0].trim()}"
              </p>
              {current.explanation.includes('[Reference:') && (
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black text-xs">i</div>
                  <div>
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Reference Data Node</span>
                    <p className="text-xs font-black text-[#0039A6] uppercase tracking-wider">
                      {current.explanation.match(/\[Reference: (.*?)\]/)?.[1] || "S.O.D.A. Primary Manual"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="fixed bottom-10 left-6 right-6 md:left-auto md:right-12 md:w-80 z-50">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className={`w-full py-6 rounded-xl font-black shadow-2xl transition-all uppercase tracking-[0.3em] text-xs ${
                selectedAnswer !== null 
                ? 'bg-[#0039A6] text-white hover:bg-[#002a7a]' 
                : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
              }`}
            >
              Log Response
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className={`w-full py-6 rounded-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs ${
                isCorrect 
                ? 'bg-[#00853E] text-white hover:bg-[#006e33]' 
                : 'bg-[#FF6319] text-white hover:bg-[#e05616]'
              }`}
            >
              {currentIdx < questions.length - 1 ? 'Next Sequence' : 'Simulation Report'}
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-16 max-w-6xl mx-auto space-y-16 pb-40">
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-white tracking-tighter">SIMULATE</h2>
        <p className="text-[#FF6319] font-black uppercase tracking-[0.5em] text-xs">Select Mission Parameter</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_TOPICS.map((t, idx) => (
          <button
            key={idx}
            onClick={() => startQuiz(t)}
            className="group bg-[#111] p-10 rounded-[2rem] border border-white/5 hover:border-[#0039A6] transition-all text-left flex flex-col items-start gap-10 relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white transition-all shadow-xl border-2 border-white/10 group-hover:border-white ${idx % 3 === 0 ? 'bg-[#0039A6]' : idx % 3 === 1 ? 'bg-[#FF6319]' : 'bg-[#6CBE45]'}`}>
              {t.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-white text-2xl mb-4 leading-tight tracking-tight group-hover:text-[#0039A6] transition-colors">{t}</h3>
              <div className="flex gap-4">
                 <span className="text-[9px] font-black text-[#FF6319] bg-[#FF6319]/10 px-2.5 py-1 rounded uppercase tracking-widest">+150 XP</span>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded">5 Sequences</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizView;
