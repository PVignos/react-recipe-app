import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StepTwo from "./StepTwo";
import { mealApi } from "../../services/meal";

let ingredient = "";

vi.mock("../../services/meal", () => ({
  mealApi: {
    listIngredients: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../store/useAppStore", () => ({
  useAppStore: (selector: any) =>
    selector({
      formData: { area: "Italian", ingredient },
      updateForm: (payload: any) => {
        ingredient = payload.ingredient;
      },
      setStep: vi.fn(),
      setPool: vi.fn(),
    }),
}));

function renderStepTwo() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <StepTwo />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  ingredient = "";
  vi.clearAllMocks();
});

describe("StepTwo — dynamic search", () => {
  it("shows suggestions filtered by typed term", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
      { strIngredient: "Chickpeas" },
      { strIngredient: "Salmon" },
    ]);

    renderStepTwo();

    const user = userEvent.setup();
    const input = screen.getByRole("combobox");
    await waitFor(() => expect(input).not.toBeDisabled());

    await user.type(input, "chick");

    expect(await screen.findByText("Chicken")).toBeInTheDocument();
    expect(await screen.findByText("Chickpeas")).toBeInTheDocument();
    expect(screen.queryByText("Salmon")).not.toBeInTheDocument();
  });

  it("selects suggestion on click", async () => {
    vi.mocked(mealApi.listIngredients).mockResolvedValue([
      { strIngredient: "Chicken" },
    ]);

    renderStepTwo();

    const user = userEvent.setup();
    const input = screen.getByRole("combobox");
    await waitFor(() => expect(input).not.toBeDisabled());

    await user.type(input, "chick");

    expect(await screen.findByText("Chicken")).toBeInTheDocument();

    await user.click(screen.getByText("Chicken"));

    expect(screen.getByRole("combobox")).toHaveValue("Chicken");
  });
});