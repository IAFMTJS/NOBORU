import { collectibleRepository } from "@/features/collectibles/repositories/collectible.repository";
import type {
  CollectibleViewModel,
  RegionCollectibleProgress,
} from "@/features/collectibles/types/collectible.types";
import type { NextUnlockViewModel } from "@/lib/progression/preview.types";

class CollectibleService {
  async getRegionProgress(
    userId: string,
    regionSlug: string,
  ): Promise<RegionCollectibleProgress> {
    const [definitions, owned] = await Promise.all([
      collectibleRepository.listByRegion(regionSlug),
      collectibleRepository.listUserCollectibles(userId),
    ]);

    const ownedIds = new Set(owned.map((o) => o.collectible_id));

    const collectibles: CollectibleViewModel[] = definitions.map((def) => {
      const row = owned.find((o) => o.collectible_id === def.id);
      return {
        slug: def.slug,
        name: def.name,
        category: def.category,
        regionSlug: def.region_slug,
        earned: ownedIds.has(def.id),
        earnedAt: row?.earned_at ?? null,
      };
    });

    const earned = collectibles.filter((c) => c.earned).length;

    return {
      regionSlug,
      earned,
      total: collectibles.length,
      collectibles,
    };
  }

  async getNextRegionCollectible(
    userId: string,
    regionSlug: string,
  ): Promise<NextUnlockViewModel | null> {
    const progress = await this.getRegionProgress(userId, regionSlug);
    const next = progress.collectibles.find((c) => !c.earned);
    if (!next) return null;

    const progressPercent =
      progress.total > 0
        ? Math.round((progress.earned / progress.total) * 100)
        : 0;

    return {
      kind: "collectible",
      label: next.name,
      progressPercent,
      remainingLabel: `${progress.earned}/${progress.total} ${next.category}s collected`,
      href: "/world",
    };
  }

  async grantBySlug(
    userId: string,
    slug: string,
    sourceType: string,
    sourceId: string | null,
  ): Promise<CollectibleViewModel | null> {
    const definition = await collectibleRepository.findBySlug(slug);
    if (!definition) return null;

    await collectibleRepository.grant({
      userId,
      collectibleId: definition.id,
      sourceType,
      sourceId,
    });

    return {
      slug: definition.slug,
      name: definition.name,
      category: definition.category,
      regionSlug: definition.region_slug,
      earned: true,
      earnedAt: new Date().toISOString(),
    };
  }

  async listAll(userId: string): Promise<CollectibleViewModel[]> {
    const supabase = await import("@/lib/supabase/server").then((m) =>
      m.createClient(),
    );
    const { data, error } = await supabase
      .from("collectible_definitions")
      .select("*")
      .eq("status", "published")
      .order("region_slug")
      .order("sort_order");

    if (error) throw new Error(error.message);

    const owned = await collectibleRepository.listUserCollectibles(userId);
    const ownedMap = new Map(owned.map((o) => [o.collectible_id, o]));

    return ((data ?? []) as Array<{
      id: string;
      slug: string;
      name: string;
      category: CollectibleViewModel["category"];
      region_slug: string;
    }>).map((def) => {
      const row = ownedMap.get(def.id);
      return {
        slug: def.slug,
        name: def.name,
        category: def.category,
        regionSlug: def.region_slug,
        earned: Boolean(row),
        earnedAt: row?.earned_at ?? null,
      };
    });
  }
}

export const collectibleService = new CollectibleService();
