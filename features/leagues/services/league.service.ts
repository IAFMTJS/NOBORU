import { getCachedLeaderboardTop100 } from "@/lib/cache/league-cache";
import { leagueRepository } from "@/features/leagues/repositories/league.repository";
import {
  LEAGUE_TIER_LABELS,
  type LeagueDashboardViewModel,
  type LeagueTier,
} from "@/features/leagues/types/league.types";

class LeagueService {
  async getDashboard(userId: string): Promise<LeagueDashboardViewModel | null> {
    const season = await leagueRepository.getActiveSeason();
    if (!season) return null;

    const membership = await leagueRepository.ensureMembership(userId, season.id);
    const leaderboard = await getCachedLeaderboardTop100(season.id);

    const userRank =
      leaderboard.find((entry) => entry.userId === userId)?.rank ?? null;

    return {
      optedIn: membership.opted_in,
      tier: membership.tier as LeagueTier,
      tierLabel: LEAGUE_TIER_LABELS[membership.tier as LeagueTier],
      weeklyEp: membership.weekly_ep,
      rank: userRank,
      seasonEndsAt: season.endsAt,
      leaderboard,
    };
  }

  async optIn(userId: string): Promise<LeagueDashboardViewModel | null> {
    const seasonId = await leagueRepository.getActiveSeasonId();
    if (!seasonId) return null;

    await leagueRepository.ensureMembership(userId, seasonId);
    await leagueRepository.updateMembership({
      userId,
      seasonId,
      optedIn: true,
    });

    return this.getDashboard(userId);
  }

  async optOut(userId: string): Promise<LeagueDashboardViewModel | null> {
    const seasonId = await leagueRepository.getActiveSeasonId();
    if (!seasonId) return null;

    await leagueRepository.ensureMembership(userId, seasonId);
    await leagueRepository.updateMembership({
      userId,
      seasonId,
      optedIn: false,
    });

    return this.getDashboard(userId);
  }

  async addWeeklyEp(userId: string, ep: number): Promise<void> {
    const seasonId = await leagueRepository.getActiveSeasonId();
    if (!seasonId) return;

    const membership = await leagueRepository.ensureMembership(userId, seasonId);
    if (!membership.opted_in) return;

    await leagueRepository.updateMembership({
      userId,
      seasonId,
      weeklyEp: membership.weekly_ep + ep,
    });
  }
}

export const leagueService = new LeagueService();
