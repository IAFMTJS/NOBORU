"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { MotionDiv } from "@/components/motion/motion-div";
import { TrailNodeMarker } from "@/features/learning/components/trail/trail-node-marker";
import { TrailSpineConnector } from "@/features/learning/components/trail/trail-spine-connector";
import { MAX_LESSONS_PER_TRAIL_PATH } from "@/features/learning/constants/trail.constants";
import { splitTrailNodesIntoSegments } from "@/features/learning/services/trail.service";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  getTrailNodePositions,
  TRAIL_MAP_ART_HEIGHT,
  TRAIL_MAP_ART_WIDTH,
  TRAIL_SCROLL_ART_HEIGHT,
  TRAIL_SCROLL_ART_WIDTH,
  type TrailPlacementOptions,
} from "@/lib/design-system/trail-path-anchors";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import type {
  TrailNodeState,
  TrailNodeViewModel,
  TrailPlacementRange,
  TrailSegmentSlice,
} from "@/features/learning/types/trail.types";

const STATE_LABELS: Record<TrailNodeState, string> = {
  completed: "Completed lesson",
  in_progress: "Continue lesson",
  available: "Next lesson",
  locked: "Locked lesson",
};

function TrailPathNode({
  node,
  position,
  nodeIndex: _nodeIndex,
  compact,
  minimal,
  labelsBelow,
  immersive,
  anchored = false,
  onNodeSelect,
  labelTheme,
}: {
  node: TrailNodeViewModel;
  position: { x: number; y: number };
  nodeIndex: number;
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  /** When true, the parent wrapper owns left/top placement along the trail. */
  anchored?: boolean;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  labelTheme?: string;
}) {
  const isCheckpoint = node.nodeKind === "checkpoint";
  const isCurrent = node.state === "in_progress";
  const labelSide =
    immersive || labelsBelow ? "right" : position.x < 48 ? "right" : "left";
  const usePillLabels = immersive && !labelsBelow;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const interactive = Boolean(onNodeSelect) || Boolean(node.href);

  const markerSize: "sm" | "md" | "lg" = isCheckpoint
    ? labelsBelow
      ? "lg"
      : "md"
    : labelsBelow && isCurrent
      ? "lg"
      : usePillLabels
        ? "md"
        : compact || minimal
          ? "sm"
          : "md";

  const labelOnLeft = !immersive && !labelsBelow && position.x >= 50;
  const hideLockedLabel = labelsBelow && immersive && node.state === "locked";

  const marker = (
    <div className={cn("relative z-10 shrink-0", labelsBelow && "z-20")}>
      <TrailNodeMarker
        state={node.state}
        nodeKind={node.nodeKind}
        size={markerSize}
      />
      {labelsBelow && !hideLockedLabel ? (
        <span
          className={cn(
            "pointer-events-none absolute top-[calc(100%+0.35rem)] max-w-[5.5rem] truncate text-[0.6875rem] font-medium leading-tight",
            immersive ? "text-white/90 drop-shadow-sm" : "text-foreground",
            node.state === "locked" ? "text-muted-foreground/80" : null,
            labelOnLeft
              ? "right-full mr-1.5 text-right"
              : "left-full ml-1.5 text-left",
          )}
        >
          {node.label}
        </span>
      ) : null}
    </div>
  );

  const pillLabel = usePillLabels ? (
    <span
      className={cn(
        "pointer-events-none max-w-[9rem] truncate rounded-full border px-3 py-1.5",
        "text-body-sm font-medium shadow-sm backdrop-blur-md",
        labelTheme === "light"
          ? "border-border/60 bg-card/85 text-foreground"
          : "border-white/10 bg-black/55 text-white",
        node.state === "locked" &&
          (labelTheme === "light" ? "text-muted-foreground" : "text-white/75"),
      )}
    >
      {node.label}
    </span>
  ) : null;

  const card =
    minimal || labelsBelow || usePillLabels ? null : (
      <div
        className={cn(
          "pointer-events-none max-w-[7.5rem] rounded-lg border border-border/60 bg-card/92 p-2 shadow-elevation-1 backdrop-blur-md transition-colors sm:max-w-[9rem]",
          node.state === "locked" ? "opacity-75" : null,
          interactive ? "hover:bg-accent/35" : "cursor-not-allowed opacity-75",
          compact && "max-w-[6.5rem] p-1.5",
        )}
      >
        <p
          className={cn(
            "line-clamp-2 font-medium leading-tight",
            compact ? "text-[0.65rem]" : "text-caption",
          )}
        >
          {node.label}
        </p>
        {!compact && node.subtitle ? (
          <p className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">
            {node.subtitle}
          </p>
        ) : null}
      </div>
    );

  const labelTransform =
    labelsBelow || minimal
      ? "translate(-50%, -50%)"
      : `translate(${labelSide === "right" ? "-12%" : "-88%"}, -50%)`;

  const touchTargetClass = cn(
    "inline-flex shrink-0 touch-manipulation items-center justify-center",
    "min-h-11 min-w-11 border-0 bg-transparent p-0",
    interactive && onNodeSelect ? "cursor-pointer" : null,
  );

  const interactiveMarker = interactive ? (
    onNodeSelect ? (
      <button
        type="button"
        className={touchTargetClass}
        aria-label={ariaLabel}
        onClick={() => onNodeSelect(node)}
      >
        {marker}
      </button>
    ) : node.href ? (
      <Link href={node.href} className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </Link>
    ) : (
      <div className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </div>
    )
  ) : (
    <div aria-label={ariaLabel}>{marker}</div>
  );

  const anchoredLayout = (
    <div
      className={cn(
        "pointer-events-none",
        usePillLabels
          ? "flex items-center gap-2"
          : labelsBelow || minimal
            ? "flex flex-col items-center"
            : cn(
                "flex items-center gap-1.5",
                labelSide === "right" ? "flex-row" : "flex-row-reverse",
              ),
      )}
    >
      <div className="pointer-events-auto">{interactiveMarker}</div>
      {pillLabel}
      {card}
    </div>
  );

  const floatingLayout = (
    <div
      className={cn(
        "absolute",
        labelsBelow || minimal
          ? "flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          : cn(
              "flex -translate-y-1/2 items-center gap-1.5",
              labelSide === "right" ? "flex-row" : "flex-row-reverse",
            ),
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: labelTransform,
      }}
    >
      {interactiveMarker}
      {pillLabel}
      {card}
    </div>
  );

  return anchored ? anchoredLayout : floatingLayout;
}

type TrailMapCanvasProps = {
  nodes: TrailNodeViewModel[];
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  regionSlug?: string;
  trailSegmentIndex?: number;
  placementRange?: TrailPlacementRange;
  activeNodeId?: string | null;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  labelTheme?: string;
};

function TrailMapCanvas({
  nodes,
  compact = false,
  minimal = false,
  labelsBelow = false,
  immersive = false,
  regionSlug,
  trailSegmentIndex = 0,
  placementRange,
  activeNodeId = null,
  onNodeSelect,
  labelTheme,
}: TrailMapCanvasProps) {
  const placementOptions: TrailPlacementOptions = {
    theme: labelTheme,
    regionSlug,
    mode: immersive ? "scroll" : "spine",
    trailSegmentIndex,
    placementRange,
  };

  const placementNodes: Array<{ nodeKind: "lesson" | "checkpoint" }> =
    nodes.map((node) => ({
      nodeKind:
        node.nodeKind === "checkpoint"
          ? ("checkpoint" as const)
          : ("lesson" as const),
    }));
  const immersivePositions = immersive
    ? getTrailNodePositions(placementNodes, placementOptions)
    : null;
  const immersiveLayout =
    immersive && immersivePositions && immersivePositions.length > 0
      ? {
          positions: immersivePositions,
          canvasAspectRatio: TRAIL_SCROLL_ART_WIDTH / TRAIL_SCROLL_ART_HEIGHT,
        }
      : null;
  const cardPositions = immersive
    ? null
    : getTrailNodePositions(placementNodes, placementOptions);
  const useScrollArt = immersive && hasTrailScrollArt(regionSlug);
  const canvasAspectRatio = immersive
    ? `${TRAIL_SCROLL_ART_WIDTH} / ${TRAIL_SCROLL_ART_HEIGHT}`
    : `${TRAIL_MAP_ART_WIDTH} / ${TRAIL_MAP_ART_HEIGHT}`;

  return (
    <div
      className={cn(
        "relative w-full",
        immersive
          ? "shrink-0 rounded-none border-0 shadow-none"
          : "overflow-hidden rounded-2xl border border-primary/20 shadow-elevation-1 dark:shadow-elevation-2",
      )}
      data-trail-map-canvas
      data-trail-segment-index={trailSegmentIndex}
      style={{ aspectRatio: canvasAspectRatio }}
    >
      <TrailMapArtwork
        theme={labelTheme}
        immersive={immersive}
        regionSlug={regionSlug}
        trailSegmentIndex={trailSegmentIndex}
        priority={useScrollArt}
      />
      {immersive && immersiveLayout && !useScrollArt ? (
        <TrailSpineConnector
          points={[...immersiveLayout.positions]}
          nodes={nodes}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0",
          immersive ? "px-0 py-0" : "px-0 py-0",
        )}
        role="list"
        aria-label={
          trailSegmentIndex > 0
            ? `Trail lessons, path ${trailSegmentIndex + 1}`
            : "Trail lessons"
        }
        style={{ aspectRatio: canvasAspectRatio }}
      >
        {nodes.map((node, index) => {
          const immersivePosition = immersiveLayout?.positions[index];
          const cardPosition = cardPositions?.[index];
          if (immersive && !immersivePosition) return null;
          if (!immersive && !cardPosition) return null;

          const labelPosition = immersivePosition ?? cardPosition!;
          const nodePosition = immersivePosition ?? cardPosition!;
          const activeNodeIndex = activeNodeId
            ? nodes.findIndex((candidate) => candidate.id === activeNodeId)
            : -1;
          const isDistant =
            immersive &&
            activeNodeIndex >= 0 &&
            Math.abs(index - activeNodeIndex) > 4;

          return (
            <div
              key={node.id}
              role="listitem"
              data-trail-node-id={node.id}
              data-trail-node-index={index}
              className={cn(
                "pointer-events-none absolute transition-opacity",
                isDistant && "opacity-40",
              )}
              style={{
                left: `${nodePosition.x}%`,
                top: `${nodePosition.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: index + 10,
              }}
            >
              <MotionDiv
                {...trailNodeReveal}
                transition={{ delay: Math.min(index * 0.03, 0.6) }}
              >
                <TrailPathNode
                  node={node}
                  position={labelPosition}
                  nodeIndex={index}
                  compact={compact}
                  minimal={minimal}
                  labelsBelow={labelsBelow}
                  immersive={immersive}
                  anchored
                  onNodeSelect={onNodeSelect}
                  labelTheme={labelTheme}
                />
              </MotionDiv>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TrailMapProps = {
  nodes: TrailNodeViewModel[];
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  regionSlug?: string;
  title?: string;
  description?: string;
  className?: string;
  trialHref?: string | null;
  trialTitle?: string | null;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  placementRange?: TrailPlacementRange;
  /** Total lessons in the region when splitting immersive trails across segments. */
  regionLessonCount?: number;
};

export function TrailMap({
  nodes,
  compact = false,
  minimal = false,
  labelsBelow = false,
  immersive = false,
  regionSlug,
  title,
  description,
  className,
  trialHref,
  trialTitle,
  onNodeSelect,
  placementRange,
  regionLessonCount,
}: TrailMapProps) {
  const { resolvedTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const activeNode =
    nodes.find((node) => node.state === "in_progress") ??
    nodes.find((node) => node.state === "available");

  const trailSegments = useMemo((): TrailSegmentSlice<TrailNodeViewModel>[] => {
    if (placementRange) {
      return [
        {
          trailSegmentIndex: placementRange.trailSegmentIndex ?? 0,
          nodes: [...nodes],
          placementRange,
        },
      ];
    }

    if (
      immersive &&
      nodes.length > MAX_LESSONS_PER_TRAIL_PATH
    ) {
      return splitTrailNodesIntoSegments(nodes, {
        regionLessonCount: regionLessonCount ?? nodes.length,
      });
    }

    return [
      {
        trailSegmentIndex: 0,
        nodes: [...nodes],
        placementRange: {
          startIndex: 0,
          totalCount: nodes.length,
          trailSegmentIndex: 0,
        },
      },
    ];
  }, [immersive, nodes, placementRange, regionLessonCount]);

  useEffect(() => {
    if (!immersive || !activeNode || !scrollRef.current) return;

    const activeElement = scrollRef.current.querySelector(
      `[data-trail-node-id="${activeNode.id}"]`,
    );
    if (!activeElement) return;

    activeElement.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeNode, immersive, prefersReducedMotion]);

  if (nodes.length === 0) {
    return (
      <YamaPresence
        presence={yamaService.resolveTrailProgress(0)}
        size="sm"
        layout="vertical"
        className="items-center"
      />
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "space-y-3",
        immersive && "min-h-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {title ? (
        <div>
          <p className="text-body-sm font-medium">{title}</p>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {trialHref && trialTitle ? (
        <Link
          href={trialHref}
          className="block rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-body-sm font-medium text-primary"
        >
          Boss Trial · {trialTitle}
        </Link>
      ) : null}
      {activeNode && !minimal && !labelsBelow ? (
        <YamaPresence
          presence={yamaService.resolveTrailProgress(activeNode.id.length)}
          size="sm"
        />
      ) : null}
      <div className={cn("space-y-4", immersive && "space-y-0")}>
        {trailSegments.map((segment, segmentIndex) => (
          <div key={segment.trailSegmentIndex}>
            {trailSegments.length > 1 ? (
              <p
                className={cn(
                  "px-1 pb-2 text-caption font-medium",
                  immersive
                    ? "text-white/80"
                    : "text-muted-foreground",
                )}
              >
                Trail {segment.trailSegmentIndex + 1}
              </p>
            ) : null}
            {segmentIndex > 0 && immersive ? (
              <div
                className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                aria-hidden
              />
            ) : null}
            <TrailMapCanvas
              nodes={segment.nodes}
              compact={compact}
              minimal={minimal}
              labelsBelow={labelsBelow}
              immersive={immersive}
              regionSlug={regionSlug}
              trailSegmentIndex={segment.trailSegmentIndex}
              placementRange={segment.placementRange}
              activeNodeId={activeNode?.id ?? null}
              onNodeSelect={onNodeSelect}
              labelTheme={resolvedTheme}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
