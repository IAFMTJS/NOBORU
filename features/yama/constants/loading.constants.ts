import type {
  LoadingProgressStage,
  LoadingSceneProfile,
} from "@/features/yama/types/loading.types";

export const LOADING_DEFAULT_SUBTITLE =
  "Gathering lessons, companions, and stories for your journey." as const;

export const LOADING_STORY_TITLES: Record<LoadingSceneProfile, string> = {
  default: "Preparing your trail…",
  home: "Preparing your trail…",
  learn: "Opening the study path…",
  review: "Warming up your recall…",
  lesson: "Setting up this lesson…",
  "region-transition": "Crossing into new ground…",
};

export const LOADING_STATUS_MESSAGES = [
  "Lighting the lanterns…",
  "Preparing the mountain path…",
  "Gathering today's lessons…",
  "Checking your backpack…",
  "Calling Noboru…",
  "Preparing your next challenge…",
] as const;

export const LOADING_PROGRESS_STAGE_THRESHOLDS: ReadonlyArray<{
  stage: LoadingProgressStage;
  label: string;
  minPercent: number;
  showSpinner: boolean;
}> = [
  { stage: "starting", label: "Starting", minPercent: 0, showSpinner: true },
  { stage: "early", label: "Early", minPercent: 25, showSpinner: false },
  { stage: "mid", label: "Mid", minPercent: 50, showSpinner: false },
  { stage: "almost", label: "Almost there", minPercent: 80, showSpinner: false },
  { stage: "complete", label: "Complete", minPercent: 100, showSpinner: false },
];

/** Synthetic progress caps below 100 until the route actually resolves. */
export const LOADING_SYNTHETIC_PROGRESS_CAP = 92;
export const LOADING_STATUS_ROTATION_MS = 3200;
export const LOADING_SYNTHETIC_TICK_MS = 500;

export const LOADING_COMPANION_POSES: Record<LoadingSceneProfile, string> = {
  default: "char-noboru-sitting-campfire",
  home: "char-noboru-sitting-campfire",
  learn: "char-noboru-reading-book",
  review: "char-noboru-standing-traveler",
  lesson: "char-noboru-walking-backpack",
  "region-transition": "char-noboru-from-behind-region-transition",
};

export const LOADING_CAMPFIRE_PROFILES: ReadonlySet<LoadingSceneProfile> = new Set([
  "default",
  "home",
  "review",
  "lesson",
]);
