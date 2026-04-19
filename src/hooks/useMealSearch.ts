import type { Ingredient } from "../types/meal.js";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QK } from "../services/query.js";
import { mealApi } from "../services/meal.js";

interface UseMealSearch {
  term: string;
  setTerm: (term: string) => void;
  suggestions: Ingredient[];
}

export function useMealSearch(): UseMealSearch {
  const [term, setTerm] = useState<string>("");
  const deferred = useDeferredValue(term);

  const { data: all = [] } = useQuery<Ingredient[]>({
    queryKey: QK.ingredients,
    queryFn: mealApi.listIngredients,
    staleTime: Infinity,
  });

  const suggestions = useMemo((): Ingredient[] => {
    if (!deferred.trim()) {
      return [];
    }

    return all
      .filter((m) =>
        m.strIngredient.toLowerCase().includes(deferred.toLowerCase()),
      )
      .slice(0, 5);
  }, [deferred, all]);

  return { term, setTerm, suggestions };
}
