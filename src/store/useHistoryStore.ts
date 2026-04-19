import { persist } from "zustand/middleware/persist";
import { create } from "zustand";
import type { HistoryEntry } from "../types/meal.js";

export interface HistoryState {
  history: HistoryEntry[];
  upsertEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      upsertEntry: (entry) =>
        set((s) => {
          // Remove any existing record for this meal, then prepend the new one
          // This ensures the most recently rated meal always appears first
          const without = s.history.filter((e) => e.id !== entry.id);
          return { history: [entry, ...without] };
        }),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "react-recipe-app-history" },
  ),
);
