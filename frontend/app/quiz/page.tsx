"use client";

import React from "react";
import Quiz from "../../components/Quiz";
import AppHeader from "../../components/AppHeader";

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <AppHeader backHref="/" backLabel="Back to Home" />
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <Quiz />
        </div>
      </div>
    </main>
  );
}

