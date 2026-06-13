import { createClient } from "@/lib/supabase/server";

import type { ShrineProtectionViewModel } from "@/features/streak-protection/types/shrine-protection.types";

type ShrineRow = {
  id: string;
  user_id: string;
  tokens_available: number;
  tokens_used: number;
};

class ShrineProtectionRepository {
  async ensure(userId: string): Promise<ShrineRow> {
    const existing = await this.find(userId);
    if (existing) return existing;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_shrine_protection")
      .insert({ user_id: userId })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ShrineRow;
  }

  async find(userId: string): Promise<ShrineRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_shrine_protection")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ShrineRow | null) ?? null;
  }

  async updateTokens(
    userId: string,
    tokensAvailable: number,
    tokensUsed: number,
  ): Promise<void> {
    await this.ensure(userId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_shrine_protection")
      .update({
        tokens_available: tokensAvailable,
        tokens_used: tokensUsed,
      })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  }
}

export const shrineProtectionRepository = new ShrineProtectionRepository();
