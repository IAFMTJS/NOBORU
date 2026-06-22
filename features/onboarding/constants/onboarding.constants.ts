import type { LearningGoal } from "@/features/profile/types/profile.types";
import type { JlptPlacement } from "@/features/profile/types/profile.types";
import type { ThemePreference } from "@/features/settings/types/settings.types";
import {
  Briefcase,
  GraduationCap,
  Landmark,
  Plane,
  Tv,
  type LucideIcon,
} from "lucide-react";

export const ONBOARDING_STEP_COUNT = 7;

export const ONBOARDING_COPY = {
  welcome: {
    title: "NOBORU",
    subtitle: "登る",
    tagline: "Your climb. Your language. Your journey.",
    cta: "Begin Your Ascent",
    secondary: "Already have an account?",
    secondaryAction: "Sign in",
  },
  goal: {
    title: "Why are you learning Japanese?",
    cta: "Continue",
  },
  level: {
    title: "Where are you on the trail?",
    cta: "Continue",
  },
  dailyGoal: {
    title: "How far do you want to climb each day?",
    cta: "Continue",
  },
  theme: {
    title: "Choose your trail atmosphere",
    cta: "Continue",
  },
  meetYama: {
    title: "Meet Yama",
    body: "Your climbing companion. Yama climbs alongside you — not above you.",
    cta: "Continue",
  },
  region: {
    title: "Welcome to the Realm of First Light",
    body: "Every summit begins with a first step. Hiragana, katakana, and your N5 climb all start here.",
    trail: "Ember Threshold",
    cta: "Begin Climb",
  },
} as const;

export const LEARNING_GOAL_OPTIONS: Array<{
  value: LearningGoal;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "anime", label: "Anime", icon: Tv },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "culture", label: "Culture", icon: Landmark },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "jlpt", label: "JLPT", icon: GraduationCap },
];

export const PLACEMENT_OPTIONS: Array<{
  value: JlptPlacement;
  label: string;
}> = [
  { value: "none", label: "Absolute Beginner" },
  { value: "n5", label: "N5" },
  { value: "n4", label: "N4" },
  { value: "n3", label: "N3" },
  { value: "n2", label: "N2" },
  { value: "n1", label: "N1" },
];

export const DAILY_GOAL_OPTIONS: Array<{
  minutes: number;
  label: string;
  hint: string;
}> = [
  { minutes: 5, label: "5 min", hint: "~1 lesson" },
  { minutes: 10, label: "10 min", hint: "~2 lessons" },
  { minutes: 20, label: "20 min", hint: "~4 lessons" },
  { minutes: 30, label: "30 min", hint: "~6 lessons" },
  { minutes: 60, label: "60 min", hint: "Deep climb" },
];

export const THEME_OPTIONS: Array<{
  value: Exclude<ThemePreference, "system">;
  label: string;
  description: string;
}> = [
  { value: "light", label: "Light Mode", description: "Mountain Dawn" },
  { value: "dark", label: "Dark Mode", description: "Mountain Night" },
];

export const N5_START_REGION = {
  slug: "n5",
  name: "Realm of First Light",
  trail: "Ember Threshold",
} as const;

/** @deprecated Use N5_START_REGION */
export const FOOTHILLS_REGION = N5_START_REGION;
