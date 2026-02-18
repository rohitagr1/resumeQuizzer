"use client";

import React from "react";
import Quiz from "../../components/Quiz";

export default function QuizPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-3xl">
        <Quiz />
      </div>
    </main>
  );
}
