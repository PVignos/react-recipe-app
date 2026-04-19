import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";
import { useMealSearch } from "../../hooks/useMealSearch";
import { getSuggestions } from "../../services/suggestion";
import { mealApi } from "../../services/meal";
import Spinner from "../ui/Spinner";
import { Step } from "../../types/meal";
import Toast from "../ui/Toast";

function StepTwo() {
  const navigate = useNavigate();
  const ingredient = useAppStore((s) => s.formData.ingredient);
  const area = useAppStore((s) => s.formData.area);
  const updateForm = useAppStore((s) => s.updateForm);
  const setStep = useAppStore((s) => s.setStep);
  const setPool = useAppStore((s) => s.setPool);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  const {
    term,
    setTerm,
    suggestions,
    isLoading: searchLoading,
    activeIndex,
    handleKeyDown,
    onSelect,
    closeSuggestions,
  } = useMealSearch(area, (name) => updateForm({ ingredient: name }));

  const handleSubmit = async () => {
    setLoading(true);
    setToast(null);
    setNoResults(false);
    try {
      const pool = await getSuggestions({ area, ingredient });
      if (pool.length === 0) {
        setNoResults(true);
        return;
      }
      const detailed = await Promise.all(
        pool.map((m) => mealApi.lookup(m.idMeal)),
      );
      const valid = detailed.filter(
        (m): m is NonNullable<typeof m> => m !== null,
      );
      setPool(valid);
      console.log(
        ">>> pool set:",
        valid.length,
        useAppStore.getState().candidates.length,
      );

      // Navigate to the first result — URL is now shareable.
      if (valid[0]) navigate(`/recipe/${valid[0].idMeal}`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
          Step 2 of 2
        </p>
        <div className="space-y-1 relative">
          <label
            htmlFor="ingredient"
            className="block text-sm font-medium text-neutral-700"
          >
            Search an ingredient
            {searchLoading && (
              <span className="ml-2 text-xs font-normal text-neutral-400">
                Loading {area} ingredients…
              </span>
            )}
          </label>
          <div className="relative">
            <input
              id="ingredient"
              type="text"
              value={term}
              autoComplete="off"
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls="ingredient-listbox"
              aria-activedescendant={
                activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
              }
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(closeSuggestions, 150)}
              placeholder={searchLoading ? "Loading…" : "e.g. Chicken, Salmon…"}
              disabled={searchLoading}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />
            {suggestions.length > 0 && (
              <ul
                id="ingredient-listbox"
                role="listbox"
                aria-label="Ingredient suggestions"
                className="w-full border border-neutral-100 rounded-xl mt-1 bg-white overflow-hidden shadow-sm"
              >
                {suggestions.map((s, i) => (
                  <li
                    key={s.strIngredient}
                    id={`suggestion-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseDown={() => onSelect(s.strIngredient)}
                    className={`px-4 py-2 text-sm cursor-pointer ${i === activeIndex ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50"}`}
                  >
                    {s.strIngredient}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {noResults && (
          <p className="text-sm text-neutral-500">
            No recipes found. Try a different ingredient.
          </p>
        )}
        {loading && <Spinner />}
        <div className="flex gap-3">
          <button
            onClick={() => setStep(Step.One)}
            className="flex-1 border border-neutral-200 text-neutral-600 font-medium py-3 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!ingredient || loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Find recipe
          </button>
        </div>
      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}

export default StepTwo;
