import {
  learningPathRepository,
  progressRepository,
} from "@/features/learning/repositories/learning-path.repository";
import type {
  LearningPathViewModel,
  LessonSummaryViewModel,
  RegionPathViewModel,
  UnitSummaryViewModel,
} from "@/features/learning/types/lesson.types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";

function mapLessonSummary(
  lesson: {
    id: string;
    unit_id: string;
    type: string;
    title: string;
    description: string | null;
    xp_reward: number;
    estimated_duration: number | null;
  },
  progressStatus: ProgressStatus,
  score: number,
): LessonSummaryViewModel {
  return {
    id: lesson.id,
    unitId: lesson.unit_id,
    type: lesson.type,
    title: lesson.title,
    description: lesson.description,
    xpReward: lesson.xp_reward,
    estimatedDuration: lesson.estimated_duration,
    progress: progressStatus,
    score,
  };
}

class LearningPathService {
  async getLearningPath(userId: string): Promise<LearningPathViewModel> {
    const [regions, progressRows] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      progressRepository.listByUserId(userId),
    ]);

    const progressByLesson = new Map(
      progressRows.map((row) => [row.lesson_id, row]),
    );

    let nextLesson: LessonSummaryViewModel | null = null;
    let nextLessonHref: string | null = null;

    const mappedRegions: RegionPathViewModel[] = regions.map((region) => {
      let regionLessonCount = 0;
      let regionCompletedCount = 0;

      const units: UnitSummaryViewModel[] = region.units.map((unit) => {
        let unitCompletedCount = 0;

        const lessons = unit.lessons.map((lesson) => {
          const progress = progressByLesson.get(lesson.id);
          const status: ProgressStatus = progress?.status ?? "not_started";
          if (status === "completed") unitCompletedCount += 1;
          regionLessonCount += 1;
          if (status === "completed") regionCompletedCount += 1;

          const summary = mapLessonSummary(
            lesson,
            status,
            progress?.score ?? 0,
          );

          if (!nextLesson && status !== "completed") {
            nextLesson = summary;
            nextLessonHref = `/learn/lesson/${lesson.id}`;
          }

          return summary;
        });

        return {
          id: unit.id,
          name: unit.name,
          description: unit.description,
          orderIndex: unit.order_index,
          lessonCount: lessons.length,
          completedCount: unitCompletedCount,
          lessons,
        };
      });

      return {
        id: region.id,
        slug: region.slug,
        name: region.name,
        description: region.description,
        lessonCount: regionLessonCount,
        completedCount: regionCompletedCount,
        progressPercent:
          regionLessonCount === 0
            ? 0
            : Math.round((regionCompletedCount / regionLessonCount) * 100),
        units,
      };
    });

    return {
      regions: mappedRegions,
      nextLesson,
      nextLessonHref,
    };
  }

  async getRegionPath(
    userId: string,
    regionSlug: string,
  ): Promise<RegionPathViewModel | null> {
    const path = await this.getLearningPath(userId);
    return path.regions.find((region) => region.slug === regionSlug) ?? null;
  }
}

export const learningPathService = new LearningPathService();
