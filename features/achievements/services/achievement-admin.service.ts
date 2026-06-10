import {
  isAchievementRarity,
  isContentStatus,
} from "@/lib/content/types";
import type { PaginatedResult, PaginationOptions } from "@/lib/api/pagination";
import { achievementRepository } from "@/features/achievements/repositories/achievement.repository";
import type {
  AchievementInput,
  AchievementRow,
} from "@/features/achievements/types/achievement.types";

function validate(input: AchievementInput): string | null {
  if (!input.name.trim()) return "Name is required.";
  if (!input.slug.trim()) return "Slug is required.";
  if (input.rarity && !isAchievementRarity(input.rarity)) {
    return "Invalid rarity.";
  }
  if (input.status && !isContentStatus(input.status)) {
    return "Invalid status.";
  }
  return null;
}

class AchievementAdminService {
  list(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<AchievementRow>> {
    return achievementRepository.list(pagination);
  }

  getById(id: string): Promise<AchievementRow | null> {
    return achievementRepository.findById(id);
  }

  async create(input: AchievementInput): Promise<AchievementRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return achievementRepository.create(input);
  }

  async update(id: string, input: AchievementInput): Promise<AchievementRow> {
    const error = validate(input);
    if (error) throw new Error(error);
    return achievementRepository.update(id, input);
  }

  remove(id: string): Promise<void> {
    return achievementRepository.remove(id);
  }
}

export const achievementAdminService = new AchievementAdminService();
