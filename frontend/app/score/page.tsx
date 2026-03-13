"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import {
  createQuizHistoryApi,
  type CreateQuizHistoryPayload,
} from "../../lib/quizHistoryApi";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { QuizState } from "../../types/quiz";

const QUIZ_STORAGE_KEY = "resumeQuizState";

type ScoreResult = {
  questionId: string;
  question: string;
  choices: string[];
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation?: string;
};

type ScoreView = {
  attemptId: string;
  attemptedAt: string;
  score: number;
  total: number;
  scorePercent: number;
  results: ScoreResult[];
};

function buildScoreView(state: QuizState): ScoreView {
  const attemptId = state.attemptId || `attempt_${Date.now()}`;
  const attemptedAt = state.attemptedAt || new Date().toISOString();

  const results = state.questions.map((question, index) => {
    const selectedIndex = state.answers[index] ?? null;
    const correctIndex = question.correctIndex;
    const isCorrect = selectedIndex === correctIndex;

    return {
      questionId: question.id || `q${index + 1}`,
      question: question.text || question.question || `Question ${index + 1}`,
      choices: question.choices,
      selectedIndex,
      correctIndex,
      isCorrect,
      explanation: question.explanation,
    } satisfies ScoreResult;
  });

  const score = results.filter((result) => result.isCorrect).length;
  const total = results.length;
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  return {
    attemptId,
    attemptedAt,
    score,
    total,
    scorePercent,
    results,
  };
}

function buildHistoryPayload(view: ScoreView): CreateQuizHistoryPayload {
  return {
    attemptId: view.attemptId,
    attemptedAt: view.attemptedAt,
    scorePercent: view.scorePercent,
    correctCount: view.score,
    totalQuestions: view.total,
    quizSnapshot: view.results.map((result) => ({
      id: result.questionId,
      text: result.question,
      choices: result.choices,
      correctIndex: result.correctIndex,
      explanation: result.explanation,
    })),
    answerSnapshot: view.results.map((result) => ({
      questionId: result.questionId,
      selectedIndex: result.selectedIndex,
      correctIndex: result.correctIndex,
      isCorrect: result.isCorrect,
      explanation: result.explanation,
    })),
  };
}

export default function ScorePage() {
  const router = useRouter();
  const { user, authLoading } = useFirebaseAuth();
  const [scoreView, setScoreView] = useState<ScoreView | null>(null);
  const [historySaved, setHistorySaved] = useState(false);
  const [historySaveMessage, setHistorySaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as QuizState;
      const view = buildScoreView(parsed);

      if (!parsed.attemptId || !parsed.attemptedAt) {
        const nextState: QuizState = {
          ...parsed,
          attemptId: view.attemptId,
          attemptedAt: view.attemptedAt,
        };
        sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(nextState));
      }

      setScoreView(view);
    } catch {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!scoreView || authLoading || !user || historySaved) {
      return;
    }

    let isCancelled = false;

    const saveHistory = async () => {
      try {
        const payload = buildHistoryPayload(scoreView);
        await createQuizHistoryApi(user, payload);

        if (isCancelled) {
          return;
        }

        setHistorySaved(true);
        setHistorySaveMessage("Saved to Past Quizzes.");
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "";
        if (message.toLowerCase().includes("already")) {
          setHistorySaved(true);
          setHistorySaveMessage("Attempt already saved in Past Quizzes.");
          return;
        }

        setHistorySaveMessage("Could not save this attempt to history.");
      }
    };

    void saveHistory();

    return () => {
      isCancelled = true;
    };
  }, [authLoading, historySaved, scoreView, user]);

  const handleRestart = () => {
    sessionStorage.removeItem(QUIZ_STORAGE_KEY);
    router.push("/");
  };

  if (!scoreView) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <AppHeader backHref="/" backLabel="Back to Home" />

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-2 text-sm muted">Quiz Completed</div>
            <div className="mb-1 text-3xl font-bold accent">
              {scoreView.score} / {scoreView.total}
            </div>
            <div className="mb-3 text-sm muted">Score: {scoreView.scorePercent}%</div>
            <div className="mb-6 text-sm muted">
              Great job. Here is a quick summary of your answers.
            </div>

            {historySaveMessage ? (
              <p className="mb-4 text-xs text-cyan-200">{historySaveMessage}</p>
            ) : null}

            <div className="mb-6 space-y-3 text-left">
              {scoreView.results.map((result, index) => (
                <div
                  key={result.questionId}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="text-sm font-medium text-slate-100">
                    Q{index + 1}: {result.question}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      result.isCorrect ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {result.isCorrect ? "Correct" : "Wrong"}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push("/past-quizzes")}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
              >
                View Past Quizzes
              </button>
              <button
                onClick={handleRestart}
                className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
