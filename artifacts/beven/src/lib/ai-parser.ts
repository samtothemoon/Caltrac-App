type ParsedResult = {
  estimatedCalories: number;
  confidence: 'High' | 'Medium' | 'Low';
  protein?: number;
  carbs?: number;
  fat?: number;
};

/**
 * This function simulates an AI text parser.
 * It takes natural language text and returns a randomized but plausible 
 * calorie estimate along with a confidence score based on the text length.
 * 
 * TODO: Replace this with a real fetch call to an API endpoint connected to OpenAI or Gemini.
 */
export async function parseMealText(text: string): Promise<ParsedResult> {
  // Simulate network delay for AI response
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();
  
  // Very basic heuristic for mock confidence
  let confidence: 'High' | 'Medium' | 'Low' = 'Low';
  if (text.length > 20) confidence = 'Medium';
  if (text.length > 50) confidence = 'High';

  // Basic mock calories base (hash the string to get a somewhat consistent result for same text)
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a number between 150 and 1200
  const randomBase = Math.abs(hash % 1050) + 150;
  
  // Specific keyword bumps
  let totalCalories = randomBase;
  if (lowerText.includes('burger')) totalCalories += 400;
  if (lowerText.includes('pizza')) totalCalories += 500;
  if (lowerText.includes('salad')) totalCalories = Math.max(150, totalCalories - 200);
  if (lowerText.includes('coffee')) totalCalories = Math.max(50, totalCalories - 300);

  // Smooth the numbers to multiples of 10
  totalCalories = Math.round(totalCalories / 10) * 10;

  return {
    estimatedCalories: totalCalories,
    confidence,
    protein: Math.round(totalCalories * 0.2 / 4), // ~20% protein
    carbs: Math.round(totalCalories * 0.5 / 4),   // ~50% carbs
    fat: Math.round(totalCalories * 0.3 / 9),     // ~30% fat
  };
}
