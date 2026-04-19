import type { Area, Ingredient, Meal, MealSummary } from "../types/meal.js";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

interface ApiResponse<T> {
  meals: T[] | null;
}

async function get<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Api ${res.status}: ${path}`);
  }

  const data: ApiResponse<T> = await res.json();

  return data.meals ?? [];
}

export const mealApi = {
  // List all Area, Ingredient
  listAreas: (): Promise<Area[]> => get<Area>("/list.php?a=list"),
  listIngredients: (): Promise<Ingredient[]> =>
    get<Ingredient>("/list.php?i=list"),
  // Filter by Area, Ingredient
  filterByArea: (a: string): Promise<MealSummary[]> =>
    get<MealSummary>(`/filter.php?a=${a}`),
  filterByIngredient: (i: string): Promise<MealSummary[]> =>
    get<MealSummary>(`/filter.php?i=${i}`),
  // Lookup full meal details
  lookup: (id: string): Promise<Meal | null> =>
    get<Meal>(`/lookup.php?i=${id}`).then((meals) => meals[0] ?? null),
};
