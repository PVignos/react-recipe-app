import { useAppStore } from "../../store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import type { Area, Ingredient } from "../../types/meal";
import { QK } from "../../services/query";
import { mealApi } from "../../services/meal";
import Spinner from "../ui/Spinner";
import { fetchIngredientsForArea } from "../../hooks/useMealSearch";
import { queryClient } from "../../services/queryClient";

function StepOne() {
  const area = useAppStore((s) => s.formData.area);
  const updateForm = useAppStore((s) => s.updateForm);
  const setStep = useAppStore((s) => s.setStep);

  const {
    data: areas = [],
    isLoading,
    isError,
  } = useQuery<Area[]>({
    queryKey: QK.areas,
    queryFn: mealApi.listAreas,
    staleTime: Infinity,
  });

  const handleAreaChange = (value: string) => {
    updateForm({ area: value });
    // Prefetch area ingredients immediately — by the time the user reaches
    // StepTwo the suggestions are already in cache, zero loading state.
    if (value) {
      queryClient.prefetchQuery<Ingredient[]>({
        queryKey: QK.ingredientsByArea(value),
        queryFn: () => fetchIngredientsForArea(value),
        staleTime: Infinity,
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load cuisines.</p>;

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
        Step 1 of 2
      </p>
      <div className="space-y-2">
        <label
          htmlFor="area"
          className="block text-sm font-medium text-neutral-700"
        >
          Choose a cuisine
        </label>
        <select
          id="area"
          value={area}
          onChange={(e) => handleAreaChange(e.target.value)}
          className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Select a cuisine…</option>
          {areas.map((a) => (
            <option key={a.strArea} value={a.strArea}>
              {a.strArea}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setStep(2)}
        disabled={!area}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
      >
        Next
      </button>
    </div>
  );
}

export default StepOne;
