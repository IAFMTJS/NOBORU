import {
  LOADING_CAMPFIRE_PROFILES,
  LOADING_COMPANION_POSES,
  LOADING_DEFAULT_SUBTITLE,
  LOADING_PROGRESS_STAGE_THRESHOLDS,
  LOADING_STATUS_MESSAGES,
  LOADING_STATUS_ROTATION_MS,
  LOADING_STORY_TITLES,
  LOADING_SYNTHETIC_PROGRESS_CAP,
  LOADING_SYNTHETIC_TICK_MS,
} from "@/features/yama/constants/loading.constants";
import type {
  LoadingPresentationInput,
  LoadingPresentationViewModel,
  LoadingProgressStage,
  LoadingSceneProfile,
} from "@/features/yama/types/loading.types";
import type { NoboruPoseId } from "@/lib/assets/art-mappings";
import { LOADING_SCENE_PROFILE_ASSETS } from "@/lib/assets/art-mappings";

function pickMessage(messages: readonly string[], seed = 0): string {
  if (messages.length === 0) return "";
  return messages[Math.abs(seed) % messages.length] ?? messages[0];
}

function resolveProfileFromPathname(pathname?: string): LoadingSceneProfile {
  if (!pathname) return "default";

  if (pathname.includes("/learn/lesson/")) return "lesson";
  if (pathname.startsWith("/learn")) return "learn";
  if (pathname.startsWith("/review")) return "review";
  if (pathname.startsWith("/home") || pathname === "/") return "home";
  if (pathname.includes("region-transition")) return "region-transition";

  return "default";
}

function resolveStage(percent: number): {
  stage: LoadingProgressStage;
  stageLabel: string;
  showSpinner: boolean;
} {
  let current = LOADING_PROGRESS_STAGE_THRESHOLDS[0];

  for (const threshold of LOADING_PROGRESS_STAGE_THRESHOLDS) {
    if (percent >= threshold.minPercent) {
      current = threshold;
    }
  }

  return {
    stage: current.stage,
    stageLabel: current.label,
    showSpinner: current.showSpinner,
  };
}

function resolveSyntheticPercent(elapsedMs = 0): number {
  const ticks = Math.floor(elapsedMs / LOADING_SYNTHETIC_TICK_MS);
  const eased = Math.round(
    LOADING_SYNTHETIC_PROGRESS_CAP * (1 - Math.exp(-ticks / 14)),
  );
  return Math.min(LOADING_SYNTHETIC_PROGRESS_CAP, Math.max(0, eased));
}

function resolveRotatingSeed(tick = 0, seed = 0): number {
  const rotationIndex = Math.floor(
    (tick * LOADING_SYNTHETIC_TICK_MS) / LOADING_STATUS_ROTATION_MS,
  );
  return seed + rotationIndex;
}

class LoadingService {
  resolveSceneProfile(pathname?: string, profile?: LoadingSceneProfile): LoadingSceneProfile {
    return profile ?? resolveProfileFromPathname(pathname);
  }

  resolveSyntheticPercent(elapsedMs = 0): number {
    return resolveSyntheticPercent(elapsedMs);
  }

  resolvePresentation(input: LoadingPresentationInput = {}): LoadingPresentationViewModel {
    const profile = this.resolveSceneProfile(input.pathname, input.profile);
    const mode = input.mode ?? "fullscreen";
    const tick = input.tick ?? 0;
    const seed = input.seed ?? 0;
    const percent =
      input.percent ?? resolveSyntheticPercent(input.elapsedMs ?? tick * LOADING_SYNTHETIC_TICK_MS);
    const { stage, stageLabel, showSpinner } = resolveStage(percent);
    const rotationSeed = resolveRotatingSeed(tick, seed);
    const backgroundRef = LOADING_SCENE_PROFILE_ASSETS[profile];

    return {
      profile,
      mode,
      title: input.title ?? LOADING_STORY_TITLES[profile],
      subtitle: input.subtitle ?? LOADING_DEFAULT_SUBTITLE,
      statusMessage:
        input.statusMessage ??
        pickMessage(LOADING_STATUS_MESSAGES, rotationSeed),
      percent,
      stage,
      stageLabel,
      showSpinner: percent === 0 ? true : showSpinner,
      showCampfire: LOADING_CAMPFIRE_PROFILES.has(profile),
      backgroundAssetId: backgroundRef.id,
      companionPoseId: LOADING_COMPANION_POSES[profile] as NoboruPoseId,
      expression: "loading",
    };
  }
}

export const loadingService = new LoadingService();
