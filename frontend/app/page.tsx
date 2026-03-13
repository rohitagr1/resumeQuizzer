"use client";

import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import { auth, ensureAuthPersistence, googleProvider } from "../lib/firebase";
import { getFirebaseAuthErrorMessage } from "../lib/authError";
import { Question } from "../types/quiz";

function createAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `attempt_${Date.now()}`;
}

function normalizeQuestions(rawQuestions: unknown): Question[] {
  if (!Array.isArray(rawQuestions)) {
    return [];
  }

  return rawQuestions.reduce<Question[]>((accumulator, rawQuestion, index) => {
    if (!rawQuestion || typeof rawQuestion !== "object") {
      return accumulator;
    }

    const source = rawQuestion as {
      id?: string;
      text?: string;
      question?: string;
      choices?: unknown;
      options?: unknown;
      correctIndex?: number;
      explanation?: string;
    };

    const text = source.text || source.question;
    const choices = Array.isArray(source.choices)
      ? source.choices
      : Array.isArray(source.options)
        ? source.options
        : [];

    if (!text || !Array.isArray(choices) || choices.length !== 4) {
      return accumulator;
    }

    const correctIndex = Number(source.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      return accumulator;
    }

    accumulator.push({
      id: source.id || `q${index + 1}`,
      text,
      choices: choices.map((choice) => String(choice)),
      correctIndex,
      explanation: source.explanation,
    });

    return accumulator;
  }, []);
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a resume PDF first.");
      return;
    }

    setLoading(true);

    try {
      await ensureAuthPersistence();

      let user = auth.currentUser;
      if (!user) {
        const signInResult = await signInWithPopup(auth, googleProvider);
        user = signInResult.user;
      }

      if (!user) {
        throw new Error("Authentication failed. Please try again.");
      }

      const idToken = await user.getIdToken();

      const formData = new FormData();
      formData.append("resume", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/generate-questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate questions.");
      }

      const normalizedQuestions = normalizeQuestions(data?.questions);
      if (normalizedQuestions.length === 0) {
        throw new Error("Invalid questions response from server.");
      }

      const quizData = {
        attemptId: createAttemptId(),
        attemptedAt: new Date().toISOString(),
        questions: normalizedQuestions,
        currentIndex: 0,
        answers: Array(normalizedQuestions.length).fill(null),
      };

      sessionStorage.setItem("resumeQuizState", JSON.stringify(quizData));
      router.push("/quiz");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "code" in error
          ? getFirebaseAuthErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "Something went wrong while generating questions.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <AppHeader />

      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl mx-auto">
          <div className="glass p-8 rounded-2xl text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl">PDF</span>
            </div>

            <h1 className="text-2xl font-semibold mb-2">Resume MCQ Generator</h1>
            <p className="text-sm muted mb-6">
              Upload a PDF resume to generate short, targeted multiple-choice questions.
            </p>

            <label htmlFor="file" className="block">
              <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg py-6 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-sm font-medium">Drag and drop or click to select a PDF</div>
                  <div className="text-xs muted mt-1">Login is required before generating questions.</div>
                </div>
              </div>
            </label>

            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setFile(null);
                  setFileName(null);
                }}
                className="py-2 px-4 rounded-lg border border-white/8 text-sm muted"
              >
                Clear
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  loading
                    ? "bg-white/20 text-white"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                }`}
              >
                {loading ? "Generating..." : "Generate Questions"}
              </button>
            </div>

            {fileName ? <p className="mt-4 text-xs muted">Selected file: {fileName}</p> : null}
          </div>
        </div>
      </div>
    </main>
  );
}

