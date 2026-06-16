"use client";

import { useMemo } from "react";

import { MotionDiv } from "@/components/motion/motion-div";
import { WorldTreeStack } from "@/components/visual/world/world-tree-stack";
import { JourneyPathNode } from "@/features/journey/components/journey-path-node";
import {
  computePathCoordinates,
} from "@/features/journey/components/path-geometry";
import { trailNodeReveal } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";

type JourneyContinuousTrailProps = {
  journey: JourneyPathViewModel;
  theme?: string;
  selectedNodeId?: string | null;
  pulseNodeId?: string | null;
  onNodeSelect?: (node: JourneyNode) => void;
};

type PlottedNode = {
  node: JourneyNode;
  x: number;
  y: number;
};

function buildPathD(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first!.x} ${first!.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(" ")}`;
}

export function JourneyContinuousTrail({
  journey,
  theme,
  selectedNodeId = null,
  pulseNodeId = null,
  onNodeSelect,
}: JourneyContinuousTrailProps) {
  const displayRegions = useMemo(
    () => [...journey.regions].reverse().filter((region) => region.nodes.length > 0),
    [journey.regions],
  );

  const regionAnchors = useMemo(() => {
    const segment = 100 / Math.max(displayRegions.length, 1);
    return displayRegions.map((region, index) => ({
      slug: region.slug,
      top: index * segment,
    }));
  }, [displayRegions]);

  const plotted = useMemo(() => {
    const segment = 100 / Math.max(displayRegions.length, 1);
    const output: PlottedNode[] = [];

    displayRegions.forEach((region, regionIndex) => {
      region.nodes.forEach((node) => {
        const local = computePathCoordinates(node.pathPosition, {
          regionSlug: region.slug,
          theme,
        });
        output.push({
          node,
          x: local.x,
          y: regionIndex * segment + (local.y / 100) * segment,
        });
      });
    });

    return output.sort((a, b) => a.node.globalIndex - b.node.globalIndex);
  }, [displayRegions, theme]);

  const currentNodeId = journey.position.currentNodeId;
  const pathD = buildPathD(plotted.map((entry) => ({ x: entry.x, y: entry.y })));

  const minHeightVh = Math.max(520, journey.regions.length * 180);

  return (
    <section
      aria-label="World journey trail"
      className="relative w-full bg-[#E9E1D0] pb-24 pt-0"
      style={{ minHeight: `${minHeightVh}vh` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <WorldTreeStack />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/25" />
      </div>

      <div className="relative h-full w-full">
        {regionAnchors.map((anchor) => (
          <div
            key={anchor.slug}
            data-journey-region-gate={anchor.slug}
            className="pointer-events-none absolute inset-x-0 z-0"
            style={{ top: `${anchor.top}%` }}
            aria-hidden
          />
        ))}

        {pathD ? (
          <svg
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={pathD}
              fill="none"
              stroke="#2a1f14"
              strokeWidth={11}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
            />
            <path
              d={pathD}
              fill="none"
              stroke="#6b5230"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.82}
            />
            <path
              d={pathD}
              fill="none"
              stroke="#c4a35a"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.52}
            />
          </svg>
        ) : null}

        <div className="absolute inset-0 z-10" role="list" aria-label="Continuous world path">
          {plotted.map((entry, index) => {
            const node = entry.node;
            const isCurrent = currentNodeId === node.id;
            return (
              <div
                key={node.id}
                role="listitem"
                data-journey-node-id={node.id}
                data-journey-node-index={index}
                className="absolute"
                style={{
                  left: `${entry.x}%`,
                  top: `${entry.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <MotionDiv
                  {...trailNodeReveal}
                  transition={{ delay: Math.min(index * 0.02, 0.45) }}
                >
                  <JourneyPathNode
                    node={node}
                    isCurrent={isCurrent}
                    isSelected={selectedNodeId === node.id}
                    isPulsing={pulseNodeId === node.id}
                    discoveryOpacity={
                      node.state === "locked" ? 0.28 : node.state === "completed" ? 0.94 : 1
                    }
                    onSelect={
                      node.kind === "lesson" || node.kind === "checkpoint"
                        ? onNodeSelect
                        : undefined
                    }
                  />
                </MotionDiv>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
