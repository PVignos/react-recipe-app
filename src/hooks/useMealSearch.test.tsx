import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMealSearch } from "./useMealSearch";
import { mealApi } from "../services/meal";

vi.mock("../services/meal", () => ({
  mealApi: {
    listIngredients: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: any) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    );
  };
}

describe("useMealSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads ingredients from api", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
      { strIngredient: "Cheese" },
      { strIngredient: "Salmon" },
    ]);

    const { result } = renderHook(() => useMealSearch(vi.fn()), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.term).toBe("");
    expect(result.current.suggestions).toEqual([]);
  });

  it("filters suggestions by term", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
      { strIngredient: "Cheese" },
      { strIngredient: "Salmon" },
    ]);

    const { result } = renderHook(() => useMealSearch(vi.fn()), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setTerm("ch");
    });

    expect(result.current.suggestions.length).toBe(2);
    expect(result.current.suggestions.map((s) => s.strIngredient)).toEqual([
      "Chicken",
      "Cheese",
    ]);
  });

  it("calls onCommit when selecting item", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
    ]);

    const onCommit = vi.fn();

    const { result } = renderHook(() => useMealSearch(onCommit), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.onSelect("Chicken");
    });

    expect(onCommit).toHaveBeenCalledWith("Chicken");
    expect(result.current.term).toBe("Chicken");
    expect(result.current.activeIndex).toBe(-1);
  });

  it("handles arrow down keyboard navigation", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
      { strIngredient: "Cheese" },
    ]);

    const { result } = renderHook(() => useMealSearch(vi.fn()), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setTerm("ch");
    });

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowDown",
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.activeIndex).toBe(0);
  });

  it("handles arrow up keyboard navigation", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
      { strIngredient: "Cheese" },
    ]);

    const { result } = renderHook(() => useMealSearch(vi.fn()), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setTerm("ch");
    });

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowDown",
        preventDefault: vi.fn(),
      } as any);
    });

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowUp",
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.activeIndex).toBe(0);
  });

  it("handles escape key reset", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
    ]);

    const { result } = renderHook(() => useMealSearch(vi.fn()), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setTerm("ch");
    });

    act(() => {
      result.current.handleKeyDown({
        key: "Escape",
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.term).toBe("");
    expect(result.current.activeIndex).toBe(-1);
  });
});
