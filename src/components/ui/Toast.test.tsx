import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Toast from "./Toast";

describe("Toast", () => {
  it("renders message", () => {
    render(<Toast message="Error occurred" onDismiss={vi.fn()} />);

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("calls onDismiss when clicking button", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();

    render(<Toast message="Error" onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: /dismiss/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  describe("timer behaviour", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    it("auto dismisses after 5 seconds", () => {
      const onDismiss = vi.fn();

      render(<Toast message="Error" onDismiss={onDismiss} />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).toHaveBeenCalled();
    });

    it("clears timer on unmount", () => {
      const onDismiss = vi.fn();

      const { unmount } = render(<Toast message="Error" onDismiss={onDismiss} />);

      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});