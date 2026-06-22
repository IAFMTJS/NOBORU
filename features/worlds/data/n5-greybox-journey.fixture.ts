import type { JourneyNode, JourneyRegionViewModel } from "@/features/journey/types/journey.types";
import { N5_LANDMARK_FALLBACKS } from "@/features/worlds/constants/n5-landmarks.constants";
import { N5_WORLD_SLUG, N5_WORLD_TITLE } from "@/features/worlds/constants/n5-world.constants";

type GreyboxSpineSegment =
  | { type: "landmark"; slug: string }
  | { type: "lessons"; count: number; labelPrefix: string }
  | { type: "trial"; label: string }
  | { type: "checkpoint"; label?: string };

/**
 * Canonical N5 spine topology for greybox / art authoring.
 * Matches docs/JWorld/11-n5-complete-spec.md landmark order and act beats.
 */
const N5_GREYBOX_SPINE: readonly GreyboxSpineSegment[] = [
  { type: "landmark", slug: "ember-threshold" },
  { type: "lessons", count: 11, labelPrefix: "Act I · Hiragana" },
  { type: "landmark", slug: "script-sanctum" },
  { type: "lessons", count: 4, labelPrefix: "Hiragana advanced" },
  { type: "landmark", slug: "kana-bridge" },
  { type: "trial", label: "Script Keeper" },
  { type: "lessons", count: 8, labelPrefix: "Katakana" },
  { type: "checkpoint", label: "Katakana Practice" },
  { type: "landmark", slug: "lantern-hamlet" },
  { type: "lessons", count: 6, labelPrefix: "Early vocab" },
  { type: "landmark", slug: "market-bend" },
  { type: "lessons", count: 4, labelPrefix: "Daily life" },
  { type: "trial", label: "Kana Warden" },
  { type: "landmark", slug: "forest-torii" },
  { type: "lessons", count: 8, labelPrefix: "Grammar I" },
  { type: "landmark", slug: "kanji-grove" },
  { type: "lessons", count: 5, labelPrefix: "Kanji" },
  { type: "landmark", slug: "first-slope-shrine" },
  { type: "lessons", count: 4, labelPrefix: "Listening" },
  { type: "checkpoint", label: "Trail Camp" },
  { type: "trial", label: "Trail Warden" },
  { type: "trial", label: "N5 Sentinel" },
  { type: "trial", label: "Guardian of First Light" },
] as const;

function landmarkBySlug(slug: string) {
  const landmark = N5_LANDMARK_FALLBACKS.find((entry) => entry.slug === slug);
  if (!landmark) {
    throw new Error(`Unknown N5 greybox landmark slug: ${slug}`);
  }
  return landmark;
}

function makeGreyboxNode(
  partial: Omit<JourneyNode, "pathPosition" | "regionIndex" | "globalIndex">,
  regionIndex: number,
): JourneyNode {
  return {
    ...partial,
    pathPosition: 0,
    regionIndex,
    globalIndex: regionIndex,
  };
}

/** Builds the full N5 spine node list used for greybox export (not live CMS data). */
export function buildN5GreyboxNodes(): JourneyNode[] {
  const nodes: JourneyNode[] = [];
  let lessonCounter = 0;

  for (const segment of N5_GREYBOX_SPINE) {
    if (segment.type === "landmark") {
      const landmark = landmarkBySlug(segment.slug);
      nodes.push(
        makeGreyboxNode(
          {
            id: `greybox-landmark-${segment.slug}`,
            lessonId: null,
            kind: "landmark",
            landmarkKind: landmark.kind,
            label: landmark.label,
            subtitle: landmark.subtitle,
            lessonType: null,
            state: "locked",
            href: null,
            xpReward: null,
          },
          nodes.length,
        ),
      );
      continue;
    }

    if (segment.type === "trial") {
      nodes.push(
        makeGreyboxNode(
          {
            id: `greybox-trial-${segment.label.toLowerCase().replace(/\s+/g, "-")}`,
            lessonId: `greybox-trial-${nodes.length}`,
            kind: "trial",
            label: segment.label,
            subtitle: "Trial",
            lessonType: "application",
            state: "locked",
            href: null,
            xpReward: 50,
          },
          nodes.length,
        ),
      );
      continue;
    }

    if (segment.type === "checkpoint") {
      nodes.push(
        makeGreyboxNode(
          {
            id: `greybox-checkpoint-${nodes.length}`,
            lessonId: `greybox-checkpoint-${nodes.length}`,
            kind: "checkpoint",
            label: segment.label ?? "Checkpoint",
            subtitle: "Practice",
            lessonType: "practice",
            state: "locked",
            href: null,
            xpReward: 25,
          },
          nodes.length,
        ),
      );
      continue;
    }

    for (let index = 0; index < segment.count; index += 1) {
      lessonCounter += 1;
      nodes.push(
        makeGreyboxNode(
          {
            id: `greybox-lesson-${lessonCounter}`,
            lessonId: `greybox-lesson-${lessonCounter}`,
            kind: "lesson",
            label: `${segment.labelPrefix} · ${lessonCounter}`,
            subtitle: "Lesson",
            lessonType: "vocabulary",
            state: "locked",
            href: null,
            xpReward: 10,
          },
          nodes.length,
        ),
      );
    }
  }

  return nodes;
}

export function buildN5GreyboxRegion(): JourneyRegionViewModel {
  const nodes = buildN5GreyboxNodes();
  const lessonCount = nodes.filter(
    (node) => node.kind === "lesson" || node.kind === "trial",
  ).length;

  return {
    id: "greybox-region-n5",
    slug: N5_WORLD_SLUG,
    name: N5_WORLD_TITLE,
    description: "Greybox fixture for art authoring",
    availability: "available",
    lockReason: null,
    lessonCount,
    completedCount: 0,
    progressPercent: 0,
    nodes,
    currentNodeIndex: 0,
  };
}
