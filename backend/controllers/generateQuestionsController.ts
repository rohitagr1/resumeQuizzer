import { generateQuestionsService } from '../services/generateQuestionsService.ts';
import { parsePdfText } from '../services/uploadParseService.ts';

export async function generateQuestionsController( req, res ){

    try{

        const resumeText = await parsePdfText( req );

        const questions = await generateQuestionsService( resumeText );
        
        return res.status(200).json( {questions} );

    }
    catch(error: any ){
        return res.status(400).json({
            error: error?.message || "Failed to generate Questions",
        });

    }

}
