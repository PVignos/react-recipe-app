// The meal db API types

// Meal
export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;

  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

// Meal coming from filter
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// Area
export interface Area {
  strArea: string;
}

// Ingredient
export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strThumb: string;
  strType: string | null;
}

// History entry (saved in localstorage)
export interface HistoryEntry {
  id: string;
  title: string;
  thumb: string;
  liked: boolean;
  timestamp: number;
  area: string;
  ingredient: string;
}
