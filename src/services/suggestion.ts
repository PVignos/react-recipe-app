import type { MealSummary } from "../types/meal.js";
import { mealApi } from "./meal.js";

export interface SuggestionParams {
  area: string;
  ingredient: string;
}

export async function getSuggestions({
  area,
  ingredient,
}: SuggestionParams): Promise<MealSummary[]> {
  const [byArea, byIngredient] = await Promise.all([
    mealApi.filterByArea(area),
    mealApi.filterByIngredient(ingredient),
  ]);

  // Get unique
  const areaIds = new Set(byArea.map((m) => m.idMeal));

  // Return find suggestions
  return byIngredient.filter((m) => areaIds.has(m.idMeal));
}
