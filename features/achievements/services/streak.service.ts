import { shrineProtectionService } from "@/features/streak-protection/services/shrine-protection.service";
import { userStreakRepository } from "@/features/achievements/repositories/user-streak.repository";

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function daysBetween(left: string, right: string): number {
  const leftMs = parseDate(left).getTime();
  const rightMs = parseDate(right).getTime();
  return Math.round((rightMs - leftMs) / (24 * 60 * 60 * 1000));
}

class StreakService {
  async recordStudyActivity(userId: string): Promise<number> {
    const today = formatUtcDate(new Date());
    const existing = await userStreakRepository.findByUserId(userId);

    if (!existing) {
      const created = await userStreakRepository.upsertStreak({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: today,
      });
      return created.current_streak;
    }

    if (existing.last_study_date === today) {
      return existing.current_streak;
    }

    const gap = existing.last_study_date
      ? daysBetween(existing.last_study_date, today)
      : null;

    if (gap !== null && gap > 1) {
      const protected_ = await shrineProtectionService.useToken(userId);
      if (protected_) {
        const updated = await userStreakRepository.upsertStreak({
          userId,
          currentStreak: existing.current_streak,
          longestStreak: existing.longest_streak,
          lastStudyDate: today,
        });
        return updated.current_streak;
      }
    }

    const currentStreak = gap === 1 ? existing.current_streak + 1 : 1;
    const longestStreak = Math.max(existing.longest_streak, currentStreak);

    const updated = await userStreakRepository.upsertStreak({
      userId,
      currentStreak,
      longestStreak,
      lastStudyDate: today,
    });

    return updated.current_streak;
  }

  async getCurrentStreak(userId: string): Promise<number> {
    const existing = await userStreakRepository.findByUserId(userId);
    if (!existing?.last_study_date) return 0;

    const today = formatUtcDate(new Date());
    const gap = daysBetween(existing.last_study_date, today);

    if (gap === 0 || gap === 1) {
      return existing.current_streak;
    }

    return 0;
  }
}

export const streakService = new StreakService();
