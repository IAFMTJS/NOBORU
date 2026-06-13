import { createClient } from "@/lib/supabase/server";

import type { LeagueMembershipRow } from "@/features/leagues/types/league.types";

class LeagueRepository {
  async getActiveSeasonId(): Promise<string | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("league_seasons")
      .select("id")
      .eq("status", "active")
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as { id: string } | null)?.id ?? null;
  }

  async ensureMembership(
    userId: string,
    seasonId: string,
  ): Promise<LeagueMembershipRow> {
    const existing = await this.findMembership(userId, seasonId);
    if (existing) return existing;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("league_memberships")
      .insert({ user_id: userId, season_id: seasonId })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as LeagueMembershipRow;
  }

  async findMembership(
    userId: string,
    seasonId: string,
  ): Promise<LeagueMembershipRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("league_memberships")
      .select("*")
      .eq("user_id", userId)
      .eq("season_id", seasonId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as LeagueMembershipRow | null) ?? null;
  }

  async updateMembership(input: {
    userId: string;
    seasonId: string;
    weeklyEp?: number;
    optedIn?: boolean;
    tier?: string;
  }): Promise<LeagueMembershipRow> {
    const supabase = await createClient();
    const updates: Record<string, unknown> = {};
    if (input.weeklyEp !== undefined) updates.weekly_ep = input.weeklyEp;
    if (input.optedIn !== undefined) updates.opted_in = input.optedIn;
    if (input.tier !== undefined) updates.tier = input.tier;

    const { data, error } = await supabase
      .from("league_memberships")
      .update(updates)
      .eq("user_id", input.userId)
      .eq("season_id", input.seasonId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as LeagueMembershipRow;
  }

  async listLeaderboard(
    seasonId: string,
    limit = 20,
  ): Promise<Array<LeagueMembershipRow & { display_name: string | null }>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("league_memberships")
      .select("*, profiles!inner(display_name)")
      .eq("season_id", seasonId)
      .eq("opted_in", true)
      .order("weekly_ep", { ascending: false })
      .limit(limit);

    if (error) {
      const { data: fallback, error: fallbackError } = await supabase
        .from("league_memberships")
        .select("*")
        .eq("season_id", seasonId)
        .eq("opted_in", true)
        .order("weekly_ep", { ascending: false })
        .limit(limit);

      if (fallbackError) throw new Error(fallbackError.message);
      return (fallback as LeagueMembershipRow[]).map((row) => ({
        ...row,
        display_name: null,
      }));
    }

    return (data as Array<LeagueMembershipRow & { profiles: { display_name: string | null } }>).map(
      (row) => ({
        ...row,
        display_name: row.profiles?.display_name ?? null,
      }),
    );
  }
}

export const leagueRepository = new LeagueRepository();
