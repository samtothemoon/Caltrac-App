# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Beven (`artifacts/beven`) — previewPath: `/`
A MacroFactor-inspired health and nutrition tracking web app. Frontend-only (no backend), all data persisted via localStorage. Dark-mode-first design.

**Features:**
- **Onboarding**: First-launch screen (name, weekly budget, dietary preference)
- **Today (Diary)**: MacroFactor-style diary — calories remaining hero metric, protein/carbs/fat macro strips, micronutrient pills (Vit C, Iron, Calcium, Potassium), meal sections (Breakfast/Lunch/Dinner/Snacks), compact food rows with P/C/F inline, food search with recent foods + Open Food Facts global database, daily streak badge
- **Market**: Personal food library/pantry with full nutrition data (calories, carbs, fat, protein, etc.) and pricing
- **Planner**: Weekly meal planner with 7-day calorie trend bar chart (vs. target), macro adherence strips, weekly budget tracker
- **Profile**: Macro targets editor (calories/protein/carbs/fat), body weight log with trend chart, dietary preferences

**Data model:**
- `FoodItem` / `Meal` — calories, protein, carbs, fat, fiber, sugar, satFat, vitamins + micronutrients (vitaminC, iron, calcium, potassium)
- `MacroTargets` — calories: 2000, protein: 150, carbs: 200, fat: 65 (editable per user)
- `WeightEntry` — id, date (YYYY-MM-DD), weight (lbs)
- `MealSection` — 'breakfast' | 'lunch' | 'dinner' | 'snacks'

**Key files:**
- `src/data/foods.ts` — food database with full macros (15 whole foods)
- `src/lib/nutrition.ts` — Nutrition Score algorithm
- `src/lib/mealHistory.ts` — localStorage helpers for trends/streaks/recent foods
- `src/lib/openFoodFacts.ts` — Open Food Facts API integration
- `src/lib/storage.ts` — typed localStorage hook
- `src/hooks/` — useUser (+ MacroTargets), useMeals (+ MealSection), useLibrary, usePlanner, useWeightLog
- `src/pages/` — Onboarding, Today, Market, Planner, Profile
- `src/components/BottomNav.tsx` — bottom nav (Today / Market / Planner / Profile)

**Theme:** Dark MacroFactor palette — background `hsl(222 28% 7%)`, card `hsl(222 25% 11%)`, primary emerald, protein blue, carbs violet, fat amber

**Tech:** React + Vite + Tailwind CSS + Recharts + framer-motion + wouter + DM Sans font

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
