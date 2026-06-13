export type CompanionEvolutionSlug =
  | "young_fox"
  | "mountain_fox"
  | "spirit_fox"
  | "shrine_fox"
  | "celestial_fox";

export type CompanionDefinitionRow = {
  id: string;
  slug: CompanionEvolutionSlug;
  name: string;
  description: string | null;
  min_bond_level: number;
  sort_order: number;
};

export type CompanionOutfitRow = {
  id: string;
  slug: string;
  companion_definition_id: string;
  name: string;
  description: string | null;
  min_bond_level: number;
  asset_key: string | null;
};

export type UserCompanionRow = {
  id: string;
  user_id: string;
  bond_level: number;
  bond_xp: number;
  evolution_slug: CompanionEvolutionSlug;
  equipped_outfit_id: string | null;
};

export type CompanionViewModel = {
  bondLevel: number;
  bondXp: number;
  bondXpToNextLevel: number;
  progressPercent: number;
  evolutionSlug: CompanionEvolutionSlug;
  evolutionName: string;
  equippedOutfitName: string | null;
};

export type CompanionNextUnlock = {
  label: string;
  progressPercent: number;
  remainingLabel: string | null;
};

export type BondXpSource =
  | "lesson_step_correct"
  | "lesson_complete"
  | "trial_pass"
  | "streak_milestone"
  | "chest";
