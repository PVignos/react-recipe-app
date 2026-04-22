import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecipePage from "./RecipePage";
import { mealApi } from "../services/meal";
import { useAppStore } from "../store/useAppStore";
import { useHistoryStore } from "../store/useHistoryStore";
import { Step } from "../types/meal";

const navigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
  useParams: () => ({ id: "1" }),
}));

vi.mock("../services/meal", () => ({
  mealApi: { lookup: vi.fn() },
}));

vi.mock("../hooks/useSeoMeta", () => ({
  useSeoMeta: vi.fn(),
}));

const mockRecipe = {
  idMeal: "1",
  strMeal: "Pizza",
  strMealThumb: "img.jpg",
  strArea: "Italian",
  strCategory: "Main",
  strSource: null,
  strYoutube: null,
} as any;

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipePage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.setState({
    step: Step.One,
    formData: { area: "Italian", ingredient: "Chicken" },
    candidates: [{ idMeal: "1", strMeal: "Pizza", strMealThumb: "" }],
    candidateIndex: 0,
  });
  useHistoryStore.setState({ history: [] });
});

describe("RecipePage", () => {
  it("shows spinner while loading", () => {
    vi.mocked(mealApi.lookup).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error when recipe is not found", async () => {
    vi.mocked(mealApi.lookup).mockRejectedValue(new Error("Not found"));

    renderPage();

    expect(await screen.findByText(/recipe not found/i)).toBeInTheDocument();
  });

  it("navigates home when clicking Start over on error", async () => {
    vi.mocked(mealApi.lookup).mockRejectedValue(new Error("Not found"));

    renderPage();

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /start over/i }));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("renders recipe title and metadata when loaded", async () => {
    vi.mocked(mealApi.lookup).mockResolvedValue(mockRecipe);

    renderPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Pizza" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Italian · Main/i)).toBeInTheDocument();
  });
});