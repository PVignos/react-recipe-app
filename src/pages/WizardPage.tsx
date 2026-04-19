import { useAppStore } from "../store/useAppStore";
import { useSeoMeta } from "../hooks/useSeoMeta";
import StepOne from "../components/wizard/StepOne";
import { Step } from "../types/meal";
import StepTwo from "../components/wizard/StepTwo";
import PageLayout from "../components/common/PageLayout";
import { useEffect } from "react";

function WizardPage() {
  const step = useAppStore((s) => s.step);
  const reset = useAppStore((s) => s.reset);

  // If step is 'result' but we're on the wizard route, the store is stale.
  // Reset to One so the user sees the form instead of a blank page.
  useEffect(() => {
    if (step === Step.Result) {
      reset();
    }
  }, []);

  useSeoMeta({
    title: "Find a Recipe — Recipe Finder",
    description:
      "Pick a cuisine and an ingredient to get a personalised recipe.",
  });

  return (
    <PageLayout title="Find a Recipe">
      {step === Step.One && <StepOne />}
      {step === Step.Two && <StepTwo />}
    </PageLayout>
  );
}

export default WizardPage;
