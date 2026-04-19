import type { Ingredient } from "../types/meal.js";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
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
  activeIndex: number; // -1 = no selection
  handleKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
  onSelect: (name: string) => void;
  closeSuggestions: () => void;
}

export function useMealSearch(
  area: string,
  onCommit: (name: string) => void,
): UseMealSearchReturn {
  const [term, setTermRaw] = useState("");
  const [activeIndex, setActive] = useState(-1);
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

  const setTerm = (t: string) => {
    setTermRaw(t);
    setActive(-1);
  };

  const onSelect = (name: string) => {
    setTermRaw(name);
    setActive(-1);
    onCommit(name);
  };

  const closeSuggestions = () => setActive(-1);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const chosen = suggestions[activeIndex];
      if (chosen) onSelect(chosen.strIngredient);
    } else if (e.key === "Escape") {
      setActive(-1);
      setTermRaw("");
    }
  };

  return {
    term,
    setTerm,
    suggestions,
    isLoading,
    activeIndex,
    handleKeyDown,
    onSelect,
    closeSuggestions,
  };
}
