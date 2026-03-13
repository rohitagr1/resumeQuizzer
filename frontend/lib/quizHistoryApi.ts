import type { User } from "firebase/auth";
import type { QuizHistoryRecord } from "../types/history";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type CreateQuizHistoryPayload = {
  attemptId: string;
  attemptedAt?: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  quizSnapshot: unknown;
  answerSnapshot: unknown;
};

type ApiSuccess<T> = {
  success: true;
  message: string;
  history: T;
};

type ApiError = {
  success: false;
  error: string;
};

const normalizeRecord = (record: {
  id: string | number;
  attemptId: string;
  attemptedAt: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  quizSnapshot: QuizHistoryRecord["quizSnapshot"];
  answerSnapshot: QuizHistoryRecord["answerSnapshot"];
}): QuizHistoryRecord => ({
  ...record,
  id: String(record.id),
});

const getAuthHeaders = async (user: User): Promise<Record<string, string>> => {
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

const readApiError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as Partial<ApiError>;
    return data.error || "Request failed";
  } catch {
    return "Request failed";
  }
};

export const createQuizHistoryApi = async (
  user: User,
  payload: CreateQuizHistoryPayload,
): Promise<QuizHistoryRecord> => {
  const authHeaders = await getAuthHeaders(user);

  const response = await fetch(`${API_URL}/quiz-history`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const data = (await response.json()) as ApiSuccess<{
    id: string | number;
    attemptId: string;
    attemptedAt: string;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    quizSnapshot: QuizHistoryRecord["quizSnapshot"];
    answerSnapshot: QuizHistoryRecord["answerSnapshot"];
  }>;

  return normalizeRecord(data.history);
};

export const showQuizHistoryApi = async (user: User): Promise<QuizHistoryRecord[]> => {
  const authHeaders = await getAuthHeaders(user);

  const response = await fetch(`${API_URL}/quiz-history`, {
    method: "GET",
    headers: authHeaders,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const data = (await response.json()) as ApiSuccess<
    Array<{
      id: string | number;
      attemptId: string;
      attemptedAt: string;
      scorePercent: number;
      correctCount: number;
      totalQuestions: number;
      quizSnapshot: QuizHistoryRecord["quizSnapshot"];
      answerSnapshot: QuizHistoryRecord["answerSnapshot"];
    }>
  >;

  if (!Array.isArray(data.history)) {
    return [];
  }

  return data.history.map(normalizeRecord);
};

export const selectQuizHistoryApi = async (
  user: User,
  historyId: string | number,
): Promise<QuizHistoryRecord> => {
  const authHeaders = await getAuthHeaders(user);

  const response = await fetch(`${API_URL}/quiz-history/${historyId}`, {
    method: "GET",
    headers: authHeaders,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const data = (await response.json()) as ApiSuccess<{
    id: string | number;
    attemptId: string;
    attemptedAt: string;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    quizSnapshot: QuizHistoryRecord["quizSnapshot"];
    answerSnapshot: QuizHistoryRecord["answerSnapshot"];
  }>;

  return normalizeRecord(data.history);
};
