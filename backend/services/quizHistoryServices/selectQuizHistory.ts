import createHttpError from "http-errors";
import databaseClient from "../../clients/databaseClient.ts";

export const selectQuizHistory = async (userId: string, historyId: number) => {

  if (!userId || !historyId) {
    throw createHttpError(400, "Missing userId or historyId");
  }

  try {

    const db = databaseClient.getDatabasePool();

    const query = `
      select
        id,
        user_id as "userId",
        attempt_id as "attemptId",
        attempted_at as "attemptedAt",
        score_percent as "scorePercent",
        correct_count as "correctCount",
        total_questions as "totalQuestions",
        quiz_snapshot as "quizSnapshot",
        answer_snapshot as "answerSnapshot"
      from public.quiz_history
      where id = $1 and user_id = $2
      limit 1;
    `;

    const result = await db.query(query, [historyId, userId]);

    if (result.rows.length === 0) {
      throw createHttpError(404, "Quiz history not found");
    }

    return result.rows[0];
  }
  catch (error: unknown) {

    if (createHttpError.isHttpError(error)) {
      throw error;
    }

    throw createHttpError(500, "Failed to fetch selected quiz history");

  }
};

export default { selectQuizHistory };
