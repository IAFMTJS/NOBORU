export type NextUnlockKind =
  | "companion"
  | "region"
  | "trial"
  | "title"
  | "collectible"
  | "chest";

export type NextUnlockViewModel = {
  kind: NextUnlockKind;
  label: string;
  progressPercent: number;
  remainingLabel: string | null;
  href: string | null;
};

export type ProgressionPreviewViewModel = {
  unlocks: NextUnlockViewModel[];
  primaryUnlock: NextUnlockViewModel | null;
};
