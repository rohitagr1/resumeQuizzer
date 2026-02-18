import type { Request, Response } from "express";
import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateQuestions = async (req: Request, res: Response) => {

    try{
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Missing GEMINI_API_KEY in backend/.env' });
        }

        if (!req.file){
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        await parser.destroy(); 
        const resumeText = pdfData.text; 

        const promt = `You are an expert technical interviewer.

Analyze the resume below and generate exactly 10 technical MCQs that evaluate the candidate’s real understanding of the technologies, tools, frameworks, and concepts mentioned in their resume.

Rules:

Questions must test technical depth, not resume facts.

Do NOT ask about what is written in the resume (e.g., “Which project did they build?”).

Instead, test implementation knowledge, debugging ability, architecture decisions, scalability, performance optimization, or best practices related to the mentioned technologies.

Use scenario-based or concept-based questions.

Each question must have exactly 4 choices.

Only one correct answer.

The correct answer position must be randomly distributed across choices.

Include a short explanation (2–3 lines).

Return strictly valid JSON.

Do not include markdown formatting.

Do not include backticks.

Do not include any text outside JSON.

Ensure the JSON is valid and parsable using JSON.parse().

Output format:

[
{
"id": "q1",
"text": "Question text",
"choices": ["Option A", "Option B", "Option C", "Option D"],
"correctIndex": 2,
"explanation": "Short explanation"
}
]

Important:

correctIndex must be between 0 and 3.

IDs must be sequential: q1 to q10.

Randomize correct answer positions.

Focus only on evaluating technical skill depth.

Resume:
${resumeText}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promt);

        const response = await result.response;

        const text = response.text();

        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');

        let questions = [];

        if(jsonStart == -1 || jsonEnd == -1){
            return res.status(500).json({ error: 'Failes to parse questions from Gemini response' });
        }
        questions = JSON.parse(text.substring(jsonStart, jsonEnd + 1));

        res.json({ questions });
    }
    catch (error: any){
        console.error(error);
        res.status(500).json({ error: error?.message || 'Failed to generate questions.' });
    }

};
