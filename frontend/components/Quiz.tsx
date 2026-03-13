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
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/");
    }
  }, [router]);

  if (!state) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const { questions, currentIndex, answers } = state;
  const question: Question = questions[currentIndex];

  const answered = answers[currentIndex] !== null;

  const handleSelect = (choiceIndex: number) => {
    if (answered) {
      return;
    }

    const nextState: QuizState = {
      ...state,
      answers: [...state.answers],
    };
    nextState.answers[currentIndex] = choiceIndex;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setState(nextState);
  };

  const handleNext = () => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.questions.length) {
      router.push("/score");
      return;
    }

    const nextState: QuizState = {
      ...state,
      currentIndex: nextIndex,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setState(nextState);
  };

  const progress = Math.round(
    ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100,
  );

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm muted">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium accent">{progress}%</div>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <QuestionCard
        question={question}
        selected={answers[currentIndex]}
        onSelect={handleSelect}
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs muted">Answer once to continue</div>
        <button
          onClick={handleNext}
          disabled={!answered}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            answered
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              : "cursor-not-allowed bg-gray-300"
          }`}
        >
          {currentIndex + 1 >= questions.length ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
