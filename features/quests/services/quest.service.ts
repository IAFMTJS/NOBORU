import {
  resolveQuestHref,
  type QuestActivityEvent,
  type QuestDeepLinks,
  type QuestMetric,
} from "@/features/quests/constants/quest.constants";
import { questTemplateRepository } from "@/features/quests/repositories/quest-template.repository";
import { userQuestRepository } from "@/features/quests/repositories/user-quest.repository";
import { userWeeklyQuestRepository } from "@/features/quests/repositories/user-weekly-quest.repository";
import type {
  DailyQuestsViewModel,
  QuestCompletionViewModel,
  QuestDashboardViewModel,
  QuestProgressTarget,
  QuestViewModel,
  UserDailyQuestWithTemplate,
  UserWeeklyQuestWithTemplate,
  WeeklyQuestsViewModel,
} from "@/features/quests/types/quest.types";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { lessonService } from "@/features/learning/services/lesson.service";
import { profileServerRepository } from "@/features/profile/repositories/profile-server.repository";

function resolveQuestDate(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
      new Date(),
    );
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function resolveWeekStart(timezone: string): string {
  const today = resolveQuestDate(timezone);
  const date = new Date(`${today}T12:00:00.000Z`);
  const dayOfWeek = date.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

function metricForEvent(event: QuestActivityEvent): QuestMetric | null {
  switch (event.type) {
    case "lesson_complete":
      return "complete_lessons";
    case "vocabulary_learned":
      return "learn_vocabulary";
    case "review_item":
      return "review_items";
    case "ep_earned":
      return "earn_ep";
    default:
      return null;
  }
}

function eventAmount(event: QuestActivityEvent): number {
  if (event.type === "vocabulary_learned") return event.amount;
  if (event.type === "ep_earned") return event.amount;
  return event.amount ?? 1;
}

function mapQuestViewModel(
  quest: QuestProgressTarget,
  links: QuestDeepLinks,
): QuestViewModel {
  const progressPercent =
    quest.targetValue === 0
      ? 0
      : Math.min(100, Math.round((quest.progress / quest.targetValue) * 100));

  return {
    id: quest.id,
    slug: quest.template.slug,
    title: quest.template.title,
    description: quest.template.description,
    current: Math.min(quest.progress, quest.targetValue),
    target: quest.targetValue,
    completed: quest.completed,
    epReward: quest.template.ep_reward,
    href: resolveQuestHref(quest.template.slug, links),
    progressPercent,
  };
}

function toDailyTarget(row: UserDailyQuestWithTemplate): QuestProgressTarget {
  return {
    id: row.id,
    userId: row.user_id,
    progress: row.progress,
    targetValue: row.target_value,
    completed: row.completed,
    template: row.template,
    period: "daily",
  };
}

function toWeeklyTarget(row: UserWeeklyQuestWithTemplate): QuestProgressTarget {
  return {
    id: row.id,
    userId: row.user_id,
    progress: row.progress,
    targetValue: row.target_value,
    completed: row.completed,
    template: row.template,
    period: "weekly",
  };
}

class QuestService {
  private async getDeepLinks(userId: string): Promise<QuestDeepLinks> {
    const nextLesson = await lessonService.getNextIncompleteLesson(userId);
    return {
      lessonHref: nextLesson ? `/learn/lesson/${nextLesson.id}` : "/learn",
      reviewHref: "/review",
    };
  }

  async getQuestDateForUser(userId: string): Promise<string> {
    const profile = await profileServerRepository.findByUserId(userId);
    return resolveQuestDate(profile?.timezone ?? "UTC");
  }

  async getWeekStartForUser(userId: string): Promise<string> {
    const profile = await profileServerRepository.findByUserId(userId);
    return resolveWeekStart(profile?.timezone ?? "UTC");
  }

  async ensureDailyQuests(userId: string): Promise<UserDailyQuestWithTemplate[]> {
    const questDate = await this.getQuestDateForUser(userId);
    const existing = await userQuestRepository.listForDate(userId, questDate);
    if (existing.length > 0) return existing;

    const templates = await questTemplateRepository.listDailyTemplates();
    const created: UserDailyQuestWithTemplate[] = [];

    for (const template of templates) {
      const row = await userQuestRepository.insertQuest({
        userId,
        questTemplateId: template.id,
        questDate,
        targetValue: template.target_value,
      });
      created.push({ ...row, template });
    }

    return created;
  }

  async ensureWeeklyQuests(userId: string): Promise<UserWeeklyQuestWithTemplate[]> {
    const weekStart = await this.getWeekStartForUser(userId);
    const existing = await userWeeklyQuestRepository.listForWeek(userId, weekStart);
    if (existing.length > 0) return existing;

    const templates = await questTemplateRepository.listWeeklyTemplates();
    const created: UserWeeklyQuestWithTemplate[] = [];

    for (const template of templates) {
      const row = await userWeeklyQuestRepository.insertQuest({
        userId,
        questTemplateId: template.id,
        weekStart,
        targetValue: template.target_value,
      });
      created.push({ ...row, template });
    }

    return created;
  }

  async getDailyQuests(userId: string): Promise<DailyQuestsViewModel> {
    const dashboard = await this.getQuestDashboard(userId);
    return dashboard.daily;
  }

  async getQuestDashboard(userId: string): Promise<QuestDashboardViewModel> {
    const [dailyRows, weeklyRows, links, questDate, weekStart] = await Promise.all([
      this.ensureDailyQuests(userId),
      this.ensureWeeklyQuests(userId),
      this.getDeepLinks(userId),
      this.getQuestDateForUser(userId),
      this.getWeekStartForUser(userId),
    ]);

    const dailyQuests = dailyRows.map((row) =>
      mapQuestViewModel(toDailyTarget(row), links),
    );
    const weeklyQuests = weeklyRows.map((row) =>
      mapQuestViewModel(toWeeklyTarget(row), links),
    );

    return {
      daily: {
        questDate,
        quests: dailyQuests,
        completedCount: dailyQuests.filter((quest) => quest.completed).length,
        totalCount: dailyQuests.length,
      },
      weekly: {
        weekStart,
        quests: weeklyQuests,
        completedCount: weeklyQuests.filter((quest) => quest.completed).length,
        totalCount: weeklyQuests.length,
      },
    };
  }

  async recordActivities(
    userId: string,
    events: QuestActivityEvent[],
  ): Promise<QuestCompletionViewModel[]> {
    if (events.length === 0) return [];

    const [dailyRows, weeklyRows] = await Promise.all([
      this.ensureDailyQuests(userId),
      this.ensureWeeklyQuests(userId),
    ]);

    const targets: QuestProgressTarget[] = [
      ...dailyRows.map(toDailyTarget),
      ...weeklyRows.map(toWeeklyTarget),
    ];

    const completions: QuestCompletionViewModel[] = [];

    for (const event of events) {
      const metric = metricForEvent(event);
      if (!metric) continue;

      const amount = eventAmount(event);
      if (amount <= 0) continue;

      for (const quest of targets.filter(
        (entry) => entry.template.metric === metric && !entry.completed,
      )) {
        const completion = await this.incrementQuest(quest, amount);
        if (completion) completions.push(completion);
      }
    }

    return completions;
  }

  private async incrementQuest(
    quest: QuestProgressTarget,
    amount: number,
  ): Promise<QuestCompletionViewModel | null> {
    if (quest.completed) return null;

    const nextProgress = quest.progress + amount;
    const isComplete = nextProgress >= quest.targetValue;

    if (!isComplete) {
      await this.persistQuestProgress(quest, {
        progress: nextProgress,
        completed: false,
        completedAt: null,
        epAwarded: null,
      });
      quest.progress = nextProgress;
      return null;
    }

    const epAmount = quest.template.ep_reward;
    const elevation = await elevationService.awardEp({
      userId: quest.userId,
      sourceType: "quest",
      sourceId: quest.id,
      amount: epAmount,
      description: `${quest.period === "weekly" ? "Weekly" : "Daily"} quest complete: ${quest.template.title}`,
    });

    await this.persistQuestProgress(quest, {
      progress: nextProgress,
      completed: true,
      completedAt: new Date().toISOString(),
      epAwarded: epAmount,
    });

    quest.progress = nextProgress;
    quest.completed = true;

    return {
      id: quest.id,
      slug: quest.template.slug,
      title: quest.template.title,
      epAwarded: epAmount,
      elevation,
      period: quest.period,
    };
  }

  private async persistQuestProgress(
    quest: QuestProgressTarget,
    input: {
      progress: number;
      completed: boolean;
      completedAt: string | null;
      epAwarded: number | null;
    },
  ): Promise<void> {
    if (quest.period === "weekly") {
      await userWeeklyQuestRepository.updateProgress({
        id: quest.id,
        progress: input.progress,
        completed: input.completed,
        completedAt: input.completedAt,
        epAwarded: input.epAwarded,
      });
      return;
    }

    await userQuestRepository.updateProgress({
      id: quest.id,
      progress: input.progress,
      completed: input.completed,
      completedAt: input.completedAt,
      epAwarded: input.epAwarded,
    });
  }
}

export const questService = new QuestService();

export async function countNewVocabularyInLesson(
  userId: string,
  lessonId: string,
  listLessonItems: (
    lessonId: string,
  ) => Promise<Array<{ content_type: string; content_id: string }>>,
  listLearnedVocabularyIds: (userId: string) => Promise<string[]>,
): Promise<number> {
  const [items, learnedIds] = await Promise.all([
    listLessonItems(lessonId),
    listLearnedVocabularyIds(userId),
  ]);

  const learnedSet = new Set(learnedIds);
  return items.filter(
    (item) =>
      item.content_type === "vocabulary" && !learnedSet.has(item.content_id),
  ).length;
}
