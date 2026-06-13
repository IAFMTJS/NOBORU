import {
  BOND_XP_AWARDS,
  BOND_XP_PER_LEVEL,
  nextEvolution,
  resolveEvolutionForLevel,
} from "@/features/companion/constants/companion.constants";
import { companionRepository } from "@/features/companion/repositories/companion.repository";
import type {
  BondXpSource,
  CompanionNextUnlock,
  CompanionViewModel,
} from "@/features/companion/types/companion.types";

function levelProgress(bondLevel: number, bondXp: number) {
  const xpForCurrent = (bondLevel - 1) * BOND_XP_PER_LEVEL;
  const xpIntoLevel = bondXp - xpForCurrent;
  const xpNeeded = BOND_XP_PER_LEVEL;
  const progressPercent = Math.min(
    100,
    Math.round((xpIntoLevel / xpNeeded) * 100),
  );
  return {
    bondXpToNextLevel: Math.max(0, xpNeeded - xpIntoLevel),
    progressPercent,
  };
}

class CompanionService {
  async getCompanion(userId: string): Promise<CompanionViewModel> {
    const row = await companionRepository.ensureCompanion(userId);
    const evolution = resolveEvolutionForLevel(row.bond_level);
    const { bondXpToNextLevel, progressPercent } = levelProgress(
      row.bond_level,
      row.bond_xp,
    );

    let equippedOutfitName: string | null = null;
    if (row.equipped_outfit_id) {
      const outfit = await companionRepository.findOutfitById(row.equipped_outfit_id);
      equippedOutfitName = outfit?.name ?? null;
    }

    return {
      bondLevel: row.bond_level,
      bondXp: row.bond_xp,
      bondXpToNextLevel,
      progressPercent,
      evolutionSlug: row.evolution_slug,
      evolutionName: evolution.name,
      equippedOutfitName,
    };
  }

  async getNextUnlock(userId: string): Promise<CompanionNextUnlock | null> {
    const companion = await this.getCompanion(userId);
    const nextEvo = nextEvolution(companion.bondLevel);

    if (nextEvo) {
      const levelsRemaining = nextEvo.minBondLevel - companion.bondLevel;
      return {
        label: `Evolve to ${nextEvo.name}`,
        progressPercent: Math.round(
          (companion.bondLevel / nextEvo.minBondLevel) * 100,
        ),
        remainingLabel:
          levelsRemaining <= 1
            ? "1 bond level away"
            : `${levelsRemaining} bond levels away`,
      };
    }

    if (companion.bondLevel < 50) {
      return {
        label: `Bond Level ${companion.bondLevel + 1}`,
        progressPercent: companion.progressPercent,
        remainingLabel: `${companion.bondXpToNextLevel} bond XP to go`,
      };
    }

    return null;
  }

  async awardBondXp(
    userId: string,
    source: BondXpSource,
  ): Promise<CompanionViewModel> {
    const row = await companionRepository.ensureCompanion(userId);
    const amount = BOND_XP_AWARDS[source];
    let newXp = row.bond_xp + amount;
    let newLevel = row.bond_level;

    while (newLevel < 50) {
      const xpNeeded = newLevel * BOND_XP_PER_LEVEL;
      if (newXp < xpNeeded) break;
      newLevel += 1;
    }

    if (newLevel > 50) newLevel = 50;

    const evolution = resolveEvolutionForLevel(newLevel);

    if (evolution.slug !== row.evolution_slug) {
      await companionRepository.insertUnlock({
        userId,
        unlockType: "evolution",
        unlockSlug: evolution.slug,
      });
    }

    await companionRepository.updateCompanion({
      userId,
      bondLevel: newLevel,
      bondXp: newXp,
      evolutionSlug: evolution.slug,
    });

    return this.getCompanion(userId);
  }

  async equipOutfit(userId: string, outfitId: string): Promise<CompanionViewModel> {
    const companion = await companionRepository.ensureCompanion(userId);
    const outfit = await companionRepository.findOutfitById(outfitId);
    if (!outfit || companion.bond_level < outfit.min_bond_level) {
      throw new Error("Outfit not available at your bond level.");
    }

    await companionRepository.updateCompanion({
      userId,
      bondLevel: companion.bond_level,
      bondXp: companion.bond_xp,
      evolutionSlug: companion.evolution_slug,
      equippedOutfitId: outfitId,
    });

    await companionRepository.insertUnlock({
      userId,
      unlockType: "outfit",
      unlockSlug: outfit.slug,
    });

    return this.getCompanion(userId);
  }
}

export const companionService = new CompanionService();
