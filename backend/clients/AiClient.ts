import { GoogleGenerativeAI } from '@google/generative-ai';
import createHttpError from 'http-errors';

async function callLLM( prompt : string){

    try{
        const apiKey = process.env.GEMINI_API_KEY;

        if( !apiKey ){
            throw createHttpError(500, 'Missing API_KEY');
        }

        const genAI = new GoogleGenerativeAI( apiKey );
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent( prompt );
        const text = result.response.text();

        if( !text?.trim() ){
            throw createHttpError(502, 'Empty response from AI model');
        }

        return text;
    }
    catch( error ){
        if (createHttpError.isHttpError( error )) {
            throw error;
        }
        throw createHttpError(502, "Failed to call AI model");
    }

}

export default { callLLM };
