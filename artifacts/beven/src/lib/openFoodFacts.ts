import { calcNutritionScore } from './nutrition';

export type OFFResult = {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: number;
  sugar: number;
  saturatedFat: number;
  vitaminC: number;
  iron: number;
  calcium: number;
  potassium: number;
  nutritionScore: number;
};

function getVal(nutriments: Record<string, number>, key: string, factor: number): number {
  if (nutriments[`${key}_serving`] !== undefined) return nutriments[`${key}_serving`] ?? 0;
  return (nutriments[`${key}_100g`] ?? 0) * factor;
}

export async function searchOpenFoodFacts(query: string): Promise<OFFResult[]> {
  if (!query.trim()) return [];

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=12&fields=id,product_name,nutriments,serving_size,serving_quantity`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const products: any[] = data.products ?? [];

    return products
      .filter((p) => p.product_name && p.nutriments)
      .map((p) => {
        const n: Record<string, number> = p.nutriments ?? {};
        const servingQty = parseFloat(p.serving_quantity) || 100;
        const factor = servingQty / 100;

        const protein      = Math.round(getVal(n, 'proteins', factor) * 10) / 10;
        const carbs        = Math.round(getVal(n, 'carbohydrates', factor) * 10) / 10;
        const fat          = Math.round(getVal(n, 'fat', factor) * 10) / 10;
        const fiber        = Math.round(getVal(n, 'fiber', factor) * 10) / 10;
        const sugar        = Math.round(getVal(n, 'sugars', factor) * 10) / 10;
        const saturatedFat = Math.round(getVal(n, 'saturated-fat', factor) * 10) / 10;
        const calories     = Math.round(getVal(n, 'energy-kcal', factor));

        const vitaminC_mg  = Math.round(getVal(n, 'vitamin-c', factor) * 1000 * 10) / 10;
        const iron_mg      = Math.round(getVal(n, 'iron', factor) * 1000 * 100) / 100;
        const calcium_mg   = Math.round(getVal(n, 'calcium', factor) * 1000);
        const potassium_mg = Math.round(getVal(n, 'potassium', factor) * 1000);

        const vitaminScore = Math.min(
          Math.round(
            (vitaminC_mg / 90) * 30 +
            (iron_mg / 18) * 30 +
            (calcium_mg / 1000) * 20 +
            (potassium_mg / 3500) * 20
          ),
          100
        );

        const food = { protein, fiber, vitamins: vitaminScore, sugar, saturatedFat };

        return {
          id: `off_${p.id ?? Math.random().toString(36).slice(2)}`,
          name: p.product_name as string,
          servingSize: p.serving_size || `${servingQty}g`,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          vitamins: vitaminScore,
          sugar,
          saturatedFat,
          vitaminC: vitaminC_mg,
          iron: iron_mg,
          calcium: calcium_mg,
          potassium: potassium_mg,
          nutritionScore: calcNutritionScore(food),
        };
      })
      .slice(0, 10);
  } catch {
    return [];
  }
}
