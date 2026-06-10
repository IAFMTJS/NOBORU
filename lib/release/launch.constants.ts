import { RELEASE } from "@/lib/release/release.constants";

export type LaunchCriterionId =
  | "foothills"
  | "forest_trail"
  | "n5"
  | "review_engine"
  | "offline"
  | "pwa"
  | "achievements"
  | "lesson_engine"
  | "learning_trail"
  | "lesson_audio"
  | "admin_tools"
  | "analytics";

export type LaunchCriterionDefinition = {
  id: LaunchCriterionId;
  label: string;
  description: string;
};

export const LAUNCH_CRITERIA: LaunchCriterionDefinition[] = [
  {
    id: "foothills",
    label: "Foothills Complete",
    description: "Hiragana region published with trail lessons.",
  },
  {
    id: "forest_trail",
    label: "Forest Trail Complete",
    description: "Katakana region published with trail lessons.",
  },
  {
    id: "n5",
    label: "N5 Complete",
    description: "Mount N5 vocabulary, grammar, kanji, reading, listening, and trials.",
  },
  {
    id: "review_engine",
    label: "Review Engine Stable",
    description: "SRS review queue with submit flow and stats.",
  },
  {
    id: "offline",
    label: "Offline Stable",
    description: "IndexedDB cache and sync batch pipeline.",
  },
  {
    id: "pwa",
    label: "PWA Installable",
    description: "Manifest, service worker, and install prompt.",
  },
  {
    id: "achievements",
    label: "Achievement System Stable",
    description: "Achievement unlocks and admin CMS.",
  },
  {
    id: "lesson_engine",
    label: "Immersive Lesson Engine Stable",
    description: "Typed recall, matching, reading, story, dialogue, and listening drills.",
  },
  {
    id: "learning_trail",
    label: "Visual Learning Trail Stable",
    description: "Trail map with locked, available, in-progress, and completed nodes.",
  },
  {
    id: "lesson_audio",
    label: "Lesson Audio Stable",
    description: "Teach-step audio with prefetch and offline cache.",
  },
  {
    id: "admin_tools",
    label: "Admin Tools Stable",
    description: "Content CMS, feedback triage, and launch readiness dashboard.",
  },
  {
    id: "analytics",
    label: "Analytics Stable",
    description: "Persisted product events for lesson, review, trial, trail, and PWA flows.",
  },
];

export const REQUIRED_LAUNCH_REGIONS = ["foothills", "forest-trail", "mount-n5"] as const;

export function getReleaseChannel(): "beta" | "official" {
  return RELEASE.isBeta ? "beta" : "official";
}
