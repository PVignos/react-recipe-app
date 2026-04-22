import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import PageLayout from "./PageLayout";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

describe("PageLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and children", () => {
    render(
      <PageLayout title="Home">
        <div>Content</div>
      </PageLayout>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders back button when backTo is provided", () => {
    render(
      <PageLayout title="Home" backTo="/prev">
        <div>Content</div>
      </PageLayout>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("navigates when clicking back button", async () => {
    const user = userEvent.setup();

    render(
      <PageLayout title="Home" backTo="/prev">
        <div>Content</div>
      </PageLayout>,
    );

    await user.click(screen.getByRole("button"));

    expect(navigateMock).toHaveBeenCalledWith("/prev");
  });

  it("does not render back button when backTo is missing", () => {
    render(
      <PageLayout title="Home">
        <div>Content</div>
      </PageLayout>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
