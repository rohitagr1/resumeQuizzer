import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import * as quizHistoryServices from "../services/quizHistoryServices/index.ts";


const getAuthenticatedUserId = (res: Response): string => {

    const user = res.locals.user as { uid?: string } | undefined;

    if( !user?.uid ){
        throw createHttpError(401, "Unauthorized" );
    }

    return user.uid;

};

const createQuizHistoryController = async ( req: Request, res: Response, next: NextFunction ) => {

    try{

        const userId = getAuthenticatedUserId(res);

        const { attemptId, attemptedAt, scorePercent, correctCount, totalQuestions, quizSnapshot, answerSnapshot } = req.body as {

            attemptId?: string;
            attemptedAt?: string;
            scorePercent?: number;
            correctCount?: number;
            totalQuestions?: number;
            quizSnapshot?: unknown;
            answerSnapshot?: unknown;
        };

        if ( !attemptId || scorePercent === undefined || correctCount === undefined || totalQuestions === undefined || quizSnapshot === undefined || answerSnapshot === undefined){

            throw createHttpError(400, "Missing required quiz history fields");

        }

        const payload = { userId, attemptId, scorePercent, correctCount, totalQuestions, quizSnapshot, answerSnapshot, ...(attemptedAt !== undefined ? { attemptedAt } : {}) };

        const saved = await quizHistoryServices.createQuizHistory(payload);

        return res.locals.send({ history: saved }, 201, "Quiz history saved");
    }
    catch (error) {
        return next(error);
    }
};


const showQuizHistoryController = async (_req: Request, res: Response, next: NextFunction ) => {

    try{
        const userId = getAuthenticatedUserId(res);

        const history = await quizHistoryServices.showQuizHistory(userId);

        return res.locals.send({ history }, 200, "Quiz history fetched");
    }
    catch(error){
        return next(error);
    }
};


const selectQuizHistoryController = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const userId = getAuthenticatedUserId(res);

        const historyId = Number(req.params.id);

        if( !Number.isInteger(historyId) || historyId <= 0){
            throw createHttpError(400, "Invalid history id");
        }

        const history = await quizHistoryServices.selectQuizHistory(userId, historyId);

        return res.locals.send({ history }, 200, "Quiz history fetched");
    }
    catch(error){
        return next(error);
    }
};

export default { createQuizHistoryController, showQuizHistoryController, selectQuizHistoryController };




