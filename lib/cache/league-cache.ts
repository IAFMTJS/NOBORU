import { unstable_cache } from "next/cache";

import { leagueRepository } from "@/features/leagues/repositories/league.repository";
import type { LeagueTier } from "@/features/leagues/types/league.types";

export type CachedLeaderboardEntry = {
  userId: string;
  displayName: string;
  weeklyEp: number;
  tier: LeagueTier;
  rank: number;
};

const LEADERBOARD_CACHE_SECONDS = 45;

export async function getCachedLeaderboardTop100(
  seasonId: string,
): Promise<CachedLeaderboardEntry[]> {
  return unstable_cache(
    async () => {
      const rows = await leagueRepository.listLeaderboard(seasonId, 100);
      return rows.map((row, index) => ({
        userId: row.user_id,
        displayName: row.display_name ?? "Climber",
        weeklyEp: row.weekly_ep,
        tier: row.tier as LeagueTier,
        rank: index + 1,
      }));
    },
    ["league-leaderboard", seasonId],
    { revalidate: LEADERBOARD_CACHE_SECONDS, tags: [`league-season-${seasonId}`] },
  )();
}
