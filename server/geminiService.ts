import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key || !key.trim()) return null;
  return key.trim();
}

export function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = getGeminiApiKey();
  if (!key) return null;
  aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

export async function callGeminiWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  modelName = "gemini-2.5-flash",
  systemInstruction?: string,
  maxRetries = 2
): Promise<string> {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      const text = response.text ? response.text.trim() : "";
      if (text) return text;
      throw new Error("Empty text response returned from Gemini API.");
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt <= maxRetries) {
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error("Gemini API call failed after retries.");
}

export function sanitizeInputString(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value
    .replace(/[<>{}]/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 500);
}

export function parseJsonFromAiResponse(rawText: string): Record<string, unknown> | null {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Return null on failure
  }
  return null;
}
