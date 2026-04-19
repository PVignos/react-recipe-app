import {create} from "zustand";
import {type Meal, Step} from "../types/meal";

export interface WizardForm {
  area: string;
  ingredient: string;
}

interface AppState {
  step: Step;
  formData: WizardForm;
  candidates: Meal[];
  candidateIndex: number;
  recipe: Meal | null;
  setStep: (step: Step) => void;
  updateForm: (patch: Partial<WizardForm>) => void;
  setPool: (pool: Meal[]) => void;
  nextRecipe: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  step: Step.One,
  formData: { area: "", ingredient: "" },
  candidates: [],
  candidateIndex: 0,
  recipe: null,

  setStep: (step) => set({ step }),

  updateForm: (patch) =>
    set((s) => ({ formData: { ...s.formData, ...patch } })),

  // Shuffle the pool once — sequence feels random but never repeats
  setPool: (pool) =>
    set((): Partial<AppState> => {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return {
        candidates: shuffled,
        candidateIndex: 0,
        recipe: shuffled[0] ?? null,
        step: Step.Result,
      };
    }),
  // Advance index — wraps only after all candidates are shown once
  nextRecipe: () =>
    set((s) => {
      const next = (s.candidateIndex + 1) % s.candidates.length;
      // ?? null normalises to match recipe: Meal | null in the interface.
      return { candidateIndex: next, recipe: s.candidates[next] ?? null };
    }),
  reset: () =>
    set({
      step: Step.One,
      formData: { area: "", ingredient: "" },
      candidates: [],
      candidateIndex: 0,
      recipe: null,
    }),
}));
