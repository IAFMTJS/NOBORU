import type { TrailNodeState, TrailNodeViewModel } from "@/features/learning/utils/trail-state";
import type { ImmersiveTrailNodePosition } from "@/lib/design-system/trail-path-anchors";

type TrailSpineConnectorProps = {
  points: ImmersiveTrailNodePosition[];
  nodes: TrailNodeViewModel[];
};

function segmentStroke(
  fromState: TrailNodeState,
  toState: TrailNodeState,
): string {
  if (fromState === "completed" && toState !== "locked") {
    return "var(--success)";
  }
  if (
    fromState === "in_progress" ||
    toState === "in_progress" ||
    fromState === "available" ||
    toState === "available"
  ) {
    return "var(--primary)";
  }
  return "rgba(255,255,255,0.22)";
}

export function TrailSpineConnector({ points, nodes }: TrailSpineConnectorProps) {
  if (points.length < 2) return null;

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
      <defs>
        <filter id="trail-spine-glow" x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {segments.map((segment, index) => (
        <path
          key={`${segment.from.x}-${segment.from.y}-${index}`}
          d={`M ${segment.from.x} ${segment.from.y} L ${segment.to.x} ${segment.to.y}`}
          fill="none"
          stroke={segmentStroke(segment.fromState, segment.toState)}
          strokeWidth="0.45"
          strokeLinecap="round"
          filter="url(#trail-spine-glow)"
          opacity={segment.toState === "locked" ? 0.65 : 0.95}
        />
      ))}
    </svg>
  );
}
