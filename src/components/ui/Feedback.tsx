import type { Meal } from "../../types/meal";
import { useAppStore } from "../../store/useAppStore";
import { useHistoryStore } from "../../store/useHistoryStore";

interface FeedbackProps {
  recipe: Meal;
}

function Feedback({ recipe }: FeedbackProps) {
  const formData = useAppStore((s) => s.formData);
  const upsertEntry = useHistoryStore((s) => s.upsertEntry);
  const history = useHistoryStore((s) => s.history);

  const existing = history.find((e) => e.id === recipe.idMeal);
  const currentRating = existing?.liked;

  const handle = (liked: boolean) => {
    upsertEntry({
      id: recipe.idMeal,
      title: recipe.strMeal,
      thumb: recipe.strMealThumb,
      liked,
      timestamp: Date.now(),
      area: formData.area,
      ingredient: formData.ingredient,
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-neutral-600">
        Did you like this recipe?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handle(true)}
          aria-pressed={currentRating === true}
          className={`flex-1 font-medium py-2 rounded-xl text-sm transition-colors border ${currentRating === true ? "bg-green-600 text-white border-green-600" : "bg-green-100 hover:bg-green-150 text-green-800 border-transparent"}`}
        >
          {currentRating === true ? "✔ Liked" : "Yes, I like it"}
        </button>
        <button
          onClick={() => handle(false)}
          aria-pressed={currentRating === false}
          className={`flex-1 font-medium py-2 rounded-xl text-sm transition-colors border ${currentRating === false ? "bg-red-500 text-white border-red-500" : "bg-red-50 hover:bg-red-100 text-red-600 border-transparent"}`}
        >
          {currentRating === false ? (
            <>
              <b>X</b> Disliked
            </>
          ) : (
            "No, not for me"
          )}
        </button>
      </div>
      {currentRating !== undefined && (
        <p className="text-xs text-neutral-400 text-center">
          Tap again to change your rating.
        </p>
      )}
    </div>
  );
}

export default Feedback;
