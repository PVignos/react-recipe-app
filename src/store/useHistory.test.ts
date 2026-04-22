import { act, renderHook } from "@testing-library/react";
import { useHistoryStore } from "./useHistoryStore";

const entryA = { id: "1", name: "A" } as any;
const entryB = { id: "2", name: "B" } as any;

describe("useHistoryStore", () => {
  beforeEach(() => {
    act(() => {
      useHistoryStore.setState({ history: [] });
    });
  });

  it("adds entry to history", () => {
    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.upsertEntry(entryA);
    });

    expect(result.current.history).toEqual([entryA]);
  });

  it("moves existing entry to top (deduplication)", () => {
    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.upsertEntry(entryA);
      result.current.upsertEntry(entryB);
      result.current.upsertEntry(entryA);
    });

    expect(result.current.history[0]).toEqual(entryA);
    expect(result.current.history).toHaveLength(2);
  });

  it("clears history", () => {
    const { result } = renderHook(() => useHistoryStore());

    act(() => {
      result.current.upsertEntry(entryA);
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
  });
});
