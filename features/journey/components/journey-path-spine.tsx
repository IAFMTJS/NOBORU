import type { JourneyNode, JourneyNodeState } from "@/features/journey/types/journey.types";
import { getJourneyPathSpine } from "@/lib/design-system/journey-path-contracts";

import { buildPathSpinePoints } from "@/features/journey/components/path-geometry";

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
    return "hsl(var(--trail-glow))";
  }
  if (fromState === "in_progress" || toState === "in_progress") {
    return "hsl(var(--trail-glow))";
  }
  if (fromState === "available" || toState === "available") {
    return "hsl(var(--warning))";
  }
  return "rgba(120, 100, 70, 0.45)";
}

function buildPathD(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first!.x} ${first!.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(" ")}`;
}

/** Stone-trail spine — warm amber glow on active/completed segments (mockup contract). */
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
      {/* Stone bed — dark earth under trail */}
      <path
        d={buildPathD(backdropPoints)}
        fill="none"
        stroke="#2a1f14"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.9}
      />
      {/* Warm stone surface */}
      <path
        d={buildPathD(backdropPoints)}
        fill="none"
        stroke="#6b5230"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />
      <path
        d={buildPathD(backdropPoints)}
        fill="none"
        stroke="#c4a35a"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.55}
      />
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {segments.map((segment, index) => {
        const isActive =
          segment.fromState === "in_progress" ||
          segment.toState === "in_progress" ||
          segment.fromState === "available";
        const isIlluminated =
          segment.fromState === "completed" && segment.toState !== "locked";
        const isLocked = segment.toState === "locked" && segment.fromState === "locked";

        return (
          <g key={`${segment.from.x}-${segment.from.y}-${index}`}>
            {isIlluminated ? (
              <path
                d={`M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`}
                fill="none"
                stroke="hsl(var(--trail-glow))"
                strokeWidth={10}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={0.45}
                className="motion-reward"
              />
            ) : null}
            {isActive ? (
              <path
                d={`M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`}
                fill="none"
                stroke="hsl(var(--trail-glow))"
                strokeWidth={7}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={0.55}
              />
            ) : null}
            <path
              d={`M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`}
              fill="none"
              stroke={segmentStroke(segment.fromState, segment.toState)}
              strokeWidth={isActive || isIlluminated ? 5 : 4}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={isLocked ? 0.35 : isActive || isIlluminated ? 0.95 : 0.7}
            />
          </g>
        );
      })}
    </svg>
  );
}
