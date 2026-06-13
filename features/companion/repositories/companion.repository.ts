import { createClient } from "@/lib/supabase/server";

import type {
  CompanionOutfitRow,
  UserCompanionRow,
} from "@/features/companion/types/companion.types";

class CompanionRepository {
  async ensureCompanion(userId: string): Promise<UserCompanionRow> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_companion")
      .insert({ user_id: userId })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserCompanionRow;
  }

  async findByUserId(userId: string): Promise<UserCompanionRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_companion")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserCompanionRow | null) ?? null;
  }

  async updateCompanion(input: {
    userId: string;
    bondLevel: number;
    bondXp: number;
    evolutionSlug: string;
    equippedOutfitId?: string | null;
  }): Promise<UserCompanionRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_companion")
      .update({
        bond_level: input.bondLevel,
        bond_xp: input.bondXp,
        evolution_slug: input.evolutionSlug,
        ...(input.equippedOutfitId !== undefined
          ? { equipped_outfit_id: input.equippedOutfitId }
          : {}),
      })
      .eq("user_id", input.userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserCompanionRow;
  }

  async insertUnlock(input: {
    userId: string;
    unlockType: string;
    unlockSlug: string;
  }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("user_companion_unlocks").upsert(
      {
        user_id: input.userId,
        unlock_type: input.unlockType,
        unlock_slug: input.unlockSlug,
      },
      { onConflict: "user_id,unlock_type,unlock_slug" },
    );

    if (error) throw new Error(error.message);
  }

  async listOutfits(): Promise<CompanionOutfitRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companion_outfits")
      .select("*")
      .eq("status", "published")
      .order("min_bond_level");

    if (error) throw new Error(error.message);
    return (data as CompanionOutfitRow[]) ?? [];
  }

  async findOutfitById(id: string): Promise<CompanionOutfitRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companion_outfits")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as CompanionOutfitRow | null) ?? null;
  }
}

export const companionRepository = new CompanionRepository();
