"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ScorePage() {
  const router = useRouter();
  const raw = typeof window !== "undefined" ? sessionStorage.getItem("resumeQuizState") : null;
  let score = 0;
  let total = 0;
  let results: Array<{ correct: boolean; question: string; selected: number | null; correctIndex: number }> = [];

  if (raw) {
    try {
      const state = JSON.parse(raw);
      const { questions, answers } = state;
      total = questions.length;
      results = questions.map((q: any, idx: number) => {
        const sel = answers[idx];
        const correct = sel === q.correctIndex;
        if (correct) score += 1;
        return { correct, question: q.text || q.question, selected: sel, correctIndex: q.correctIndex };
      });
    } catch (e) {
      // ignore
    }
  }

  const handleRestart = () => {
    sessionStorage.removeItem("resumeQuizState");
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-xl">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="text-sm muted mb-2">Quiz Completed</div>
          <div className="text-3xl font-bold mb-2 accent">{score} / {total}</div>
          <div className="text-sm muted mb-6">Great job — here's a quick summary of your answers.</div>

          <div className="space-y-3 mb-6">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/8 bg-white/6">
                <div className="text-sm font-medium">Q{i + 1}: {r.question}</div>
                <div className={`text-sm font-semibold ${r.correct ? 'text-green-400' : 'text-red-400'}`}>{r.correct ? 'Correct' : 'Wrong'}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={handleRestart} className="px-4 py-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">Restart</button>
          </div>
        </div>
      </div>
    </main>
  );
}
