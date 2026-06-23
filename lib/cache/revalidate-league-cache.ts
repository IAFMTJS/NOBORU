import { revalidateTag } from "next/cache";

import { leagueRepository } from "@/features/leagues/repositories/league.repository";

export async function revalidateActiveLeagueSeasonCache(): Promise<void> {
  const seasonId = await leagueRepository.getActiveSeasonId();
  if (seasonId) {
    revalidateTag(`league-season-${seasonId}`);
  }
}
