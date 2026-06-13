"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { MotionDiv } from "@/components/motion/motion-div";
import { ImmersiveTrailWorld } from "@/features/learning/components/trail/immersive-trail-world";
import { TrailPathNode } from "@/features/learning/components/trail/trail-path-node";
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
  TrailNodeViewModel,
  TrailPlacementRange,
  TrailSegmentSlice,
} from "@/features/learning/types/trail.types";

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

function resolvePlacementConfig(
  immersive: boolean,
  trailSegmentIndex: number,
  placementRange?: TrailPlacementRange,
): {
  mode: "scroll" | "spine";
  segmentIndex: number;
  useCompactScrollArt: boolean;
} {
  const segmentIndex =
    placementRange?.trailSegmentIndex ?? trailSegmentIndex;
  const useScrollAnchors =
    immersive || segmentIndex > 0 || Boolean(placementRange?.trailSegmentIndex);

  return {
    mode: useScrollAnchors ? "scroll" : "spine",
    segmentIndex,
    useCompactScrollArt: !immersive && segmentIndex > 0,
  };
}

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
  const placementConfig = resolvePlacementConfig(
    immersive,
    trailSegmentIndex,
    placementRange,
  );

  const placementOptions: TrailPlacementOptions = {
    theme: labelTheme,
    regionSlug,
    mode: placementConfig.mode,
    trailSegmentIndex: placementConfig.segmentIndex,
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
  const scrollCropFocus =
    placementConfig.useCompactScrollArt && cardPositions && cardPositions.length > 0
      ? {
          x:
            cardPositions.reduce((sum, point) => sum + point.x, 0) /
            cardPositions.length,
          y:
            cardPositions.reduce((sum, point) => sum + point.y, 0) /
            cardPositions.length,
        }
      : undefined;
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
      data-trail-segment-index={placementConfig.segmentIndex}
      style={{ aspectRatio: canvasAspectRatio }}
    >
      <TrailMapArtwork
        theme={labelTheme}
        immersive={immersive}
        regionSlug={regionSlug}
        trailSegmentIndex={placementConfig.segmentIndex}
        priority={useScrollArt || Boolean(scrollCropFocus)}
        scrollCropFocus={scrollCropFocus}
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
          placementConfig.segmentIndex > 0
            ? `Trail lessons, path ${placementConfig.segmentIndex + 1}`
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

  const useContinuousWorld = immersive && !placementRange;

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
  }, [activeNode, immersive, prefersReducedMotion, regionSlug]);

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
      {activeNode && !minimal && !labelsBelow && !useContinuousWorld ? (
        <YamaPresence
          presence={yamaService.resolveTrailProgress(activeNode.id.length)}
          size="sm"
        />
      ) : null}
      {useContinuousWorld ? (
        <ImmersiveTrailWorld
          segments={trailSegments}
          regionSlug={regionSlug}
          activeNodeId={activeNode?.id ?? null}
          onNodeSelect={onNodeSelect}
          labelTheme={resolvedTheme}
          scrollContainerRef={scrollRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <div className={cn("space-y-4", immersive && "space-y-0")}>
          {trailSegments.map((segment) => (
            <TrailMapCanvas
              key={segment.trailSegmentIndex}
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
          ))}
        </div>
      )}
    </div>
  );
}
