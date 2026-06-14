import type { ProgressStatus } from "@/features/learning/types/progress.types";
import type { RegionAvailability } from "@/lib/learning/region-unlock";

export type JourneyNodeState =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export type JourneyNodeKind = "lesson" | "checkpoint" | "landmark" | "trial";

export type JourneyLandmarkKind =
  | "village"
  | "shrine"
  | "torii"
  | "bridge"
  | "overlook"
  | "camp";

export type JourneyNode = {
  id: string;
  lessonId: string | null;
  kind: JourneyNodeKind;
  landmarkKind?: JourneyLandmarkKind | null;
  label: string;
  subtitle: string | null;
  state: JourneyNodeState;
  /** Normalized position along the vertical path segment, 0–1. */
  pathPosition: number;
  /** Index within the region node list. */
  regionIndex: number;
  /** Index across the full journey (lessons + landmarks). */
  globalIndex: number;
  href: string | null;
  xpReward: number | null;
};

export type JourneyPosition = {
  currentRegionSlug: string;
  currentRegionIndex: number;
  currentLessonId: string | null;
  currentNodeId: string | null;
  globalNodeIndex: number;
  globalLessonIndex: number;
  pathPosition: number;
};

export type JourneyRegionViewModel = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  availability: RegionAvailability;
  lockReason: string | null;
  lessonCount: number;
  completedCount: number;
  progressPercent: number;
  nodes: JourneyNode[];
  currentNodeIndex: number | null;
};

export type JourneyPathViewModel = {
  regions: JourneyRegionViewModel[];
  position: JourneyPosition;
  nextLessonId: string | null;
  nextLessonHref: string | null;
};

export type RegionJourneyInput = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  availability: RegionAvailability;
  lockReason: string | null;
  lessonCount: number;
  completedCount: number;
  units: Array<{
    lessons: Array<{
      id: string;
      type: string;
      title: string;
      xpReward: number;
      progress: ProgressStatus;
    }>;
  }>;
};
