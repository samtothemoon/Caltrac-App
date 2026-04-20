import { useLocalStorage } from '@/lib/storage';
import { calcNutritionScore } from '@/lib/nutrition';

export type LibraryItem = {
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
  pricePerServing: number;
  storeName: string;
  nutritionScore: number;
};

export function useLibrary() {
  const [library, setLibrary] = useLocalStorage<LibraryItem[]>('beven_library', []);

  const addItem = (item: Omit<LibraryItem, 'id' | 'nutritionScore'>) => {
    const newItem: LibraryItem = {
      ...item,
      id: crypto.randomUUID(),
      nutritionScore: calcNutritionScore(item),
    };
    setLibrary(prev => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setLibrary(prev => prev.filter(i => i.id !== id));
  };

  return { library, addItem, deleteItem };
}
