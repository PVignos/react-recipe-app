import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSuggestions } from "./suggestion";
import { mealApi } from "./meal";

vi.mock("../services/meal");

describe("getSuggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns intersection of area and ingredient results", async () => {
    vi.mocked(mealApi.filterByArea).mockResolvedValue([
      { idMeal: "1", strMeal: "A", strMealThumb: "" },
      { idMeal: "2", strMeal: "B", strMealThumb: "" },
    ]);
    vi.mocked(mealApi.filterByIngredient).mockResolvedValue([
      { idMeal: "2", strMeal: "B", strMealThumb: "" },
      { idMeal: "3", strMeal: "C", strMealThumb: "" },
    ]);

    const result = await getSuggestions({
      area: "Italian",
      ingredient: "Chicken",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.idMeal).toBe("2");
  });

  it("returns empty array when there is no intersection", async () => {
    vi.mocked(mealApi.filterByArea).mockResolvedValue([
      { idMeal: "1", strMeal: "A", strMealThumb: "" },
    ]);
    vi.mocked(mealApi.filterByIngredient).mockResolvedValue([
      { idMeal: "99", strMeal: "Z", strMealThumb: "" },
    ]);

    const result = await getSuggestions({
      area: "Japanese",
      ingredient: "Beef",
    });
    expect(result).toHaveLength(0);
  });
});
