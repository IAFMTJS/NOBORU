"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

import { NoboruWordmark } from "@/components/brand/noboru-wordmark";
import { MascotImage } from "@/components/media/mascot-image";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/features/onboarding/components/onboarding-progress";
import { SelectionCard } from "@/features/onboarding/components/selection-card";
import {
  DAILY_GOAL_OPTIONS,
  FOOTHILLS_REGION,
  LEARNING_GOAL_OPTIONS,
  ONBOARDING_COPY,
  ONBOARDING_STEP_COUNT,
  PLACEMENT_OPTIONS,
  THEME_OPTIONS,
} from "@/features/onboarding/constants/onboarding.constants";
import { onboardingService } from "@/features/onboarding/services/onboarding.service";
import {
  INITIAL_ONBOARDING_DRAFT,
  type OnboardingDraft,
} from "@/features/onboarding/types/onboarding.types";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { cn } from "@/lib/utils";

export function OnboardingWizard() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_ONBOARDING_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateDraft(partial: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  }

  function goNext() {
    setError(null);
    setStep((current) => Math.min(ONBOARDING_STEP_COUNT, current + 1));
  }

  async function completeOnboarding() {
    if (
      !draft.learningGoal ||
      !draft.currentLevel ||
      !draft.dailyGoalMinutes ||
      !draft.theme
    ) {
      setError("Please complete each step before starting your climb.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await onboardingService.completeOnboarding({
      learningGoal: draft.learningGoal,
      currentLevel: draft.currentLevel,
      dailyGoalMinutes: draft.dailyGoalMinutes,
      theme: draft.theme,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to complete onboarding.");
      return;
    }

    setTheme(draft.theme);
    router.push(AUTH_ROUTES.home);
    router.refresh();
  }

  const canContinue =
    (step === 1 && true) ||
    (step === 2 && draft.learningGoal !== null) ||
    (step === 3 && draft.currentLevel !== null) ||
    (step === 4 && draft.dailyGoalMinutes !== null) ||
    (step === 5 && draft.theme !== null) ||
    (step === 6 && true) ||
    (step === 7 && true);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <OnboardingProgress currentStep={step} />
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-6">
          {step === 1 ? (
            <div className="space-y-6 text-center">
              <div className="relative mx-auto h-32 w-32">
                <MascotImage alt="Yama" fill className="object-contain" priority />
              </div>
              <NoboruWordmark className="mx-auto" priority />
              <p className="text-body-sm text-muted-foreground">
                {ONBOARDING_COPY.welcome.subtitle}
              </p>
              <p className="text-body text-muted-foreground">
                {ONBOARDING_COPY.welcome.tagline}
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-heading-4">{ONBOARDING_COPY.goal.title}</h2>
              <div className="space-y-2">
                {LEARNING_GOAL_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectionCard
                      key={option.value}
                      label={option.label}
                      selected={draft.learningGoal === option.value}
                      icon={<Icon className="h-5 w-5" aria-hidden />}
                      onClick={() => updateDraft({ learningGoal: option.value })}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-heading-4">{ONBOARDING_COPY.level.title}</h2>
              <div className="grid grid-cols-2 gap-2">
                {PLACEMENT_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={draft.currentLevel === option.value}
                    onClick={() => updateDraft({ currentLevel: option.value })}
                    className={cn(
                      option.value !== "none" && "justify-center text-center",
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-heading-4">{ONBOARDING_COPY.dailyGoal.title}</h2>
              <div className="space-y-2">
                {DAILY_GOAL_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.minutes}
                    label={option.label}
                    description={option.hint}
                    selected={draft.dailyGoalMinutes === option.minutes}
                    onClick={() =>
                      updateDraft({ dailyGoalMinutes: option.minutes })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <h2 className="text-heading-4">{ONBOARDING_COPY.theme.title}</h2>
              <div className="space-y-2">
                {THEME_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    selected={draft.theme === option.value}
                    onClick={() => {
                      updateDraft({ theme: option.value });
                      setTheme(option.value);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="space-y-6 text-center">
              <div className="relative mx-auto h-40 w-40">
                <MascotImage alt="Yama" fill className="object-contain" priority />
              </div>
              <div className="space-y-2">
                <h2 className="text-heading-4">{ONBOARDING_COPY.meetYama.title}</h2>
                <p className="text-body text-muted-foreground">
                  {ONBOARDING_COPY.meetYama.body}
                </p>
              </div>
            </div>
          ) : null}

          {step === 7 ? (
            <div className="space-y-6 text-center">
              <div className="rounded-hero border border-primary/20 bg-primary/5 p-6">
                <p className="text-caption uppercase tracking-wide text-primary">
                  {FOOTHILLS_REGION.trail}
                </p>
                <h2 className="mt-2 text-heading-3">{ONBOARDING_COPY.region.title}</h2>
                <p className="mt-3 text-body text-muted-foreground">
                  {ONBOARDING_COPY.region.body}
                </p>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-center text-caption text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mx-auto w-full max-w-md space-y-3 pb-[env(safe-area-inset-bottom)]">
          {step > 1 && step < ONBOARDING_STEP_COUNT ? (
            <Button variant="ghost" className="w-full" onClick={goBack}>
              Back
            </Button>
          ) : null}

          {step < ONBOARDING_STEP_COUNT ? (
            <Button
              className="w-full"
              disabled={!canContinue}
              onClick={goNext}
            >
              {step === 1
                ? ONBOARDING_COPY.welcome.cta
                : step === 2
                  ? ONBOARDING_COPY.goal.cta
                  : step === 3
                    ? ONBOARDING_COPY.level.cta
                    : step === 4
                      ? ONBOARDING_COPY.dailyGoal.cta
                      : step === 5
                        ? ONBOARDING_COPY.theme.cta
                        : ONBOARDING_COPY.meetYama.cta}
            </Button>
          ) : (
            <Button
              className="w-full"
              loading={loading}
              onClick={() => void completeOnboarding()}
            >
              {ONBOARDING_COPY.region.cta}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
