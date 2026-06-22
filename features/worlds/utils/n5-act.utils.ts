import type { N5ActIndex } from "@/lib/design-system/worlds";
import { getN5ActLabel } from "@/lib/design-system/worlds";

import { N5_ACT_BANDS } from "@/features/worlds/constants/n5-world.constants";

export function resolveN5ActFromPathPosition(
  pathPosition: number,
): N5ActIndex {
  const t = Math.min(1, Math.max(0, pathPosition));
  if (t < N5_ACT_BANDS[0]!.pathEnd) return 1;
  if (t < N5_ACT_BANDS[1]!.pathEnd) return 2;
  return 3;
}

export function resolveN5ActLabelFromPathPosition(pathPosition: number): string {
  const actIndex = resolveN5ActFromPathPosition(pathPosition);
  return getN5ActLabel(actIndex) ?? "";
}

export function resolveN5ActBandForIndex(actIndex: N5ActIndex) {
  return N5_ACT_BANDS.find((band) => band.actIndex === actIndex) ?? N5_ACT_BANDS[0]!;
}
