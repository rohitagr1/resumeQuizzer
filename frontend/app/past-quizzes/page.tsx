"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import QuizReviewModal from "../../components/QuizReviewModal";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import {
  selectQuizHistoryApi,
  showQuizHistoryApi,
} from "../../lib/quizHistoryApi";
import { QuizHistoryRecord } from "../../types/history";

type HistoryStatus = "idle" | "loading" | "success" | "error";

function formatAttemptDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreBadgeClass(scorePercent: number): string {
  if (scorePercent >= 75) {
    return "border-green-500/40 bg-green-500/15 text-green-100";
  }

  if (scorePercent >= 50) {
    return "border-yellow-500/40 bg-yellow-500/15 text-yellow-100";
  }

  return "border-red-500/40 bg-red-500/15 text-red-100";
}

export default function PastQuizzesPage() {
  const router = useRouter();
  const { user, authLoading, authActionLoading, loginWithGoogle } = useFirebaseAuth();
  const [historyStatus, setHistoryStatus] = useState<HistoryStatus>("idle");
  const [historyError, setHistoryError] = useState<string>("");
  const [historyRecords, setHistoryRecords] = useState<QuizHistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<QuizHistoryRecord | null>(null);
  const [openRecordId, setOpenRecordId] = useState<string | null>(null);
  const [openRecordError, setOpenRecordError] = useState<string>("");

  const loadHistory = useCallback(async () => {
    if (!user) {
      setHistoryRecords([]);
      setHistoryStatus("success");
      setHistoryError("");
      return;
    }

    setHistoryStatus("loading");
    setHistoryError("");

    try {
      const records = await showQuizHistoryApi(user);
      setHistoryRecords(records);
      setHistoryStatus("success");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to load past quizzes right now.";
      setHistoryStatus("error");
      setHistoryError(message);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void loadHistory();
  }, [authLoading, loadHistory]);

  const emptyStateMessage = useMemo(() => {
    if (!user) {
      return "Login to view your quiz history.";
    }

    return "No quizzes yet. Complete a quiz and it will appear here.";
  }, [user]);

  const handleRetry = () => {
    void loadHistory();
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to login.";
      alert(message);
    }
  };

  const handleOpenRecord = async (record: QuizHistoryRecord) => {
    if (!user) {
      return;
    }

    setOpenRecordError("");
    setOpenRecordId(record.id);

    try {
      const detailedRecord = await selectQuizHistoryApi(user, record.id);
      setSelectedRecord(detailedRecord);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to open quiz detail.";
      setOpenRecordError(message);
    } finally {
      setOpenRecordId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <AppHeader backHref="/" backLabel="Back to Home" hidePastQuizzesInMenu />

      <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white">Past Quizzes</h1>
              <p className="mt-1 text-sm muted">Latest attempts appear first.</p>
            </div>
            {user ? (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {user.email}
              </span>
            ) : null}
          </div>

          {authLoading || historyStatus === "loading" ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              <p className="text-sm text-slate-200">Loading past quizzes...</p>
            </div>
          ) : null}

          {!authLoading && !user ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-slate-200">{emptyStateMessage}</p>
              <button
                onClick={handleLogin}
                disabled={authActionLoading}
                className="mt-4 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authActionLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          ) : null}

          {!authLoading && user && historyStatus === "error" ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-200">{historyError}</p>
              <button
                onClick={handleRetry}
                className="mt-3 rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-100"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!authLoading && user && historyStatus === "success" && historyRecords.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-slate-200">{emptyStateMessage}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-100"
              >
                Take a Quiz
              </button>
            </div>
          ) : null}

          {!authLoading && user && historyStatus === "success" && historyRecords.length > 0 ? (
            <div className="space-y-3">
              {historyRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => {
                    void handleOpenRecord(record);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/25 hover:bg-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{formatAttemptDate(record.attemptedAt)}</p>
                      <p className="mt-1 text-xs muted">
                        {record.correctCount}/{record.totalQuestions} correct
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {openRecordId === record.id ? (
                        <span className="text-xs text-slate-300">Opening...</span>
                      ) : null}
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${scoreBadgeClass(
                          record.scorePercent,
                        )}`}
                      >
                        {record.scorePercent}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {openRecordError ? (
            <p className="mt-4 text-sm text-red-200">{openRecordError}</p>
          ) : null}
        </div>
      </div>

      {selectedRecord ? (
        <QuizReviewModal
          record={selectedRecord}
          onClose={() => {
            setSelectedRecord(null);
          }}
        />
      ) : null}
    </main>
  );
}
