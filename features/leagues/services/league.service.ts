import { leagueRepository } from "@/features/leagues/repositories/league.repository";
import {
  LEAGUE_TIER_LABELS,
  type LeagueDashboardViewModel,
  type LeagueTier,
} from "@/features/leagues/types/league.types";

class LeagueService {
  async getDashboard(userId: string): Promise<LeagueDashboardViewModel | null> {
    const seasonId = await leagueRepository.getActiveSeasonId();
    if (!seasonId) return null;

    const membership = await leagueRepository.ensureMembership(userId, seasonId);
    const leaderboardRows = await leagueRepository.listLeaderboard(seasonId);

    const leaderboard = leaderboardRows.map((row, index) => ({
      userId: row.user_id,
      displayName: row.display_name ?? "Climber",
      weeklyEp: row.weekly_ep,
      tier: row.tier as LeagueTier,
      rank: index + 1,
    }));

    const userRank =
      leaderboard.find((entry) => entry.userId === userId)?.rank ?? null;

    return {
      optedIn: membership.opted_in,
      tier: membership.tier as LeagueTier,
      tierLabel: LEAGUE_TIER_LABELS[membership.tier as LeagueTier],
      weeklyEp: membership.weekly_ep,
      rank: userRank,
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
