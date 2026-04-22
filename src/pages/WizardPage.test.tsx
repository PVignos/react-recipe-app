import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WizardPage from "./WizardPage";
import { Step } from "../types/meal";
import { useAppStore } from "../store/useAppStore";
import { mealApi } from "../services/meal";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../services/meal", () => ({
  mealApi: {
    listAreas: vi.fn(),
    listIngredients: vi.fn(),
  },
}));

vi.mock("../hooks/useSeoMeta", () => ({
  useSeoMeta: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <WizardPage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.setState({
    step: Step.One,
    formData: { area: "", ingredient: "" },
    candidates: [],
    candidateIndex: 0,
  });
});

describe("WizardPage", () => {
  it("renders step one form when step is One", async () => {
    vi.mocked(mealApi.listAreas).mockResolvedValue([{ strArea: "Italian" }]);

    renderPage();

    expect(await screen.findByText("Step 1 of 2")).toBeInTheDocument();
    expect(screen.getByLabelText(/choose a cuisine/i)).toBeInTheDocument();
  });

  it("renders step two form when step is Two", () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([]);
    useAppStore.setState({
      step: Step.Two,
      formData: { area: "Italian", ingredient: "" },
      candidates: [],
      candidateIndex: 0,
    });

    renderPage();

    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();
    expect(screen.getByLabelText(/search an ingredient/i)).toBeInTheDocument();
  });

  it("resets to step one if store was in result state on mount", async () => {
    vi.mocked(mealApi.listAreas).mockResolvedValue([{ strArea: "Italian" }]);
    useAppStore.setState({
      step: Step.Result,
      formData: { area: "", ingredient: "" },
      candidates: [],
      candidateIndex: 0,
    });

    renderPage();

    expect(await screen.findByText("Step 1 of 2")).toBeInTheDocument();
  });
});