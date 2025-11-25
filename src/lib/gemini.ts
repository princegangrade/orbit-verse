import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = (import.meta.env.VITE_GEMINI_API_KEY || '').split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);

if (API_KEYS.length === 0) {
  console.warn('Missing VITE_GEMINI_API_KEY in environment variables');
}

// Helper to get a model instance with a specific key
const getModel = (keyIndex: number) => {
  const key = API_KEYS[keyIndex % API_KEYS.length];
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerationResult {
  files: GeneratedFile[];
  explanation: string;
}

export interface AnalysisResult {
  archetype: string;
  tools: string[];
  checklist: string[];
}

// Generic retry wrapper for Gemini calls
async function withRetry<T>(
  operation: (model: any) => Promise<T>,
  onRetry?: (attempt: number, error: any) => void
): Promise<T> {
  let lastError: any;

  // Try each key once
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const model = getModel(i);
      return await operation(model);
    } catch (err: any) {
      lastError = err;
      console.warn(`Attempt ${i + 1} failed with key ending in ...${API_KEYS[i].slice(-4)}`, err);
      if (onRetry) onRetry(i + 1, err);
      // Continue to next key
    }
  }

  throw lastError || new Error('All API keys failed');
}

export async function generateProject(prompt: string, onChunk: (text: string) => void): Promise<GenerationResult> {
  return withRetry(async (model) => {
    const systemPrompt = `
      You are an expert full-stack developer. Your task is to generate a complete, working React application based on the user's prompt.
      
      Rules:
      1. Output ONLY valid JSON.
      2. The JSON must follow this structure:
         {
           "explanation": "Brief explanation of what was built",
           "files": [
             {
               "path": "index.html",
               "content": "..."
             },
             {
               "path": "src/main.tsx",
               "content": "..."
             },
             {
               "path": "src/App.tsx",
               "content": "..."
             },
             {
               "path": "src/components/Example.tsx",
               "content": "..."
             }
           ]
         }
      3. You MUST include these specific files:
         - index.html (with <div id="root"></div> and script module src="/src/main.tsx")
         - src/main.tsx (React entry point, mounting App to root)
         - src/App.tsx (Main component)
         - src/index.css (Tailwind directives)
         - vite.config.ts
      4. Use Tailwind CSS for styling (include @tailwind directives in index.css).
      5. Use 'lucide-react' for icons.
      6. Ensure all imports are correct (e.g., import App from './App').
      7. Do not include package.json or tsconfig.json.
      8. Ensure the code is production-ready, beautiful, and error-free.
      9. Create a comprehensive file structure. Don't just put everything in App.tsx. Create separate components in src/components/.
      10. If the user asks for a specific type of app (e.g., Dashboard, Landing Page), ensure the design reflects that with appropriate components and layout.
    `;

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser Prompt: ' + prompt }] }],
    });

    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(chunkText);
    }

    // Attempt to clean and parse JSON
    try {
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      return parsed as GenerationResult;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      throw new Error('Failed to generate valid project structure');
    }
  }, (attempt, err) => {
    onChunk(`\n⚠️ Attempt ${attempt} failed. Switching API key...\n`);
  });
}

export async function analyzePrompt(prompt: string): Promise<AnalysisResult> {
  return withRetry(async (model) => {
    const systemPrompt = `
      You are an expert software architect. Analyze the user's project idea and return a JSON object with:
      1. "archetype": A short, descriptive name for the app type (e.g., "E-commerce", "SaaS Dashboard", "Social Network").
      2. "tools": A list of 4-6 recommended tools/libraries (e.g., "React", "Tailwind", "Supabase", "Zustand").
      3. "checklist": A list of 3-4 key features to implement.

      Output ONLY valid JSON.
      Example:
      {
        "archetype": "E-commerce Store",
        "tools": ["React", "Tailwind", "Stripe", "Zustand"],
        "checklist": ["Product Listing", "Shopping Cart", "Checkout Flow"]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser Idea: ' + prompt }] }],
    });

    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  });
}
