import React, { useEffect, useState } from "react";

// --- 1. TYPES ---
interface SessionReview {
  question: string;
  correctText: string;
  status: "pending" | "CORRECT" | "FAILED";
}

interface LeaderboardEntry {
  pass_number: string;
  readiness_rating: number;
}

interface RadarPing {
  id: number;
  top: string;
  left: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_LIMIT = 10;

export default function App() {
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [passNum, setPassNum] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [review, setReview] = useState<SessionReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pings, setPings] = useState<RadarPing[]>([]);

  const [sloganText, setSloganText] = useState("");
  const fullSlogan = "Precise • Prepared • Proven";

  useEffect(() => {
    fetchLeaderboard();

    let i = 0;
    const sloganInterval = setInterval(() => {
      if (i <= fullSlogan.length) {
        setSloganText(fullSlogan.slice(0, i));
        i++;
      } else {
        clearInterval(sloganInterval);
      }
    }, 50);

    const pingInterval = setInterval(() => {
      const newPing = {
        id: Date.now(),
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      };
      setPings((prev) => [...prev.slice(-4), newPing]);
    }, 3000);

    return () => {
      clearInterval(sloganInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/operator_scores?select=pass_number,readiness_rating&order=readiness_rating.desc&limit=5`,
        {
          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      );
      const data = await response.json();
      if (Array.isArray(data)) setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passNum.trim().length >= 2) {
      setIsLoggedIn(true);
      fetchQuestion();
    }
  };

  const saveToDatabase = async (finalScore: number, correctCount: number) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/operator_scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          pass_number: passNum.toUpperCase(),
          readiness_rating: finalScore,
          correct_answers: correctCount,
          total_questions: SESSION_LIMIT,
          last_active: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  const fetchQuestion = async () => {
    if (loading) return;
    setLoading(true);
    setShowExplanation(false);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/soda-prep`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ history, salt: Math.random() }),
      });
      const data = await response.json();
      const intel = data.answer;
      setHistory((prev) => [...prev, intel.question]);
      setCurrentQuestion(intel);
    } catch (e) {
      console.error("SODA Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (letter: string) => {
    if (showExplanation) return;
    const isCorrect = letter === currentQuestion.correct;
    const newStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      total: stats.total + 1,
    };

    setReview((prev) => [...prev, {
      question: currentQuestion.question,
      correctText: currentQuestion.options[currentQuestion.correct],
      status: isCorrect ? "CORRECT" : "FAILED",
    }]);

    setStats(newStats);
    setShowExplanation(true);

    if (newStats.total >= SESSION_LIMIT) {
      const finalScore = Math.round((newStats.correct / SESSION_LIMIT) * 100);
      saveToDatabase(finalScore, newStats.correct);
      setTimeout(() => setIsFinished(true), 1500);
    }
  };

  // --- BRANDING: IMPROVED MAP & FULL RADAR REVOLUTION ---
  const BackgroundBranding = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#01040a]">
      {/* 1. Radar Static Rings (Centered for full revolution) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] opacity-20">
        {[0.1, 0.25, 0.4, 0.55].map((scale, i) => (
          <div
            key={i}
            className="absolute inset-0 border-[0.5px] border-orange-500/15 rounded-full"
            style={{ transform: `scale(${scale})` }}
          >
          </div>
        ))}
      </div>

      {/* 2. Rotating Radar Sweep (Ensure full 360 degree coverage) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] z-10 opacity-30">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(234,88,12,0.6)_1deg,transparent_30deg)] animate-[spin_5s_linear_infinite]">
        </div>
      </div>

      {/* 3. LEFT SIDE: High-Tech Map Overlay */}
      <div className="absolute inset-y-0 left-0 w-1/2 -translate-x-10 opacity-[0.07] flex items-center justify-center p-12">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="scale-125"
        >
          {/* NYC Street Grid Simulation */}
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={i}>
              <line
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="1000"
                stroke="#ea580c"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={i * 50}
                x2="1000"
                y2={i * 50}
                stroke="#ea580c"
                strokeWidth="0.5"
              />
            </React.Fragment>
          ))}
          {/* Main Arteries / Transit Lines */}
          <path
            d="M0 200 L400 600 L1000 700"
            stroke="#ea580c"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M200 0 L500 1000"
            stroke="#ea580c"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M0 800 L1000 400"
            stroke="#ea580c"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <circle cx="400" cy="600" r="10" fill="#ea580c" opacity="0.8" />
          <circle cx="700" cy="550" r="6" fill="#ea580c" opacity="0.5" />
        </svg>
      </div>

      {/* 4. RIGHT SIDE: Logo Overlay */}
      <div className="absolute inset-y-0 right-0 w-1/2 translate-x-1/4 opacity-[0.12] flex items-center justify-center">
        <img
          src="/We Move New York Final.png"
          alt=""
          className="w-[85%] max-w-4xl brightness-125 select-none grayscale contrast-125"
        />
      </div>

      {/* 5. Radar Pings */}
      {pings.map((ping) => (
        <div
          key={ping.id}
          className="absolute w-2 h-2 bg-orange-600 rounded-full z-20"
          style={{
            top: ping.top,
            left: ping.left,
            animation: "sonarPing 5s forwards",
          }}
        >
          <div className="absolute inset-0 bg-orange-500 blur-sm opacity-60">
          </div>
        </div>
      ))}

      <style>
        {`
        @keyframes sonarPing {
          0% { transform: scale(0.5); opacity: 0; }
          2% { opacity: 0.9; }
          100% { transform: scale(8); opacity: 0; }
        }
      `}
      </style>
    </div>
  );

  const Header = () => (
    <div className="fixed top-0 w-full px-4 md:px-6 py-4 flex justify-between items-center z-[100] bg-slate-950/90 backdrop-blur-3xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="relative p-1 bg-white/5 rounded-xl border border-white/10">
          <img
            src="/We Move New York Final.png"
            alt="WMNY"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </div>
        <div className="h-8 w-[1px] bg-white/20"></div>
        <img
          src="/image0.png"
          alt="S.O.D.A."
          className="h-6 md:h-8 w-auto object-contain brightness-125"
        />
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="text-[6px] md:text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1 italic">
          Built By
        </div>
        <div className="text-[10px] md:text-[11px] font-black text-white tracking-tighter italic">
          Prometheus Analytics
        </div>
      </div>
    </div>
  );

  const SODALogo = () => (
    <div className="mb-10 flex flex-col items-center animate-fadeIn relative z-10">
      <div className="relative group">
        <div className="absolute -inset-1 bg-orange-600/10 rounded-full blur-2xl">
        </div>
        <div className="relative flex flex-col items-center bg-black/80 px-6 md:px-10 py-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
              S.O.D.A.
            </span>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse">
            </div>
          </div>
          <div className="mt-3 flex flex-col items-center">
            <div className="h-[1px] w-32 bg-orange-500/30 mb-2"></div>
            <p className="text-[7px] md:text-[8px] font-black text-orange-500/80 uppercase tracking-[0.4em]">
              Surface Operations Data Assistant
            </p>
            <p className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-1 h-3">
              {sloganText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <BackgroundBranding />
        <Header />
        <div className="w-full max-w-md z-10 relative pt-24">
          <SODALogo />
          <div className="p-8 md:p-10 rounded-[3rem] bg-black/80 border border-white/10 backdrop-blur-3xl shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                className="w-full bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white outline-none focus:border-orange-500 transition-all uppercase font-mono text-center text-xl md:text-2xl tracking-[0.3em] placeholder:text-slate-900"
                placeholder="PASS NUMBER"
                value={passNum}
                onChange={(e) => setPassNum(e.target.value)}
              />
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 md:py-6 rounded-2xl transition-all shadow-xl shadow-orange-900/40 uppercase tracking-[0.4em] text-[10px]">
                Initialize Evaluation
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = Math.round((stats.correct / stats.total) * 100);
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 relative flex flex-col items-center justify-center overflow-hidden">
        <BackgroundBranding />
        <Header />
        <div className="w-full max-w-2xl z-10 animate-fadeIn mt-24">
          <div
            className={`p-10 md:p-16 rounded-[3rem] border-2 mb-10 text-center backdrop-blur-3xl ${
              score === 100
                ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_50px_rgba(250,204,21,0.1)]"
                : "border-white/10 bg-white/5 shadow-2xl"
            }`}
          >
            <h2 className="text-7xl md:text-[10rem] font-black mb-2 tracking-tighter leading-none">
              {score}%
            </h2>
            <p className="text-[10px] font-black tracking-[0.6em] opacity-40 uppercase">
              Assessment Complete
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-6 rounded-[2rem] bg-orange-600 font-black tracking-[0.4em] text-xs transition-all uppercase shadow-2xl shadow-orange-900/40"
          >
            Reset Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 relative flex flex-col items-center overflow-hidden">
      <BackgroundBranding />
      <Header />
      <div className="w-full max-w-3xl z-10 mt-28 mb-10">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black italic tracking-tighter">
              S.O.D.A.
            </span>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-orange-500/80 uppercase tracking-[0.3em]">
                Surface Evaluation Node
              </span>
              <span className="text-[6px] font-mono text-slate-500 uppercase">
                Status: Connected
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Operator_ID
            </span>
            <p className="font-mono text-orange-500 font-black tracking-widest">
              {passNum.toUpperCase()}
            </p>
          </div>
        </div>

        {loading
          ? (
            <div className="h-64 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin">
              </div>
              <p className="text-[10px] font-mono text-orange-500/80 tracking-[0.5em] uppercase">
                Fetching Intel...
              </p>
            </div>
          )
          : currentQuestion && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl md:text-4xl font-black mb-8 leading-tight italic drop-shadow-2xl">
                {currentQuestion.question}
              </h3>
              <div className="grid gap-4 mb-10">
                {Object.entries(currentQuestion.options).map((
                  [letter, text]: any,
                ) => (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(letter)}
                    className={`p-5 md:p-7 rounded-[1.5rem] text-left flex items-center border-2 transition-all group backdrop-blur-2xl ${
                      showExplanation && letter === currentQuestion.correct
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/5 bg-white/10 hover:border-orange-500/30"
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 font-black text-orange-500 text-lg shrink-0 transition-transform group-hover:bg-orange-500/10">
                      {letter}
                    </span>
                    <span className="font-bold text-slate-100 text-sm md:text-base">
                      {text}
                    </span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="p-8 rounded-[2rem] bg-black/90 border border-white/10 animate-fadeIn relative backdrop-blur-3xl shadow-2xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-600">
                  </div>
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.5em] mb-4">
                    Reference Intelligence
                  </p>
                  <p className="text-slate-200 italic text-sm md:text-base leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  {stats.total < SESSION_LIMIT && (
                    <button
                      onClick={fetchQuestion}
                      className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.5em] text-[10px] hover:bg-orange-600 hover:text-white transition-all"
                    >
                      Proceed to Following Task
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
