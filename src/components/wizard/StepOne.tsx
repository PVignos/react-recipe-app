import { useAppStore } from "../../store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import type { Area } from "../../types/meal";
import { QK } from "../../services/query";
import { mealApi } from "../../services/meal";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";

function StepOne() {
  const area = useAppStore((s) => s.formData.area);
  const updateForm = useAppStore((s) => s.updateForm);
  const setStep = useAppStore((s) => s.setStep);

  const {
    data: areas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Area[]>({
    queryKey: QK.areas,
    queryFn: mealApi.listAreas,
    staleTime: Infinity,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area) setStep(2);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            onChange={(e) => updateForm({ area: e.target.value })}
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
          type="submit"
          disabled={!area}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
        >
          Next
        </button>
      </form>
      {isError && (
        <Toast
          message="Failed to load cuisines. Please try again."
          onDismiss={() => refetch()}
        />
      )}
    </>
  );
}

export default StepOne;
