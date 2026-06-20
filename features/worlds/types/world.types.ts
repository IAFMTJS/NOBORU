import type { JourneyPathViewModel, JourneyPosition } from "@/features/journey/types/journey.types";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { RegionSlug } from "@/lib/design-system/regions";
import type { JlptLevel } from "@/lib/content/types";

export type JlptWorldTheme = {
  accentColor: string;
  accentGlow: string;
  backgroundLight: string;
  backgroundDark: string;
  label: string;
  subtitle: string;
};

export type JlptWorldArtConfig = {
  heroFileBase: string;
  heroAnchor: "bottom" | "center" | "top";
};

/** Self-contained JLPT world definition — one game level per entry. */
export type JlptWorldDefinition = {
  id: JlptLevel;
  regionSlugs: readonly RegionSlug[];
  skeletonZoneIds: readonly WorldTreeZoneId[];
  /** Trial slug required to enter this world (null = always accessible). */
  entryTrialSlug: string | null;
  /** Final trial slug that completes this world and unlocks the portal. */
  exitTrialSlug: string | null;
  nextWorldId: JlptLevel | null;
  portalLabel: string;
  portalDescription: string;
  theme: JlptWorldTheme;
  art: JlptWorldArtConfig;
  /** Minimum canvas height in vh for this world's tree. */
  canvasMinHeightVh: number;
  /** Future audio theme identifier — no assets loaded until wired. */
  audioThemeId: string;
};

export type JlptWorldPathViewModel = {
  world: JlptWorldDefinition;
  journey: JourneyPathViewModel;
  position: JourneyPosition;
  completedNodeCount: number;
  totalNodeCount: number;
  nextLessonId: string | null;
  nextLessonHref: string | null;
};

export type WorldPortalState = {
  visible: boolean;
  unlocked: boolean;
  nextWorldId: JlptLevel | null;
  nextWorldHref: string | null;
  label: string;
  description: string;
};

export type WorldScrollFocus = {
  focusYPercent: number | null;
  anchorScrollToBottom: boolean;
  highlightNodeId: string | null;
};
