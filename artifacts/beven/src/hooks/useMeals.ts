import { useLocalStorage } from '@/lib/storage';
import { calcNutritionScore, calcDailyScore } from '@/lib/nutrition';
import { format } from 'date-fns';

export type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type Meal = {
  id: string;
  foodId: string;
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
  mealSection: MealSection;
  timeLogged: string;
};

type LogMealInput = Omit<Meal, 'id' | 'timeLogged' | 'nutritionScore'> & {
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  potassium?: number;
  carbs?: number;
  fat?: number;
  calories?: number;
};

export function useMeals(date: Date = new Date()) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const [meals, setMeals] = useLocalStorage<Meal[]>(`beven_meals_${dateKey}`, []);

  const logMeal = (food: LogMealInput) => {
    const newMeal: Meal = {
      ...food,
      vitaminC: food.vitaminC ?? 0,
      iron: food.iron ?? 0,
      calcium: food.calcium ?? 0,
      potassium: food.potassium ?? 0,
      carbs: food.carbs ?? 0,
      fat: food.fat ?? 0,
      calories: food.calories ?? 0,
      mealSection: food.mealSection ?? 'breakfast',
      id: crypto.randomUUID(),
      nutritionScore: calcNutritionScore(food),
      timeLogged: new Date().toISOString(),
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const dailyScore = calcDailyScore(meals);

  return { meals, logMeal, deleteMeal, dailyScore };
}
