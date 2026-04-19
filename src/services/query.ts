export const QK = {
  areas: ["areas"],
  ingredients: ["ingredients"],
  ingredientsByArea: (a: string) => ["ingredients", "area", a],
  byArea: (a: string) => ["meals", "area", a],
  byIngredient: (i: string) => ["meals", "ingredient", i],
  detail: (id: string) => ["meal", id],
};
