import {
  learningPathRepository,
} from "@/features/learning/repositories/learning-path.repository";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { trialTemplateRepository } from "@/features/trials/repositories/trial-template.repository";
import { userTrialRepository } from "@/features/trials/repositories/user-trial.repository";
import type {
  LearningPathViewModel,
  LessonSummaryViewModel,
  RegionPathViewModel,
  UnitSummaryViewModel,
} from "@/features/learning/types/lesson.types";
import type { ProgressStatus, UserProgressRow } from "@/features/learning/types/progress.types";
import type {
  LessonRow,
  RegionRow,
  UnitRow,
} from "@/features/learning/types/curriculum.types";

type RegionWithUnits = RegionRow & {
  units: Array<
    UnitRow & {
      lessons: LessonRow[];
    }
  >;
};

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

export function buildLearningPathFromData(
  regions: RegionWithUnits[],
  progressRows: UserProgressRow[],
  passedTrialSlugs: ReadonlySet<string> = new Set(),
): LearningPathViewModel {
  const progressByLesson = new Map(
    progressRows.map((row) => [row.lesson_id, row]),
  );

  let nextLesson: LessonSummaryViewModel | null = null;
  let nextLessonHref: string | null = null;

  const mappedRegions: RegionPathViewModel[] = regions.map((region) => {
    const access = resolveRegionAccess(region.slug, passedTrialSlugs);
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

        if (!nextLesson && access.availability === "available" && status !== "completed") {
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
      availability: access.availability,
      lockReason: access.lockReason,
      units,
    };
  });

  return {
    regions: mappedRegions,
    nextLesson,
    nextLessonHref,
  };
}

class LearningPathService {
  async getPassedTrialSlugs(userId: string): Promise<Set<string>> {
    const [templates, progressRows] = await Promise.all([
      trialTemplateRepository.listPublished(),
      userTrialRepository.listProgressByUserId(userId),
    ]);

    const slugById = new Map(templates.map((template) => [template.id, template.slug]));

    return new Set(
      progressRows
        .filter((row) => row.passed)
        .map((row) => slugById.get(row.trial_template_id))
        .filter((slug): slug is string => Boolean(slug)),
    );
  }

  async isRegionAccessible(userId: string, regionSlug: string): Promise<boolean> {
    const passedTrialSlugs = await this.getPassedTrialSlugs(userId);
    return resolveRegionAccess(regionSlug, passedTrialSlugs).availability === "available";
  }

  async getLearningPath(userId: string): Promise<LearningPathViewModel> {
    const [regions, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(userId),
      this.getPassedTrialSlugs(userId),
    ]);

    return buildLearningPathFromData(regions, progressRows, passedTrialSlugs);
  }

  buildLearningPath(
    regions: RegionWithUnits[],
    progressRows: UserProgressRow[],
    passedTrialSlugs: ReadonlySet<string> = new Set(),
  ): LearningPathViewModel {
    return buildLearningPathFromData(regions, progressRows, passedTrialSlugs);
  }

  async getRegionPath(
    userId: string,
    regionSlug: string,
  ): Promise<RegionPathViewModel | null> {
    const [region, progressRows, passedTrialSlugs] = await Promise.all([
      learningPathRepository.findPublishedRegionBySlug(regionSlug),
      getCachedProgressRows(userId),
      this.getPassedTrialSlugs(userId),
    ]);

    if (!region) return null;

    const path = buildLearningPathFromData([region], progressRows, passedTrialSlugs);
    return path.regions[0] ?? null;
  }
}

export const learningPathService = new LearningPathService();

export type { RegionWithUnits };
