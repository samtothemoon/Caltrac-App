export function calcNutritionScore(food: {
  protein: number;
  fiber: number;
  vitamins: number;
  sugar: number;
  saturatedFat: number;
}): number {
  const proteinScore = Math.min(food.protein / 30 * 35, 35);
  const fiberScore = Math.min(food.fiber / 15 * 25, 25);
  const vitaminScore = Math.min(food.vitamins / 100 * 25, 25);
  const sugarPenalty = Math.min(food.sugar / 20 * 10, 10);
  const fatPenalty = Math.min(food.saturatedFat / 10 * 5, 5);
  return Math.round(Math.max(0, proteinScore + fiberScore + vitaminScore - sugarPenalty - fatPenalty));
}

export function calcDailyScore(meals: Array<{ nutritionScore: number }>): number {
  if (meals.length === 0) return 0;
  const avg = meals.reduce((sum, m) => sum + m.nutritionScore, 0) / meals.length;
  return Math.min(Math.round(avg), 100);
}
