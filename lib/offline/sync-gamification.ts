import type {
  OfflineSyncGamificationResult,
  OfflineSyncResultItem,
} from "@/lib/offline/types";

export function toSyncGamification(
  input: {
    elevation?: OfflineSyncGamificationResult["elevation"];
    achievements?: OfflineSyncGamificationResult["achievements"];
    quests?: OfflineSyncGamificationResult["quests"];
  } | null | undefined,
): OfflineSyncGamificationResult | undefined {
  if (!input) return undefined;

  const elevation = input.elevation ?? null;
  const achievements = input.achievements ?? [];
  const quests = input.quests ?? [];

  if (!elevation && achievements.length === 0 && quests.length === 0) {
    return undefined;
  }

  return { elevation, achievements, quests };
}

export function aggregateSyncGamification(
  applied: OfflineSyncResultItem[],
): OfflineSyncGamificationResult | null {
  let elevation: OfflineSyncGamificationResult["elevation"] = null;
  const achievements: OfflineSyncGamificationResult["achievements"] = [];
  const quests: OfflineSyncGamificationResult["quests"] = [];
  const achievementIds = new Set<string>();
  const questIds = new Set<string>();

  for (const item of applied) {
    const gamification = item.gamification;
    if (!gamification) continue;

    if (gamification.elevation) {
      elevation = gamification.elevation;
    }

    for (const achievement of gamification.achievements) {
      if (achievementIds.has(achievement.id)) continue;
      achievementIds.add(achievement.id);
      achievements.push(achievement);
    }

    for (const quest of gamification.quests) {
      if (questIds.has(quest.id)) continue;
      questIds.add(quest.id);
      quests.push(quest);
    }
  }

  if (!elevation && achievements.length === 0 && quests.length === 0) {
    return null;
  }

  return { elevation, achievements, quests };
}
