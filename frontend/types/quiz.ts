export type Question = {
  id: string;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
};

export type QuizState = {
  questions: Question[];
  currentIndex: number;
  answers: Array<number | null>;
};
