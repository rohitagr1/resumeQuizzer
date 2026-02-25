import  aiClient  from "../clients/AiClient.ts";
import { generateQuestionsPrompt } from "../constants/generateQuestionsPrompt.ts";


async function generateAIQuiz( resumeText : string ){

    try{
        const prompt = `${generateQuestionsPrompt} Resume: ${resumeText}`;

        const generatedText = await aiClient.callLLM( prompt );

        const jsonStart = generatedText.indexOf('[');
        const jsonEnd = generatedText.lastIndexOf(']');

        if( jsonStart === -1 || jsonEnd === -1 ){
            throw new Error('failed to parse ai results');
        }

        const questions = JSON.parse( generatedText.substring( jsonStart, jsonEnd + 1 ) );
        return questions;
    }
    catch (error : any){
        throw new Error(error?.message || 'Failed to generate questions')
    }
}

export default { generateAIQuiz };
