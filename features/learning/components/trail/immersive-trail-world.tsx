"use client";

import { useEffect, useMemo, type RefObject } from "react";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { hasTrailScrollArt } from "@/lib/assets/registry";
import { MotionDiv } from "@/components/motion/motion-div";
import { TrailPathNode } from "@/features/learning/components/trail/trail-path-node";
import { TrailSpineConnector } from "@/features/learning/components/trail/trail-spine-connector";
import { TRAIL_SEGMENT_OVERLAP_RATIO, TRAIL_SEGMENT_SCRIM_RATIO } from "@/features/learning/constants/trail.constants";
import {
  getTrailNodePositions,
  TRAIL_SCROLL_ART_HEIGHT,
  TRAIL_SCROLL_ART_WIDTH,
  type TrailPlacementOptions,
} from "@/lib/design-system/trail-path-anchors";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import type {
  TrailNodeViewModel,
  TrailSegmentSlice,
} from "@/features/learning/types/trail.types";

const SCROLL_ASPECT = `${TRAIL_SCROLL_ART_WIDTH} / ${TRAIL_SCROLL_ART_HEIGHT}`;
const SEGMENT_HEIGHT_VW =
  (TRAIL_SCROLL_ART_HEIGHT / TRAIL_SCROLL_ART_WIDTH) * 100;
const SEGMENT_OVERLAP_VW = SEGMENT_HEIGHT_VW * TRAIL_SEGMENT_OVERLAP_RATIO;

type ImmersiveTrailWorldProps = {
  segments: TrailSegmentSlice<TrailNodeViewModel>[];
  regionSlug?: string;
  activeNodeId?: string | null;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  labelTheme?: string;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  prefersReducedMotion?: boolean;
};

function TrailSegmentLayer({
  segment,
  regionSlug,
  activeNodeId,
  activeSegmentIndex,
  onNodeSelect,
  labelTheme,
  seamTop,
  seamBottom,
  priorityArt,
}: {
  segment: TrailSegmentSlice<TrailNodeViewModel>;
  regionSlug?: string;
  activeNodeId?: string | null;
  activeSegmentIndex: number | null;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  labelTheme?: string;
  seamTop: boolean;
  seamBottom: boolean;
  priorityArt: boolean;
}) {
  const placementOptions: TrailPlacementOptions = {
    theme: labelTheme,
    regionSlug,
    mode: "scroll",
    trailSegmentIndex: segment.trailSegmentIndex,
    placementRange: segment.placementRange,
  };

  const placementNodes = segment.nodes.map((node) => ({
    nodeKind:
      node.nodeKind === "checkpoint"
        ? ("checkpoint" as const)
        : ("lesson" as const),
  }));

  const positions = getTrailNodePositions(placementNodes, placementOptions);
  const useScrollArt = hasTrailScrollArt(regionSlug);
  const activeNodeIndex = activeNodeId
    ? segment.nodes.findIndex((node) => node.id === activeNodeId)
    : -1;
  const isInactiveSegment =
    activeSegmentIndex !== null &&
    segment.trailSegmentIndex !== activeSegmentIndex;

  const scrimHeightPercent = TRAIL_SEGMENT_SCRIM_RATIO * 100;

  return (
    <div
      className={cn(
        "relative w-full shrink-0 transition-opacity duration-300",
        isInactiveSegment && "opacity-60",
      )}
      data-trail-segment-index={segment.trailSegmentIndex}
      style={{ aspectRatio: SCROLL_ASPECT }}
    >
      <TrailMapArtwork
        theme={labelTheme}
        immersive
        regionSlug={regionSlug}
        trailSegmentIndex={segment.trailSegmentIndex}
        priority={priorityArt}
        scrim={seamTop || seamBottom ? "minimal" : "full"}
      />
      {positions.length >= 2 && !useScrollArt ? (
        <TrailSpineConnector points={[...positions]} nodes={segment.nodes} />
      ) : null}
      {seamBottom ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-background/80 via-background/25 to-transparent"
          style={{ height: `${scrimHeightPercent}%` }}
          aria-hidden
        />
      ) : null}
      {seamTop ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[6] bg-gradient-to-b from-background/70 via-background/20 to-transparent"
          style={{ height: `${scrimHeightPercent}%` }}
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 z-10">
        {segment.nodes.map((node, index) => {
          const nodePosition = positions[index];
          if (!nodePosition) return null;

          const isDistant =
            !isInactiveSegment &&
            activeNodeIndex >= 0 &&
            Math.abs(index - activeNodeIndex) > 4;

          return (
            <div
              key={node.id}
              data-trail-node-id={node.id}
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
                  position={nodePosition}
                  nodeIndex={index}
                  immersive
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

/**
 * One continuous vertical mountain world — segments stack base-to-summit with
 * blended overlaps so progression feels like a single climb, not separate pages.
 */
export function ImmersiveTrailWorld({
  segments,
  regionSlug,
  activeNodeId = null,
  onNodeSelect,
  labelTheme,
  scrollContainerRef,
  prefersReducedMotion = false,
}: ImmersiveTrailWorldProps) {
  const orderedSegments = useMemo(
    () =>
      [...segments].sort(
        (left, right) => right.trailSegmentIndex - left.trailSegmentIndex,
      ),
    [segments],
  );

  const activeSegmentIndex = useMemo(() => {
    if (!activeNodeId) return null;
    const match = segments.find((segment) =>
      segment.nodes.some((node) => node.id === activeNodeId),
    );
    return match?.trailSegmentIndex ?? null;
  }, [activeNodeId, segments]);

  const highestSegmentIndex =
    orderedSegments[0]?.trailSegmentIndex ?? 0;

  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    if (activeNodeId) return;

    const baseMarker = scrollContainerRef.current.querySelector(
      "[data-trail-world-base]",
    );
    baseMarker?.scrollIntoView({
      block: "end",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [
    activeNodeId,
    orderedSegments.length,
    prefersReducedMotion,
    regionSlug,
    scrollContainerRef,
  ]);

  return (
    <div
      className="relative w-full"
      data-trail-world
      role="list"
      aria-label="Trail lessons"
    >
      {orderedSegments.map((segment, index) => {
        const isHighest = segment.trailSegmentIndex === highestSegmentIndex;
        const isBase = index === orderedSegments.length - 1;
        const hasOverlapBelow = index < orderedSegments.length - 1;

        const isAdjacentToActive =
          activeSegmentIndex !== null &&
          Math.abs(segment.trailSegmentIndex - activeSegmentIndex) <= 1;

        return (
          <div
            key={segment.trailSegmentIndex}
            role="presentation"
            className="relative w-full"
            style={
              hasOverlapBelow
                ? { marginBottom: `-${SEGMENT_OVERLAP_VW}vw` }
                : undefined
            }
          >
            <TrailSegmentLayer
              segment={segment}
              regionSlug={regionSlug}
              activeNodeId={activeNodeId}
              activeSegmentIndex={activeSegmentIndex}
              onNodeSelect={onNodeSelect}
              labelTheme={labelTheme}
              seamTop={!isHighest}
              seamBottom={!isBase}
              priorityArt={isBase || isAdjacentToActive || orderedSegments.length <= 2}
            />
          </div>
        );
      })}
      <div data-trail-world-base className="h-px w-full shrink-0" aria-hidden />
    </div>
  );
}
