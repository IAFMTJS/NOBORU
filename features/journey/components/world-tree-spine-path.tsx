"use client";

import type {
  PlottedSkeletonNode,
  WorldTreeLayoutSegment,
} from "@/features/journey/utils/world-tree-layout.utils";
import { cn } from "@/lib/utils";

type WorldTreeSpinePathProps = {
  segments: WorldTreeLayoutSegment[];
  nodes: PlottedSkeletonNode[];
  className?: string;
};

function buildTreeLimbConnector(
  fork: PlottedSkeletonNode,
  first: PlottedSkeletonNode,
): string {
  const dx = first.xPercent - fork.xPercent;
  const dy = first.yPercent - fork.yPercent;
  const ctrlX = fork.xPercent + dx * 0.38;
  const ctrlY = fork.yPercent + dy * 0.22 - Math.abs(dx) * 0.05;

  return `M ${fork.xPercent} ${fork.yPercent} Q ${ctrlX} ${ctrlY}, ${first.xPercent} ${first.yPercent}`;
}

function buildSegmentPath(
  nodes: PlottedSkeletonNode[],
  fork?: PlottedSkeletonNode | null,
  limb = false,
): string | null {
  if (nodes.length === 0) return null;

  const sorted = [...nodes].sort((a, b) => b.yPercent - a.yPercent);
  const first = sorted[0]!;

  let path = fork
    ? buildTreeLimbConnector(fork, first)
    : `M ${first.xPercent} ${first.yPercent}`;

  if (sorted.length < 2) return path;

  for (let index = 1; index < sorted.length; index += 1) {
    const prev = sorted[index - 1]!;
    const node = sorted[index]!;

    if (limb) {
      const midX = (prev.xPercent + node.xPercent) / 2;
      const midY =
        (prev.yPercent + node.yPercent) / 2 -
        Math.abs(prev.xPercent - node.xPercent) * 0.05;
      path += ` Q ${midX} ${midY}, ${node.xPercent} ${node.yPercent}`;
    } else {
      const midY = (prev.yPercent + node.yPercent) / 2;
      path += ` C ${prev.xPercent} ${midY}, ${node.xPercent} ${midY}, ${node.xPercent} ${node.yPercent}`;
    }
  }

  return path;
}

function collectMainSpineNodes(nodes: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  return nodes
    .filter(
      (entry) =>
        entry.node.kind !== "landmark" &&
        entry.segmentType === "main_spine" &&
        entry.spineRole === "main",
    )
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);
}

function collectBranchSegments(segments: WorldTreeLayoutSegment[]): WorldTreeLayoutSegment[] {
  return segments.filter((segment) => segment.type !== "main_spine");
}

type SpineStrokeProps = {
  d: string;
  variant: "main" | "branch" | "cave";
};

function SpineStroke({ d, variant }: SpineStrokeProps) {
  const isMain = variant === "main";
  const isCave = variant === "cave";

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={isMain ? "rgba(107, 83, 68, 0.45)" : "rgba(107, 83, 68, 0.25)"}
        strokeWidth={isMain ? 10 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke={isMain ? "rgba(214, 168, 95, 0.9)" : "rgba(214, 168, 95, 0.55)"}
        strokeWidth={isMain ? 3.5 : 2.25}
        strokeDasharray={isCave ? "6 4" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {isMain ? (
        <path
          d={d}
          fill="none"
          stroke="rgba(255, 236, 200, 0.45)"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </>
  );
}

/** SVG paths connecting nodes on the World Tree skeleton. */
export function WorldTreeSpinePath({ segments, nodes, className }: WorldTreeSpinePathProps) {
  const nodeById = new Map(nodes.map((entry) => [entry.node.id, entry]));
  const mainSpinePath = buildSegmentPath(collectMainSpineNodes(nodes));
  const branchSegments = collectBranchSegments(segments);

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      data-world-tree-spine
    >
      {mainSpinePath ? <SpineStroke d={mainSpinePath} variant="main" /> : null}

      {branchSegments.map((segment) => {
        const fork = segment.forkFromNodeId
          ? (nodeById.get(segment.forkFromNodeId) ?? null)
          : null;
        const pathD = buildSegmentPath(segment.nodes, fork, true);
        if (!pathD) return null;

        const variant = segment.type === "cave" ? "cave" : "branch";

        return (
          <g
            key={segment.segmentId}
            data-segment-type={segment.type}
            data-world-tree-zone={segment.zoneId}
          >
            <SpineStroke d={pathD} variant={variant} />
          </g>
        );
      })}
    </svg>
  );
}
