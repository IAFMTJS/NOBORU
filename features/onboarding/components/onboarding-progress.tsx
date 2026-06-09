import { cn } from "@/lib/utils";

import { ONBOARDING_STEP_COUNT } from "@/features/onboarding/constants/onboarding.constants";

type OnboardingProgressProps = {
  currentStep: number;
  className?: string;
};

export function OnboardingProgress({
  currentStep,
  className,
}: OnboardingProgressProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label={`Step ${currentStep} of ${ONBOARDING_STEP_COUNT}`}
    >
      {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <span
            key={step}
            className={cn(
              "h-2 rounded-full transition-all motion-standard",
              isActive ? "w-6 bg-primary" : "w-2",
              isComplete ? "bg-primary/60" : !isActive ? "bg-muted" : "",
            )}
          />
        );
      })}
    </div>
  );
}
