export const QK = {
  areas: ["areas"],
  ingredients: ["ingredients"],
  byArea: (a: string) => ["meals", "area", a],
  byIngredient: (i: string) => ["meals", "ingredient", i],
  detail: (id: string) => ["meal", id],
};
