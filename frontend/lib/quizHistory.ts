import { QuizHistoryRecord } from "../types/history";

const QUIZ_HISTORY_STORAGE_KEY = "resumeQuizHistoryByUser";

type QuizHistoryStore = Record<string, QuizHistoryRecord[]>;

function readStore(): QuizHistoryStore {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = localStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as QuizHistoryStore;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function writeStore(store: QuizHistoryStore): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(store));
}

export function listQuizHistoryForUser(userId: string): QuizHistoryRecord[] {
  if (!userId) {
    return [];
  }

  const store = readStore();
  const records = Array.isArray(store[userId]) ? store[userId] : [];

  return [...records].sort(
    (first, second) =>
      new Date(second.attemptedAt).getTime() - new Date(first.attemptedAt).getTime(),
  );
}

export function hasQuizAttemptForUser(userId: string, attemptId: string): boolean {
  if (!userId || !attemptId) {
    return false;
  }

  const records = listQuizHistoryForUser(userId);
  return records.some((record) => record.attemptId === attemptId);
}

export function saveQuizHistoryForUser(userId: string, record: QuizHistoryRecord): void {
  if (!userId) {
    return;
  }

  const store = readStore();
  const existingRecords = Array.isArray(store[userId]) ? store[userId] : [];

  if (existingRecords.some((existing) => existing.attemptId === record.attemptId)) {
    return;
  }

  store[userId] = [...existingRecords, record];
  writeStore(store);
}
