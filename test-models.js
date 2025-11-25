import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('VITE_GEMINI_API_KEY not found in environment');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const modelName = 'gemini-2.5-flash';
        console.log(`Testing ${modelName}...`);

        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello');
            console.log(`SUCCESS: ${modelName} works.`);
            console.log(result.response.text());
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message}`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
