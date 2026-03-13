import createHttpError from "http-errors";
import databaseClient from "../../clients/databaseClient.ts";
import type { quizHistoryInput } from "./quizHistoryTypes.ts";

export const createQuizHistory  = async (input: quizHistoryInput ) => {

    if ( !input.userId || !input.attemptId ){
        throw createHttpError(400, "Missing required id" );
    }

    const db = databaseClient.getDatabasePool();

    try {

        const query = `insert into public.quiz_history(
        user_id,
        attempt_id,
        attempted_at,
        score_percent,
        correct_count,
        total_questions,
        quiz_snapshot,
        answer_snapshot
        )
        values(
        $1, $2, coalesce($3::timestamptz, now()), $4, $5, $6, $7::jsonb, $8::jsonb
        )
        returning
        id,
        user_id as "userId",
        attempt_id as "attemptId",
        attempted_at as "attemptedAt",
        score_percent as "scorePercent",
        correct_count as "correctCount",
        total_questions as "totalQuestions",
        quiz_snapshot as "quizSnapshot",
        answer_snapshot as "answerSnapshot";
        `;

        const values = [
            input.userId,
            input.attemptId,
            input.attemptedAt ?? null,
            input.scorePercent,
            input.correctCount,
            input.totalQuestions,
            JSON.stringify(input.quizSnapshot),
            JSON.stringify(input.answerSnapshot),
        ];

        const result = await db.query(query, values);

        return result.rows[0];
    }
    catch( error: unknown ){

        const pqError = error as { code?: string };

        if( pqError.code === "23505" ){
            throw createHttpError(409, "this attempt is already saved");
        }

        throw createHttpError(500, "Failed to save quiz");
    }
};


