type ParsedResult = {
  estimatedCalories: number;
  confidence: 'High' | 'Medium' | 'Low';
  protein?: number;
  carbs?: number;
  fat?: number;
};

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";

/**
 * Parses natural language meal descriptions into structured nutritional data using Google Gemini.
 */
export async function parseMealText(text: string): Promise<ParsedResult> {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing from environment variables.");
    throw new Error("Gemini API key is not configured. Please ensure VITE_GEMINI_API_KEY is in your .env file and restart the dev server.");
  }

  // Log key presence for debugging (first and last 2 chars only)
  console.log(`Using API Key: ${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);

  const prompt = `
    You are a nutrition expert. Parse the following food description and return a JSON object with:
    - estimatedCalories: total calories (number)
    - protein: grams of protein (number)
    - carbs: grams of carbohydrates (number)
    - fat: grams of fat (number)
    - confidence: "High", "Medium", or "Low" (string)

    Food description: "${text}"

    Return ONLY the raw JSON object, no markdown, no explanations.
  `;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    console.log(`Calling Gemini API at: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      }),
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error Detail:", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      console.error("Gemini Response Data:", JSON.stringify(data, null, 2));
      throw new Error("Empty response from Gemini.");
    }

    const parsed = JSON.parse(resultText);

    return {
      estimatedCalories: Number(parsed.estimatedCalories) || 0,
      protein: Number(parsed.protein) || 0,
      carbs: Number(parsed.carbs) || 0,
      fat: Number(parsed.fat) || 0,
      confidence: parsed.confidence || "Medium",
    };
  } catch (error: any) {
    console.error("Parsing failed:", error);
    throw error;
  }
}


