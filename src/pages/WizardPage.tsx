import { useAppStore } from "../store/useAppStore";
import { useSeoMeta } from "../hooks/useSeoMeta";
import StepOne from "../components/wizard/StepOne";
import { Step } from "../types/meal";
import StepTwo from "../components/wizard/StepTwo";
import PageLayout from "../components/common/PageLayout";

function WizardPage() {
  const step = useAppStore((s) => s.step);
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
