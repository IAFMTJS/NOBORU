import type { TrialGrade } from "@/features/trials/types/trial.types";

export const TRIAL_KIND_LABELS = {
  regional_challenge: "Regional Challenge",
  boss_trial: "Boss Trial",
  final_trial: "Final Trial",
} as const;

export const TRIAL_GRADE_LABELS: Record<TrialGrade, string> = {
  pass: "Pass",
  excellent: "Excellent",
  perfect: "Perfect",
  mastery: "Mastery",
  legendary: "Legendary",
};

export const TRIAL_GRADE_EP_MULTIPLIER: Record<TrialGrade, number> = {
  pass: 1,
  excellent: 1.15,
  perfect: 1.3,
  mastery: 1.5,
  legendary: 2,
};

export function computeTrialGrade(
  scorePercent: number,
  passed: boolean,
): TrialGrade | null {
  if (!passed) return null;
  if (scorePercent >= 100) return "legendary";
  if (scorePercent >= 95) return "mastery";
  if (scorePercent >= 90) return "perfect";
  if (scorePercent >= 80) return "excellent";
  return "pass";
}

export function computeTrialEpReward(
  baseReward: number,
  grade: TrialGrade | null,
  isFirstPass: boolean,
): number {
  if (!grade || !isFirstPass) return 0;
  return Math.round(baseReward * TRIAL_GRADE_EP_MULTIPLIER[grade]);
}

export function buildReviewRecommendations(
  scorePercent: number,
  regionSlug: string,
): string[] {
  const recommendations: string[] = [];

  if (scorePercent < 80) {
    recommendations.push("Review your SRS queue for weak items.");
  }
  if (regionSlug === "foothills" || regionSlug === "forest-trail") {
    recommendations.push("Practice character charts before retrying.");
  }
  if (regionSlug === "mount-n5") {
    recommendations.push("Revisit N5 vocabulary and grammar lessons on the trail.");
    recommendations.push("Complete reading and listening exercises for comprehension.");
  }
  if (regionSlug === "mount-n4") {
    recommendations.push("Revisit N4 vocabulary and grammar lessons on the trail.");
    recommendations.push("Complete N4 reading and listening exercises for comprehension.");
  }

  return recommendations;
}
