import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export async function parseReminderText(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze the following text and extract a reminder task and its scheduled date/time.
      Current time: ${new Date().toLocaleString()}
      Text: "${text}"
      
      Return a JSON object with:
      - task: string
      - datetime: ISO string
      - priority: "low" | "medium" | "high"
      - category: string
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          datetime: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
          category: { type: Type.STRING }
        },
        required: ["task", "datetime"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
