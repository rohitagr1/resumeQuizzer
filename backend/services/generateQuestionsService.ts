import { aiClient } from "../clients/AiClient.ts";
import { generateQuestionsPrompt } from "../constants/generateQuestionsPrompt.ts";


export async function generateQuestionsService( resumeText ){

    const prompt = `${generateQuestionsPrompt} Resume: ${resumeText}`;

    const generatedText = await aiClient( prompt );

    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']');

    if( jsonStart === -1 || jsonEnd === -1 ){
        throw new Error('failed to parse ai results');
    }

    const questions = JSON.parse( generatedText.substring( jsonStart, jsonEnd + 1 ) );

    return questions;
}
