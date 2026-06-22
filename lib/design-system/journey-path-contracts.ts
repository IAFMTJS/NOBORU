import contract from "@/lib/design-system/journey-path-contracts.json";
import { type RegionSlug } from "@/lib/design-system/regions";
import { normalizeRegionSlug, isWorldSlug } from "@/lib/design-system/worlds";

export type JourneyPathPoint = { x: number; y: number };

export type JourneyPathTheme = "dark" | "light";

export type JourneyPathContract = {
  spine: Record<JourneyPathTheme, JourneyPathPoint[]>;
  trails: Array<Record<JourneyPathTheme, JourneyPathPoint[]>>;
  checkpointSlots: number[];
  landmarkSlots: number[];
};

export const JOURNEY_SCROLL_ART_WIDTH = contract.scrollArtWidth;
export const JOURNEY_SCROLL_ART_HEIGHT = contract.scrollArtHeight;
export const JOURNEY_SCROLL_ART_ASPECT =
  JOURNEY_SCROLL_ART_WIDTH / JOURNEY_SCROLL_ART_HEIGHT;

const DEFAULT_REGION: RegionSlug = "n5";

const PATH_CONTRACT_JSON_KEYS: Record<RegionSlug, keyof typeof contract.regions> = {
  n5: "n5",
  n4: "mount-n4",
  n3: "mount-n3",
  n2: "mount-n2",
  n1: "mount-n1",
};

export function getJourneyPathContract(regionSlug: string): JourneyPathContract | null {
  const world = normalizeRegionSlug(regionSlug);
  if (!isWorldSlug(world)) return null;
  const key = PATH_CONTRACT_JSON_KEYS[world];
  return contract.regions[key] as JourneyPathContract;
}

export function getJourneyPathSpine(
  regionSlug: string,
  options?: { theme?: string; trailSegmentIndex?: number },
): ReadonlyArray<JourneyPathPoint> {
  const theme: JourneyPathTheme = options?.theme === "light" ? "light" : "dark";
  const trailSegmentIndex = options?.trailSegmentIndex ?? 0;

  const regionContract = getJourneyPathContract(regionSlug);
  if (!regionContract) {
    return contract.worldSpine[theme];
  }

  if (trailSegmentIndex === 0) {
    return regionContract.spine[theme];
  }

  const trailSpine = regionContract.trails[trailSegmentIndex - 1]?.[theme];
  return trailSpine ?? regionContract.spine[theme];
}

export function getWorldJourneySpine(
  theme?: string,
): ReadonlyArray<JourneyPathPoint> {
  const resolved: JourneyPathTheme = theme === "light" ? "light" : "dark";
  return contract.worldSpine[resolved];
}

export function interpolateAlongJourneyPath(
  spine: ReadonlyArray<JourneyPathPoint>,
  pathPosition: number,
): JourneyPathPoint {
  if (spine.length === 0) return { x: 50, y: 50 };
  if (spine.length === 1) return { ...spine[0]! };

  const t = Math.min(1, Math.max(0, pathPosition));

  const segments: Array<{
    start: JourneyPathPoint;
    end: JourneyPathPoint;
    length: number;
  }> = [];
  let totalLength = 0;

  for (let i = 0; i < spine.length - 1; i += 1) {
    const start = spine[i]!;
    const end = spine[i + 1]!;
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segments.push({ start, end, length });
    totalLength += length;
  }

  if (totalLength === 0) return { ...spine[0]! };

  let remaining = t * totalLength;
  for (const segment of segments) {
    if (remaining <= segment.length) {
      const frac = segment.length === 0 ? 0 : remaining / segment.length;
      return {
        x: segment.start.x + (segment.end.x - segment.start.x) * frac,
        y: segment.start.y + (segment.end.y - segment.start.y) * frac,
      };
    }
    remaining -= segment.length;
  }

  return { ...spine[spine.length - 1]! };
}

export function computeJourneyPathCoordinates(
  pathPosition: number,
  regionSlug: string,
  options?: { theme?: string; trailSegmentIndex?: number },
): JourneyPathPoint {
  const spine = getJourneyPathSpine(regionSlug, options);
  return interpolateAlongJourneyPath(spine, pathPosition);
}

export function resolveCheckpointPathPosition(
  regionSlug: string,
  checkpointIndex: number,
): number {
  const regionContract = getJourneyPathContract(regionSlug);
  const slots = regionContract?.checkpointSlots ?? [0.35, 0.68];
  return slots[checkpointIndex % slots.length] ?? 0.5;
}

export function resolveLandmarkPathPosition(
  regionSlug: string,
  landmarkIndex: number,
): number {
  const regionContract = getJourneyPathContract(regionSlug);
  const slots = regionContract?.landmarkSlots ?? [0.18, 0.52, 0.84];
  return slots[landmarkIndex % slots.length] ?? 0.5;
}

export function getDefaultJourneyRegionSlug(): RegionSlug {
  return DEFAULT_REGION;
}
