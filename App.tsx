import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. Supabase Initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
);

// --- Component: Landing Page ---
const LandingPage = ({ setView }: { setView: (v: string) => void }) => (
  <div style={styles.card}>
    <h1 style={styles.header}>Transit Tutor</h1>
    <p style={styles.text}>Master your manuals with AI-powered practice.</p>
    <div style={styles.buttonStack}>
      <button
        style={styles.mainButton}
        onClick={() =>
          setView("search")}
      >
        🔍 Search Manuals
      </button>
      <button
        style={styles.secondaryButton}
        onClick={() => setView("practice")}
      >
        📝 Practice Quiz
      </button>
    </div>
  </div>
);

// --- Component: Search View ---
const SearchView = ({ onBack }: { onBack: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchDatabase = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);

      // Querying your CSV data columns: title and content
      const { data, error } = await supabase
        .from("manual_entries")
        .select("id, title, content")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(15);

      if (!error) setResults(data || []);
      setLoading(false);
    };

    const timer = setTimeout(searchDatabase, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backLink}>← Back to Home</button>
      <h2 style={styles.header}>Search</h2>
      <input
        type="text"
        placeholder="Search by keyword or rule..."
        style={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={styles.resultArea}>
        {loading && <p style={{ textAlign: "center" }}>Searching...</p>}
        {results.map((item) => (
          <div key={item.id} style={styles.resultItem}>
            <h4 style={{ margin: "0 0 5px 0", color: "#007bff" }}>
              {item.title}
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#444" }}>
              {item.content}
            </p>
          </div>
        ))}
        {!loading && query.length >= 2 && results.length === 0 && (
          <p style={{ color: "#999", textAlign: "center" }}>
            No matches found.
          </p>
        )}
      </div>
    </div>
  );
};

// --- Component: Practice View (Scenario Logic) ---
const PracticeView = ({ onBack }: { onBack: () => void }) => {
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const generateScenario = async () => {
    setLoading(true);
    setFeedback("");

    // 1. Get already answered questions from history
    const { data: history } = await supabase.from("quiz_history").select(
      "manual_id",
    );
    const usedIds = history?.map((h) => h.manual_id) || [];

    // 2. Fetch one random entry from your CSV table that isn't in history
    let query = supabase.from("manual_entries").select("id, title, content");
    if (usedIds.length > 0) {
      query = query.not("id", "in", `(${usedIds.join(",")})`);
    }

    const { data: entry, error } = await query.limit(1).maybeSingle();

    if (error || !entry) {
      setFeedback("End of manual reached! Clear your history to restart.");
      setLoading(false);
      return;
    }

    // 3. Create a multiple-choice scenario
    const options = [
      entry.content, // Correct
      "Disregard and continue normal operations.",
      "Notify the dispatcher at the end of the tour.",
      "Seek verbal authorization from a fellow operator.",
    ].sort(() => Math.random() - 0.5);

    setScenario({
      id: entry.id,
      title: entry.title,
      question:
        `Situation: A supervisor asks about "${entry.title}". According to the manual, what is the correct protocol?`,
      correct: entry.content,
      options: options,
    });
    setLoading(false);
  };

  const submitAnswer = async (selected: string) => {
    const isCorrect = selected === scenario.correct;

    // Track in quiz_history table
    await supabase.from("quiz_history").insert([{
      manual_id: scenario.id,
      was_correct: isCorrect,
    }]);

    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. The manual states: ${scenario.correct}`,
    );
    setTimeout(generateScenario, 3500);
  };

  useEffect(() => {
    generateScenario();
  }, []);

  if (loading) return <div style={styles.card}>Creating scenario...</div>;

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backLink}>← Back</button>
      {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : (
        <>
          <p style={{ color: "#999", fontSize: "0.8rem", marginBottom: "5px" }}>
            {scenario?.title}
          </p>
          <h3 style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
            {scenario?.question}
          </h3>
          <div style={styles.buttonStack}>
            {scenario?.options.map((opt: string, i: number) => (
              <button
                key={i}
                style={styles.optionButton}
                onClick={() => submitAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- App Entry Point ---
export default function App() {
  const [view, setView] = useState("landing");

  return (
    <div style={styles.wrapper}>
      {view === "landing" && <LandingPage setView={setView} />}
      {view === "search" && <SearchView onBack={() => setView("landing")} />}
      {view === "practice" && (
        <PracticeView
          onBack={() => setView("landing")}
        />
      )}
    </div>
  );
}

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Inter", sans-serif',
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  header: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#2d3436",
  },
  text: { color: "#636e72", marginBottom: "30px" },
  buttonStack: { display: "flex", flexDirection: "column", gap: "12px" },
  mainButton: {
    padding: "16px",
    backgroundColor: "#0984e3",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  secondaryButton: {
    padding: "16px",
    backgroundColor: "#fff",
    color: "#0984e3",
    border: "2px solid #0984e3",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  optionButton: {
    padding: "14px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #dfe6e9",
    marginBottom: "20px",
    boxSizing: "border-box",
    fontSize: "1rem",
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#0984e3",
    cursor: "pointer",
    marginBottom: "20px",
    display: "block",
    fontWeight: "600",
  },
  resultArea: { textAlign: "left", maxHeight: "350px", overflowY: "auto" },
  resultItem: { padding: "15px 0", borderBottom: "1px solid #f1f1f1" },
  feedbackBox: {
    padding: "25px",
    borderRadius: "15px",
    backgroundColor: "#e1f5fe",
    color: "#0277bd",                                                                                                                                                                                                                                                                                                                                                                                             
    fontWeight: "600",
    lineHeight: "1.5",
  },
};
