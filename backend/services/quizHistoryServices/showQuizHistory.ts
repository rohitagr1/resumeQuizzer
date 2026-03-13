import createHttpError from "http-errors";
import databaseClient from "../../clients/databaseClient.ts";

export const showQuizHistory = async (userId: string) => {

    if (!userId) {
    throw createHttpError(400, "Missing userId");
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
      where user_id = $1
      order by attempted_at desc;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;

  }
  catch (error: unknown) {

    if (createHttpError.isHttpError(error)) {
      throw error;
    }

    throw createHttpError(500, "Failed to fetch quiz history");
  }
};

export default { showQuizHistory };
