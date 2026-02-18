"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Question, QuizState } from "../types/quiz";
import QuestionCard from "./QuestionCard";

const STORAGE_KEY = "resumeQuizState";

export default function Quiz(): JSX.Element {
  const router = useRouter();
  const [state, setState] = useState<QuizState | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as QuizState;
      setState(parsed);
    } catch (e) {
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/");
    }
  }, [router]);

  if (!state) return <div className="text-center p-8">Loading…</div>;

  const { questions, currentIndex, answers } = state;
  const q: Question = questions[currentIndex];

  const answered = answers[currentIndex] !== null;

  const handleSelect = (choiceIndex: number) => {
    if (answered) return; // already answered
    const next = { ...state, answers: [...state.answers] } as QuizState;
    next.answers[currentIndex] = choiceIndex;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const handleNext = () => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.questions.length) {
      router.push("/score");
      return;
    }
    const next = { ...state, currentIndex: nextIndex };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const progress = Math.round(((currentIndex + (answered ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm muted">Question {currentIndex + 1} of {questions.length}</div>
        <div className="text-sm font-medium accent">{progress}%</div>
      </div>

      <div className="w-full h-2 bg-white/8 rounded-full mb-4 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${progress}%` }} />
      </div>

      <QuestionCard
        question={q}
        selected={answers[currentIndex]}
        onSelect={handleSelect}
      />

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xs muted">Answer once to continue</div>
        <button
          onClick={handleNext}
          disabled={!answered}
          className={`px-4 py-2 rounded-lg text-sm text-white font-medium ${answered ? 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' : 'bg-gray-200 cursor-not-allowed'}`}
        >
          {currentIndex + 1 >= questions.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
