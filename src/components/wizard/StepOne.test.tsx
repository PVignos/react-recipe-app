import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StepOne from "./StepOne";
import { mealApi } from "../../services/meal";
import { useAppStore } from "../../store/useAppStore";
import { Step } from "../../types/meal";

vi.mock("../../services/meal", () => ({
  mealApi: {
    listAreas: vi.fn(),
  },
}));

function renderStepOne() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <StepOne />
    </QueryClientProvider>,
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

describe("StepOne", () => {
  it("renders loading state initially", () => {
    vi.mocked(mealApi.listAreas).mockReturnValue(new Promise(() => {}));

    renderStepOne();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders area options after loading", async () => {
    vi.mocked(mealApi.listAreas).mockResolvedValue([
      { strArea: "Italian" },
      { strArea: "French" },
    ]);

    renderStepOne();

    await screen.findByRole("combobox");

    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("button is disabled until area is selected", async () => {
    vi.mocked(mealApi.listAreas).mockResolvedValue([{ strArea: "Italian" }]);

    renderStepOne();

    const user = userEvent.setup();
    const select = await screen.findByRole("combobox");
    const button = screen.getByRole("button", { name: /next/i });

    // Arrange: no area selected
    expect(button).toBeDisabled();

    // Act: select an area
    await user.selectOptions(select, "Italian");

    // Assert: button is now enabled
    expect(button).toBeEnabled();
  });

  it("advances to step 2 on submit", async () => {
    vi.mocked(mealApi.listAreas).mockResolvedValue([{ strArea: "Italian" }]);

    renderStepOne();

    const user = userEvent.setup();
    const select = await screen.findByRole("combobox");
    await user.selectOptions(select, "Italian");
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(useAppStore.getState().step).toBe(Step.Two);
  });
});