import type { LearningGoal, JlptPlacement } from "@/features/profile/types/profile.types";
import type { ThemePreference } from "@/features/settings/types/settings.types";

export type OnboardingDraft = {
  learningGoal: LearningGoal | null;
  currentLevel: JlptPlacement | null;
  dailyGoalMinutes: number | null;
  theme: Exclude<ThemePreference, "system"> | null;
};

export type CompleteOnboardingInput = {
  learningGoal: LearningGoal;
  currentLevel: JlptPlacement;
  dailyGoalMinutes: number;
  theme: Exclude<ThemePreference, "system">;
};

export type OnboardingResult = {
  success: boolean;
  error?: string;
};

export const INITIAL_ONBOARDING_DRAFT: OnboardingDraft = {
  learningGoal: null,
  currentLevel: null,
  dailyGoalMinutes: null,
  theme: "dark",
};
