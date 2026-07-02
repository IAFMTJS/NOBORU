import type { LearningLayer } from "@/lib/learning/knowledge-block/types";

export type LayerWeaknessRecord = {
  layer: LearningLayer;
  missCount: number;
};

const LAYER_EXERCISE_PREFIX = "layer:";

export function layerExerciseType(layer: LearningLayer): string {
  return `${LAYER_EXERCISE_PREFIX}${layer}`;
}

export function parseLayerFromExerciseType(exerciseType: string): LearningLayer | null {
  if (!exerciseType.startsWith(LAYER_EXERCISE_PREFIX)) return null;
  return exerciseType.slice(LAYER_EXERCISE_PREFIX.length) as LearningLayer;
}

export function rankWeakLayers(
  exerciseTypes: readonly string[],
  missCounts: ReadonlyMap<LearningLayer, number>,
): LearningLayer[] {
  const layers = exerciseTypes
    .map(parseLayerFromExerciseType)
    .filter((layer): layer is LearningLayer => layer != null);

  const unique = Array.from(new Set(layers));
  return unique.sort((left, right) => (missCounts.get(right) ?? 0) - (missCounts.get(left) ?? 0));
}

export function getWeakLayersFromMasteryRows(
  rows: ReadonlyArray<{ exercise_types: string[] | null }>,
  missCounts: ReadonlyMap<LearningLayer, number>,
): LearningLayer[] {
  const exerciseTypes = rows.flatMap((row) => row.exercise_types ?? []);
  return rankWeakLayers(exerciseTypes, missCounts);
}
