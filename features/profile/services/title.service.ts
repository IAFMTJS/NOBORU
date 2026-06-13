import { titleRepository } from "@/features/profile/repositories/title.repository";
import type { TitleViewModel } from "@/features/profile/types/title.types";

class TitleService {
  async listTitles(userId: string): Promise<TitleViewModel[]> {
    const [unlocked, equippedId] = await Promise.all([
      titleRepository.listUnlockedTitles(userId),
      titleRepository.getEquippedTitleId(userId),
    ]);

    return unlocked.map((row) => ({
      id: row.id,
      title: row.title,
      level: row.level,
      rewardValue: row.reward_value,
      equipped: row.id === equippedId,
    }));
  }

  async getActiveTitle(userId: string): Promise<string | null> {
    const equippedId = await titleRepository.getEquippedTitleId(userId);
    if (equippedId) {
      const title = await titleRepository.findTitleById(equippedId);
      return title?.title ?? null;
    }

    const unlocked = await titleRepository.listUnlockedTitles(userId);
    const highest = unlocked[unlocked.length - 1];
    return highest?.title ?? null;
  }

  async equipTitle(userId: string, titleId: string): Promise<TitleViewModel[]> {
    const unlocked = await titleRepository.listUnlockedTitles(userId);
    if (!unlocked.some((t) => t.id === titleId)) {
      throw new Error("Title not unlocked.");
    }

    await titleRepository.setEquippedTitle(userId, titleId);
    return this.listTitles(userId);
  }
}

export const titleService = new TitleService();
