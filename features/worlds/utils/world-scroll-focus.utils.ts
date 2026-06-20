import {
  findLastCompletedJourneyNode,
  findFirstAscentJourneyNode,
} from "@/features/journey/utils/world-tree-scroll-focus.utils";
import {
  buildWorldLayout,
  findPlottedNode,
  resolveWorldPortalYPercent,
} from "@/features/worlds/utils/world-layout.utils";
import type { JlptWorldPathViewModel, WorldScrollFocus } from "@/features/worlds/types/world.types";

const LESSON_LIKE_KINDS = new Set(["lesson", "checkpoint", "trial"]);

export function resolveWorldScrollFocus(
  worldPath: JlptWorldPathViewModel,
  options: {
    highlightNodeId?: string | null;
    regionSlug?: string | null;
  } = {},
): WorldScrollFocus {
  const layout = buildWorldLayout(worldPath);
  const highlightNodeId = options.highlightNodeId ?? null;

  if (highlightNodeId) {
    const plotted = findPlottedNode(layout.nodes, highlightNodeId);
    return {
      focusYPercent: plotted?.yPercent ?? null,
      anchorScrollToBottom: false,
      highlightNodeId,
    };
  }

  const currentNodeId = worldPath.position.currentNodeId;
  if (currentNodeId) {
    const plotted = findPlottedNode(layout.nodes, currentNodeId);
    if (plotted) {
      return {
        focusYPercent: plotted.yPercent,
        anchorScrollToBottom: false,
        highlightNodeId: null,
      };
    }
  }

  const lastCompleted = findLastCompletedJourneyNode(worldPath.journey);
  if (lastCompleted) {
    const plotted = findPlottedNode(layout.nodes, lastCompleted.id);
    if (plotted) {
      return {
        focusYPercent: plotted.yPercent,
        anchorScrollToBottom: false,
        highlightNodeId: null,
      };
    }
  }

  const first = findFirstAscentJourneyNode(worldPath.journey);
  if (first) {
    const plotted = findPlottedNode(layout.nodes, first.id);
    return {
      focusYPercent: plotted?.yPercent ?? 100,
      anchorScrollToBottom: plotted == null,
      highlightNodeId: null,
    };
  }

  return {
    focusYPercent: resolveWorldPortalYPercent(),
    anchorScrollToBottom: true,
    highlightNodeId: null,
  };
}

export function isUserAtWorldEnd(worldPath: JlptWorldPathViewModel): boolean {
  const lessonNodes = worldPath.journey.regions.flatMap((region) =>
    region.nodes.filter((node) => LESSON_LIKE_KINDS.has(node.kind)),
  );

  if (lessonNodes.length === 0) return false;

  const lastLesson = lessonNodes[lessonNodes.length - 1]!;
  return (
    lastLesson.state === "completed" ||
    worldPath.position.currentNodeId === lastLesson.id
  );
}
