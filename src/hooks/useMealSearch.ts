import type { Ingredient } from "../types/meal.js";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QK } from "../services/query.js";
import { mealApi } from "../services/meal.js";

const SAMPLE_SIZE = 10;

/** Exported so StepOne can prefetch with the identical queryFn + queryKey
 *  Fetches /filter.php?a={area}, takes first SAMPLE_SIZE ids, resolves in
 *  parallel, then collects unique non-empty ingredient names. */
export async function fetchIngredientsForArea(
  area: string,
): Promise<Ingredient[]> {
  const summaries = await mealApi.filterByArea(area);
  const meals = await Promise.all(
    summaries.slice(0, SAMPLE_SIZE).map((m) => mealApi.lookup(m.idMeal)),
  );
  const seen = new Set<string>();
  const result: Ingredient[] = [];
  for (const meal of meals) {
    if (!meal) continue;
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}` as keyof typeof meal] as
        | string
        | null;
      if (name?.trim() && !seen.has(name)) {
        seen.add(name);
        result.push({ strIngredient: name });
      }
    }
  }
  return result.sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));
}

interface UseMealSearchReturn {
  term: string;
  setTerm: (term: string) => void;
  suggestions: Ingredient[];
  isLoading: boolean;
}

export function useMealSearch(area: string): UseMealSearchReturn {
  const [term, setTerm] = useState<string>("");

  // useDeferredValue keeps the input responsive — filtering runs at lower
  // priority without a manual debounce or setTimeout.
  const deferred = useDeferredValue(term);

  const { data: all = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: area ? QK.ingredientsByArea(area) : QK.ingredients,
    queryFn: area
      ? () => fetchIngredientsForArea(area)
      : mealApi.listIngredients,
    staleTime: Infinity,
  });

  const suggestions = useMemo((): Ingredient[] => {
    if (!deferred.trim()) return [];
    return all
      .filter((m) =>
        m.strIngredient.toLowerCase().includes(deferred.toLowerCase()),
      )
      .slice(0, 6);
  }, [deferred, all]);

  return { term, setTerm, suggestions, isLoading };
}
