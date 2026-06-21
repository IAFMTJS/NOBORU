import { createClient } from "@/lib/supabase/server";

import type {
  CollectibleDefinitionRow,
  UserCollectibleRow,
} from "@/features/collectibles/types/collectible.types";

class CollectibleRepository {
  async listByRegion(regionSlug: string): Promise<CollectibleDefinitionRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collectible_definitions")
      .select("*")
      .eq("region_slug", regionSlug)
      .eq("status", "published")
      .order("sort_order");

    if (error) throw new Error(error.message);
    return (data as CollectibleDefinitionRow[]) ?? [];
  }

  async findBySlug(slug: string): Promise<CollectibleDefinitionRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collectible_definitions")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as CollectibleDefinitionRow | null) ?? null;
  }

  async listAllPublished(): Promise<CollectibleDefinitionRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collectible_definitions")
      .select("*")
      .eq("status", "published")
      .order("region_slug")
      .order("sort_order");

    if (error) throw new Error(error.message);
    return (data as CollectibleDefinitionRow[]) ?? [];
  }

  async listUserCollectibles(userId: string): Promise<UserCollectibleRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_collectibles")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data as UserCollectibleRow[]) ?? [];
  }

  async grant(input: {
    userId: string;
    collectibleId: string;
    sourceType: string;
    sourceId: string | null;
  }): Promise<UserCollectibleRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_collectibles")
      .upsert(
        {
          user_id: input.userId,
          collectible_id: input.collectibleId,
          source_type: input.sourceType,
          source_id: input.sourceId,
        },
        { onConflict: "user_id,collectible_id" },
      )
      .select("*")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as UserCollectibleRow | null) ?? null;
  }
}

export const collectibleRepository = new CollectibleRepository();
