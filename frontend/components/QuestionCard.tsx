"use client";

import React from "react";
import { Question } from "../types/quiz";

type Props = {
  question: Question;
  selected: number | null;
  onSelect: (index: number) => void;
};

export default function QuestionCard({ question, selected, onSelect }: Props) {
  const text = question.text || question.question || "Untitled question";

  return (
    <div>
      <div className="mb-4 text-lg font-semibold">{text}</div>

      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const isSelected = selected === index;
          const isCorrect = question.correctIndex === index;

          let buttonClass =
            "w-full rounded-lg border p-3 text-left font-medium transition";

          if (selected === null) {
            buttonClass += " border-gray-200 bg-white text-gray-900 hover:shadow-sm";
          } else if (isCorrect) {
            buttonClass += " option-correct";
          } else if (isSelected) {
            buttonClass += " option-wrong";
          } else {
            buttonClass += " border-gray-100 bg-white text-gray-900 opacity-90";
          }

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={selected !== null}
              className={buttonClass}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-base font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1">{choice}</div>
                {selected !== null && isCorrect ? (
                  <div className="text-sm font-semibold text-green-700">Correct</div>
                ) : null}
                {selected !== null && isSelected && !isCorrect ? (
                  <div className="text-sm font-semibold text-red-700">Wrong</div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null ? (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
          <div className="mb-1 text-sm font-semibold">Explanation</div>
          <div className="text-sm">{question.explanation || "No explanation provided."}</div>
        </div>
      ) : null}
    </div>
  );
}
