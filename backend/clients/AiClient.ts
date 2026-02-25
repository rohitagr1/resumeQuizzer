import { GoogleGenerativeAI } from '@google/generative-ai';

async function callLLM( prompt : string){

    try{
        const apiKey = process.env.GEMINI_API_KEY;

        if( !apiKey ){
            throw new Error('Missing API_KEY');
        }

        const genAI = new GoogleGenerativeAI( apiKey );
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent( prompt );
        const text = result.response.text();

        if( !text?.trim() ){
            throw new Error('Empty response from AI model');
        }

        return text;
    }
    catch( error: any){
        throw new Error(error?.message || 'Failed to call AI model' );
    }

}

export default { callLLM };
