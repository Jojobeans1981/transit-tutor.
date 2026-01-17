
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuizFromTopic = async (topic: string, difficulty: string = 'intermediate'): Promise<Question[]> => {
  const prompt = `Generate a 5-question multiple choice quiz for NYC DOT Dispatcher Exam candidates. 
  Topic: ${topic}. 
  Difficulty: ${difficulty}. 
  Ensure questions are practical, covering real-world dispatching scenarios, radio codes, or safety regulations typical of a New York City Department of Transportation shop.
  
  CRITICAL REQUIREMENT: For each question, provide a detailed "explanation" that:
  1. Clearly explains why the correct answer is right and why the common mistakes are wrong.
  2. Explicitly references a specific section or concept from the NYC DOT Dispatcher Study Guide (e.g., "[Reference: Section 4.1.2 - Radio Priority Codes]" or "[Reference: Section 2.5 - Shop Safety Protocols]").
  3. Uses professional NYC DOT shop terminology.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of 4 options"
            },
            correctAnswer: { 
              type: Type.INTEGER,
              description: "Index of the correct answer (0-3)"
            },
            explanation: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "category"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse quiz response", e);
    return [];
  }
};

export const chatWithStudyGuide = async (query: string, context: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert tutor for the NYC DOT Dispatcher Exam. 
    Use the following study guide context to answer the user's question. 
    Context: ${context}
    
    User Query: ${query}`,
    config: {
      systemInstruction: "Always be professional and use NYC DOT specific terminology like 'Shop', 'Facility', 'Unit Number', '10-4', etc."
    }
  });

  return response.text || "I'm sorry, I couldn't find an answer for that in the materials.";
};
