export type QuizHistoryQuestion = {
  id: string;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
};

export type QuizHistoryAnswer = {
  questionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation?: string;
};

export type QuizHistoryRecord = {
  id: string;
  attemptId: string;
  attemptedAt: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  quizSnapshot: QuizHistoryQuestion[];
  answerSnapshot: QuizHistoryAnswer[];
};
