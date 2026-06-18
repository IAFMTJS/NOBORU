"use client";

import { useMemo, useState } from "react";

import { WorldBossNode } from "@/components/visual/world/world-boss-node";
import { WorldLessonNode } from "@/components/visual/world/world-lesson-node";
import { LessonNodeDetailSheet } from "@/features/learning/components/trail/lesson-node-detail-sheet";
import type { LessonSummaryViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/types/trail.types";
import type { JourneyNode, JourneyPathViewModel } from "@/features/journey/types/journey.types";
import {
  findPlottedNode,
  plotJourneyNodesOnSkeleton,
} from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type JourneyWorldNodeLayerProps = {
  journey: JourneyPathViewModel;
  regionName: string;
  className?: string;
};

function toTrailNode(node: JourneyNode): TrailNodeViewModel {
  return {
    id: node.id,
    label: node.label,
    subtitle: node.subtitle,
    href: node.href,
    state: node.state,
    xpReward: node.xpReward ?? 0,
    nodeKind:
      node.kind === "checkpoint"
        ? "checkpoint"
        : node.kind === "trial"
          ? "application"
          : "lesson",
  };
}

function toLessonSummary(node: JourneyNode): LessonSummaryViewModel | null {
  if (!node.lessonId) return null;

  const progress =
    node.state === "completed"
      ? "completed"
      : node.state === "in_progress"
        ? "in_progress"
        : "not_started";

  return {
    id: node.lessonId,
    unitId: "",
    type: node.lessonType ?? "vocabulary",
    title: node.label,
    description: node.subtitle,
    xpReward: node.xpReward ?? 0,
    estimatedDuration: null,
    progress,
    score: 0,
  };
}

function nodeVisualSize(node: JourneyNode, isCurrent: boolean): "sm" | "md" | "lg" {
  if (isCurrent || node.state === "in_progress") return "lg";
  if (node.state === "locked") return "sm";
  return "md";
}

/** Lesson, checkpoint, landmark, and trial buttons plotted on the World Tree trunk. */
export function JourneyWorldNodeLayer({
  journey,
  regionName,
  className,
}: JourneyWorldNodeLayerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const plotted = useMemo(() => plotJourneyNodesOnSkeleton(journey), [journey]);
  const selectedPlotted = findPlottedNode(plotted, selectedNodeId);
  const selectedNode = selectedPlotted?.node ?? null;

  const lessonCount = journey.regions.reduce(
    (sum, region) =>
      sum + region.nodes.filter((node) => node.kind === "lesson" || node.kind === "trial").length,
    0,
  );

  const lessonNumber =
    selectedNode && selectedNode.lessonId
      ? plotted.filter(
          (entry) =>
            entry.node.globalIndex <= selectedNode.globalIndex &&
            (entry.node.kind === "lesson" || entry.node.kind === "trial"),
        ).length
      : null;

  return (
    <>
      <div className={cn("pointer-events-none absolute inset-0", className)} data-journey-node-layer>
        <div className="pointer-events-auto relative h-full w-full min-h-full">
          {plotted.map(({ node, xPercent, yPercent }) => {
            const isCurrent = node.id === journey.position.currentNodeId;
            const size = nodeVisualSize(node, isCurrent);

            return (
              <div
                key={node.id}
                className={cn(
                  "absolute z-30 -translate-x-1/2 -translate-y-1/2",
                  isCurrent && "z-40",
                )}
                style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
              >
                {node.kind === "trial" ? (
                  <WorldBossNode
                    state={node.state}
                    isCurrent={isCurrent}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setSheetOpen(true);
                    }}
                  />
                ) : (
                  <WorldLessonNode
                    state={node.state}
                    nodeKind={node.kind}
                    lessonType={node.lessonType}
                    isCurrent={isCurrent}
                    size={size}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setSheetOpen(true);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <LessonNodeDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        node={selectedNode ? toTrailNode(selectedNode) : null}
        lesson={selectedNode ? toLessonSummary(selectedNode) : null}
        lessonNumber={lessonNumber}
        lessonCount={lessonCount}
        regionName={regionName}
        unlockRequirements={
          selectedNode?.state === "locked"
            ? [{ label: "Complete the previous lesson", completed: false }]
            : []
        }
      />
    </>
  );
}
