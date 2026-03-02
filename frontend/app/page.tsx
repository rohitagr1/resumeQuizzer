"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, ensureAuthPersistence, googleProvider } from "../lib/firebase";

function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";

  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in was closed before completion.";
  }

  if (code === "auth/popup-blocked") {
    return "Popup was blocked by the browser. Enable popups and try again.";
  }

  if (code === "auth/cancelled-popup-request") {
    return "Another sign-in attempt is already in progress.";
  }

  return "Unable to sign in with Google right now. Please try again.";
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
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

      if (!Array.isArray(data?.questions) || data.questions.length === 0) {
        throw new Error("Invalid questions response from server.");
      }

      const quizData = {
        questions: data.questions,
        currentIndex: 0,
        answers: Array(data.questions.length).fill(null),
      };

      sessionStorage.setItem("resumeQuizState", JSON.stringify(quizData));
      router.push("/quiz");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "code" in error
          ? getAuthErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "Something went wrong while generating questions.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-xl mx-auto">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-inner">
            <span className="text-3xl">PDF</span>
          </div>

          <h1 className="text-2xl font-semibold mb-2">Resume MCQ Generator</h1>
          <p className="text-sm muted mb-6">Upload a PDF resume to generate short, targeted multiple-choice questions.</p>

          <label htmlFor="file" className="block">
            <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg py-6 cursor-pointer hover:border-white/20 transition">
              <div>
                <div className="text-sm font-medium">Drag and drop or click to select a PDF</div>
                <div className="text-xs muted mt-1">Google sign-in appears only when you click Generate Questions.</div>
              </div>
            </div>
          </label>

          <input id="file" type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />

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
              className={`py-2 px-4 rounded-lg text-sm font-medium ${loading ? "bg-white/20 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"}`}
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>

          {fileName && <p className="mt-4 text-xs muted">Selected file: {fileName}</p>}
        </div>
      </div>
    </main>
  );
}
