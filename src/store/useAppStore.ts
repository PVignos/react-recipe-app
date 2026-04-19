import { create } from "zustand";
import { type MealSummary, Step } from "../types/meal";

export interface WizardForm {
  area: string;
  ingredient: string;
}

interface AppState {
  step: Step;
  formData: WizardForm;
  candidates: MealSummary[];
  candidateIndex: number;
  setStep: (step: Step) => void;
  updateForm: (patch: Partial<WizardForm>) => void;
  setPool: (pool: MealSummary[]) => void;
  nextRecipe: () => MealSummary | null;
  reset: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  step: Step.One,
  formData: { area: "", ingredient: "" },
  candidates: [],
  candidateIndex: 0,

  setStep: (step) => set({ step }),

  updateForm: (patch) =>
    set((s) => ({ formData: { ...s.formData, ...patch } })),

  // Shuffle once — sequence feels random but never repeats
  setPool: (pool) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    set({ candidates: shuffled, candidateIndex: 0, step: Step.Result });
  },

  // Advance index and return the next candidate
  nextRecipe: () => {
    const { candidates, candidateIndex } = get();
    const next = (candidateIndex + 1) % candidates.length;
    set({ candidateIndex: next });
    return candidates[next] ?? null;
  },

  reset: () =>
    set({
      step: Step.One,
      formData: { area: "", ingredient: "" },
      candidates: [],
      candidateIndex: 0,
    }),
}));
