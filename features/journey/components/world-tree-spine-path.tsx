"use client";

import type {
  PlottedSkeletonNode,
  WorldTreeLayoutSegment,
} from "@/features/journey/utils/world-tree-layout.utils";
import { WORLD_TREE_MANIFEST_ANCHORS } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  resolveJlptBandAccent,
  resolveJlptBandForZone,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { cn } from "@/lib/utils";

type WorldTreeSpinePathProps = {
  segments: WorldTreeLayoutSegment[];
  nodes: PlottedSkeletonNode[];
  hubPositions?: Record<string, { xPercent: number; yPercent: number }>;
  className?: string;
  /** Overview: one continuous glowing trail through all lesson nodes. */
  continuousTrail?: boolean;
  /** Color trail strokes by JLPT band accent. */
  coloredByJlpt?: boolean;
};

function buildTreeLimbConnector(
  forkX: number,
  forkY: number,
  first: PlottedSkeletonNode,
): string {
  const dx = first.xPercent - forkX;
  const dy = first.yPercent - forkY;
  const ctrlX = forkX + dx * 0.38;
  const ctrlY = forkY + dy * 0.22 - Math.abs(dx) * 0.05;

  return `M ${forkX} ${forkY} Q ${ctrlX} ${ctrlY}, ${first.xPercent} ${first.yPercent}`;
}

function buildSegmentPath(
  nodes: PlottedSkeletonNode[],
  fork?: { xPercent: number; yPercent: number } | null,
  limb = false,
): string | null {
  if (nodes.length === 0) return null;

  const sorted = limb
    ? [...nodes].sort((a, b) => a.node.globalIndex - b.node.globalIndex)
    : [...nodes].sort((a, b) => b.yPercent - a.yPercent);
  const first = sorted[0]!;

  let path = fork
    ? buildTreeLimbConnector(fork.xPercent, fork.yPercent, first)
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

function buildContinuousAscentPaths(
  nodes: PlottedSkeletonNode[],
): { bandId: WorldTreeJlptBandId; path: string }[] {
  const sorted = nodes
    .filter((entry) => entry.node.kind !== "landmark")
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  if (sorted.length < 2) return [];

  const groups: { bandId: WorldTreeJlptBandId; nodes: PlottedSkeletonNode[] }[] = [];

  for (const entry of sorted) {
    const bandId = resolveJlptBandForZone(entry.zoneId);
    const last = groups[groups.length - 1];
    if (last?.bandId === bandId) {
      last.nodes.push(entry);
    } else {
      groups.push({ bandId, nodes: [entry] });
    }
  }

  return groups
    .map((group) => {
      const path = buildSegmentPath(group.nodes, null, true);
      return path ? { bandId: group.bandId, path } : null;
    })
    .filter((entry): entry is { bandId: WorldTreeJlptBandId; path: string } => entry != null);
}

function collectMainSpineNodes(nodes: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  return nodes
    .filter(
      (entry) =>
        entry.node.kind !== "landmark" &&
        entry.spineRole === "main",
    )
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);
}

function collectBranchSegments(segments: WorldTreeLayoutSegment[]): WorldTreeLayoutSegment[] {
  return segments.filter(
    (segment) => segment.forkPoint != null || segment.type !== "main_spine",
  );
}

type SpineStrokeProps = {
  d: string;
  variant: "main" | "branch" | "cave";
  accentColor?: string;
};

function SpineStroke({ d, variant, accentColor }: SpineStrokeProps) {
  const isMain = variant === "main";
  const isCave = variant === "cave";
  const glow = accentColor ?? "#D6A85F";
  const shadow = accentColor ? `${accentColor}55` : "rgba(107, 83, 68, 0.45)";
  const mid = accentColor ? `${accentColor}E6` : "rgba(214, 168, 95, 0.9)";

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={shadow}
        strokeWidth={isMain ? 10 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke={mid}
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
          stroke="rgba(255, 255, 255, 0.72)"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: accentColor ? `drop-shadow(0 0 4px ${glow})` : undefined }}
        />
      ) : null}
    </>
  );
}

function buildTrunkColumnPath(
  hubPositions: Record<string, { xPercent: number; yPercent: number }>,
): string {
  const trunkCenter = WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent;
  const hubs = Object.values(hubPositions).sort((a, b) => b.yPercent - a.yPercent);

  let path = `M ${trunkCenter} 100`;
  for (const hub of hubs) {
    path += ` L ${trunkCenter} ${hub.yPercent}`;
  }
  path += ` L ${trunkCenter} 3`;
  return path;
}

/** SVG paths connecting nodes on the World Tree skeleton. */
export function WorldTreeSpinePath({
  segments,
  nodes,
  hubPositions = {},
  className,
  continuousTrail = false,
  coloredByJlpt = false,
}: WorldTreeSpinePathProps) {
  const continuousPaths = continuousTrail ? buildContinuousAscentPaths(nodes) : [];
  const trunkColumnPath = continuousTrail ? null : buildTrunkColumnPath(hubPositions);
  const mainSpinePath = continuousTrail ? null : buildSegmentPath(collectMainSpineNodes(nodes));
  const branchSegments = continuousTrail ? [] : collectBranchSegments(segments);

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      data-world-tree-spine
      data-trail-mode={continuousTrail ? "continuous" : "segmented"}
    >
      {continuousPaths.map(({ bandId, path }) => (
        <g key={bandId} data-jlpt-band={bandId}>
          <SpineStroke
            d={path}
            variant="main"
            accentColor={coloredByJlpt ? resolveJlptBandAccent(bandId).accentColor : undefined}
          />
        </g>
      ))}

      {trunkColumnPath ? <SpineStroke d={trunkColumnPath} variant="main" /> : null}
      {mainSpinePath ? <SpineStroke d={mainSpinePath} variant="main" /> : null}

      {branchSegments.map((segment) => {
        const fork = segment.forkPoint ?? null;
        const pathD = buildSegmentPath(segment.nodes, fork, true);
        if (!pathD) return null;

        const variant = segment.type === "cave" ? "cave" : "branch";
        const bandId = resolveJlptBandForZone(segment.zoneId);
        const accent = coloredByJlpt ? resolveJlptBandAccent(bandId).accentColor : undefined;

        return (
          <g
            key={segment.segmentId}
            data-segment-type={segment.type}
            data-world-tree-zone={segment.zoneId}
            data-jlpt-band={bandId}
          >
            <SpineStroke d={pathD} variant={variant} accentColor={accent} />
          </g>
        );
      })}
    </svg>
  );
}
