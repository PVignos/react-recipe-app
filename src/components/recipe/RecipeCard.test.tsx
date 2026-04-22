import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RecipeCard from "./RecipeCard";
import { useAppStore } from "../../store/useAppStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { Step } from "../../types/meal";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const recipe = {
  idMeal: "1",
  strMeal: "Pizza",
  strMealThumb: "image.jpg",
  strArea: "Italian",
  strCategory: "Main",
  strSource: "https://example.com",
  strYoutube: "https://youtube.com",
} as any;

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.setState({
    step: Step.Result,
    formData: { area: "Italian", ingredient: "Chicken" },
    candidates: [
      { idMeal: "1", strMeal: "Pizza", strMealThumb: "" },
      { idMeal: "2", strMeal: "Pasta", strMealThumb: "" },
    ],
    candidateIndex: 0,
  });
  useHistoryStore.setState({ history: [] });
});

describe("RecipeCard", () => {
  it("renders recipe title, metadata and feedback question", () => {
    render(<RecipeCard recipe={recipe} />);

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText(/Italian · Main/i)).toBeInTheDocument();
    expect(screen.getByText(/did you like this recipe/i)).toBeInTheDocument();
  });

  it("navigates to next recipe on New Idea click", async () => {
    const user = userEvent.setup();
    render(<RecipeCard recipe={recipe} />);

    await user.click(screen.getByRole("button", { name: /new idea/i }));

    expect(navigateMock).toHaveBeenCalledWith("/recipe/2");
  });

  it("resets and navigates home on Start over", async () => {
    const user = userEvent.setup();
    render(<RecipeCard recipe={recipe} />);

    await user.click(screen.getByRole("button", { name: /start over/i }));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("renders external links when present", () => {
    render(<RecipeCard recipe={recipe} />);

    expect(screen.getByText(/view full recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/watch on youtube/i)).toBeInTheDocument();
  });
});