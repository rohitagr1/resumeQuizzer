import { GoogleGenerativeAI } from '@google/generative-ai';

export async function aiClient( prompt ){

    const apiKey = process.env.GEMINI_API_KEY;

    if( !apiKey ){
        throw new Error('Missing API_KEY');
    }

    const genAI = new GoogleGenerativeAI( apiKey );
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent( prompt );
    const response = await result.response;
    const text = response.text();

    return text;

}
