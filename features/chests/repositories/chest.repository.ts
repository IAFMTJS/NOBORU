import { createClient } from "@/lib/supabase/server";

import type {
  ChestTemplateRow,
  UserChestClaimRow,
} from "@/features/chests/types/chest.types";

class ChestRepository {
  async listTemplates(): Promise<ChestTemplateRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chest_templates")
      .select("*")
      .eq("status", "published");

    if (error) throw new Error(error.message);
    return (data as ChestTemplateRow[]) ?? [];
  }

  async findTemplateBySlug(slug: string): Promise<ChestTemplateRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chest_templates")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ChestTemplateRow | null) ?? null;
  }

  async findClaim(
    userId: string,
    chestTemplateId: string,
    claimPeriodKey: string,
  ): Promise<UserChestClaimRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_chest_claims")
      .select("*")
      .eq("user_id", userId)
      .eq("chest_template_id", chestTemplateId)
      .eq("claim_period_key", claimPeriodKey)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserChestClaimRow | null) ?? null;
  }

  async insertClaim(input: {
    userId: string;
    chestTemplateId: string;
    claimPeriodKey: string;
  }): Promise<UserChestClaimRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_chest_claims")
      .insert({
        user_id: input.userId,
        chest_template_id: input.chestTemplateId,
        claim_period_key: input.claimPeriodKey,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as UserChestClaimRow;
  }
}

export const chestRepository = new ChestRepository();
