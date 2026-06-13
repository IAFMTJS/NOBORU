import type { ProgressStatus } from "@/features/learning/types/progress.types";

export type TrailNodeState = "locked" | "available" | "in_progress" | "completed";

export type TrailNodeKind = "lesson" | "checkpoint" | "application";

export type TrailNodeViewModel = {
  id: string;
  label: string;
  subtitle: string | null;
  href: string | null;
  state: TrailNodeState;
  xpReward: number;
  nodeKind: TrailNodeKind;
};

export type TrailLessonInput = {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  progress: ProgressStatus;
};

/** Maps lesson nodes to coordinates along a trail path segment. */
export type TrailPlacementRange = {
  startIndex: number;
  totalCount: number;
  trailSegmentIndex?: number;
};

export type TrailSegmentSlice<T> = {
  trailSegmentIndex: number;
  nodes: T[];
  placementRange: TrailPlacementRange;
};
