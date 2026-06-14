import type {
  WorldMapRegionAvailability,
  WorldMapSpatialPosition,
} from "@/features/world-map/types/world-map.types";

type WorldMapSpineConnectorProps = {
  regions: ReadonlyArray<{
    position: WorldMapSpatialPosition;
    availability: WorldMapRegionAvailability;
    isCurrent: boolean;
  }>;
};

function segmentStroke(
  fromAvailability: WorldMapRegionAvailability,
  toAvailability: WorldMapRegionAvailability,
  fromIsCurrent: boolean,
  toIsCurrent: boolean,
): string {
  if (fromAvailability === "completed" && toAvailability !== "locked") {
    return "var(--success)";
  }
  if (fromIsCurrent || toIsCurrent) {
    return "hsl(var(--primary))";
  }
  if (fromAvailability === "available" || toAvailability === "available") {
    return "hsl(var(--warning))";
  }
  return "rgba(255,255,255,0.22)";
}

export function WorldMapSpineConnector({ regions }: WorldMapSpineConnectorProps) {
  if (regions.length < 2) return null;

  const segments = regions.slice(1).map((region, index) => ({
    from: regions[index]!.position,
    to: region.position,
    fromAvailability: regions[index]!.availability,
    toAvailability: region.availability,
    fromIsCurrent: regions[index]!.isCurrent,
    toIsCurrent: region.isCurrent,
  }));

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="world-map-spine-glow" x="-50%" y="-10%" width="200%" height="120%">
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
          stroke={segmentStroke(
            segment.fromAvailability,
            segment.toAvailability,
            segment.fromIsCurrent,
            segment.toIsCurrent,
          )}
          strokeWidth="0.55"
          strokeLinecap="round"
          filter="url(#world-map-spine-glow)"
          opacity={segment.toAvailability === "locked" ? 0.55 : 0.95}
        />
      ))}
    </svg>
  );
}
