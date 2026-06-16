import type { NoboruPoseId } from "@/lib/assets/art-mappings";

/** Route/context profile for loading scene selection. */
export type LoadingSceneProfile =
  | "default"
  | "home"
  | "learn"
  | "review"
  | "lesson"
  | "region-transition";

export type LoadingProgressStage =
  | "starting"
  | "early"
  | "mid"
  | "almost"
  | "complete";

export type LoadingPresentationMode = "fullscreen" | "compact";

export type LoadingPresentationInput = {
  profile?: LoadingSceneProfile;
  pathname?: string;
  title?: string;
  statusMessage?: string;
  subtitle?: string;
  percent?: number;
  /** Synthetic timeline tick (500ms intervals). */
  tick?: number;
  /** Elapsed milliseconds for synthetic progress. */
  elapsedMs?: number;
  mode?: LoadingPresentationMode;
  seed?: number;
};

export type LoadingPresentationViewModel = {
  profile: LoadingSceneProfile;
  mode: LoadingPresentationMode;
  title: string;
  subtitle: string;
  statusMessage: string;
  percent: number;
  stage: LoadingProgressStage;
  stageLabel: string;
  showSpinner: boolean;
  showCampfire: boolean;
  backgroundAssetId: string;
  companionPoseId: NoboruPoseId;
  expression: "loading";
};
