import { act, renderHook } from "@testing-library/react";
import { useAppStore } from "./useAppStore";
import { Step } from "../types/meal";

const pool = [
  { id: "1", name: "A" },
  { id: "2", name: "B" },
  { id: "3", name: "C" },
] as any;

beforeEach(() => {
  act(() => {
    useAppStore.setState({
      step: Step.One,
      formData: { area: "", ingredient: "" },
      candidates: [],
      candidateIndex: 0,
    });
  });
});

describe("useAppStore", () => {
  it("sets step", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setStep(Step.Result);
    });

    expect(result.current.step).toBe(Step.Result);
  });

  it("updates form data partially", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.updateForm({ area: "Italian" });
    });

    expect(result.current.formData.area).toBe("Italian");
    expect(result.current.formData.ingredient).toBe("");
  });

  it("sets pool and switches step to Result", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setPool(pool);
    });

    expect(result.current.candidates.length).toBe(3);
    expect(result.current.step).toBe(Step.Result);
    expect(result.current.candidateIndex).toBe(0);
  });

  it("cycles candidates and wraps index", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setPool(pool);
    });

    let first: any;
    act(() => {
      first = result.current.nextRecipe();
    });

    // nextRecipe returns a candidate (not null) and advances the index
    expect(first).not.toBeNull();
    expect(result.current.candidateIndex).toBe(1);

    // After cycling through all 3 candidates, index wraps back to 0
    act(() => {
      result.current.nextRecipe(); // → 2
      result.current.nextRecipe(); // → 0 (wraps)
    });
    expect(result.current.candidateIndex).toBe(0);
  });

  it("resets store", () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setPool(pool);
      result.current.reset();
    });

    expect(result.current.step).toBe(Step.One);
    expect(result.current.candidates).toEqual([]);
    expect(result.current.candidateIndex).toBe(0);
  });
});
