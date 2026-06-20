import "server-only";

import { augmentRegionsWithBlueprint } from "@/features/journey/utils/journey-blueprint-merge.utils";
import { buildJourneyPathFromData } from "@/features/journey/utils/journey-path.builder";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";

/** Full blueprint tree — used for art audit / page export (no auth). Server-only. */
export function buildWorldTreeAuditJourney(): JourneyPathViewModel {
  const augmented = augmentRegionsWithBlueprint([], new Set());
  return buildJourneyPathFromData(augmented, [], new Set());
}
