import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize with Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safety Check: Only create the client if keys exist
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const App = () => {
  const [view, setView] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!supabase) {
        setError("Environment variables missing. Check your .env file.");
        setView("error");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setUser(session.user);
        setView("ready");
      } catch (err) {
        setError(err.message);
        setView("error");
      }
    };
    checkConnection();
  }, []);

  // Error Screen
  if (view === "error") {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-10">
        <div className="border border-red-500 p-8 rounded-2xl bg-red-900/10 text-center">
          <h2 className="text-red-500 font-black mb-2">CONNECTION_ERROR</h2>
          <p className="text-white text-xs font-mono">{error}</p>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-[#020408] text-white">
      <header className="p-6 border-b border-white/5">
        <h1 className="text-4xl font-black italic text-blue-600">S.O.D.A.</h1>
      </header>

      <main className="p-10 flex flex-col items-center">
        <div className="glass-blur p-12 rounded-[40px] border border-blue-500/20 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 italic uppercase">
            Terminal Initialized
          </h2>
          <p className="text-slate-400 mb-8">
            System linked to project: <br />
            <code className="text-blue-500 text-[10px]">
              ifkenxfvhjsbdibaioqt
            </code>
          </p>

          {!user
            ? (
              <div className="space-y-4">
                <button className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase tracking-widest">
                  Operator Login
                </button>
                <p className="text-center text-[10px] text-slate-500 uppercase">
                  Cloud Sync Status: Active
                </p>
              </div>
            )
            : (
              <p className="text-green-500 font-mono">
                Operator {user.email} Connected.
              </p>
            )}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
