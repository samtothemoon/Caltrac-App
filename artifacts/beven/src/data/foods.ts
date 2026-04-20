export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  saturatedFat: number;
  vitamins: number;
  servingSize: string;
  vitaminC: number;
  iron: number;
  calcium: number;
  potassium: number;
  nutritionScore?: number;
};

export const FOOD_DATABASE: FoodItem[] = [
  { id: 'f1',  name: 'Brown Rice',       calories: 216, protein: 3,  carbs: 45, fat: 2,  fiber: 2,  sugar: 0,  saturatedFat: 0, vitamins: 30, servingSize: '1 cup cooked',   vitaminC: 0,  iron: 0.8, calcium: 20,  potassium: 84  },
  { id: 'f2',  name: 'Salmon Fillet',    calories: 280, protein: 34, carbs: 0,  fat: 13, fiber: 0,  sugar: 0,  saturatedFat: 3, vitamins: 60, servingSize: '150g',           vitaminC: 5,  iron: 0.9, calcium: 27,  potassium: 628 },
  { id: 'f3',  name: 'Spinach',          calories: 40,  protein: 3,  carbs: 4,  fat: 0,  fiber: 3,  sugar: 1,  saturatedFat: 0, vitamins: 90, servingSize: '2 cups raw',     vitaminC: 28, iron: 3.6, calcium: 120, potassium: 560 },
  { id: 'f4',  name: 'Chicken Breast',   calories: 248, protein: 31, carbs: 0,  fat: 3,  fiber: 0,  sugar: 0,  saturatedFat: 1, vitamins: 20, servingSize: '150g',           vitaminC: 0,  iron: 1.2, calcium: 15,  potassium: 440 },
  { id: 'f5',  name: 'Quinoa',           calories: 222, protein: 8,  carbs: 39, fat: 4,  fiber: 5,  sugar: 0,  saturatedFat: 0, vitamins: 40, servingSize: '1 cup cooked',   vitaminC: 0,  iron: 2.8, calcium: 31,  potassium: 318 },
  { id: 'f6',  name: 'Avocado',          calories: 161, protein: 3,  carbs: 9,  fat: 15, fiber: 10, sugar: 1,  saturatedFat: 2, vitamins: 35, servingSize: 'half',           vitaminC: 10, iron: 0.6, calcium: 18,  potassium: 487 },
  { id: 'f7',  name: 'Greek Yogurt',     calories: 100, protein: 17, carbs: 6,  fat: 5,  fiber: 0,  sugar: 7,  saturatedFat: 2, vitamins: 25, servingSize: '170g',           vitaminC: 1,  iron: 0.1, calcium: 190, potassium: 240 },
  { id: 'f8',  name: 'Lentils',          calories: 230, protein: 18, carbs: 40, fat: 1,  fiber: 15, sugar: 2,  saturatedFat: 0, vitamins: 50, servingSize: '1 cup cooked',   vitaminC: 3,  iron: 6.6, calcium: 38,  potassium: 730 },
  { id: 'f9',  name: 'Blueberries',      calories: 84,  protein: 1,  carbs: 21, fat: 0,  fiber: 4,  sugar: 15, saturatedFat: 0, vitamins: 80, servingSize: '1 cup',          vitaminC: 14, iron: 0.4, calcium: 9,   potassium: 114 },
  { id: 'f10', name: 'Oats',             calories: 150, protein: 6,  carbs: 27, fat: 3,  fiber: 4,  sugar: 1,  saturatedFat: 0, vitamins: 20, servingSize: '1/2 cup dry',    vitaminC: 0,  iron: 2.1, calcium: 26,  potassium: 164 },
  { id: 'f11', name: 'Eggs',             calories: 156, protein: 13, carbs: 1,  fat: 11, fiber: 0,  sugar: 1,  saturatedFat: 3, vitamins: 40, servingSize: '2 large',        vitaminC: 0,  iron: 1.8, calcium: 56,  potassium: 138 },
  { id: 'f12', name: 'Sweet Potato',     calories: 112, protein: 4,  carbs: 26, fat: 0,  fiber: 6,  sugar: 10, saturatedFat: 0, vitamins: 75, servingSize: '1 medium',       vitaminC: 22, iron: 0.7, calcium: 39,  potassium: 542 },
  { id: 'f13', name: 'Almonds',          calories: 164, protein: 6,  carbs: 6,  fat: 14, fiber: 3,  sugar: 1,  saturatedFat: 1, vitamins: 30, servingSize: '28g',            vitaminC: 0,  iron: 1.1, calcium: 76,  potassium: 208 },
  { id: 'f14', name: 'Broccoli',         calories: 55,  protein: 3,  carbs: 11, fat: 1,  fiber: 5,  sugar: 2,  saturatedFat: 0, vitamins: 85, servingSize: '1 cup chopped',  vitaminC: 81, iron: 0.7, calcium: 47,  potassium: 288 },
  { id: 'f15', name: 'Banana',           calories: 89,  protein: 1,  carbs: 23, fat: 0,  fiber: 3,  sugar: 14, saturatedFat: 0, vitamins: 30, servingSize: '1 medium',       vitaminC: 10, iron: 0.3, calcium: 5,   potassium: 422 },
];
