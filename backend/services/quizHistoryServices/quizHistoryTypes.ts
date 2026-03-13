export type quizHistoryInput = {

    userId: string;
    attemptId: string;
    attemptedAt?: string;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    quizSnapshot: unknown;
    answerSnapshot: unknown;

};
