import type { Request, Response, NextFunction } from 'express';
import generateQuestionsService from '../services/generateQuestionsService.ts';
import uploadParseService from '../services/uploadParseService.ts';

export async function generateQuestionsController( req : Request, res : Response, next: NextFunction ){

    try{

        const resumeText = await uploadParseService.parsePDFText( req.file );

        const questions = await generateQuestionsService.generateAIQuiz( resumeText );
        
        return res.locals.send( { questions }, 200, "Questions Generated");

    }
    catch(error){
        return next(error);
    }

}
