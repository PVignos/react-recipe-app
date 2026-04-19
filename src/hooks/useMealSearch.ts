import type { Ingredient } from "../types/meal.js";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QK } from "../services/query.js";
import { mealApi } from "../services/meal.js";

interface UseMealSearchReturn {
  term: string;
  setTerm: (term: string) => void;
  suggestions: Ingredient[];
  isLoading: boolean;
  activeIndex: number;
  handleKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
  onSelect: (name: string) => void;
  closeSuggestions: () => void;
}

export function useMealSearch(
  onCommit: (name: string) => void,
): UseMealSearchReturn {
  const [term, setTermRaw] = useState("");
  const [activeIndex, setActive] = useState(-1);
  const deferred = useDeferredValue(term);

  // Single request for the full ingredient list — cached forever.
  const { data: all = [], isLoading } = useQuery<Ingredient[]>({
    queryKey: QK.ingredients,
    queryFn: mealApi.listIngredients,
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
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        // A suggestion is highlighted, select it and block form submit
        e.preventDefault();
        const chosen = suggestions[activeIndex];
        if (chosen) onSelect(chosen.strIngredient);
      } else {
        // Suggestions are visible but none highlighted, just close the dropdown and let the form submit naturally
        closeSuggestions();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
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
