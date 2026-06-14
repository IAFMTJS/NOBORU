import type { JourneyNode, JourneyNodeState } from "@/features/learning/types/journey.types";
import { getJourneyPathSpine } from "@/lib/design-system/journey-path-contracts";

import { buildPathSpinePoints } from "@/features/learning/components/journey/path-geometry";

type JourneyPathSpineProps = {
  nodes: JourneyNode[];
  regionSlug: string;
  theme?: string;
  trailSegmentIndex?: number;
};

function segmentStroke(
  fromState: JourneyNodeState,
  toState: JourneyNodeState,
): string {
  if (fromState === "completed" && toState !== "locked") {
    return "var(--success)";
  }
  if (fromState === "in_progress" || toState === "in_progress") {
    return "hsl(var(--primary))";
  }
  if (fromState === "available" || toState === "available") {
    return "hsl(var(--warning))";
  }
  return "rgba(90, 70, 45, 0.55)";
}

function buildPathD(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first!.x} ${first!.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(" ")}`;
}

export function JourneyPathSpine({
  nodes,
  regionSlug,
  theme,
  trailSegmentIndex = 0,
}: JourneyPathSpineProps) {
  const geometryOptions = { regionSlug, theme, trailSegmentIndex };
  const spine = getJourneyPathSpine(regionSlug, { theme, trailSegmentIndex });
  const backdropPoints = spine.map((point) => ({ x: point.x, y: point.y }));
  const nodePoints =
    nodes.length >= 2
      ? buildPathSpinePoints(nodes, geometryOptions)
      : backdropPoints;

  const points = nodePoints.length >= 2 ? nodePoints : backdropPoints;
  if (points.length < 2) return null;

  const pathD = buildPathD(points);
  const segments = points.slice(1).map((point, index) => ({
    from: points[index]!,
    to: point,
    fromState: nodes[index]?.state ?? "locked",
    toState: nodes[index + 1]?.state ?? "locked",
  }));

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={buildPathD(backdropPoints)}
        fill="none"
        stroke="#3d2f1f"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />
      <path
        d={buildPathD(backdropPoints)}
        fill="none"
        stroke="#8b6914"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.92}
      />
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {segments.map((segment, index) => (
        <path
          key={`${segment.from.x}-${segment.from.y}-${index}`}
          d={`M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`}
          fill="none"
          stroke={segmentStroke(segment.fromState, segment.toState)}
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={segment.toState === "locked" ? 0.45 : 0.75}
        />
      ))}
    </svg>
  );
}
