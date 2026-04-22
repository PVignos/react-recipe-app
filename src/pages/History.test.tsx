import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HistoryPage from "./HistoryPage";
import { useHistoryStore } from "../store/useHistoryStore";

vi.mock("../hooks/useSeoMeta", () => ({
  useSeoMeta: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useHistoryStore.setState({ history: [] });
});

describe("HistoryPage", () => {
  it("shows empty state when no history", () => {
    renderPage();

    expect(screen.getByText(/no recipes rated yet/i)).toBeInTheDocument();
  });

  it("clears history when clicking Clear all", async () => {
    useHistoryStore.setState({
      history: [
        { id: "1", title: "Pizza", liked: true, thumb: "", timestamp: 0, area: "IT", ingredient: "Cheese" },
      ],
    });

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /clear all/i }));

    expect(screen.getByText(/no recipes rated yet/i)).toBeInTheDocument();
  });

  it("filters liked items only", async () => {
    useHistoryStore.setState({
      history: [
        { id: "1", title: "Pizza", liked: true, thumb: "", timestamp: 0, area: "IT", ingredient: "Cheese" },
        { id: "2", title: "Burger", liked: false, thumb: "", timestamp: 1, area: "US", ingredient: "Meat" },
      ],
    });

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Liked" }));

    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.queryByText("Burger")).not.toBeInTheDocument();
  });

  it("filters disliked items only", async () => {
    useHistoryStore.setState({
      history: [
        { id: "1", title: "Pizza", liked: true, thumb: "", timestamp: 0, area: "IT", ingredient: "Cheese" },
        { id: "2", title: "Burger", liked: false, thumb: "", timestamp: 1, area: "US", ingredient: "Meat" },
      ],
    });

    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Disliked" }));

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.queryByText("Pizza")).not.toBeInTheDocument();
  });

  it("paginates when more than page size", () => {
    useHistoryStore.setState({
      history: Array.from({ length: 12 }).map((_, i) => ({
        id: String(i),
        title: `Meal ${i}`,
        liked: true,
        thumb: "",
        timestamp: i,
        area: "IT",
        ingredient: "X",
      })),
    });

    renderPage();

    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });
});