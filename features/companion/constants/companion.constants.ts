import type { CompanionEvolutionSlug } from "@/features/companion/types/companion.types";

export const BOND_XP_PER_LEVEL = 100;

export const BOND_XP_AWARDS = {
  lesson_step_correct: 2,
  lesson_complete: 15,
  trial_pass: 40,
  streak_milestone: 25,
  chest: 10,
} as const;

export const EVOLUTION_THRESHOLDS: Array<{
  slug: CompanionEvolutionSlug;
  name: string;
  minBondLevel: number;
}> = [
  { slug: "young_fox", name: "Young Fox", minBondLevel: 1 },
  { slug: "mountain_fox", name: "Mountain Fox", minBondLevel: 10 },
  { slug: "spirit_fox", name: "Spirit Fox", minBondLevel: 20 },
  { slug: "shrine_fox", name: "Shrine Fox", minBondLevel: 35 },
  { slug: "celestial_fox", name: "Celestial Fox", minBondLevel: 50 },
];

export function bondXpForLevel(level: number): number {
  return level * BOND_XP_PER_LEVEL;
}

export function resolveEvolutionForLevel(
  bondLevel: number,
): (typeof EVOLUTION_THRESHOLDS)[number] {
  const sorted = [...EVOLUTION_THRESHOLDS].sort(
    (a, b) => b.minBondLevel - a.minBondLevel,
  );
  return sorted.find((e) => bondLevel >= e.minBondLevel) ?? EVOLUTION_THRESHOLDS[0];
}

export function nextEvolution(
  bondLevel: number,
): (typeof EVOLUTION_THRESHOLDS)[number] | null {
  return EVOLUTION_THRESHOLDS.find((e) => bondLevel < e.minBondLevel) ?? null;
}
