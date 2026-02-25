import type { Request, Response, NextFunction } from 'express';
import generateQuestionsService from '../services/generateQuestionsService.ts';
import uploadParseService from '../services/uploadParseService.ts';

export async function generateQuestionsController( req : Request, res : Response, next: NextFunction ){

    try{

        const resumeText = await uploadParseService.parsePDFText( req.file );

        const questions = await generateQuestionsService.generateAIQuiz( resumeText );
        
        return res.status(200).json( {questions} );

    }
    catch(error){
        return next(error);
    }

}
