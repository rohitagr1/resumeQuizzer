"use client";

import React from "react";
import { Question } from "../types/quiz";

type Props = {
  question: Question;
  selected: number | null;
  onSelect: (index: number) => void;
};

export default function QuestionCard({ question, selected, onSelect }: Props) {
  const text = question.text ?? (question as any).question;

  return (
    <div>
      <div className="text-lg font-semibold mb-4">{text}</div>

      <div className="space-y-3">
        {question.choices.map((c, i) => {
          const isSelected = selected === i;
          const isCorrect = question.correctIndex === i;

          let base = "w-full text-left p-3 rounded-lg border transition font-medium";
          if (selected === null) {
            base += " border-gray-200 hover:shadow-sm bg-white text-gray-900";
          } else if (isCorrect) {
            base += " option-correct";
          } else if (isSelected) {
            base += " option-wrong";
          } else {
            base += " border-gray-100 bg-white text-gray-900 opacity-90";
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={selected !== null}
              className={base}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1">{c}</div>
                {selected !== null && isCorrect && <div className="text-green-700 text-xl font-bold">✓</div>}
                {selected !== null && isSelected && !isCorrect && <div className="text-red-700 text-xl font-bold">✕</div>}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 text-sm text-gray-700 border border-gray-100">
          <div className="font-semibold text-sm mb-1">Explanation</div>
          <div className="text-sm">{question.explanation}</div>
        </div>
      )}
    </div>
  );
}
