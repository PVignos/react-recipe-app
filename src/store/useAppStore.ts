import type { Meal } from "../types/meal.js";
import { create } from "zustand";

export interface StepFormData {
  area: string;
  ingredient: string;
}

export interface AppState {
  step: number | string;
  formData: StepFormData;
  candidates: Meal[];
  recipe: Meal | null;

  setStep: (step: number) => void;
  updateForm: (patch: Partial<StepFormData>) => void;
  setPool: (pool: Meal[]) => void;
  nextRecipe: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  step: 1,
  formData: { area: "", ingredient: "" },
  candidates: [],
  recipe: null,

  setStep: (step) => set({ step }),

  updateForm: (patch) =>
    set((s) => ({
      formData: { ...s.formData, ...patch },
    })),

  setPool: (pool) =>
    set({
      candidates: pool,
      recipe: pool[Math.floor(Math.random() * pool.length)] ?? null,
      step: "result",
    }),

  nextRecipe: () =>
    set((s) => ({
      recipe:
        s.candidates[Math.floor(Math.random() * s.candidates.length)] ?? null,
    })),

  reset: () =>
    set({
      step: 1,
      formData: { area: "", ingredient: "" },
      candidates: [],
      recipe: null,
    }),
}));
