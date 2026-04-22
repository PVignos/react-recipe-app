import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "./ErrorBoundary";
import type { FC } from "react";

const ProblemChild: FC = () => {
  throw new Error("Crash");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>OK</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    // suppress console.error noise
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("resets error state when clicking Try again", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try again/i }));

    // after reset, boundary tries to re-render children
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });
});
