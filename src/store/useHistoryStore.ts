import { persist } from "zustand/middleware/persist";
import { create } from "zustand";
import type { HistoryEntry } from "../types/meal.js";

export interface HistoryState {
  history: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addEntry: (entry) =>
        set((s) => ({
          history: [entry, ...s.history],
        })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "react-recipe-app-history" },
  ),
);
