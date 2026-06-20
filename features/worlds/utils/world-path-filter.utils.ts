import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyPosition,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import { resolveWorldForRegionSlug } from "@/features/worlds/constants/world-registry.constants";
import type {
  JlptWorldDefinition,
  JlptWorldPathViewModel,
} from "@/features/worlds/types/world.types";
import type { JlptLevel } from "@/lib/content/types";
import type { RegionSlug } from "@/lib/design-system/regions";

const LESSON_LIKE_KINDS = new Set(["lesson", "checkpoint", "trial"]);

function reindexRegions(
  regions: JourneyRegionViewModel[],
): JourneyRegionViewModel[] {
  let globalIndex = 0;

  return regions.map((region) => ({
    ...region,
    nodes: region.nodes.map((node) => ({
      ...node,
      globalIndex: globalIndex++,
    })),
  }));
}

function countCompletedNodes(regions: JourneyRegionViewModel[]): number {
  return regions.reduce(
    (sum, region) =>
      sum + region.nodes.filter((node) => node.state === "completed").length,
    0,
  );
}

function countTotalNodes(regions: JourneyRegionViewModel[]): number {
  return regions.reduce((sum, region) => sum + region.nodes.length, 0);
}

function resolveWorldPosition(
  regions: JourneyRegionViewModel[],
  globalPosition: JourneyPosition,
): JourneyPosition {
  const regionSlugSet = new Set(regions.map((region) => region.slug));
  const scopedRegions = regions;

  let currentRegionSlug = globalPosition.currentRegionSlug;
  if (!regionSlugSet.has(currentRegionSlug)) {
    currentRegionSlug = scopedRegions[0]?.slug ?? globalPosition.currentRegionSlug;
  }

  let currentNode: JourneyNode | null = null;
  let currentRegionIndex = 0;

  for (let regionIndex = 0; regionIndex < scopedRegions.length; regionIndex += 1) {
    const region = scopedRegions[regionIndex]!;
    if (region.slug !== currentRegionSlug) continue;

    currentRegionIndex = regionIndex;
    currentNode =
      region.nodes.find((node) => node.id === globalPosition.currentNodeId) ??
      region.nodes.find(
        (node) =>
          LESSON_LIKE_KINDS.has(node.kind) &&
          (node.state === "available" || node.state === "in_progress"),
      ) ??
      region.nodes.find((node) => node.state === "completed") ??
      null;
    break;
  }

  if (!currentNode) {
    for (let regionIndex = 0; regionIndex < scopedRegions.length; regionIndex += 1) {
      const region = scopedRegions[regionIndex]!;
      const available = region.nodes.find(
        (node) =>
          LESSON_LIKE_KINDS.has(node.kind) &&
          (node.state === "available" || node.state === "in_progress"),
      );
      if (available) {
        currentRegionIndex = regionIndex;
        currentRegionSlug = region.slug;
        currentNode = available;
        break;
      }
    }
  }

  const globalNodeIndex = currentNode?.globalIndex ?? 0;
  const globalLessonIndex = scopedRegions
    .flatMap((region) => region.nodes)
    .filter((node) => LESSON_LIKE_KINDS.has(node.kind))
    .findIndex((node) => node.id === currentNode?.id);

  return {
    currentRegionSlug,
    currentRegionIndex,
    currentLessonId: currentNode?.lessonId ?? null,
    currentNodeId: currentNode?.id ?? null,
    globalNodeIndex,
    globalLessonIndex: globalLessonIndex >= 0 ? globalLessonIndex : 0,
    pathPosition: currentNode?.pathPosition ?? 0,
  };
}

function resolveNextLesson(
  regions: JourneyRegionViewModel[],
): { nextLessonId: string | null; nextLessonHref: string | null } {
  for (const region of regions) {
    for (const node of region.nodes) {
      if (
        LESSON_LIKE_KINDS.has(node.kind) &&
        (node.state === "available" || node.state === "in_progress") &&
        node.href
      ) {
        return { nextLessonId: node.lessonId, nextLessonHref: node.href };
      }
    }
  }

  return { nextLessonId: null, nextLessonHref: null };
}

/** Filters a full journey path to a single JLPT world's regions and reindexes progress. */
export function filterJourneyPathForWorld(
  journey: JourneyPathViewModel,
  world: JlptWorldDefinition,
): JlptWorldPathViewModel {
  const regionSlugSet = new Set(world.regionSlugs as readonly string[]);
  const filteredRegions = reindexRegions(
    journey.regions.filter((region) => regionSlugSet.has(region.slug as RegionSlug)),
  );

  const position = resolveWorldPosition(filteredRegions, journey.position);
  const { nextLessonId, nextLessonHref } = resolveNextLesson(filteredRegions);
  const completedNodeCount = countCompletedNodes(filteredRegions);
  const totalNodeCount = countTotalNodes(filteredRegions);

  return {
    world,
    journey: {
      regions: filteredRegions,
      position,
      nextLessonId,
      nextLessonHref,
    },
    position,
    completedNodeCount,
    totalNodeCount,
    nextLessonId,
    nextLessonHref,
  };
}

/** Whether every lesson-like node in the world is completed. */
export function isWorldCurriculumComplete(
  worldPath: JlptWorldPathViewModel,
): boolean {
  const lessonNodes = worldPath.journey.regions.flatMap((region) =>
    region.nodes.filter((node) => LESSON_LIKE_KINDS.has(node.kind)),
  );

  if (lessonNodes.length === 0) return false;

  return lessonNodes.every((node) => node.state === "completed");
}

/** Whether the exit trial node is completed in this world. */
export function isWorldExitTrialComplete(
  worldPath: JlptWorldPathViewModel,
): boolean {
  if (!worldPath.world.exitTrialSlug) return true;

  return worldPath.journey.regions.some((region) =>
    region.nodes.some(
      (node) =>
        node.kind === "trial" &&
        node.state === "completed" &&
        node.label.toLowerCase().includes("trial"),
    ),
  );
}

export function canEnterWorld(
  world: JlptWorldDefinition,
  passedTrialSlugs: ReadonlySet<string>,
): boolean {
  if (!world.entryTrialSlug) return true;
  return passedTrialSlugs.has(world.entryTrialSlug);
}

export function resolveCurrentWorldIdFromPath(
  journey: JourneyPathViewModel,
): JlptLevel {
  const world =
    resolveWorldForRegionSlug(journey.position.currentRegionSlug) ??
    resolveWorldForRegionSlug(journey.regions[0]?.slug ?? "foothills");

  return world?.id ?? "n5";
}
