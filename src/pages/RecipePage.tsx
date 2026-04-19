import { useSeoMeta } from "../hooks/useSeoMeta";
import { mealApi } from "../services/meal";
import { useQuery } from "@tanstack/react-query";
import { QK } from "../services/query";
import type { Meal } from "../types/meal";
import Spinner from "../components/ui/Spinner";
import RecipeCard from "../components/recipe/RecipeCard";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";

function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery<Meal | null>({
    queryKey: QK.detail(id!),
    queryFn: () => mealApi.lookup(id!),
    // Meal details never change
    staleTime: Infinity,
    enabled: !!id,
  });

  useSeoMeta({
    title: recipe ? `${recipe.strMeal} — Recipe Recommender` : "Recipe",
    description: recipe
      ? `${recipe.strMeal} — ${recipe.strArea} ${recipe.strCategory} recipe.`
      : "Recipe detail",
  });

  if (isLoading) return <Spinner />;
  if (isError || !recipe) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-neutral-500 text-sm">Recipe not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-orange-500 hover:underline"
        >
          Start over
        </button>
      </main>
    );
  }

  return (
    <PageLayout title={recipe.strMeal} backTo="/" backLabel="Back to wizard">
      <RecipeCard recipe={recipe} />
    </PageLayout>
  );
}

export default RecipePage;
