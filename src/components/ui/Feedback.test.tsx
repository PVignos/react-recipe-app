import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Feedback from "./Feedback";
import { useAppStore } from "../../store/useAppStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { Step } from "../../types/meal";

const recipe = {
  idMeal: "1",
  strMeal: "Pizza",
  strMealThumb: "img.jpg",
} as any;

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.setState({
    step: Step.One,
    formData: { area: "Italian", ingredient: "Chicken" },
    candidates: [],
    candidateIndex: 0,
  });
  useHistoryStore.setState({ history: [] });
});

describe("Feedback", () => {
  it("renders question", () => {
    render(<Feedback recipe={recipe} />);

    expect(screen.getByText(/did you like this recipe/i)).toBeInTheDocument();
  });

  it("shows liked state after clicking yes", async () => {
    const user = userEvent.setup();
    render(<Feedback recipe={recipe} />);

    await user.click(screen.getByRole("button", { name: /yes/i }));

    expect(screen.getByText("✔ Liked")).toBeInTheDocument();
  });

  it("shows disliked state after clicking no", async () => {
    const user = userEvent.setup();
    render(<Feedback recipe={recipe} />);

    await user.click(screen.getByRole("button", { name: /no/i }));

    expect(screen.getByRole("button", { name: /disliked/i })).toBeInTheDocument();
  });

  it("shows liked state when already rated in history", () => {
    useHistoryStore.setState({
      history: [
        { id: "1", title: "Pizza", thumb: "", liked: true, timestamp: 0, area: "Italian", ingredient: "Chicken" },
      ],
    });

    render(<Feedback recipe={recipe} />);

    expect(screen.getByText("✔ Liked")).toBeInTheDocument();
  });

  it("shows disliked state when already rated in history", () => {
    useHistoryStore.setState({
      history: [
        { id: "1", title: "Pizza", thumb: "", liked: false, timestamp: 0, area: "Italian", ingredient: "Chicken" },
      ],
    });

    render(<Feedback recipe={recipe} />);

    expect(screen.getByRole("button", { name: /disliked/i })).toBeInTheDocument();
  });
});