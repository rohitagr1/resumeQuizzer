import  aiClient  from "../clients/AiClient.ts";
import { generateQuestionsPrompt } from "../constants/generateQuestionsPrompt.ts";
import createHttpError from "http-errors";


async function generateAIQuiz( resumeText : string ){

    try{
        const prompt = `${generateQuestionsPrompt} Resume: ${resumeText}`;

        const generatedText = await aiClient.callLLM( prompt );

        const jsonStart = generatedText.indexOf('[');
        const jsonEnd = generatedText.lastIndexOf(']');

        if( jsonStart === -1 || jsonEnd === -1 ){
            throw createHttpError(502, 'failed to parse ai results');
        }

        const questions = JSON.parse( generatedText.substring( jsonStart, jsonEnd + 1 ) );
        return questions;
    }
    catch ( error ){
        if( createHttpError.isHttpError( error ) ){
            throw error;
        }
        throw createHttpError(500, "Failed to generate questions");
    }
}

export default { generateAIQuiz };
