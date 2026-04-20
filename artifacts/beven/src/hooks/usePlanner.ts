import { useLocalStorage } from '@/lib/storage';
import { format, startOfWeek } from 'date-fns';

export type PlannedMeal = {
  id: string;
  foodId: string;
  foodName: string;
  day: string; // 'Mon' | 'Tue' | ...
  nutritionScore: number;
  estimatedCost: number;
  date: string;
};

export function usePlanner(date: Date = new Date()) {
  const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const [plannedMeals, setPlannedMeals] = useLocalStorage<PlannedMeal[]>(`beven_plan_${weekStart}`, []);

  const planMeal = (meal: Omit<PlannedMeal, 'id'>) => {
    setPlannedMeals(prev => [...prev, { ...meal, id: crypto.randomUUID() }]);
  };

  const removePlannedMeal = (id: string) => {
    setPlannedMeals(prev => prev.filter(m => m.id !== id));
  };

  return { plannedMeals, planMeal, removePlannedMeal, weekStart };
}
