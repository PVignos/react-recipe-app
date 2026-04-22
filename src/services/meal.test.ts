import { beforeEach, describe, expect, it, vi } from "vitest";
import { mealApi } from "./meal";

function mockFetch(data: any, ok = true) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
  } as any);
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("mealApi", () => {
  it("returns ingredients list", async () => {
    mockFetch({
      meals: [{ strIngredient: "Chicken" }],
    });

    const res = await mealApi.listIngredients();

    expect(res).toEqual([{ strIngredient: "Chicken" }]);
  });

  it("returns areas list", async () => {
    mockFetch({
      meals: [{ strArea: "Italian" }],
    });

    const res = await mealApi.listAreas();

    expect(res).toEqual([{ strArea: "Italian" }]);
  });

  it("filters by ingredient", async () => {
    mockFetch({
      meals: [{ idMeal: "1", strMeal: "Pizza" }],
    });

    const res = await mealApi.filterByIngredient("chicken");

    expect(res).toEqual([{ idMeal: "1", strMeal: "Pizza" }]);
  });

  it("filters by area", async () => {
    mockFetch({
      meals: [{ idMeal: "2", strMeal: "Pasta" }],
    });

    const res = await mealApi.filterByArea("Italian");

    expect(res).toEqual([{ idMeal: "2", strMeal: "Pasta" }]);
  });

  it("returns first meal or null for lookup", async () => {
    mockFetch({
      meals: [{ idMeal: "1", strMeal: "Pizza" }],
    });

    const res = await mealApi.lookup("1");

    expect(res).toEqual({ idMeal: "1", strMeal: "Pizza" });
  });

  it("returns null when lookup has no meals", async () => {
    mockFetch({
      meals: [],
    });

    const res = await mealApi.lookup("1");

    expect(res).toBeNull();
  });

  it("throws on HTTP error", async () => {
    mockFetch({}, false);

    await expect(mealApi.listAreas()).rejects.toThrow("Api 500");
  });

  it("throws on invalid response shape", async () => {
    mockFetch({
      meals: "invalid",
    });

    await expect(mealApi.listAreas()).rejects.toThrow("Invalid response");
  });
});
