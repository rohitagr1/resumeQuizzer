export type Question = {
  id: string;
  text?: string;
  question?: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
};

export type QuizState = {
  questions: Question[];
  currentIndex: number;
  answers: Array<number | null>;
  attemptId?: string;
  attemptedAt?: string;
};
