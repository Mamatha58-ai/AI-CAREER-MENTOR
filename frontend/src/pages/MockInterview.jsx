import { useState, useEffect, useRef } from "react";
import "./MockInterview.css";

const QUESTIONS = {
  JavaScript: [
    { q: "What does 'typeof null' return in JavaScript?",
      opts: ["'null'", "'object'", "'undefined'", "'boolean'"], ans: 1,
      exp: "typeof null returns 'object' — a well-known JavaScript bug that was never fixed for backward compatibility." },
    { q: "Which method removes the last element from an array?",
      opts: ["shift()", "pop()", "splice()", "slice()"], ans: 1,
      exp: "pop() removes and returns the last element. shift() removes the first." },
    { q: "What is a closure?",
      opts: ["A loop construct", "A function with access to its outer scope variables", "A type of array", "An async pattern"], ans: 1,
      exp: "A closure is a function that retains access to its outer scope's variables even after the outer function has returned." },
    { q: "What does === check?",
      opts: ["Value only", "Type only", "Value and type", "Reference"], ans: 2,
      exp: "=== is strict equality — checks both value and type without coercion." },
    { q: "Which keyword declares a block-scoped variable?",
      opts: ["var", "let", "function", "global"], ans: 1,
      exp: "let and const are block-scoped. var is function-scoped." },
    { q: "What is the output of: console.log(0.1 + 0.2 === 0.3)?",
      opts: ["true", "false", "NaN", "undefined"], ans: 1,
      exp: "Floating-point arithmetic means 0.1 + 0.2 equals 0.30000000000000004, not 0.3." },
    { q: "What is event delegation?",
      opts: ["Passing events to child components", "Attaching one listener to a parent to handle child events", "Removing event listeners", "Async event handling"], ans: 1,
      exp: "Event delegation uses event bubbling — one parent listener handles events from all child elements via event.target." },
    { q: "What does Array.prototype.map() return?",
      opts: ["The original array", "A new array with transformed elements", "A boolean", "undefined"], ans: 1,
      exp: "map() returns a NEW array with each element transformed by the callback. It does not mutate the original." },
    { q: "What is the purpose of 'use strict'?",
      opts: ["Enables ES6 features", "Enforces stricter parsing and error handling", "Disables console.log", "Enables async/await"], ans: 1,
      exp: "'use strict' prevents silent errors, disallows duplicate params, and throws errors on bad syntax." },
    { q: "What does Promise.all() do?",
      opts: ["Runs promises one by one", "Runs all promises in parallel and resolves when all resolve", "Resolves on the first fulfilled promise", "Ignores rejected promises"], ans: 1,
      exp: "Promise.all() runs in parallel and resolves when ALL promises resolve; rejects immediately if any one rejects." },
  ],
  Python: [
    { q: "What is the output of: type([])?",
      opts: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'set'>"], ans: 1,
      exp: "[] creates a list in Python. type([]) returns <class 'list'>." },
    { q: "Which of these creates a dictionary?",
      opts: ["[]", "()", "{}", "set()"], ans: 2,
      exp: "{} with key-value pairs creates a dict. {} alone also creates an empty dict; set() creates an empty set." },
    { q: "What does the 'pass' statement do?",
      opts: ["Exits the function", "Does nothing — a placeholder", "Skips to the next iteration", "Returns None"], ans: 1,
      exp: "pass is a null statement used as a placeholder where Python expects code but you don't want any action." },
    { q: "How do you make a class method accessible without instantiation?",
      opts: ["@classmethod", "@staticmethod", "@property", "@abstractmethod"], ans: 1,
      exp: "@staticmethod makes a method callable on the class itself without needing an instance or cls/self." },
    { q: "What does 'list[::-1]' do?",
      opts: ["Removes last element", "Returns a reversed copy", "Sorts the list", "Returns the last element"], ans: 1,
      exp: "Slicing with step -1 ([: :-1]) returns a reversed copy of the list without modifying the original." },
    { q: "What is a generator in Python?",
      opts: ["A class that generates instances", "A function that yields values lazily", "A built-in type", "A decorator"], ans: 1,
      exp: "A generator function uses yield to produce values one at a time, saving memory compared to building a whole list." },
    { q: "What is the difference between deepcopy and copy?",
      opts: ["No difference", "deepcopy copies nested objects too", "copy copies nested objects", "deepcopy is faster"], ans: 1,
      exp: "copy() is a shallow copy — nested objects are still shared. deepcopy() recursively copies everything." },
    { q: "What does enumerate() do?",
      opts: ["Sorts a list", "Returns index-value pairs", "Converts to string", "Removes duplicates"], ans: 1,
      exp: "enumerate() wraps an iterable and yields (index, value) tuples, so you get both the index and the item." },
    { q: "What is a lambda function?",
      opts: ["A named function", "An anonymous one-line function", "A built-in function", "A class method"], ans: 1,
      exp: "lambda creates an anonymous function: lambda x: x*2 is equivalent to def f(x): return x*2." },
    { q: "What does __init__ do in a Python class?",
      opts: ["Destroys the instance", "Initialises a new instance", "Defines class variables", "Imports the class"], ans: 1,
      exp: "__init__ is the constructor — it runs when a new instance is created and sets up initial state." },
  ],
  React: [
    { q: "What hook would you use to run code after render?",
      opts: ["useState", "useEffect", "useContext", "useReducer"], ans: 1,
      exp: "useEffect runs after every render (or only when deps change). Perfect for side effects like fetching data." },
    { q: "What does the key prop do in a list?",
      opts: ["Styles the element", "Helps React identify changed items", "Passes data to children", "Prevents re-renders"], ans: 1,
      exp: "key helps React's reconciliation algorithm detect which items were added, removed, or reordered." },
    { q: "What is prop drilling?",
      opts: ["Passing props through many nested components", "Adding too many props", "Validating prop types", "Memoising props"], ans: 0,
      exp: "Prop drilling means passing props down multiple component levels even when intermediate components don't use them." },
    { q: "What does useMemo do?",
      opts: ["Caches a component", "Memoises a computed value", "Creates a ref", "Subscribes to context"], ans: 1,
      exp: "useMemo caches the result of a function between renders, recomputing only when its dependencies change." },
    { q: "What is the difference between controlled and uncontrolled components?",
      opts: ["Controlled uses state; uncontrolled uses the DOM directly", "No difference", "Controlled is faster", "Uncontrolled uses props"], ans: 0,
      exp: "Controlled: form state in React state. Uncontrolled: form state in DOM (via ref). Controlled gives you more control." },
    { q: "When does a component re-render?",
      opts: ["Only on prop changes", "On state or prop changes", "Every second", "Only on parent re-render"], ans: 1,
      exp: "A component re-renders when its state changes, its parent re-renders, or context it subscribes to changes." },
    { q: "What does React.Fragment do?",
      opts: ["Creates a portal", "Wraps children without adding a DOM node", "Lazy loads a component", "Suspends rendering"], ans: 1,
      exp: "Fragment lets you group elements without adding an extra div to the DOM." },
    { q: "What is the purpose of useCallback?",
      opts: ["Caches a value", "Memoises a function reference", "Creates state", "Handles side effects"], ans: 1,
      exp: "useCallback returns a memoised version of a callback, preventing unnecessary re-renders in child components." },
    { q: "What is Reconciliation in React?",
      opts: ["Fetching remote data", "The process of comparing old and new virtual DOM", "Managing state", "Routing between pages"], ans: 1,
      exp: "Reconciliation is React's diffing algorithm that compares the previous and new virtual DOM trees to update only what changed." },
    { q: "What does createContext() return?",
      opts: ["A hook", "A context object with Provider and Consumer", "A state object", "A reducer"], ans: 1,
      exp: "createContext() returns an object with a Provider (to supply the value) and Consumer (to read it)." },
  ],
  SQL: [
    { q: "Which clause filters rows AFTER aggregation?",
      opts: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], ans: 1,
      exp: "HAVING filters groups produced by GROUP BY. WHERE filters individual rows before any aggregation." },
    { q: "What does DISTINCT do?",
      opts: ["Sorts results", "Removes duplicate rows", "Joins tables", "Counts rows"], ans: 1,
      exp: "DISTINCT eliminates duplicate rows from the result set." },
    { q: "Which JOIN returns all rows from the left table?",
      opts: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"], ans: 1,
      exp: "LEFT JOIN returns all left-table rows plus matching right-table rows; NULLs where no match." },
    { q: "What does COUNT(*) count?",
      opts: ["Non-NULL values only", "All rows including NULLs", "Distinct values", "Numeric columns only"], ans: 1,
      exp: "COUNT(*) counts all rows. COUNT(column) counts only non-NULL values in that column." },
    { q: "What is a PRIMARY KEY?",
      opts: ["Any indexed column", "A column that uniquely identifies each row and cannot be NULL", "A foreign reference", "An auto-increment only"], ans: 1,
      exp: "A PRIMARY KEY uniquely identifies every row. It is automatically NOT NULL and indexed." },
    { q: "What does TRUNCATE do vs DELETE?",
      opts: ["Same thing", "TRUNCATE removes all rows faster, cannot be rolled back easily", "DELETE is faster", "TRUNCATE drops the table"], ans: 1,
      exp: "TRUNCATE removes all rows very fast and resets identity counters but cannot be filtered with WHERE. DELETE is logged and can be rolled back." },
    { q: "What is a subquery?",
      opts: ["A stored procedure", "A query nested inside another query", "A view", "A trigger"], ans: 1,
      exp: "A subquery is a SELECT inside another statement. It runs first and passes results to the outer query." },
    { q: "What does the COALESCE function do?",
      opts: ["Rounds a number", "Returns the first non-NULL argument", "Concatenates strings", "Converts types"], ans: 1,
      exp: "COALESCE(a, b, c) returns the first non-NULL value in the list — useful for providing fallback values." },
    { q: "What is an index used for?",
      opts: ["Sorting data permanently", "Speeding up row lookups", "Enforcing uniqueness only", "Joining tables"], ans: 1,
      exp: "An index is a data structure that makes lookups faster. Without it, queries do a full table scan." },
    { q: "What is a FOREIGN KEY?",
      opts: ["A primary key in disguise", "A column referencing a primary key in another table", "An encrypted column", "A unique constraint"], ans: 1,
      exp: "A FOREIGN KEY enforces referential integrity — its values must exist in the referenced table's primary key." },
  ],
  DSA: [
    { q: "What is the time complexity of binary search?",
      opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1,
      exp: "Binary search halves the search space each step, giving O(log n) time." },
    { q: "Which data structure uses LIFO order?",
      opts: ["Queue", "Stack", "Heap", "Graph"], ans: 1,
      exp: "Stack is Last In First Out. The last pushed element is the first popped." },
    { q: "What is the worst-case complexity of quicksort?",
      opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], ans: 1,
      exp: "Quicksort's worst case is O(n²) when the pivot is always the smallest or largest element (e.g. sorted input without randomization)." },
    { q: "What is a hash table collision?",
      opts: ["Table overflow", "Two keys mapping to the same bucket", "A missing key", "An empty table"], ans: 1,
      exp: "A collision happens when two different keys hash to the same index. Resolved via chaining or open addressing." },
    { q: "What is dynamic programming?",
      opts: ["Sorting algorithm", "Solving problems by storing subproblem results", "A graph traversal", "A data structure"], ans: 1,
      exp: "Dynamic programming breaks problems into overlapping subproblems and caches results to avoid recomputation." },
    { q: "What is BFS used for?",
      opts: ["Finding shortest path in weighted graphs", "Finding shortest path in unweighted graphs", "Sorting arrays", "Searching trees depth-first"], ans: 1,
      exp: "BFS (Breadth-First Search) explores level by level — ideal for shortest path in unweighted graphs." },
    { q: "What is the space complexity of an array of n elements?",
      opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], ans: 1,
      exp: "Storing n elements requires O(n) space." },
    { q: "Which sorting algorithm has the best average case?",
      opts: ["Bubble sort", "Merge sort", "Insertion sort", "Selection sort"], ans: 1,
      exp: "Merge sort guarantees O(n log n) in all cases. Quicksort is often faster in practice but has an O(n²) worst case." },
    { q: "What is a linked list?",
      opts: ["An array with pointers", "A sequence of nodes where each node points to the next", "A hash map", "A binary tree"], ans: 1,
      exp: "A linked list stores elements in nodes; each node holds a value and a pointer to the next node." },
    { q: "What is memoization?",
      opts: ["A memory allocation strategy", "Caching function results to avoid recomputation", "A sorting technique", "A graph algorithm"], ans: 1,
      exp: "Memoization stores the results of expensive function calls and returns the cached result when the same inputs occur again." },
  ],
};

const TOPICS = Object.keys(QUESTIONS);

const TOPIC_META = {
  JavaScript: { color: "#f59e0b", icon: "🟨", desc: "ES6+, closures, async, DOM" },
  Python:     { color: "#3b82f6", icon: "🐍", desc: "OOP, decorators, data structures" },
  React:      { color: "#06b6d4", icon: "⚛️",  desc: "Hooks, rendering, state management" },
  SQL:        { color: "#10b981", icon: "🗄️",  desc: "Queries, joins, aggregations" },
  DSA:        { color: "#a855f7", icon: "🧩", desc: "Algorithms, data structures, complexity" },
};

const SECS_PER_Q = 30;

export default function MockInterview() {
  // screen: "setup" | "test" | "result" | "review"
  const [screen,    setScreen]    = useState("setup");
  const [topic,     setTopic]     = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx,      setQIdx]      = useState(0);
  const [answers,   setAnswers]   = useState({});   // { qIdx: chosenOptIndex }
  const [timeLeft,  setTimeLeft]  = useState(SECS_PER_Q);
  const [timerOn,   setTimerOn]   = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleNext(true); return SECS_PER_Q; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerOn, qIdx]);

  function startTest(t) {
    const qs = [...QUESTIONS[t]].sort(() => Math.random() - 0.5).slice(0, 10);
    setTopic(t);
    setQuestions(qs);
    setQIdx(0);
    setAnswers({});
    setTimeLeft(SECS_PER_Q);
    setTimerOn(true);
    setScreen("test");
  }

  function handleSelect(optIdx) {
    if (answers[qIdx] !== undefined) return;   // already answered
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));
    clearInterval(timerRef.current);
    setTimerOn(false);
  }

  function handleNext(autoSkip = false) {
    clearInterval(timerRef.current);
    if (qIdx + 1 >= questions.length) {
      setTimerOn(false);
      setScreen("result");
      return;
    }
    setQIdx(i => i + 1);
    setTimeLeft(SECS_PER_Q);
    setTimerOn(true);
  }

  function restartSetup() {
    clearInterval(timerRef.current);
    setTimerOn(false);
    setScreen("setup");
    setTopic(null);
  }

  // Scoring
  const score  = questions.reduce((acc, q, i) => acc + (answers[i] === q.ans ? 1 : 0), 0);
  const total  = questions.length;
  const pct    = total ? Math.round((score / total) * 100) : 0;
  const meta   = topic ? TOPIC_META[topic] : null;

  // Timer colour
  const timerColor = timeLeft > 15 ? "#10b981" : timeLeft > 8 ? "#f59e0b" : "#f43f5e";

  // ── SETUP SCREEN ──────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div className="mi-page">
        <div className="mi-header">
          <h1>🎤 Mock Interview</h1>
          <p>Choose a topic to start a 10-question timed test. You have {SECS_PER_Q}s per question.</p>
        </div>
        <div className="mi-topic-grid">
          {TOPICS.map(t => {
            const m = TOPIC_META[t];
            return (
              <button
                key={t}
                className="mi-topic-card"
                style={{ "--tc": m.color }}
                onClick={() => startTest(t)}
              >
                <span className="mi-topic-icon">{m.icon}</span>
                <span className="mi-topic-name">{t}</span>
                <span className="mi-topic-desc">{m.desc}</span>
                <span className="mi-topic-start">Start test →</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── TEST SCREEN ───────────────────────────────────────────
  if (screen === "test") {
    const q       = questions[qIdx];
    const chosen  = answers[qIdx];
    const answered = chosen !== undefined;

    return (
      <div className="mi-page">
        <div className="mi-test-topbar">
          <div className="mi-test-info">
            <span className="mi-test-topic" style={{ color: meta.color }}>{meta.icon} {topic}</span>
            <span className="mi-test-qcount">Q {qIdx + 1} / {total}</span>
          </div>
          <div className="mi-timer" style={{ color: timerColor, borderColor: timerColor }}>
            <span className="mi-timer-val">{timeLeft}s</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mi-bar-track" style={{ marginBottom: 24 }}>
          <div className="mi-bar-fill" style={{ width: `${((qIdx + 1) / total) * 100}%`, background: meta.color }} />
        </div>

        {/* Question */}
        <div className="mi-q-card" style={{ "--tc": meta.color }}>
          <div className="mi-q-num">Question {qIdx + 1}</div>
          <p className="mi-q-text">{q.q}</p>
        </div>

        {/* Options */}
        <div className="mi-options">
          {q.opts.map((opt, i) => {
            let cls = "mi-option";
            if (answered) {
              if (i === q.ans)    cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (chosen === i) {
              cls += " selected";
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="mi-opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        {answered && (
          <div className="mi-feedback" style={{ "--tc": meta.color }}>
            <div className="mi-feedback-label">
              {answers[qIdx] === q.ans ? "✅ Correct!" : "❌ Incorrect"}
            </div>
            <p className="mi-feedback-exp">{q.exp}</p>
            <button className="mi-next-btn" style={{ "--tc": meta.color }} onClick={() => handleNext()}>
              {qIdx + 1 >= total ? "See Results →" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── RESULT SCREEN ─────────────────────────────────────────
  if (screen === "result") {
    const verdict =
      pct >= 80 ? { label: "Excellent!", color: "#10b981", note: "You're well prepared for this topic." }
    : pct >= 60 ? { label: "Good job!", color: "#f59e0b", note: "A bit more practice and you'll nail it." }
    :             { label: "Keep going!", color: "#f43f5e", note: "Review the topics and try again." };

    return (
      <div className="mi-page">
        <div className="mi-header">
          <h1>📊 Your Results</h1>
          <p>{meta.icon} {topic} — {total}-question mock test</p>
        </div>

        <div className="mi-score-card">
          <div className="mi-score-ring-wrap">
            <svg viewBox="0 0 100 100" className="mi-score-ring">
              <circle cx="50" cy="50" r="40" className="mi-ring-track" />
              <circle
                cx="50" cy="50" r="40"
                className="mi-ring-fill"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                style={{ stroke: verdict.color }}
              />
            </svg>
            <span className="mi-score-pct" style={{ color: verdict.color }}>{pct}%</span>
          </div>
          <div className="mi-score-details">
            <div className="mi-score-verdict" style={{ color: verdict.color }}>{verdict.label}</div>
            <div className="mi-score-fraction">{score} / {total} correct</div>
            <div className="mi-score-note">{verdict.note}</div>
          </div>
        </div>

        <div className="mi-result-actions">
          <button className="mi-btn-outline" onClick={() => setScreen("review")}>Review Answers</button>
          <button className="mi-btn-primary" style={{ "--tc": meta.color }} onClick={() => startTest(topic)}>Retry Test</button>
          <button className="mi-btn-ghost" onClick={restartSetup}>Change Topic</button>
        </div>
      </div>
    );
  }

  // ── REVIEW SCREEN ─────────────────────────────────────────
  return (
    <div className="mi-page">
      <div className="mi-header">
        <button className="mi-back-btn" onClick={() => setScreen("result")}>← Back to results</button>
        <h1>📋 Answer Review</h1>
        <p>See every question, your choice, and the correct answer.</p>
      </div>

      <div className="mi-review-list">
        {questions.map((q, i) => {
          const chosen  = answers[i];
          const correct = q.ans;
          const isRight = chosen === correct;
          return (
            <div key={i} className={`mi-review-item${isRight ? " ri-ok" : " ri-wrong"}`}>
              <div className="mi-review-top">
                <span className="mi-review-num">Q{i + 1}</span>
                <span className="mi-review-verdict">{isRight ? "✅ Correct" : "❌ Wrong"}</span>
              </div>
              <p className="mi-review-q">{q.q}</p>
              <div className="mi-review-opts">
                {q.opts.map((opt, oi) => {
                  let cls = "mi-review-opt";
                  if (oi === correct)                    cls += " rev-correct";
                  else if (oi === chosen && !isRight)    cls += " rev-wrong";
                  return (
                    <div key={oi} className={cls}>
                      <span className="mi-opt-letter">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </div>
                  );
                })}
              </div>
              <div className="mi-review-exp">{q.exp}</div>
            </div>
          );
        })}
      </div>

      <button className="mi-btn-primary" style={{ "--tc": meta.color, marginTop: 24 }} onClick={() => setScreen("result")}>
        ← Back to Results
      </button>
    </div>
  );
}
