import { format, subDays } from 'date-fns';

type MealLike = {
  id: string;
  name: string;
  servingSize: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  vitamins?: number;
  sugar?: number;
  saturatedFat?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  potassium?: number;
  nutritionScore?: number;
};

function readMeals(dateKey: string): MealLike[] {
  try {
    const raw = localStorage.getItem(`beven_meals_${dateKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getRecentFoods(days = 7): MealLike[] {
  const seen = new Map<string, MealLike>();
  for (let i = 0; i < days; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    for (const m of readMeals(key)) {
      if (!seen.has(m.name)) seen.set(m.name, m);
    }
  }
  return Array.from(seen.values()).slice(0, 8);
}

export function getDailyCalories(days = 7): { date: string; calories: number; protein: number; carbs: number; fat: number }[] {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const meals = readMeals(format(d, 'yyyy-MM-dd'));
    result.push({
      date: format(d, 'EEE'),
      calories: meals.reduce((s, m) => s + (m.calories ?? 0), 0),
      protein:  meals.reduce((s, m) => s + (m.protein ?? 0), 0),
      carbs:    meals.reduce((s, m) => s + (m.carbs ?? 0), 0),
      fat:      meals.reduce((s, m) => s + (m.fat ?? 0), 0),
    });
  }
  return result;
}

export function getStreak(): number {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const meals = readMeals(format(subDays(new Date(), i), 'yyyy-MM-dd'));
    if (meals.length === 0) break;
    streak++;
  }
  return streak;
}
