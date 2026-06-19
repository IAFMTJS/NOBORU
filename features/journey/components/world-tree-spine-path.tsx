"use client";

import type {
  PlottedSkeletonNode,
  WorldTreeLayoutSegment,
} from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeSpinePathProps = {
  segments: WorldTreeLayoutSegment[];
  className?: string;
};

function buildSegmentPath(nodes: PlottedSkeletonNode[]): string | null {
  if (nodes.length < 2) return null;

  const sorted = [...nodes].sort((a, b) => b.yPercent - a.yPercent);
  const [first, ...rest] = sorted;
  if (!first) return null;

  let path = `M ${first.xPercent} ${first.yPercent}`;
  for (const node of rest) {
    const prev = sorted[sorted.indexOf(node) - 1];
    if (!prev) continue;
    const midY = (prev.yPercent + node.yPercent) / 2;
    path += ` C ${prev.xPercent} ${midY}, ${node.xPercent} ${midY}, ${node.xPercent} ${node.yPercent}`;
  }

  return path;
}

/** SVG paths connecting nodes on the World Tree skeleton. */
export function WorldTreeSpinePath({ segments, className }: WorldTreeSpinePathProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      data-world-tree-spine
    >
      {segments.map((segment) => {
        const pathD = buildSegmentPath(segment.nodes);
        if (!pathD) return null;

        const isMain = segment.type === "main_spine";
        const isCave = segment.type === "cave";

        return (
          <path
            key={segment.segmentId}
            d={pathD}
            data-segment-type={segment.type}
            data-world-tree-zone={segment.zoneId}
            fill="none"
            stroke={isMain ? "rgba(214, 168, 95, 0.55)" : "rgba(214, 168, 95, 0.3)"}
            strokeWidth={isMain ? 0.45 : 0.3}
            strokeDasharray={isCave ? "1.2 0.8" : undefined}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
