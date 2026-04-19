import { useAppStore } from "../store/useAppStore";
import { useSeoMeta } from "../hooks/useSeoMeta";
import StepOne from "../components/wizard/StepOne";
import { Step } from "../types/meal";
import StepTwo from "../components/wizard/StepTwo";

function WizardPage() {
  const step = useAppStore((s) => s.step);
  useSeoMeta({
    title: "Find a Recipe — Recipe Finder",
    description:
      "Pick a cuisine and an ingredient to get a personalised recipe.",
  });
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-8">
        Find a Recipe
      </h1>
      {step === Step.One && <StepOne />}
      {step === Step.Two && <StepTwo />}
    </main>
  );
}

export default WizardPage;
