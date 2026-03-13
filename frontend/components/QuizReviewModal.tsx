"use client";

import React, { useEffect } from "react";
import { QuizHistoryRecord } from "../types/history";

type QuizReviewModalProps = {
  record: QuizHistoryRecord;
  onClose: () => void;
};

function getStatusClass(isCorrect: boolean): string {
  return isCorrect
    ? "border-green-500/40 bg-green-500/10 text-green-100"
    : "border-red-500/40 bg-red-500/10 text-red-100";
}

export default function QuizReviewModal({ record, onClose }: QuizReviewModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const scoreLabel = `${record.correctCount} / ${record.totalQuestions}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="glass w-full max-w-3xl rounded-2xl border border-white/15">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300">Past Quiz Review</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Score {scoreLabel}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto p-5">
          {record.quizSnapshot.map((question, index) => {
            const answer =
              record.answerSnapshot.find((item) => item.questionId === question.id) ||
              record.answerSnapshot[index];

            return (
              <div key={question.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-100">
                    Q{index + 1}. {question.text}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      answer?.isCorrect ?? false,
                    )}`}
                  >
                    {answer?.isCorrect ? "Correct" : "Wrong"}
                  </span>
                </div>

                <div className="space-y-2">
                  {question.choices.map((choice, choiceIndex) => {
                    const isSelected = answer?.selectedIndex === choiceIndex;
                    const isCorrect = question.correctIndex === choiceIndex;

                    let choiceClass =
                      "rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-slate-200";

                    if (isCorrect) {
                      choiceClass =
                        "rounded-lg border border-green-500/40 bg-green-500/15 px-3 py-2 text-sm text-green-100";
                    } else if (isSelected) {
                      choiceClass =
                        "rounded-lg border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-100";
                    }

                    return (
                      <div key={`${question.id}-${choiceIndex}`} className={choiceClass}>
                        <div className="flex items-center justify-between gap-3">
                          <span>{choice}</span>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
                            {isSelected ? (
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-slate-100">Your answer</span>
                            ) : null}
                            {isCorrect ? (
                              <span className="rounded-full bg-green-600/30 px-2 py-0.5 text-green-100">Correct</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-slate-300">
                  {answer?.explanation || question.explanation || "No explanation available."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
