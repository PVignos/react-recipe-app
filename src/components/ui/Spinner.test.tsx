import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders loading role", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has loading label", () => {
    render(<Spinner />);

    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

});
