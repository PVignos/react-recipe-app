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
    const next = nextRecipe();
    if (next) navigate(`/recipe/${next.idMeal}`);
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
      {(recipe.strSource || recipe.strYoutube) && (
        <div className="flex flex-wrap justify-between gap-3">
          {recipe.strSource && (
            <a
              href={recipe.strSource}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-orange-500 hover:underline"
            >
              &#128279; View full recipe →
            </a>
          )}
          {recipe.strYoutube && (
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-400 hover:underline"
            >
              &#9654; Watch on YouTube →
            </a>
          )}
        </div>
      )}
      <Feedback recipe={recipe} />
      <div className="flex gap-3 pt-2">
        {candidates.length > 1 && (
          <button
            onClick={handleNext}
            className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            New Idea ({candidateIndex + 1}/{candidates.length})
          </button>
        )}
        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-medium py-2 rounded-xl hover:bg-neutral-50 transition-colors"
        >
          Start over
        </button>
      </div>
    </article>
  );
}

export default RecipeCard;
