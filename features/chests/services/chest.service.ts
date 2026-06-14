import { companionService } from "@/features/companion/services/companion.service";
import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";
import { chestRepository } from "@/features/chests/repositories/chest.repository";
import type {
  ChestClaimResult,
  ChestEligibilityViewModel,
  ChestTemplateRow,
} from "@/features/chests/types/chest.types";
import type { NextUnlockViewModel } from "@/lib/progression/preview.types";

function localDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekKey(): string {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getUTCDay() + 1) / 7,
  );
  return `${now.getUTCFullYear()}-W${week}`;
}

function periodKeyForChest(chest: ChestTemplateRow): string {
  if (chest.kind === "daily") return localDateKey();
  if (chest.kind === "weekly") return weekKey();
  if (chest.kind === "streak" && chest.streak_milestone_days) {
    return `streak-${chest.streak_milestone_days}`;
  }
  return `boss-${chest.slug}`;
}

class ChestService {
  async getNextEligibleChest(userId: string): Promise<NextUnlockViewModel | null> {
    const templates = await chestRepository.listTemplates();
    const daily = templates.find((t) => t.kind === "daily");
    if (!daily) return null;

    const periodKey = periodKeyForChest(daily);
    const claimed = await chestRepository.findClaim(userId, daily.id, periodKey);
    if (claimed) return null;

    return {
      kind: "chest",
      label: daily.title,
      progressPercent: 100,
      remainingLabel: "Ready to open",
      href: "/world/fox-camp",
    };
  }

  async listEligible(userId: string): Promise<ChestEligibilityViewModel[]> {
    const templates = await chestRepository.listTemplates();
    const results: ChestEligibilityViewModel[] = [];

    for (const chest of templates) {
      const claimPeriodKey = periodKeyForChest(chest);
      const claim = await chestRepository.findClaim(
        userId,
        chest.id,
        claimPeriodKey,
      );
      results.push({
        chest,
        eligible: !claim,
        claimPeriodKey,
      });
    }

    return results;
  }

  async claimChest(
    userId: string,
    chestSlug: string,
    claimPeriodKey?: string,
  ): Promise<ChestClaimResult> {
    const template = await chestRepository.findTemplateBySlug(chestSlug);
    if (!template) throw new Error("Chest not found.");

    const periodKey = claimPeriodKey ?? periodKeyForChest(template);
    const existing = await chestRepository.findClaim(
      userId,
      template.id,
      periodKey,
    );

    if (existing) {
      return {
        chestSlug: template.slug,
        title: template.title,
        epReward: template.ep_reward,
        bondXpReward: template.bond_xp_reward,
        collectibleSlug: template.collectible_slug,
        shrineProtectionGrant: template.shrine_protection_grant,
        alreadyClaimed: true,
      };
    }

    await chestRepository.insertClaim({
      userId,
      chestTemplateId: template.id,
      claimPeriodKey: periodKey,
    });

    if (template.ep_reward > 0) {
      await elevationService.awardEp({
        userId,
        amount: template.ep_reward,
        sourceType: "quest",
        sourceId: template.id,
        description: `Opened ${template.title}`,
      });
    }

    if (template.bond_xp_reward > 0) {
      await companionService.awardBondXp(userId, "chest");
    }

    if (template.collectible_slug) {
      await collectibleService.grantBySlug(
        userId,
        template.collectible_slug,
        "chest",
        template.slug,
      );
    }

    if (template.shrine_protection_grant > 0) {
      await shrineProtectionService.grantTokens(
        userId,
        template.shrine_protection_grant,
      );
    }

    return {
      chestSlug: template.slug,
      title: template.title,
      epReward: template.ep_reward,
      bondXpReward: template.bond_xp_reward,
      collectibleSlug: template.collectible_slug,
      shrineProtectionGrant: template.shrine_protection_grant,
      alreadyClaimed: false,
    };
  }

  async claimDailyOnStudy(userId: string): Promise<ChestClaimResult | null> {
    try {
      return await this.claimChest(userId, "daily-chest");
    } catch {
      return null;
    }
  }

  async claimBossChest(
    userId: string,
    trialSlug: string,
  ): Promise<ChestClaimResult | null> {
    const slugMap: Record<string, string> = {
      "foothills-kana-trial": "boss-foothills",
      "forest-kana-trial": "boss-forest",
    };
    const chestSlug = slugMap[trialSlug];
    if (!chestSlug) return null;
    return this.claimChest(userId, chestSlug, `boss-${trialSlug}`);
  }
}

export const chestService = new ChestService();
