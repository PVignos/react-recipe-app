import type { Meal } from "../../types/meal";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import Feedback from "../ui/Feedback";

interface RecipeCardProps {
  recipe: Meal;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const candidates = useAppStore((s) => s.candidates);
  const candidateIndex = useAppStore((s) => s.candidateIndex);
  const nextRecipe = useAppStore((s) => s.nextRecipe);
  const reset = useAppStore((s) => s.reset);

  const handleNext = () => {
    nextRecipe();
    // Sync URL to the next candidate — replace so Back button skips duplicates.
    const nextIndex = (candidateIndex + 1) % candidates.length;
    const nextMeal = candidates[nextIndex];
    if (nextMeal) navigate(`/recipe/${nextMeal.idMeal}`, { replace: true });
  };

  return (
    <article className="space-y-4">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-56 object-cover rounded-2xl"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
        }}
      />
      <div>
        <h2 className="text-xl font-semibold text-neutral-800">
          {recipe.strMeal}
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          {recipe.strArea} · {recipe.strCategory}
        </p>
      </div>
      {recipe.strYoutube && (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-orange-500 hover:underline"
        >
          Watch on YouTube →
        </a>
      )}
      <Feedback recipe={recipe} />
      <div className="flex gap-3 pt-2">
        {candidates.length > 1 && (
          <button
            onClick={handleNext}
            className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-xl hover:bg-neutral-50"
          >
            New Idea ({candidateIndex + 1}/{candidates.length})
          </button>
        )}
        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-xl hover:bg-neutral-50"
        >
          Start over
        </button>
      </div>
    </article>
  );
}

export default RecipeCard;
